# Telangana Experience Guide, agentified

Telangana Experience Guide is a fictional activity-discovery website created
for the Open Agentic Web Challenge.

The site presents three demonstration experiences around Shankarpalle,
Telangana:

- Sunrise Lake Experience
- Shankarpalle Heritage Walk
- Family Nature Trail

Visitors can explore activities, search demonstration departures, compare INR
prices, add activities to a basket, and create or cancel browser-only demo
reservations.

The website uses plain HTML, CSS and JavaScript modules. It has no application
backend, database, payment system or production reservation integration.

## Demonstration notice

This project is a hackathon demonstration.

- No real activity is reserved.
- No payment is collected.
- Availability is simulated.
- Reservation records exist only in the current browser session.
- Refreshing the page restores the original synthetic demonstration data.
- No confirmation email, text message or phone call is sent.
- All seeded names and reservation records are synthetic.

Do not use this project to accept real reservations or personal information
without replacing its in-memory state with an appropriately secured backend.

## Activity catalog

| ID | Activity | Price per eligible visitor | Duration | Minimum age |
|---|---|---:|---:|---:|
| `sunrise-lake` | Sunrise Lake Experience | ₹1,800 | 120 minutes | 10 |
| `heritage-walk` | Shankarpalle Heritage Walk | ₹1,200 | 180 minutes | None |
| `family-nature` | Family Nature Trail | ₹900 | 90 minutes | 6 |

Prices are stored internally as whole paise:

```text
₹1,800 = 180000 paise
₹1,200 = 120000 paise
₹900 = 90000 paise
```

The copied reservation application keeps separate adult and child price fields.
For this demonstration, every eligible adult or child pays the same advertised
per-person price.

No harbor dues apply.

## Worked price examples

For two eligible visitors:

```text
Sunrise Lake Experience
₹1,800 × 2 = ₹3,600
```

```text
Shankarpalle Heritage Walk
₹1,200 × 2 = ₹2,400
```

```text
Family Nature Trail
₹900 × 2 = ₹1,800
```

The website JavaScript calculates authoritative totals. The assistant must use
the results returned by website tools rather than inventing or independently
asserting a final price.

## Run locally

The commands below assume this folder is located at:

```text
examples/telangana_experience_guide
```

Run them from the root of the `agentic-web` repository.

### Recommended server

Use the repository's site server because it provides the headers needed for
agent-network linking:

```bash
node skills/agentify-website/scripts/serve_site.mjs \
  examples/telangana_experience_guide \
  --port 8081 \
  --open-as localhost
```

Open:

```text
http://localhost:8081/
```

Port `8081` allows the guide to run beside Anantha Weekend Stay on port `8080`.

### Basic static server

For independent UI testing, you can also use:

```bash
python -m http.server 8081 \
  --bind 0.0.0.0 \
  --directory ./examples/telangana_experience_guide
```

The basic Python server is sufficient for local page testing. It may not provide
the CORS and security headers required for cross-origin agent-network linking.

Do not open `index.html` directly through a `file://` URL. Browsers restrict
JavaScript modules and network requests on local file pages.

## Try the website

1. Browse the three fictional experiences.
2. Review each activity's:
   - INR price
   - duration
   - operating days
   - departure times
   - minimum age
   - accessibility information
   - dog policy
3. Under **Find an experience**, select:
   - a future date
   - number of adults
   - number of children
   - number of children under 4
4. Select **Show experiences**.
5. Add a valid departure to the demo basket.
6. Review the basket and its calculated INR total.
7. Enter demonstration contact details.
8. Select **Create demo reservation**.
9. Review and approve the browser confirmation dialog.
10. Use the resulting `TEG-*` code and matching last name under
    **Manage my demo reservation**.
11. Test cancellation and verify that declining confirmation changes nothing.

## Activity rules

### Sunrise Lake Experience

- ID: `sunrise-lake`
- Price: ₹1,800 per eligible visitor
- Duration: 120 minutes
- Minimum age: 10
- Demonstration departure: 6:00 AM
- Dogs: not accepted
- Capacity: 12 visitors

### Shankarpalle Heritage Walk

- ID: `heritage-walk`
- Price: ₹1,200 per eligible visitor
- Duration: 180 minutes
- Minimum age: none
- Demonstration departures: 9:00 AM and 2:00 PM
- Dogs: accepted
- Capacity: 16 visitors

### Family Nature Trail

- ID: `family-nature`
- Price: ₹900 per eligible visitor
- Duration: 90 minutes
- Minimum age: 6
- Demonstration departures: 8:30 AM and 3:30 PM
- Dogs: accepted
- Capacity: 20 visitors

The underlying copied application groups visitors into:

```js
{
  adults,
  children,
  under4s
}
```

The website's deterministic business rules decide whether a selected group is
eligible for an activity.

## Booking limits

The demonstration currently uses these limits:

```text
Maximum visitors in one activity selection: 8
Maximum activities in one reservation: 3
Maximum advance booking window: 60 days
Nearest selectable date: tomorrow
```

These values are defined in:

```text
js/tour-data.js
```

## Synthetic reservations

The site includes synthetic reservations so capacity and lookup behavior can be
demonstrated.

Example records use codes such as:

```text
TEG-3MVK
TEG-8RPD
TEG-W7NB
TEG-5JXT
```

These records contain no real visitor information.

Do not expose another synthetic visitor's:

- reservation code
- first name
- last name
- email
- phone number
- notes

A reservation lookup must require both the complete reservation code and its
matching last name.

## The browser assistant

The site includes a browser-based assistant.

The assistant runs using the LLM provider, model and API key selected by the
visitor. The website host does not need to pay for model calls.

Open **AI model settings** below the chat, enter a browser-compatible provider
configuration and select **Save and start**.

The reference configuration uses:

```text
Provider URL: https://api.otari.ai/api/v1
Model: alibaba/qwen3.8-flash
```

The provider must allow requests from the browser.

Never commit an API key into:

- JavaScript
- HTML
- the manifest
- network JSON
- HOCON
- Git history

For development keys, use a low spending limit and remove the saved setup when
testing is complete.

## Assistant capabilities

The assistant can help visitors:

- list the three fictional experiences
- compare prices and durations
- explain minimum-age rules
- explain accessibility and dog policies
- find demonstration departures
- calculate deterministic INR quotes
- add an activity to the visible basket
- remove an activity from the basket
- create a browser-only demo reservation
- look up a matching demo reservation
- cancel a matching demo reservation

The assistant must use only current website state and website-tool results.

It must not invent:

- activities
- prices
- schedules
- capacity
- age limits
- accessibility claims
- availability
- reservation codes
- reservation status

## Consequential actions

Creating and cancelling a reservation are consequential demonstration actions.

They must:

1. be proposed through a registered website action;
2. use schema-validated arguments;
3. show the browser's confirmation dialog;
4. execute only after explicit approval;
5. change nothing when approval is declined;
6. return a structured receipt after execution.

The assistant must not claim that a reservation was created or cancelled until
the corresponding website action returns a successful receipt.

## Sample assistant questions

Use prompts such as:

```text
What fictional experiences are available?
```

```text
Which activity is suitable for a family with a 7-year-old child?
```

```text
Which activities are available in the morning?
```

```text
Recommend a morning activity for two eligible visitors under ₹4,000.
```

For two eligible visitors, grounded options include:

```text
Sunrise Lake Experience: ₹3,600
Shankarpalle Heritage Walk: ₹2,400
Family Nature Trail: ₹1,800
```

You can also test:

```text
Show me activities that welcome dogs.
```

```text
Put the Shankarpalle Heritage Walk in my basket for two adults.
```

```text
Create a demo reservation for the Family Nature Trail.
```

```text
Look up reservation TEG-3MVK under the last name Visitor.
```

## Connected agent networks

No remote peer network is enabled in the initial independent Day 4 build.

The intended next connection is:

```text
Telangana Experience Guide
    ↕ visitor-approved peer call
Anantha Weekend Stay
```

Before enabling the connection, verify:

- both manifests are public
- both resolved network JSON files are public
- the partner network URL is correct
- the partner bridge loads
- public artifacts return the required CORS headers
- the caller's `allowed_peers` contains only the verified partner origin
- the consent card appears before any request is sent
- denial prevents the peer call
- an unavailable partner fails closed
- names, email addresses, phone numbers and reservation codes are not included
  in peer requests

The peer network is intended for discovery and recommendations. A peer agent
loaded in another site's browser does not automatically receive this website's
local reservation functions.

## Planned network identity

The customized agent-network identity is:

```text
Network: telangana_experience_guide
Front agent: experience_coordinator
Brand: Telangana Experience Guide
```

Until the network-renaming step is complete, copied Harbor Tours network names
may still exist in migration-only files.

Do not advertise the new network URL until the manifest, network JSON,
discovery metadata and tests agree on the same identity.

## Build and test

### Validate JavaScript

From the repository root:

```bash
find examples/telangana_experience_guide/js \
  -name '*.js' \
  -print0 \
  | xargs -0 -n1 node --check
```

### Check formatting issues

```bash
git diff --check
```

### Find the current tests

```bash
find examples/telangana_experience_guide/tests \
  -maxdepth 1 \
  -name '*.test.mjs' \
  -print
```

### Run tests

```bash
node --test \
  examples/telangana_experience_guide/tests/*.test.mjs
```

Some copied tests may initially reference:

- Seal Rocks Cruise
- Harbor and Lighthouse Loop
- Twilight Sail
- Sea Wall History Walk
- dollar prices
- the former Harbor Tours network

Update copied test fixtures to match the Telangana activity data. Do not weaken
tests covering:

- schema validation
- confirmation gating
- declined actions changing nothing
- availability rules
- capacity rules
- minimum-age rules
- cancellation behavior
- reservation privacy
- local-only website actions
- peer consent

## Cross-site local testing

After the Experience Guide works independently, run the two sites on separate
origins.

### Anantha Weekend Stay

```bash
node skills/agentify-website/scripts/serve_site.mjs \
  examples/telangana_stay_agent \
  --port 8080 \
  --open-as 127.0.0.1
```

### Telangana Experience Guide

```bash
node skills/agentify-website/scripts/serve_site.mjs \
  examples/telangana_experience_guide \
  --port 8081 \
  --open-as localhost
```

Using two hostnames helps keep each site's browser storage and origin boundaries
separate during local peer testing.

Do not use the plain Python server for final cross-origin validation because it
does not provide all of the specialized headers supplied by the repository's
site server.

## Hosting requirements

For public deployment, use HTTPS.

Publicly serve:

```text
agent-manifest.json
telangana_experience_guide.network.json
links.json
agent-mcp.json
.well-known/nsdeploy.json
.well-known/nsdeploy-agent.json
bridge/action-bridge.html
runtime/
```

Serve public agent artifacts with the CORS headers required by the Open Agentic
Web runtime.

Do not block framing for the `bridge/` page because other agentic websites may
load it in a hidden frame.

If a Content Security Policy is configured:

- allow the selected LLM provider in `connect-src`;
- allow verified partner origins in `connect-src`;
- allow verified partner origins in `frame-src`;
- keep unrelated origins blocked.

The static MCP facade must remain marked unavailable unless a real application
host provides it.

## Files

- `index.html`: activity catalog, finder, basket, demo reservation form,
  reservation management and assistant mount.
- `policies.html`: visitor-facing policies and demonstration limitations.
- `styles.css`: responsive website and assistant styles.
- `favicon.svg`: website icon.
- `js/app.js`: starts the website and exposes the shared running page.
- `js/tours-page.js`: renders activities and connects forms and buttons.
- `js/trip-book.js`: holds in-memory reservations and reservation operations.
- `js/trip-basket.js`: manages the visible activity basket.
- `js/trip-rules.js`: validates dates, parties, capacity and contact details.
- `js/fare-calculator.js`: calculates line-item prices and formats money.
- `js/calendar.js`: date and time helpers.
- `js/tour-data.js`: Telangana activity catalog, limits and synthetic records.
- `js/good-to-know.js`: reads the visitor-facing policy page.
- `site.js`: boots the browser assistant and confirmation dialogs.
- `site-actions.js`: registers model-callable `website_*` operations.
- `agent-manifest.json`: public network, policy and deployment metadata.
- `links.json`: peer-network link metadata.
- `agent-mcp.json`: MCP availability metadata.
- `.well-known/`: public discovery metadata.
- `bridge/`: cross-site bridge page.
- `runtime/`: browser agent runtime copied from the agentify-website skill.
- `tests/`: Node integration tests using the real page code and scripted models.

## How the application works

`TourData` defines:

- activity ID and name
- activity kind
- duration in minutes
- operating days
- departure times
- capacity
- adult and child prices in paise
- minimum age
- dog policy
- highlights
- accessibility description
- booking limits
- synthetic reservations

A selected activity uses a structure similar to:

```js
{
  tourId,
  date,
  time,
  adults,
  children,
  under4s
}
```

Dates use:

```text
YYYY-MM-DD
```

Times use:

```text
HH:MM
```

A demonstration contact uses:

```js
{
  firstName,
  lastName,
  email,
  phone,
  notes
}
```

`TripBook` provides deterministic application operations for:

- listing departures
- quoting an activity
- creating a demo reservation
- looking up a reservation
- cancelling a reservation

`TripBasket` manages selected activities in page memory.

`TripRules` validates:

- real calendar dates
- booking window
- operating days
- valid departure times
- number of visitors
- capacity
- adult supervision
- minimum ages
- availability
- contact fields
- note length

`ToursPage` connects the deterministic application operations to the normal
website UI.

The assistant calls the same operations through `site-actions.js`, so the manual
UI and agent share one set of business rules.

## Known limitations

This project does not implement:

- real activities
- real availability
- real payments
- authentication
- production reservations
- durable storage
- confirmation emails
- text notifications
- weather alerts
- live maps
- transportation
- discount codes
- gift vouchers
- private bookings
- background execution
- production customer support

Replace all in-memory state and simulated operations before using this design
for real visitors or real transactions.