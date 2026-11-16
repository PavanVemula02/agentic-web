# Validation Report

## Release candidate

```text
Repository: https://github.com/PavanVemula02/agentic-web.git
Branch: pavan-local-experience-agent
Release tag: final-submission
```

## Automated test results

### Anantha Weekend Stay

Run:

```bash
node --test \
  examples/telangana_stay_agent/tests/telangana.test.mjs
```

Expected summary:

```text
tests 13
pass 13
fail 0
```

The suite validates:

- manifest and network consistency;
- exactly two Telangana accommodations;
- Garden Suite step-free accessibility;
- current accommodation IDs in action schemas;
- booking-state privacy;
- deterministic INR quotes;
- Family Cottage capacity enforcement;
- rejection of unknown accommodation IDs;
- confirmation-gated booking;
- declined booking behavior;
- generated `AWS-*` confirmation codes;
- code and matching-last-name lookup;
- confirmation-gated cancellation.

### Telangana Experience Guide

Run:

```bash
node --test \
  examples/telangana_experience_guide/tests/telangana_experience.test.mjs
```

Expected summary:

```text
tests 9
pass 9
fail 0
```

The suite validates:

- exactly three Telangana experiences;
- removal of retired Harbor activity IDs;
- zero harbor dues;
- maximum of three activities per reservation;
- synthetic reservation integrity;
- current activity IDs in action schemas;
- unknown activity rejection;
- successful current-activity lookup;
- expected totals for two visitors.

---

## Network consistency checks

### Stay network

```bash
node skills/agentify-website/scripts/build_network.mjs \
  examples/telangana_stay_agent/telangana_stay_assistant.hocon \
  --manifest examples/telangana_stay_agent/agent-manifest.json \
  --check
```

Required result:

- no `ERROR`;
- no `FAILED`;
- no `WARNING`;
- generated artifacts are up to date;
- front agent is `stay_coordinator`;
- partner tool is `telangana_experience_guide`.

### Experience Guide network

```bash
node skills/agentify-website/scripts/build_network.mjs \
  examples/telangana_experience_guide/telangana_experience_guide.hocon \
  --manifest examples/telangana_experience_guide/agent-manifest.json \
  --check
```

Required result:

- no `ERROR`;
- no `FAILED`;
- no `WARNING`;
- generated artifacts are up to date;
- front agent is `experience_coordinator`;
- no remote partner tool is configured.

---

## Public JSON validation

Run:

```bash
python - <<'PY'
import json
from pathlib import Path

files = [
    "examples/telangana_stay_agent/agent-manifest.json",
    "examples/telangana_stay_agent/telangana_stay_assistant.network.json",
    "examples/telangana_stay_agent/agent-mcp.json",
    "examples/telangana_stay_agent/links.json",
    "examples/telangana_stay_agent/.well-known/nsdeploy-agent.json",
    "examples/telangana_stay_agent/.well-known/nsdeploy.json",
    "examples/telangana_experience_guide/agent-manifest.json",
    "examples/telangana_experience_guide/telangana_experience_guide.network.json",
    "examples/telangana_experience_guide/agent-mcp.json",
    "examples/telangana_experience_guide/links.json",
    "examples/telangana_experience_guide/.well-known/nsdeploy-agent.json",
    "examples/telangana_experience_guide/.well-known/nsdeploy.json",
]

for name in files:
    path = Path(name)

    if not path.is_file():
        raise SystemExit(f"Missing file: {name}")

    json.loads(path.read_text())
    print(f"OK: {name}")

print(f"Validated {len(files)} public JSON files.")
PY
```

Expected final line:

```text
Validated 12 public JSON files.
```

---

## Partner interoperability check

Start the two websites first.

### Terminal 1: Experience Guide

```bash
node skills/agentify-website/scripts/serve_site.mjs \
  examples/telangana_experience_guide \
  --port 8081 \
  --open-as localhost
```

### Terminal 2: Stay website

```bash
node skills/agentify-website/scripts/serve_site.mjs \
  examples/telangana_stay_agent \
  --port 8080 \
  --open-as 127.0.0.1
```

### Terminal 3: Partner check

```bash
node skills/agentify-website/scripts/check_partner.mjs \
  http://localhost:8081/telangana_experience_guide \
  --origin http://127.0.0.1:8080
```

Expected final result:

```text
OK: http://localhost:8081/telangana_experience_guide can be called from http://127.0.0.1:8080.
```

The check must confirm successful access to:

- `agent-manifest.json`;
- `telangana_experience_guide.network.json`;
- `links.json`;
- `bridge/action-bridge.html`;
- `runtime/action-bridge.js`;
- `bridge/agent-manifest.json`.

---

## Identity and peer-policy validation

Run:

```bash
python - <<'PY'
import json
from pathlib import Path

stay_root = Path("examples/telangana_stay_agent")
guide_root = Path("examples/telangana_experience_guide")

stay_manifest = json.loads(
    (stay_root / "agent-manifest.json").read_text()
)

stay_network = json.loads(
    (stay_root / "telangana_stay_assistant.network.json").read_text()
)

guide_manifest = json.loads(
    (guide_root / "agent-manifest.json").read_text()
)

guide_network = json.loads(
    (guide_root / "telangana_experience_guide.network.json").read_text()
)

partner_url = (
    "http://localhost:8081/"
    "telangana_experience_guide"
)

assert stay_manifest["brand"] == (
    "Anantha Weekend Stay Assistant"
)

assert stay_manifest["networks"][0]["name"] == (
    "telangana_stay_assistant"
)

assert stay_manifest["networks"][0]["front_man"] == (
    "stay_coordinator"
)

assert stay_manifest["allowed_peers"] == [
    "http://localhost:8081"
]

assert stay_manifest["peer_policy"]["mode"] == "closed"
assert stay_manifest["linking"]["imports"] == []

stay_coordinator = next(
    item
    for item in stay_network["tools"]
    if item["name"] == "stay_coordinator"
)

assert stay_coordinator["tools"] == [partner_url]

assert stay_network["link_labels"][partner_url] == (
    "Telangana Experience Guide"
)

assert guide_manifest["brand"] == (
    "Telangana Experience Guide"
)

assert guide_manifest["networks"][0]["name"] == (
    "telangana_experience_guide"
)

assert guide_manifest["networks"][0]["front_man"] == (
    "experience_coordinator"
)

assert guide_manifest["allowed_peers"] == []
assert guide_manifest["peer_policy"]["mode"] == "closed"

guide_coordinator = next(
    item
    for item in guide_network["tools"]
    if item["name"] == "experience_coordinator"
)

assert guide_coordinator.get("tools", []) == []

print("Network identities are correct.")
print("Only the Stay Assistant calls the Guide.")
print("Peer policy is closed and origin-restricted.")
PY
```

Expected output:

```text
Network identities are correct.
Only the Stay Assistant calls the Guide.
Peer policy is closed and origin-restricted.
```

---

## Manual acceptance matrix

| Scenario | Expected result |
|---|---|
| Garden Suite quote for two nights | ₹10,900 |
| Family Cottage over four guests | Request rejected |
| Unknown accommodation ID | Schema rejection |
| Stay booking confirmation declined | No booking created |
| Stay booking confirmation approved | New `AWS-*` code |
| Lookup with wrong last name | Generic not-found response |
| Stay cancellation declined | Booking remains unchanged |
| Stay cancellation approved | Matching booking cancelled |
| Guide activity catalog | Exactly three experiences |
| Sunrise Lake for two visitors | ₹3,600 |
| Heritage Walk for two visitors | ₹2,400 |
| Family Nature Trail for two visitors | ₹1,800 |
| Peer activity request approved | Exactly one partner call |
| Peer activity request declined | Nothing sent |
| Private information in visitor message | Excluded from partner request |
| Guide server unavailable | Clear failure and no retry loop |
| Guide invoked as peer | No Guide-local website actions |
| Stay functions after peer failure | Continue working |

---

## Confirmation tests

### Stay booking

1. Request a valid Garden Suite demo booking.
2. Verify the browser confirmation dialog appears.
3. Select **Decline**.
4. Verify no booking was created.
5. Repeat the booking request.
6. Select **Approve**.
7. Verify an `AWS-*` code is returned.

### Stay cancellation

1. Look up a valid booking with its code and matching last name.
2. Request cancellation.
3. Verify the browser confirmation dialog appears.
4. Decline and verify the booking remains unchanged.
5. Repeat and approve.
6. Verify the cancellation receipt.

### Activity reservation

1. Add an eligible Guide activity to the basket.
2. Request a demo reservation.
3. Verify confirmation appears.
4. Decline and verify no reservation was created.
5. Repeat and approve.
6. Verify a `TEG-*` reservation code.

---

## Consent and privacy tests

Ask the Stay Assistant:

```text
My name is Pavan, my email is pavan@example.com and my booking code is
AWS-7KQ2. Recommend a morning activity for two people under ₹4,000.
```

The partner consent preview must not contain:

```text
Pavan
pavan@example.com
AWS-7KQ2
phone numbers
stay dates
special requests
```

An acceptable sanitized request is:

```text
What morning activities suit two eligible visitors under INR 4,000?
```

Verify:

- the consent card names Telangana Experience Guide;
- nothing is sent before approval;
- approval makes one partner call;
- declining makes no partner call;
- the request is no more than 140 characters;
- the partner is not automatically retried;
- the response does not claim live availability;
- the response directs the visitor to the Guide page.

---

## Partner-unavailable test

1. Stop the Experience Guide server.
2. Ask the Stay Assistant for a local activity recommendation.
3. Approve the proposed partner call.
4. Verify the Stay Assistant reports that the Guide did not answer.
5. Verify no activity availability is invented.
6. Verify no repeated call loop occurs.
7. Verify normal Stay functions continue to work.
8. Restart the Guide server.

---

## Privacy and security controls

- Website actions are schema-validated.
- Website JavaScript is the source of truth.
- Prices use integer minor currency units.
- Irreversible actions require browser confirmation.
- Declined actions change nothing.
- Unknown action status is not automatically retried.
- Booking lookup requires code and matching last name.
- Peer policy is closed.
- Only the exact Guide origin is allowed.
- Partner requests require visitor consent.
- Partner requests are limited to 140 characters.
- Private booking information is forbidden in peer requests.
- The Guide receives no local website actions in peer mode.
- No API key is committed to the repository.

---

## Secret scan

Run:

```bash
git grep -niE \
  '(api[_-]?key|secret|password|bearer )[[:space:]]*[:=][[:space:]]*["'\''][^"'\'']+'
```

Expected result:

```text
No committed provider key or credential.
```

Review any match before submission.

---

## Submission artifact validation

Run:

```bash
find submission -maxdepth 2 -type f | sort
```

Expected package:

```text
submission/README.md
submission/architecture.md
submission/demo-script.md
submission/screenshots/01-stay-home.png
submission/screenshots/02-stay-quote.png
submission/screenshots/03-booking-consent.png
submission/screenshots/04-booking-success.png
submission/screenshots/05-guide-home.png
submission/screenshots/06-guide-experiences.png
submission/screenshots/07-peer-consent.png
submission/screenshots/08-peer-result.png
submission/validation.md
```

Verify image formats:

```bash
file submission/screenshots/*.png
```

Every screenshot must report:

```text
PNG image data
```

Verify Markdown files are populated:

```bash
for file in submission/*.md
do
  test -s "$file" \
    && echo "OK: $file" \
    || echo "EMPTY: $file"
done
```

All four files must report `OK`.

---

## Final Git checks

```bash
git diff --check
git status
git log --oneline --decorate -5
```

Expected final state:

```text
nothing to commit, working tree clean
```

The `final-submission` tag and `pavan-local-experience-agent` branch should
point to the same commit containing all documentation and screenshots.