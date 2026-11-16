# Architecture

## Agent networks

### Anantha Weekend Stay

- Network: `telangana_stay_assistant`
- Front agent: `stay_coordinator`
- Website origin during local testing: `http://127.0.0.1:8080`

Website actions:

- `get_guesthouse_state`
- `get_house_policies`
- `search_rooms`
- `quote_stay`
- `fill_booking_form`
- `look_up_booking`
- `place_booking`
- `cancel_booking`

### Telangana Experience Guide

- Network: `telangana_experience_guide`
- Front agent: `experience_coordinator`
- Website origin during local testing: `http://localhost:8081`

Website actions:

- `get_tours_state`
- `get_good_to_know`
- `find_departures`
- `add_trip_to_basket`
- `remove_trip_from_basket`
- `reserve_basket`
- `look_up_reservation`
- `cancel_reservation`

## System flow

```text
Visitor
   |
   v
Anantha Weekend Stay
   |
   +-- deterministic website actions
   |
   +-- browser confirmation for booking and cancellation
   |
   +-- consent-gated sanitized peer request
          |
          v
   Telangana Experience Guide public network
          |
          +-- no Guide-local website actions in peer mode