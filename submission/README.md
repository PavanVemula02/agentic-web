# Telangana Local Experience Agent Network

A two-site browser-based agent network for fictional accommodation and activity
discovery around Shankarpalle, Telangana.

## Components

- Anantha Weekend Stay
  - Network: `telangana_stay_assistant`
  - Front agent: `stay_coordinator`
- Telangana Experience Guide
  - Network: `telangana_experience_guide`
  - Front agent: `experience_coordinator`

## Repository

https://github.com/PavanVemula02/agentic-web.git

Branch: `pavan-local-experience-agent`

## Key controls

- Website-owned deterministic actions provide prices and availability.
- Booking and cancellation require browser confirmation.
- Partner calls require visitor consent.
- Names, emails, phones, dates and booking codes are excluded from peer requests.
- The peer-loaded Guide receives none of its local reservation actions.

## Tests

```bash
node --test examples/telangana_stay_agent/tests/telangana.test.mjs
node --test examples/telangana_experience_guide/tests/telangana_experience.test.mjs