# Anantha Weekend Stay Assistant

Anantha Weekend Stay is a fictional accommodation website created for the Open
Agentic Web Challenge.

The site demonstrates how a browser-based assistant can use the same
deterministic operations as the normal website UI to:

- explain accommodation and policies;
- check simulated availability;
- calculate INR quotes;
- update the visible booking form;
- create browser-only demo bookings;
- look up and cancel matching demo bookings;
- contact Telangana Experience Guide for fictional activity discovery after
  the visitor approves a consent card.

The application uses plain HTML, CSS and JavaScript modules. It has no
application backend, database, payment system or production reservation
integration.

## Demonstration notice

This project is a hackathon demonstration.

- No real accommodation is reserved.
- No payment is requested or collected.
- Availability is simulated.
- Bookings exist only in the current browser session.
- Refreshing the page restores the original synthetic data.
- No confirmation email, text message or phone call is sent.
- All seeded booking records are synthetic.

Do not use this project to accept real bookings or personal information without
replacing the in-memory application state with an appropriately secured
backend.

## Accommodation catalog

| ID | Accommodation | Capacity | Nightly price | Accessibility |
|---|---|---:|---:|---|
| `garden-suite` | Garden Suite | 2 guests | ₹5,200 | Step-free access |
| `family-cottage` | Family Cottage | 4 guests | ₹7,600 | Review the current website description |

Prices are stored internally as whole paise:

```text
₹5,200 = 520000 paise
₹7,600 = 760000 paise
```

The cleaning fee is:

```text
₹500 = 50000 paise per stay
```

No tourist tax applies.

## Optional extras

| ID | Extra | Price |
|---|---|---:|
| `breakfast` | Breakfast | ₹500 per guest per night |
| `parking` | Parking | ₹200 per night |
| `late-checkout` | Late checkout | ₹750 per stay |

The website JavaScript calculates authoritative totals. The assistant must use
website-tool results rather than inventing or independently asserting a final
price.

## Worked quote examples

For a two-night Garden Suite stay without extras:

```text
Room subtotal: ₹5,200 × 2 = ₹10,400
Cleaning fee: ₹500
Total: ₹10,900
```

For a two-night Family Cottage stay without extras:

```text
Room subtotal: ₹7,600 × 2 = ₹15,200
Cleaning fee: ₹500
Total: ₹15,700
```

## Run locally

The commands below assume this folder is located at:

```text
examples/telangana_stay_agent
```

Run commands from the root of the `agentic-web` repository.

### Serve Anantha Weekend Stay

Use the repository server because it supplies the headers required for public
agent artifacts and cross-origin partner calls:

```bash
node skills/agentify-website/scripts/serve_site.mjs \
  examples/telangana_stay_agent \
  --port 8080 \
  --open-as 127.0.0.1
```

Open the Stay website at:

```text
http://127.0.0.1:8080/
```

Its public agent-network URL is:

```text
http://127.0.0.1:8080/telangana_stay_assistant
```

### Serve Telangana Experience Guide

Run the connected guide in a second terminal:

```bash
node skills/agentify-website/scripts/serve_site.mjs \
  examples/telangana_experience_guide \
  --port 8081 \
  --open-as localhost
```

Open the Guide website at:

```text
http://localhost:8081/
```

Its public agent-network URL is:

```text
http://localhost:8081/telangana_experience_guide
```

The two sites intentionally use different hostnames during local testing:

```text
Stay site: 127.0.0.1
Guide site: localhost
```

Do not open either `index.html` directly through a `file://` URL. Browsers
restrict JavaScript modules, network operations and cross-origin behavior on
local file pages.

## Try the Stay website

1. Browse the Garden Suite and Family Cottage.
2. Review beds, guest limits, rates, amenities, accessibility and pet
   information.
3. Under **Check availability**, select check-in and check-out dates and the
   number of guests.
4. Select **Search rooms**.
5. Choose an available accommodation.
6. Review the itemized INR quote.
7. Add optional extras.
8. Enter demonstration guest details and an arrival window.
9. Select the booking button.
10. Review and approve the browser confirmation dialog.
11. Use the resulting `AWS-*` code and matching last name under
    **Manage my booking**.
12. Test cancellation and verify that declining confirmation changes nothing.

## Synthetic booking examples

The demonstration includes synthetic booking records with codes such as:

```text
AWS-7KQ2
AWS-M3XD
AWS-C8VN
AWS-9PLF
```

For a lookup demonstration, use:

```text
Code: AWS-7KQ2
Last name: Guest
```

A lookup requires both the complete code and its matching last name.

The application must not reveal another visitor's:

- booking code;
- first name;
- last name;
- email address;
- phone number;
- special requests.

## Stay policies

[policies.html](policies.html) covers:

- check-in and check-out;
- length-of-stay limits;
- cancellation;
- fees and payment;
- pets;
- quiet hours;
- children and guest counting;
- accessibility;
- hackathon demonstration limitations.

The assistant reads this same policy page through
`website_get_house_policies`.

## Browser assistant

The website includes a browser-based assistant.

The assistant uses the model provider, model and API key configured by the
visitor. The website host does not need to pay for model calls.

Open **AI model settings** below the chat and configure a browser-compatible
provider. The reference configuration uses:

```text
Provider URL: https://api.otari.ai/api/v1
Model: alibaba/qwen3.8-flash
```

The selected provider must permit browser CORS requests.

Never commit an API key into:

- HTML;
- JavaScript;
- HOCON;
- manifest JSON;
- network JSON;
- environment files;
- Git history.

For local testing, use a key with a low spending limit. Delete the saved setup
when testing is complete, then close the browser tab.

## Stay Assistant capabilities

The assistant can:

- read the current accommodation catalog;
- compare capacity, amenities and accessibility;
- read current stay policies;
- check simulated availability;
- calculate deterministic INR quotes;
- update the visible booking form when asked;
- create a browser-only demo booking after confirmation;
- look up a booking using its code and matching last name;
- cancel a matching booking after confirmation;
- contact Telangana Experience Guide for fictional activity discovery after
  visitor consent.

The assistant must not invent:

- accommodation;
- prices;
- availability;
- dates or times;
- amenities;
- accessibility details;
- policies;
- booking codes;
- booking status;
- cancellation fees.

## Consequential actions

Creating and cancelling a demo booking are consequential actions.

They must:

1. be proposed through registered website actions;
2. use schema-validated arguments;
3. display the browser's confirmation dialog;
4. execute only after explicit visitor approval;
5. change nothing when approval is declined;
6. return a structured receipt after execution.

The assistant must not claim success until the corresponding website action
returns a successful receipt.

## Sample Stay Assistant prompts

```text
Which accommodation has step-free access for two guests?
```

```text
What accommodation options are available and how much does each cost?
```

```text
Is either accommodation available for two guests for two nights starting three
weeks from today?
```

```text
Put the Garden Suite in the booking form for two guests for two nights.
```

```text
What are the cancellation rules for a demo booking?
```

```text
How much would it cost to cancel booking AWS-7KQ2 under the last name Guest
today?
```

## Connected agent network

The Stay Assistant can contact Telangana Experience Guide after the visitor
approves the partner consent card.

Partner network:

```text
http://localhost:8081/telangana_experience_guide
```

Allowed partner origin:

```text
http://localhost:8081
```

The Stay manifest uses a closed peer policy. No other origin is authorized.

The connection is one-way in the Day 5 and Day 6 builds:

```text
Anantha Weekend Stay
        |
        | Visitor-approved discovery request
        v
Telangana Experience Guide
```

Telangana Experience Guide does not call the Stay Assistant.

## Partner consent flow

Ask the Stay Assistant:

```text
Recommend a morning activity for two people under INR 4,000.
```

Before any request is sent, the runtime displays a consent card that:

- identifies Telangana Experience Guide;
- shows its origin;
- displays up to the first 140 characters of the proposed request;
- allows the visitor to approve or decline the contact.

Approval permits one partner call for the visitor's message.

Declining must:

- send nothing to the partner;
- produce no fabricated partner answer;
- trigger no automatic retry;
- leave the Stay website functional.

## Partner privacy boundary

A partner request may contain only information needed for activity discovery,
such as:

- party size;
- budget;
- preferred duration;
- accessibility needs;
- age suitability;
- preferred time of day.

A partner request must not contain:

- first or last names;
- email addresses;
- phone numbers;
- check-in or check-out dates;
- special requests;
- `AWS-*` booking codes;
- `TEG-*` reservation codes;
- payment information;
- credentials.

For example, this visitor message:

```text
My name is Pavan, my email is pavan@example.com and my booking code is
AWS-7KQ2. Ask the guide for a morning activity for two people under ₹4,000.
```

should produce a sanitized partner request similar to:

```text
What morning activities suit two eligible visitors under INR 4,000?
```

The partner request should not include the name, email address or booking code.

## Partner response limitations

When loaded as a partner, Telangana Experience Guide receives none of its own
local `website_*` actions. It answers only from its public network
instructions.

Therefore, the Stay Assistant must not claim that the partner:

- checked live activity availability;
- updated the Guide's basket;
- created a reservation;
- looked up a reservation;
- cancelled a reservation.

The Stay Assistant should direct visitors to the Guide's own page for current
website-backed departures, prices and demo reservations.

## Partner failure handling

If the visitor declines consent, the partner does not answer, or the Guide
server is unavailable, the Stay Assistant must:

- say that the Guide did not answer;
- avoid inventing a response;
- avoid automatically retrying;
- continue supporting normal accommodation functions.

## Validate the partner

Start both local servers, then run:

```bash
node skills/agentify-website/scripts/check_partner.mjs \
  http://localhost:8081/telangana_experience_guide \
  --origin http://127.0.0.1:8080
```

The check should end with:

```text
OK: http://localhost:8081/telangana_experience_guide can be called from http://127.0.0.1:8080.
```

## Network identity

```text
Brand: Anantha Weekend Stay Assistant
Network: telangana_stay_assistant
Front agent: stay_coordinator
```

The connected partner is:

```text
Brand: Telangana Experience Guide
Network: telangana_experience_guide
Front agent: experience_coordinator
```

## Build the Stay network

From the repository root:

```bash
node skills/agentify-website/scripts/build_network.mjs \
  examples/telangana_stay_agent/telangana_stay_assistant.hocon \
  --manifest examples/telangana_stay_agent/agent-manifest.json
```

Check generated files:

```bash
node skills/agentify-website/scripts/build_network.mjs \
  examples/telangana_stay_agent/telangana_stay_assistant.hocon \
  --manifest examples/telangana_stay_agent/agent-manifest.json \
  --check
```

The HOCON file is the source of truth. Do not independently edit generated
network or discovery files.

## Run the tests

From the repository root:

```bash
node --test \
  examples/telangana_stay_agent/tests/telangana.test.mjs
```

Expected:

```text
tests 13
pass 13
fail 0
```

Run the connected Guide's active test suite:

```bash
node --test \
  examples/telangana_experience_guide/tests/telangana_experience.test.mjs
```

Expected:

```text
tests 9
pass 9
fail 0
```

The tests use the real runtime and page code with scripted models. They do not
call an external LLM provider.

## Public files

Other agentic websites read these files:

- `agent-manifest.json`
- `telangana_stay_assistant.network.json`
- `links.json`
- `agent-mcp.json`
- `.well-known/nsdeploy.json`
- `.well-known/nsdeploy-agent.json`
- `bridge/action-bridge.html`
- `bridge/agent-manifest.json`

Serve the public JSON and network files with the CORS headers required by the
runtime.

Do not block framing for `bridge/action-bridge.html`, because partner sites may
load it in a hidden frame.

The static MCP facade must remain marked unavailable unless a real application
host provides it.

## Files

- `index.html`: accommodation cards, availability search, booking form, booking
  management and assistant mount.
- `policies.html`: house policies, INR fees and demonstration limitations.
- `styles.css`: responsive page and assistant styles.
- `favicon.svg`: site icon.
- `js/app.js`: starts the page and exposes the shared running page.
- `js/booking-page.js`: renders the page and connects forms and buttons.
- `js/booking-facts.js`: converts application state into page-facing facts.
- `js/house-policies.js`: reads `policies.html` for the assistant.
- `js/reservation-book.js`: in-memory booking operations.
- `js/stay-rules.js`: deterministic booking rules and validation messages.
- `js/price-calculator.js`: itemized INR pricing.
- `js/calendar.js`: date helpers and the single application clock.
- `js/guesthouse-data.js`: accommodation, extras, fees and synthetic bookings.
- `site.js`: starts the assistant and creates confirmation dialogs.
- `site-actions.js`: registers model-callable `website_*` operations.
- `telangana_stay_assistant.hocon`: agent-network source of truth.
- `telangana_stay_assistant.network.json`: generated resolved network.
- `agent-manifest.json`: network, peer policy, deployment and action metadata.
- `links.json`: public link-discovery metadata.
- `agent-mcp.json`: MCP availability metadata.
- `.well-known/`: public discovery metadata.
- `bridge/`: cross-site bridge files generated by the builder.
- `runtime/`: browser runtime copied from the agentify-website skill.
- `tests/`: Node integration tests and preserved migration references.

## How booking data works

A stay contains:

```js
{
  roomId,
  checkIn,
  checkOut,
  guests,
  extras
}
```

Dates use:

```text
YYYY-MM-DD
```

A guest contains:

```js
{
  firstName,
  lastName,
  email,
  phone,
  arrival,
  requests
}
```

Phone and special requests are optional.

The arrival value must exactly match one option from
`GuesthouseData.ARRIVAL_TIMES`.

## Reservation operations

`ReservationBook` provides deterministic operations for:

- searching accommodation;
- quoting a stay;
- checking a proposed booking;
- creating a demo booking;
- looking up a matching booking;
- checking cancellation;
- cancelling a booking.

Refused operations return structured errors and change nothing.

A cancelled action receipt means the visitor declined browser confirmation and
nothing happened.

An unknown action receipt means the result is uncertain. The assistant must ask
the visitor to inspect the page and must not automatically retry an
irreversible action.

## Booking rules

`StayRules` checks:

- check-in is not in the past;
- check-out follows check-in;
- stays containing Saturday satisfy the minimum length;
- online stays do not exceed the configured maximum;
- the guest count fits the selected accommodation;
- the accommodation is available;
- extra IDs are valid and not duplicated;
- required guest details are present;
- email and optional phone values are valid;
- special requests remain within the configured limit.

The manual UI and assistant call the same application operations.

## Known limitations

This project does not provide:

- real accommodation;
- real activity reservations;
- live availability;
- production payments;
- authentication;
- durable storage;
- confirmation emails;
- text notifications;
- live weather;
- transport;
- gift cards;
- discount codes;
- production customer support;
- background execution.

Replace the in-memory state and demonstration operations before using this
design for real visitors or transactions.