Guesthouse reference tests
Test	            Passed	                        Observation
Grounded            accommodation answer	        Yes/No	
Missing             information handled honestly	Yes/No	
Website state       changed visibly	                Yes/No	
Missing booking     fields collected safely	        Yes/No	
Confirmation        appeared before booking	        Yes/No	
Declining           confirmation created no booking	Yes/No	
Approval            returned a confirmation code	Yes/No	
Page and action     receipt matched	                Yes/No	
Refresh behavior    matched documentation	        Yes/No	
## Guesthouse automated test results

Command:

`node --test examples/guesthouse_agentified/tests/agentified.test.mjs`

Result:

- Tests: 31
- Passed: 31
- Failed: 0
- Cancelled: 0
- Skipped: 0
- Duration: approximately 542 ms

Validated behaviors include:

- Network, manifest, grounding, peer and partner rules
- Registered local-only website actions
- Website state access through the front agent
- Confirmation required for booking and cancellation
- Declined operations leave state unchanged
- Consent-card focus behavior
- Search, quote and stay-limit validation
- Approved booking and cancellation flows
- Private guest information is not exposed

## Reference-site loading evidence

The local HTTP server successfully returned:

- `index.html`
- `agent-manifest.json`
- `tidewhistle_guesthouse.network.json`
- `links.json`
- `site-actions.js`
- Browser runtime modules
- Guesthouse data and booking modules

No HTTP loading failure appeared in the server log.
