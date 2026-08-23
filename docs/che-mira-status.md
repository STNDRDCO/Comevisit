# Che, Mirá — Build status (2026-08-23)

## Completed product sprints

### Sprint 1 — Publish
- `/che-mira-v5/publicar`
- Text-first event creation.
- Live preview.
- Account gate only at final publish.
- Authenticated write to Supabase.
- Real shareable slug after creation.
- Clear handoff to Ojo Acá.

### Sprint 2 — Consumer object
- `/che-mira-v5/p/[id]`
- Real listing lookup by slug.
- External destination CTA.
- Save, share, claim, report entry points.
- `/che-mira-v5/guardados`.

### Sprint 3 — Publisher dashboard
- `/che-mira-v5/mis-publicaciones`
- Reads owned listings.
- Real view and outbound-click counts.
- Active/upcoming/expired grouping.
- Ojo state visible where present.

### Sprint 4 — Ojo Acá promotion UX
- `/che-mira-v5/ojo`
- Reads owned listings when signed in.
- Reads live Ojo ranking from Supabase.
- Bid simulation dynamically reranks the market.
- Real checkout/payment intentionally disabled.

### Sprint 5 — Data + account foundation
- Minimal account route: `/che-mira-v5/acceso`.
- Supabase tables: `cm_listings`, `cm_saves`, `cm_ojo_bids`, `cm_claims`, `cm_reports`, `cm_outbound_clicks`, `cm_listing_views`.
- RLS enabled on all Che, Mirá tables.
- Explicit API grants configured.
- Public reads limited to active, non-expired, non-blocked listings.
- Owner writes require authenticated user identity.
- Home feed and Ojo read live APIs with resilient demo fallbacks.

### Sprint 6 — Quality controls
- Exact duplicate guard: same title + day + neighborhood is rejected before creation.
- Claim flow: `/che-mira-v5/reclamar`.
- Report flow: `/che-mira-v5/reportar`.
- Claims/reports require authenticated identity.
- Moderation state exists at data layer (`clean`, `flagged`, `blocked`).
- Real payment/microfee remains intentionally inactive.

### Sprint 7 — Measurement loop
- Listing detail views tracked without personal data.
- Shared links append `src=share`, allowing attribution.
- Outbound CTA passes through `/api/cm/go` and records the click before redirecting.
- Publisher dashboard can read owned view/click metrics.

## Current product rule set

1. Organic feed is chronological by `published_at`.
2. Editing must never reset `published_at`.
3. Explore is objective filtering/sorting, not recommendation.
4. Ojo Acá is a separate paid-attention market.
5. More money = higher Ojo position inside a time market.
6. Images are optional; core UX is text-first.
7. Destination belongs to publisher: Instagram, WhatsApp, web, checkout/ticketing.
8. Consumer browsing is open; identity is requested only for actions that need ownership/accountability.

## Deliberately blocked pending business decision

- Real Ojo payment capture.
- Paid microfee after first listing.
- Refund/cancellation economics for paid attention.
- Exact credit reward formula for traffic brought by a publisher.

These require explicit commercial rules before implementation because they create money movement and irreversible user expectations.

## Next validation phase

Stop adding major feature surface. Use the current build to test five questions:

1. Can a new user understand Ojo Acá in under 10 seconds?
2. Can a publisher create a listing without instruction?
3. Does the shareable listing feel useful enough to distribute externally?
4. Do consumers actually use time/category/place filters rather than only Ojo?
5. Does a public money-ranked list make publishers want to compete?

Only after those answers should the next build add real payments, traffic credits, or more fragmented Ojo markets.
