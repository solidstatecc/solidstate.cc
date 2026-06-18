# AU tax notes — GST, reverse-charge, ABN

Solid State sells from Australia, so the kit's tax dogfood is AU-shaped. These
notes are **dated 2026-06-18** and are *not tax advice* — they tell you what to
check and confirm with the ATO or an accountant, not what your liability is.

## GST registration threshold

- GST registration is generally required once annual turnover reaches **A$75,000**
  (lower thresholds apply to some activities). Below it, registration is optional.
- Selling below the threshold? You generally do **not** charge GST. `register`
  still warns you, because the decision is yours and consequential — don't
  register a jurisdiction you have no obligation in.

## ABN

- Hold your **ABN** ready before registering. Stripe Tax's AU registration and
  your tax invoices reference it. No ABN → finish that first.

## B2C vs B2B and reverse-charge

- **B2C (selling to AU consumers):** charge GST on taxable supplies.
- **B2B (selling to GST-registered businesses):** in cross-border cases the
  **reverse-charge** mechanism can shift the GST accounting to the buyer. Stripe
  Tax handles much of this when the customer's tax ID / location is captured —
  but capture it. A missing customer tax status is the usual cause of a wrong
  GST line.

## Tax-inclusive vs exclusive

- AU consumer prices are typically shown **GST-inclusive**. Stripe's
  `tax_behavior` (`inclusive` / `exclusive`) must match how you advertise the
  price, or your displayed price and your captured tax will disagree.

## What the skill does vs what you must do

- The skill **configures Stripe** to collect/track correctly and warns on
  obligations. It does **not** decide that you are liable, and it does **not**
  lodge your BAS or file a return.
- Before going live in AU: confirm threshold/liability, have your ABN, set
  `tax_behavior` to match your pricing, and capture customer tax status for B2B.

Verify all of the above against current ATO and Stripe Tax documentation — rates,
thresholds, and reverse-charge rules change.
