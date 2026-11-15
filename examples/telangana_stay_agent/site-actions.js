// Registers this website's operations with the agent runtime.
//
// agent-manifest.json loads this module through "actions.module". Only the
// names listed in "actions.agentTools" become model-callable website_* tools.
//
// Each action wraps an operation of the running booking page or the policy
// reader. Business rules remain in reservation-book.js and stay-rules.js.
// The assistant therefore uses the same validation and state as the manual UI.

import { App } from "./js/app.js";
import { GuesthouseData } from "./js/guesthouse-data.js";
import { HousePolicies } from "./js/house-policies.js";

/**
 * Describes Anantha Weekend Stay operations as actions agents can call.
 *
 * The runtime validates action arguments against each inputSchema before
 * execute runs. Actions marked irreversible require explicit browser
 * confirmation.
 */
class SiteActions {
  /**
   * Register every website action with the runtime.
   *
   * @param {object} actions Runtime action-registry facade.
   */
  static registerActions(actions) {
    actions.register(SiteActions.readStateAction());
    actions.register(SiteActions.readPoliciesAction());
    actions.register(SiteActions.searchRoomsAction());
    actions.register(SiteActions.quoteStayAction());
    actions.register(SiteActions.fillBookingFormAction());
    actions.register(SiteActions.lookUpBookingAction());
    actions.register(SiteActions.placeBookingAction());
    actions.register(SiteActions.cancelBookingAction());
  }

  /**
   * Return the IDs from one of the website's catalogs.
   *
   * @param {Array<object>} list Rooms or extras.
   * @returns {Array<string>} Catalog IDs.
   */
  static ids(list) {
    return list.map((item) => item.id);
  }

  /**
   * Build a date field schema.
   *
   * @param {string} description Field description.
   * @returns {object} JSON Schema field.
   */
  static dateField(description) {
    return {
      type: "string",
      format: "date",
      description,
    };
  }

  /**
   * Build the guest-count schema.
   *
   * The upper bound is deliberately broader than room capacity so the
   * website's business rules can return a useful domain-specific message.
   *
   * @returns {object} JSON Schema field.
   */
  static guestsField() {
    return {
      type: "integer",
      minimum: 1,
      maximum: 20,
      description:
        "Number of guests. The website checks this against accommodation capacity.",
    };
  }

  /**
   * Build the accommodation-ID schema from the current website data.
   *
   * @returns {object} JSON Schema field.
   */
  static roomField() {
    return {
      type: "string",
      enum: SiteActions.ids(GuesthouseData.ROOMS),
      description:
        "Accommodation ID returned by website_get_guesthouse_state.",
    };
  }

  /**
   * Build the extras-list schema from current website data.
   *
   * @returns {object} JSON Schema field.
   */
  static extrasField() {
    return {
      type: "array",
      maxItems: GuesthouseData.EXTRAS.length,
      items: {
        type: "string",
        enum: SiteActions.ids(GuesthouseData.EXTRAS),
      },
      description:
        "Optional extra IDs returned by website_get_guesthouse_state. Each ID may appear only once.",
    };
  }

  /**
   * Return the shared properties used by stay-related actions.
   *
   * @returns {object} JSON Schema properties.
   */
  static stayProperties() {
    return {
      roomId: SiteActions.roomField(),
      checkIn: SiteActions.dateField(
        "Requested check-in date in YYYY-MM-DD format.",
      ),
      checkOut: SiteActions.dateField(
        "Requested check-out date in YYYY-MM-DD format.",
      ),
      guests: SiteActions.guestsField(),
      extras: SiteActions.extrasField(),
    };
  }

  /**
   * Define the website-state reader.
   *
   * @returns {object} Action definition.
   */
  static readStateAction() {
    return {
      name: "get_guesthouse_state",
      description:
        "Read the current Anantha Weekend Stay accommodation, rates, amenities, accessibility information, extras, fees, stay limits, arrival times, cancellation rules, current date and visible page state. It includes the booking form, latest search, latest demo booking and booking currently displayed under Manage my booking. It never reveals other visitors' private booking records.",
      effect: "read",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      execute: SiteActions.readState,
    };
  }

  /**
   * Return a fresh copy of public website and page state.
   *
   * @returns {object} Current website state.
   */
  static readState() {
    return App.page.readState();
  }

  /**
   * Define the policy-page reader.
   *
   * @returns {object} Action definition.
   */
  static readPoliciesAction() {
    return {
      name: "get_house_policies",
      description:
        "Read Anantha Weekend Stay policies from the same policy page visitors can open. Returns policy sections, text, table rows and links. The site is a fictional hackathon demonstration and creates no real reservation or payment.",
      effect: "read",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      execute: SiteActions.readPolicies,
    };
  }

  /**
   * Read the public policy page.
   *
   * @returns {Promise<object>} Parsed policy sections.
   */
  static readPolicies() {
    return HousePolicies.read();
  }

  /**
   * Define the availability-search action.
   *
   * @returns {object} Action definition.
   */
  static searchRoomsAction() {
    return {
      name: "search_rooms",
      description:
        "Find simulated accommodations available for the requested dates and guest count. Returns each matching accommodation and its deterministic price without changing the page. Returns ok false when the dates or guest count violate website rules.",
      effect: "read",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["checkIn", "checkOut", "guests"],
        properties: {
          checkIn: SiteActions.dateField(
            "Requested check-in date in YYYY-MM-DD format.",
          ),
          checkOut: SiteActions.dateField(
            "Requested check-out date in YYYY-MM-DD format.",
          ),
          guests: SiteActions.guestsField(),
        },
      },
      execute: SiteActions.searchRooms,
    };
  }

  /**
   * Search availability through the website's existing operation.
   *
   * @param {object} args Validated search arguments.
   * @returns {object} Matching accommodation or refusal.
   */
  static searchRooms(args) {
    return App.page.searchRooms(args);
  }

  /**
   * Define the stay-quotation action.
   *
   * @returns {object} Action definition.
   */
  static quoteStayAction() {
    return {
      name: "quote_stay",
      description:
        "Calculate a deterministic line-by-line INR quote for one accommodation and optional extras. Checks stay rules and simulated availability without changing page state.",
      effect: "read",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["roomId", "checkIn", "checkOut", "guests"],
        properties: SiteActions.stayProperties(),
      },
      execute: SiteActions.quoteStay,
    };
  }

  /**
   * Calculate a quote through the website's existing operation.
   *
   * @param {object} args Validated stay arguments.
   * @returns {object} Quote or refusal.
   */
  static quoteStay(args) {
    return App.page.quoteStay(args);
  }

  /**
   * Define the reversible booking-form update.
   *
   * @returns {object} Action definition.
   */
  static fillBookingFormAction() {
    return {
      name: "fill_booking_form",
      description:
        "Place an accommodation, dates, guest count and optional extras into the visible booking form and display its calculated total. This does not create a booking and does not change visitor contact details.",
      effect: "write",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["roomId", "checkIn", "checkOut", "guests"],
        properties: SiteActions.stayProperties(),
      },
      execute: SiteActions.fillBookingForm,
    };
  }

  /**
   * Fill the visible booking form.
   *
   * @param {object} args Validated stay arguments.
   * @returns {object} Updated form state or refusal.
   */
  static fillBookingForm(args) {
    return App.page.fillDraft(args);
  }

  /**
   * Define the demonstration-booking lookup.
   *
   * @returns {object} Action definition.
   */
  static lookUpBookingAction() {
    return {
      name: "look_up_booking",
      description:
        "Find a demonstration booking by confirmation code and matching last name. Returns booking status and the current cancellation fee when a match exists. It does not reveal unrelated bookings.",
      effect: "read",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["code", "lastName"],
        properties: {
          code: {
            type: "string",
            minLength: 1,
            maxLength: 12,
            description:
              "Anantha Weekend Stay demonstration confirmation code, such as AWS-7KQ2.",
          },
          lastName: {
            type: "string",
            minLength: 1,
            maxLength: 60,
            description:
              "Last name associated with the demonstration booking.",
          },
        },
      },
      execute: SiteActions.lookUpBooking,
    };
  }

  /**
   * Look up a demonstration booking.
   *
   * @param {object} args Validated lookup arguments.
   * @returns {object} Matching booking or refusal.
   */
  static lookUpBooking(args) {
    return App.page.lookUpBooking(args.code, args.lastName);
  }

  /**
   * Define the confirmation-gated demonstration-booking operation.
   *
   * @returns {object} Action definition.
   */
  static placeBookingAction() {
    const properties = {
      ...SiteActions.stayProperties(),
      firstName: {
        type: "string",
        minLength: 1,
        maxLength: 60,
        description: "Visitor's first name.",
      },
      lastName: {
        type: "string",
        minLength: 1,
        maxLength: 60,
        description: "Visitor's last name.",
      },
      email: {
        type: "string",
        minLength: 3,
        maxLength: 120,
        description:
          "Email entered for this browser-only demonstration booking.",
      },
      phone: {
        type: "string",
        maxLength: 20,
        description: "Optional phone number.",
      },
      arrival: {
        type: "string",
        enum: GuesthouseData.ARRIVAL_TIMES.slice(),
        description:
          "Arrival window explicitly selected by the visitor.",
      },
      requests: {
        type: "string",
        maxLength: 500,
        description:
          "Optional special requests supplied by the visitor.",
      },
    };

    return {
      name: "place_booking",
      description:
        "Create an in-memory demonstration booking. The browser must show the proposed accommodation, dates, guests and total and receive explicit visitor confirmation before execution. No real accommodation is reserved and no payment is collected.",
      effect: "irreversible",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: [
          "roomId",
          "checkIn",
          "checkOut",
          "guests",
          "firstName",
          "lastName",
          "email",
          "arrival",
        ],
        properties,
      },
      execute: SiteActions.placeBooking,
    };
  }

  /**
   * Create the confirmed demonstration booking.
   *
   * @param {object} args Validated, visitor-confirmed booking arguments.
   * @returns {object} Booking receipt or refusal.
   */
  static placeBooking(args) {
    return App.page.placeStay(args);
  }

  /**
   * Define the confirmation-gated cancellation operation.
   *
   * @returns {object} Action definition.
   */
  static cancelBookingAction() {
    return {
      name: "cancel_booking",
      description:
        "Cancel a matching demonstration booking under the displayed cancellation policy. The site rejects execution if the supplied expected fee differs from the current deterministic fee. Browser confirmation is required.",
      effect: "irreversible",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["code", "lastName", "expectedFeeCents"],
        properties: {
          code: {
            type: "string",
            minLength: 1,
            maxLength: 12,
            description:
              "Anantha Weekend Stay demonstration confirmation code.",
          },
          lastName: {
            type: "string",
            minLength: 1,
            maxLength: 60,
            description:
              "Last name associated with the demonstration booking.",
          },
          expectedFeeCents: {
            type: "integer",
            minimum: 0,
            maximum: 100000000,
            description:
              "Cancellation fee in minor currency units returned by website_look_up_booking during the current interaction.",
          },
        },
      },
      execute: SiteActions.cancelBooking,
    };
  }

  /**
   * Cancel the confirmed demonstration booking.
   *
   * @param {object} args Validated, visitor-confirmed cancellation arguments.
   * @returns {object} Cancellation receipt or refusal.
   */
  static cancelBooking(args) {
    return App.page.cancelStay(
      args.code,
      args.lastName,
      args.expectedFeeCents,
    );
  }
}

// The runtime calls this named module export.
export const registerActions = SiteActions.registerActions;