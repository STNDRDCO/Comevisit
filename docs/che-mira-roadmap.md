# Che, Mirá — Product Roadmap

## Working principle
Build the product in reversible sprints without waiting for manual approval between them. Stop only for irreversible/paid actions, sensitive credentials, or a business-model change that materially alters the thesis.

## Product thesis
Che, Mirá is a neutral local discovery layer for things happening in the city.

- Open feed: ordered by publication time.
- Explore: objective filters/sorts, no editorial recommendation.
- Ojo Acá: paid attention market, ranked by amount paid within a time window.
- Each listing can redirect to Instagram, WhatsApp, website, ticketing, or checkout.
- Images are optional; the product must work text-first.

## Sprint 1 — Publish flow
Goal: make supply creation tangible and extremely simple.

Deliverables:
- `/che-mira-v5/publicar`
- Form: title, category, date/time, neighborhood, location, price, short description, external destination, optional image URL placeholder.
- Live preview.
- Success state with shareable listing URL concept.
- CTA to promote in Ojo Acá.
- Connect all v5 Publish CTAs to the flow.
- Fix CTA alignment bug in listing rows.

Exit criterion: a user can understand how to create a listing end-to-end without explanation.

## Sprint 2 — Listing detail + saved plans
Goal: complete the consumer object.

Deliverables:
- Reusable listing detail page pattern.
- External CTA, save, share, calendar, report.
- Clear claimed/unclaimed state without clutter.
- Saved plans view.
- Discovery handoff: after opening one listing, easy route back to Explore / what else is happening.

Exit criterion: a listing works as a standalone shareable object and as an entry point into Che, Mirá.

## Sprint 3 — Publisher dashboard
Goal: give the supplier a reason to return.

Deliverables:
- `/che-mira-v5/mis-publicaciones`
- Active / upcoming / expired.
- Visits and outbound clicks demo metrics.
- Edit, share, cancel, promote.
- Editing does not reset published_at.

Exit criterion: supplier lifecycle is understandable from publish to expiry.

## Sprint 4 — Ojo Acá promotion flow
Goal: make the business model operationally clear.

Deliverables:
- Choose listing.
- Choose eligible time market.
- Show current ranking and exact amount required to enter / move up.
- Set bid/attention budget.
- Preview resulting position.
- Confirmation screen using demo money only.

Exit criterion: a publisher can understand exactly what they are buying and why ranking changes.

## Sprint 5 — Real data foundation
Goal: replace hard-coded product state with a minimal backend.

Deliverables:
- Supabase schema for users, listings, saves, outbound clicks, claims, markets/bids.
- Expiry model.
- Read paths for feed/explore/Ojo.
- Write path for listings.
- Minimal auth only where needed.

Exit criterion: create/read/save flows persist across sessions.

## Sprint 6 — Claim, moderation, anti-spam
Goal: allow open contribution without destroying quality.

Deliverables:
- Claim listing flow.
- Duplicate prevention rules.
- Report listing.
- Basic moderation states.
- First-listing-free / later microfee product state, without real payment processor yet.

Exit criterion: open supply has credible controls.

## Sprint 7 — Measurement + growth loop
Goal: test whether listings can bring their own audience.

Deliverables:
- Share tracking.
- Outbound click attribution.
- Publisher stats.
- Ojo credit concept based on qualified traffic, only if metrics justify it.
- Launch concentration around a narrow time window / city slice.

Exit criterion: we can measure supply → share → visit → discovery → outbound conversion.

## Deferred until evidence exists
- Real payment processor.
- Advanced profiles/social graph.
- Reviews/ratings.
- Editorial recommendations.
- Map-first UX.
- Highly fragmented Ojo markets by category/neighborhood.
- Badges/crowns/gamification not tied to real utility.
