import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { ActionRegistry } from "../runtime/actions.js";
import { Calendar } from "../js/calendar.js";
import { TourData } from "../js/tour-data.js";
import { StubDocument } from "./stub_document.mjs";
import { StubOption } from "./stub_option.mjs";

const BASE = "http://localhost:8081";
const NETWORK_NAME = "marrow_point_harbor_tours";
const TODAY = "2026-11-11";

/*
 * The page reads the current date through Calendar.today().
 * Pin it so activity schedules and availability remain deterministic.
 */
Calendar.fixedToday = TODAY;

/*
 * site-actions.js imports app.js, and app.js starts the page immediately.
 * Install a browser-like document before dynamically importing site-actions.js.
 */
globalThis.document = StubDocument.fromHtml(
  await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  ),
  `${BASE}/`,
);

/*
 * The page creates option elements during startup.
 * Node does not provide the browser Option constructor.
 */
globalThis.Option = StubOption;

/*
 * tours-page.js searches for date inputs and earlier validation messages.
 * Supply the selectors expected by the page.
 */
document.provide('input[type="date"]', [
  document.getElementById("find-date"),
]);

document.provide('.field-error[id^="find-"]', []);
document.provide('.field-error[id^="reserve-"]', []);
document.provide('.field-error[id^="manage-"]', []);

/*
 * Stub selects start empty. Give the activity finder a valid party.
 */
document.getElementById("find-adults").value = "2";
document.getElementById("find-children").value = "0";
document.getElementById("find-under4s").value = "0";

/*
 * The reservation form resets after a successful reservation.
 * Register the controls the page expects to reset.
 */
document.getElementById("reserve-form").elements = {
  firstName: document.getElementById("reserve-firstName"),
  lastName: document.getElementById("reserve-lastName"),
  email: document.getElementById("reserve-email"),
  phone: document.getElementById("reserve-phone"),
  notes: document.getElementById("reserve-notes"),
};

/*
 * Import site-actions only after the browser stand-ins are installed.
 */
const { registerActions } = await import("../site-actions.js");

/**
 * Return the action-registration scope used by the current copied network.
 *
 * This will be renamed to telangana_experience_guide during the network
 * identity migration.
 *
 * @returns {{base: string, network: string}} Registration scope.
 */
function scope() {
  return {
    base: BASE,
    network: NETWORK_NAME,
  };
}

/**
 * Create an action registry containing the site's real website operations.
 *
 * @returns {ActionRegistry} Registered action catalog.
 */
function registry() {
  const actions = new ActionRegistry();

  registerActions({
    register: actions.register.bind(
      actions,
      scope(),
    ),
  });

  return actions;
}

test(
  "catalog contains exactly the three Telangana experiences",
  () => {
    assert.deepEqual(
      TourData.TOURS.map((tour) => ({
        id: tour.id,
        name: tour.name,
        minutes: tour.minutes,
        adultPrice: tour.adultPrice,
        childPrice: tour.childPrice,
        minAge: tour.minAge,
      })),
      [
        {
          id: "sunrise-lake",
          name: "Sunrise Lake Experience",
          minutes: 120,
          adultPrice: 180000,
          childPrice: 180000,
          minAge: 10,
        },
        {
          id: "heritage-walk",
          name: "Shankarpalle Heritage Walk",
          minutes: 180,
          adultPrice: 120000,
          childPrice: 120000,
          minAge: 0,
        },
        {
          id: "family-nature",
          name: "Family Nature Trail",
          minutes: 90,
          adultPrice: 90000,
          childPrice: 90000,
          minAge: 6,
        },
      ],
    );
  },
);

test("catalog contains no Harbor activity IDs", () => {
  const ids = TourData.TOURS.map(
    (tour) => tour.id,
  );

  const retiredIds = [
    "seal-rocks",
    "harbor-loop",
    "twilight-sail",
    "sea-wall-walk",
  ];

  for (const retiredId of retiredIds) {
    assert.ok(
      !ids.includes(retiredId),
      `Catalog still contains retired ID ${retiredId}.`,
    );
  }
});

test("no harbor dues apply", () => {
  assert.equal(TourData.HARBOR_DUES, 0);
});

test(
  "the demonstration permits at most three activities",
  () => {
    assert.equal(TourData.MAX_TRIPS, 3);
  },
);

test(
  "all synthetic reservations use valid activities",
  () => {
    const validIds = new Set(
      TourData.TOURS.map((tour) => tour.id),
    );

    for (
      const reservation
      of TourData.EXISTING_RESERVATIONS
    ) {
      assert.match(
        reservation.code,
        /^TEG-[A-Z0-9]{4}$/,
      );

      for (const trip of reservation.trips) {
        assert.ok(
          validIds.has(trip.tourId),
          `${reservation.code} references unknown activity `
            + `${trip.tourId}.`,
        );
      }
    }
  },
);

test(
  "registered action schemas use current activity IDs",
  () => {
    const actions = registry();

    const currentIds = [
      "sunrise-lake",
      "heritage-walk",
      "family-nature",
    ];

    const retiredIds = [
      "seal-rocks",
      "harbor-loop",
      "twilight-sail",
      "sea-wall-walk",
    ];

    let schemasChecked = 0;

    for (const action of actions.catalog(scope())) {
      const schema = JSON.stringify(
        action.inputSchema,
      );

      if (!schema.includes("tourId")) {
        continue;
      }

      for (const id of currentIds) {
        assert.ok(
          schema.includes(id),
          `${action.name} does not include current `
            + `activity ID ${id}.`,
        );
      }

      for (const id of retiredIds) {
        assert.ok(
          !schema.includes(id),
          `${action.name} still includes retired `
            + `activity ID ${id}.`,
        );
      }

      schemasChecked += 1;
    }

    assert.ok(
      schemasChecked > 0,
      "No registered action schema containing "
        + "tourId was found.",
    );
  },
);

test("unknown activity lookup returns null", () => {
  assert.equal(
    TourData.findById(
      TourData.TOURS,
      "unknown-activity",
    ),
    null,
  );
});

test(
  "current activity lookup returns the matching record",
  () => {
    const activity = TourData.findById(
      TourData.TOURS,
      "family-nature",
    );

    assert.ok(activity);
    assert.equal(
      activity.name,
      "Family Nature Trail",
    );
    assert.equal(activity.minutes, 90);
    assert.equal(activity.minAge, 6);
  },
);

test(
  "experience prices produce expected totals for two visitors",
  () => {
    const expectedTotals = {
      "sunrise-lake": 360000,
      "heritage-walk": 240000,
      "family-nature": 180000,
    };

    for (const activity of TourData.TOURS) {
      assert.equal(
        activity.adultPrice * 2,
        expectedTotals[activity.id],
        activity.name,
      );
    }
  },
);