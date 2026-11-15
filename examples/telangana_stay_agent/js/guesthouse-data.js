/**
 * Accommodation, extras, fees, rules and synthetic demo bookings for
 * Anantha Weekend Stay in Shankarpalle, Telangana.
 *
 * Monetary values are stored as whole paise. For example, 520000 paise
 * represents INR 5,200. Keep policies.html synchronized with fees and
 * cancellation tiers defined here.
 *
 * This is a fictional hackathon demonstration. No real accommodation is
 * reserved and no payment is collected.
 */
export class GuesthouseData {
  /**
   * Accommodation at Anantha Weekend Stay.
   *
   * The weekend rate applies to Friday and Saturday nights.
   * The demonstration currently uses the same weekday and weekend rate.
   */
  static ROOMS = [
    {
      id: "garden-suite",
      name: "Garden Suite",
      beds: "1 queen bed",
      maxGuests: 2,
      nightlyRate: 520000,
      weekendRate: 520000,
      amenities: [
        "Breakfast",
        "Wi-Fi",
        "Air conditioning",
        "Step-free entrance",
      ],
      accessibility:
        "Ground floor with step-free access from the main entrance.",
      petFriendly: false,
    },
    {
      id: "family-cottage",
      name: "Family Cottage",
      beds: "1 queen bed and 2 single beds",
      maxGuests: 4,
      nightlyRate: 760000,
      weekendRate: 760000,
      amenities: [
        "Breakfast",
        "Wi-Fi",
        "Kitchen",
        "Private patio",
      ],
      accessibility:
        "Ground floor, but the entrance has two steps and is not step-free.",
      petFriendly: false,
    },
  ];

  /**
   * Optional extras.
   *
   * Each price is charged per guest per night, per night or per stay,
   * according to the value of the `per` property.
   */
  static EXTRAS = [
    {
      id: "breakfast",
      name: "Telangana breakfast",
      price: 50000,
      per: "guest per night",
    },
    {
      id: "parking",
      name: "Parking space",
      price: 20000,
      per: "night",
    },
    {
      id: "late-checkout",
      name: "Late checkout until 1 pm",
      price: 75000,
      per: "stay",
    },
  ];

  /**
   * Cleaning fee of INR 500, charged once per stay.
   */
  static CLEANING_FEE = 50000;

  /**
   * No tourist tax is charged in this fictional demonstration.
   *
   * Keep this field because the existing price calculator expects it.
   */
  static TOURIST_TAX = 0;

  /**
   * Stays that include a Saturday night require at least this many nights.
   */
  static SATURDAY_MIN_NIGHTS = 2;

  /**
   * Longest stay that visitors can create through the demonstration.
   */
  static MAX_NIGHTS = 14;

  /**
   * Cancellation tiers, checked in order.
   *
   * A tier applies when check-in is at least `minDays` away.
   * `feeShare` is the portion of the room charge kept as the
   * demonstration cancellation fee.
   */
  static CANCELLATION_TIERS = [
    {
      minDays: 7,
      feeShare: 0,
      rule: "7 or more days before check-in: free cancellation",
    },
    {
      minDays: 2,
      feeShare: 0.5,
      rule: "2 to 6 days before check-in: 50% of the room charge",
    },
    {
      minDays: 0,
      feeShare: 1,
      rule:
        "the day before or the day of check-in: the full room charge",
    },
  ];

  /**
   * Available arrival windows.
   *
   * Regular check-in is from 3 pm to 9 pm. The final option represents
   * simulated self check-in for the hackathon demonstration.
   */
  static ARRIVAL_TIMES = [
    "3 pm to 5 pm",
    "5 pm to 7 pm",
    "7 pm to 9 pm",
    "After 9 pm (self check-in)",
  ];

  /**
   * Synthetic bookings used only to demonstrate availability conflicts.
   *
   * These records contain no real customer information. `daysFromToday`
   * is the number of days between the current date and check-in, allowing
   * the demonstration bookings to move with the current date.
   */
  static EXISTING_BOOKINGS = [
    {
      code: "AWS-7KQ2",
      roomId: "garden-suite",
      firstName: "Demo",
      lastName: "Guest",
      daysFromToday: 2,
      nights: 2,
      guests: 2,
    },
    {
      code: "AWS-M3XD",
      roomId: "family-cottage",
      firstName: "Sample",
      lastName: "Visitor",
      daysFromToday: 7,
      nights: 3,
      guests: 4,
    },
    {
      code: "AWS-C8VN",
      roomId: "garden-suite",
      firstName: "Test",
      lastName: "Traveller",
      daysFromToday: 14,
      nights: 2,
      guests: 1,
    },
    {
      code: "AWS-9PLF",
      roomId: "family-cottage",
      firstName: "Example",
      lastName: "Family",
      daysFromToday: 21,
      nights: 4,
      guests: 3,
    },
  ];

  /**
   * Find a room or an extra by its ID.
   *
   * @param {Array<object>} list ROOMS or EXTRAS.
   * @param {string} id ID to locate.
   * @returns {object|null} Matching item, or null when it is not found.
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