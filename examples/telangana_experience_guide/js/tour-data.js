/**
 * Fictional activities, booking limits, fees and synthetic reservations for
 * Telangana Experience Guide in Shankarpalle, Telangana.
 *
 * Prices are stored as whole paise:
 * - 180000 paise = INR 1,800
 * - 120000 paise = INR 1,200
 * - 90000 paise = INR 900
 *
 * Keep policies.html synchronized with the activity restrictions, booking
 * limits and accessibility information defined here.
 *
 * This is a hackathon demonstration. No real activity is reserved and no
 * payment is collected.
 */
export class TourData {
  /**
   * Fictional experiences around Shankarpalle.
   *
   * `days` contains getUTCDay() values:
   * 0 = Sunday, 1 = Monday, through 6 = Saturday.
   *
   * Times use 24-hour HH:MM format.
   * `places` is the maximum number of visitors on one departure.
   *
   * The copied application uses separate adult and child prices. This
   * demonstration charges the same per-person rate for every eligible visitor.
   */
  static TOURS = [
    {
      id: "sunrise-lake",
      name: "Sunrise Lake Experience",
      kind: "experience",
      vessel: null,
      minutes: 120,
      days: [1, 2, 3, 4, 5, 6, 0],
      times: ["06:00"],
      places: 12,
      adultPrice: 180000,
      childPrice: 180000,
      minAge: 10,
      dogsWelcome: false,
      highlights: [
        "A fictional guided sunrise experience beside a lake near Shankarpalle",
        "A two-hour early-morning experience",
        "Small demonstration groups of up to 12 visitors",
      ],
      access:
        "The demonstration route uses mostly level paths, with one uneven outdoor section.",
    },
    {
      id: "heritage-walk",
      name: "Shankarpalle Heritage Walk",
      kind: "walk",
      vessel: null,
      minutes: 180,
      days: [2, 4, 6, 0],
      times: ["09:00", "14:00"],
      places: 16,
      adultPrice: 120000,
      childPrice: 120000,
      minAge: 0,
      dogsWelcome: true,
      highlights: [
        "A fictional guided introduction to local history",
        "Stories about community landmarks and regional heritage",
        "Morning and afternoon demonstration departures",
      ],
      access:
        "The fictional route is mostly step-free but includes uneven outdoor surfaces. Assistance dogs are welcome.",
    },
    {
      id: "family-nature",
      name: "Family Nature Trail",
      kind: "walk",
      vessel: null,
      minutes: 90,
      days: [1, 3, 5, 6, 0],
      times: ["08:30", "15:30"],
      places: 20,
      adultPrice: 90000,
      childPrice: 90000,
      minAge: 6,
      dogsWelcome: true,
      highlights: [
        "A fictional family-friendly nature trail",
        "A 90-minute guided outdoor activity",
        "Nature observation suitable for visitors aged 6 and over",
      ],
      access:
        "The fictional trail includes compacted paths and a short uneven section. Assistance dogs are welcome.",
    },
  ];

  /**
   * No harbor dues apply to these fictional land-based experiences.
   *
   * Keep this field because the copied pricing code expects it.
   */
  static HARBOR_DUES = 0;

  /**
   * Maximum number of visitors in one activity selection.
   */
  static MAX_PLACES = 8;

  /**
   * Maximum number of activities in one basket or demo reservation.
   */
  static MAX_TRIPS = 3;

  /**
   * Furthest selectable date, measured in days from today.
   *
   * The nearest selectable demonstration date is tomorrow.
   */
  static BOOK_AHEAD_DAYS = 60;

  /**
   * Synthetic reservations used only to demonstrate availability and capacity.
   *
   * These records contain no real customer information. Each activity is put
   * on its first valid operating day at or after `fromToday`.
   */
  static EXISTING_RESERVATIONS = [
    {
      code: "TEG-3MVK",
      firstName: "Demo",
      lastName: "Visitor",
      trips: [
        {
          tourId: "sunrise-lake",
          fromToday: 1,
          time: "06:00",
          adults: 2,
          children: 0,
          under4s: 0,
        },
      ],
    },
    {
      code: "TEG-8RPD",
      firstName: "Sample",
      lastName: "Family",
      trips: [
        {
          tourId: "family-nature",
          fromToday: 1,
          time: "08:30",
          adults: 2,
          children: 2,
          under4s: 0,
        },
      ],
    },
    {
      code: "TEG-W7NB",
      firstName: "Example",
      lastName: "Walker",
      trips: [
        {
          tourId: "heritage-walk",
          fromToday: 2,
          time: "09:00",
          adults: 2,
          children: 0,
          under4s: 0,
        },
      ],
    },
    {
      code: "TEG-5JXT",
      firstName: "Test",
      lastName: "Group",
      trips: [
        {
          tourId: "heritage-walk",
          fromToday: 2,
          time: "14:00",
          adults: 4,
          children: 2,
          under4s: 0,
        },
        {
          tourId: "family-nature",
          fromToday: 5,
          time: "15:30",
          adults: 2,
          children: 2,
          under4s: 0,
        },
      ],
    },
  ];

  /**
   * Find an activity by its ID.
   *
   * @param {Array<object>} list Activity list, normally TourData.TOURS.
   * @param {string} id Activity ID to locate.
   * @returns {object|null} Matching activity or null.
   */
  static findById(list, id) {
    for (const item of list) {
      if (item.id === id) {
        return item;
      }
    }

    return null;
  }
}