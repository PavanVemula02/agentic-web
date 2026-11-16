# Two-Minute Demonstration Script

## Preparation

Before recording:

1. Start Telangana Experience Guide on `localhost:8081`.
2. Start Anantha Weekend Stay on `127.0.0.1:8080`.
3. Configure the browser assistant with the selected model provider.
4. Use synthetic visitor information only.
5. Hide API keys, notifications, unrelated tabs and personal information.
6. Keep the final video under two minutes.

---

## 0:00–0:15 | Introduce the project

**Show:** `01-stay-home.png` or the live Anantha Weekend Stay homepage.

**Say:**

> This is Telangana Local Experience Agent Network, a two-site browser-based
> agent system for fictional travel discovery around Shankarpalle, Telangana.
> Anantha Weekend Stay handles accommodation, while Telangana Experience Guide
> provides activity discovery.

---

## 0:15–0:35 | Demonstrate grounded information

**Ask the Stay Assistant:**

```text
Which accommodation has step-free access for two guests?
```

**Show:** The response identifying the Garden Suite.

**Say:**

> The assistant reads current website state through registered website actions.
> Accommodation, capacity and accessibility information come from deterministic
> application data rather than model memory.

---

## 0:35–0:55 | Demonstrate deterministic INR pricing

**Ask:**

```text
Quote the Garden Suite for two guests for two nights.
```

**Show:** `02-stay-quote.png` or the live itemized quote.

Expected calculation:

```text
Garden Suite: ₹5,200 × 2 nights = ₹10,400
Cleaning fee: ₹500
Total: ₹10,900
```

**Say:**

> The authoritative total is calculated by website JavaScript using integer
> paise and returned to the assistant as a structured result.

---

## 0:55–1:15 | Demonstrate confirmation-gated booking

**Ask the assistant to create a booking using synthetic details:**

```text
Create a demo booking for the Garden Suite for two guests for two nights
starting three weeks from today. Use Test Visitor,
test.visitor@example.com, arriving 3 pm to 5 pm.
```

**Show:** `03-booking-consent.png` or the live browser confirmation dialog.

**Say:**

> The action has not executed yet. The model cannot bypass this browser
> confirmation dialog. Declining would change nothing.

Approve the dialog.

**Show:** `04-booking-success.png` and the generated `AWS-*` confirmation code.

**Say:**

> Approval creates only an in-memory demonstration booking. No real
> accommodation is reserved and no payment is collected.

---

## 1:15–1:45 | Demonstrate peer consent and privacy

**Ask:**

```text
My email is pavan@example.com and my booking code is AWS-7KQ2.
Recommend a morning activity for two people under ₹4,000.
```

**Show:** `07-peer-consent.png` or the live partner-consent card.

**Say:**

> Before the Stay Assistant contacts Telangana Experience Guide, the browser
> displays the proposed request. The request is sanitized, so the email address
> and booking code are not sent to the partner.

Verify the preview excludes:

- `pavan@example.com`
- `AWS-7KQ2`
- names
- phone numbers
- stay dates
- special requests

An acceptable partner request is:

```text
What morning activities suit two eligible visitors under INR 4,000?
```

Approve the partner call.

---

## 1:45–1:55 | Demonstrate least-privilege peer behavior

**Show:** `08-peer-result.png` or the live recommendation response.

Possible catalog-based recommendations for two eligible visitors include:

```text
Sunrise Lake Experience: ₹3,600
Shankarpalle Heritage Walk: ₹2,400
Family Nature Trail: ₹1,800
```

**Say:**

> When invoked as a peer, Telangana Experience Guide receives none of its
> local reservation actions. The partner supports discovery but cannot claim
> live availability, modify its basket or create a cross-site reservation.

---

## 1:55–2:00 | Closing statement

**Say:**

> This project demonstrates grounded website actions, deterministic pricing,
> browser-controlled confirmation, explicit cross-site consent, least-privilege
> peer access and a clear privacy boundary.

---

## Recording checklist

- [ ] Video is shorter than two minutes.
- [ ] The entrant narrates the video.
- [ ] Both websites are shown running in a browser.
- [ ] The ₹10,900 Garden Suite quote is visible.
- [ ] The booking confirmation dialog is visible.
- [ ] An `AWS-*` demo confirmation code is visible.
- [ ] The partner-consent card names Telangana Experience Guide.
- [ ] The consent preview contains no private booking information.
- [ ] The partner recommendation is visible.
- [ ] No API key or credential is visible.
- [ ] No copyrighted music is used.
- [ ] The uploaded video can be viewed without requesting access.