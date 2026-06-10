# Supabase auth email subjects

Source of truth for the dashboard fields at
`/project/wwmzjaxfyuizauefssiw/auth/templates/`.
Body HTML lives next to this file, one file per template slug.

| Template | Subject |
| --- | --- |
| magic-link-or-otp | Sign in to Solid State |
| confirm-sign-up | Confirm your email — Solid State |
| invite-user | You're invited to Solid State |
| change-email-address | Confirm your new email — Solid State |
| reset-password | Reset your password — Solid State |
| reauthentication | Your code — Solid State |

Skin: matches the Resend delivery email in
`app/api/stripe/webhook/route.ts` — #0a0a0a ground, mono stack,
white CTA, 520px column. Table-based so Outlook keeps the black
background. Logo served from Bunny CDN:
`https://solidstate.b-cdn.net/BRANDING/logo_white.png`.
Note: the dashboard preview shows the logo broken (its CSP
blocks external images) — real clients load it.
