import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { ActionRegistry } from "../runtime/actions.js";
import { AgentNetwork, validateNetwork } from "../runtime/kernel.js";
import {
  buildToolTable,
  dispatchToolCall,
} from "../runtime/runner.js";
import { TraceBus } from "../runtime/trace.js";
import { Calendar } from "../js/calendar.js";
import { GuesthouseData } from "../js/guesthouse-data.js";
import { StubDocument } from "./stub_document.mjs";
import { StubOption } from "./stub_option.mjs";
import { ScriptedModel } from "./scripted_model.mjs";

const NETWORK_NAME = "telangana_stay_assistant";
const BASE = "http://localhost:8080";
const TODAY = "2026-11-11";

Calendar.fixedToday = TODAY;

globalThis.document = StubDocument.fromHtml(
  await readFile(new URL("../index.html", import.meta.url), "utf8"),
  `${BASE}/`,
);

globalThis.Option = StubOption;

document.provide('input[type="date"]', [
  document.getElementById("search-checkIn"),
  document.getElementById("search-checkOut"),
  document.getElementById("book-checkIn"),
  document.getElementById("book-checkOut"),
]);

document.provide('.field-error[id^="search-"]', []);
document.provide('.field-error[id^="book-"]', []);
document.provide('.field-error[id^="manage-"]', []);

document.getElementById("search-guests").value = "2";
document.getElementById("book-guests").value = "2";
document.getElementById("book-guests").defaultValue = "2";

document.getElementById("booking-form").elements = {
  roomId: document.getElementById("book-roomId"),
  checkIn: document.getElementById("book-checkIn"),
  checkOut: document.getElementById("book-checkOut"),
  guests: document.getElementById("book-guests"),
  firstName: document.getElementById("book-firstName"),
  lastName: document.getElementById("book-lastName"),
  email: document.getElementById("book-email"),
  phone: document.getElementById("book-phone"),
  arrival: document.getElementById("book-arrival"),
  requests: document.getElementById("book-requests"),
};

const { registerActions } = await import("../site-actions.js");
const { App } = await import("../js/app.js");

for (
  const box of document
    .getElementById("book-extras")
    .querySelectorAll("input")
) {
  document.getElementById("booking-form").elements[box.value] = box;
}

function scope() {
  return {
    base: BASE,
    network: NETWORK_NAME,
  };
}

function registry() {
  const actions = new ActionRegistry();

  registerActions({
    register: actions.register.bind(actions, scope()),
  });

  return actions;
}

async function load() {
  const config = JSON.parse(
    await readFile(
      new URL(`../${NETWORK_NAME}.network.json`, import.meta.url),
      "utf8",
    ),
  );

  const manifest = JSON.parse(
    await readFile(
      new URL("../agent-manifest.json", import.meta.url),
      "utf8",
    ),
  );

  return {
    config,
    manifest,
    network: new AgentNetwork(config, NETWORK_NAME),
  };
}

function actionRef(actions, name) {
  for (const entry of actions.catalog(scope())) {
    if (entry.name === name) {
      return entry.ref;
    }
  }

  throw new Error(`Action ${name} is not registered.`);
}

async function approve() {
  return true;
}

async function decline() {
  return false;
}

async function execute(name, args, confirm = approve) {
  const actions = registry();

  const plan = actions.prepare({
    kind: "action",
    action: actionRef(actions, name),
    arguments: args,
  });

  const receipts = await actions.execute(
    plan,
    confirm,
    `telangana-${name}`,
  );

  return receipts[0];
}

async function toolTable(confirm = approve) {
  const loaded = await load();
  const actions = registry();
  const frontMan = loaded.network.findFrontMan();
  const spec = loaded.network.getAgentSpec(frontMan);

  const context = {
    network: loaded.network,
    manifest: loaded.manifest,
    actions,
    baseOrigin: BASE,
    displayOrigin: new URL(BASE).host,
    trace: new TraceBus(),
    isTop: true,
    frontMan,
    history: [],
    llm: new ScriptedModel([]),
    confirmWebsiteActions: confirm,
  };

  const table = await buildToolTable(context, spec, [], null);

  return {
    loaded,
    actions,
    context,
    table,
  };
}

function futureStay(roomId, guests = 2) {
  return {
    roomId,
    checkIn: "2026-12-09",
    checkOut: "2026-12-11",
    guests,
  };
}

test("site publishes a valid agent network and matching manifest", async () => {
  const loaded = await load();

  assert.deepEqual(validateNetwork(loaded.network).errors, []);

  assert.equal(
    loaded.network.findFrontMan(),
    loaded.manifest.networks[0].front_man,
  );
});

test("site contains exactly the two Telangana accommodations", () => {
  assert.deepEqual(
    GuesthouseData.ROOMS.map((room) => ({
      id: room.id,
      name: room.name,
      guests: room.maxGuests,
      nightlyRate: room.nightlyRate,
      weekendRate: room.weekendRate,
    })),
    [
      {
        id: "garden-suite",
        name: "Garden Suite",
        guests: 2,
        nightlyRate: 520000,
        weekendRate: 520000,
      },
      {
        id: "family-cottage",
        name: "Family Cottage",
        guests: 4,
        nightlyRate: 760000,
        weekendRate: 760000,
      },
    ],
  );
});

test("Garden Suite is step-free and Family Cottage is not", () => {
  const garden = GuesthouseData.findById(
    GuesthouseData.ROOMS,
    "garden-suite",
  );

  const family = GuesthouseData.findById(
    GuesthouseData.ROOMS,
    "family-cottage",
  );

  assert.ok(garden);
  assert.ok(family);

  assert.match(garden.accessibility, /step-free/i);
  assert.doesNotMatch(family.accessibility, /^step-free/i);
});

test("registered room schemas accept only current accommodation IDs", () => {
  const actions = registry();

  const quote = actions
    .catalog(scope())
    .find((entry) => entry.name === "quote_stay");

  assert.ok(quote);

  assert.deepEqual(
    quote.inputSchema.properties.roomId.enum,
    ["garden-suite", "family-cottage"],
  );
});

test("website state exposes two rooms and no other guest records", async () => {
  const receipt = await execute("get_guesthouse_state", {});

  assert.equal(receipt.status, "succeeded");
  assert.equal(receipt.result.rooms.length, 2);

  assert.deepEqual(
    receipt.result.rooms.map((room) => room.id),
    ["garden-suite", "family-cottage"],
  );

  const serialized = JSON.stringify(receipt.result);

  for (const booking of GuesthouseData.EXISTING_BOOKINGS) {
    const fullName = `${booking.firstName} ${booking.lastName}`;

    assert.ok(
      !serialized.includes(booking.code),
      `Public state exposed booking code ${booking.code}.`,
    );

    assert.ok(
      !serialized.includes(fullName),
      `Public state exposed guest name ${fullName}.`,
    );
  }
});

test("Garden Suite two-night quote uses deterministic INR data", async () => {
  const receipt = await execute(
    "quote_stay",
    futureStay("garden-suite", 2),
  );

  assert.equal(receipt.status, "succeeded");
  assert.equal(receipt.result.ok, true, receipt.result.reason);
  assert.equal(receipt.result.roomId, "garden-suite");
  assert.equal(receipt.result.room, "Garden Suite");

  /*
   * Two nights:
   *   Room subtotal: 2 x INR 5,200 = INR 10,400
   *   Cleaning fee: INR 500
   *   Tourist tax: INR 0
   *   Expected total: INR 10,900
   */
  assert.equal(receipt.result.total, "₹10,900");
});

test("Family Cottage rejects more than four guests", async () => {
  const receipt = await execute("quote_stay", {
    ...futureStay("family-cottage", 5),
  });

  assert.equal(receipt.status, "succeeded");
  assert.equal(receipt.result.ok, false);
  assert.equal(receipt.result.field, "guests");
  assert.match(receipt.result.reason, /up to 4 guests/i);
});

test("unknown accommodation ID is rejected by schema", async () => {
  await assert.rejects(
    execute("quote_stay", {
      ...futureStay("penthouse", 2),
    }),
    /Invalid arguments\.roomId/,
  );
});

test("booking tool is hidden without confirmation support", async () => {
  const { loaded, context, actions } = await toolTable(undefined);
  const spec = loaded.network.getAgentSpec(
    loaded.network.findFrontMan(),
  );

  const table = await buildToolTable(
    {
      ...context,
      actions,
      confirmWebsiteActions: undefined,
    },
    spec,
    [],
    null,
  );

  assert.ok(!table.toolByName.has("website_place_booking"));
});

test("declining booking confirmation creates no booking", async () => {
  const { context, table } = await toolTable(decline);

  const entry = table.toolByName.get("website_place_booking");
  assert.ok(entry);

  const before = JSON.stringify(App.page.book.bookings);

  const receipt = await dispatchToolCall(
    context,
    entry,
    {
      ...futureStay("garden-suite", 2),
      firstName: "Test",
      lastName: "Visitor",
      email: "test.visitor@example.com",
      arrival: "3 pm to 5 pm",
    },
    null,
    [],
  );

  assert.equal(receipt.status, "cancelled");
  assert.equal(JSON.stringify(App.page.book.bookings), before);
});

test("approved booking creates an AWS confirmation code", async () => {
  const { context, table } = await toolTable(approve);

  const entry = table.toolByName.get("website_place_booking");
  assert.ok(entry);

  const receipt = await dispatchToolCall(
    context,
    entry,
    {
      ...futureStay("garden-suite", 2),
      firstName: "Pavan",
      lastName: "Vemula",
      email: "pavan.demo@example.com",
      arrival: "3 pm to 5 pm",
    },
    null,
    [],
  );

  assert.equal(receipt.status, "succeeded");
  assert.equal(receipt.result.ok, true, receipt.result.reason);

  assert.match(
    receipt.result.booking.code,
    /^AWS-[A-Z0-9]{4}$/,
  );
});

test("lookup requires a matching code and last name", async () => {
  const success = await execute("look_up_booking", {
    code: "AWS-7KQ2",
    lastName: "Guest",
  });

  assert.equal(success.result.ok, true);
  assert.equal(success.result.booking.code, "AWS-7KQ2");

  const refusal = await execute("look_up_booking", {
    code: "AWS-7KQ2",
    lastName: "Wrong",
  });

  assert.equal(refusal.result.ok, false);

  const serialized = JSON.stringify(refusal.result);

  assert.ok(!serialized.includes("Demo"));
  assert.ok(!serialized.includes("Guest"));
});

test("cancellation tool is confirmation-gated", async () => {
  const lookup = await execute("look_up_booking", {
    code: "AWS-M3XD",
    lastName: "Visitor",
  });

  assert.equal(lookup.result.ok, true);

  const { context, table } = await toolTable(decline);

  const entry = table.toolByName.get("website_cancel_booking");
  assert.ok(entry);

  const before = JSON.stringify(App.page.book.bookings);

  const receipt = await dispatchToolCall(
    context,
    entry,
    {
      code: "AWS-M3XD",
      lastName: "Visitor",
      expectedFeeCents: lookup.result.cancellation.feeCents,
    },
    null,
    [],
  );

  assert.equal(receipt.status, "cancelled");
  assert.equal(JSON.stringify(App.page.book.bookings), before);
});
