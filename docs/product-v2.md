# ComeVisit — Product v2

## Core thesis
ComeVisit is not a pay-to-rank directory. It is a useful traveler-facing city guide with a separate transparent market for sponsored attention.

## Supply model: no global prelisting
ComeVisit must **not** bulk-import or prelist the world's businesses.

A place enters ComeVisit only when:
1. a local/traveler intentionally adds it, or
2. the owner intentionally claims/adds it.

Launch campaigns may use clearly marked demo/editorial seed content, but automated global prelisting is not the product model.

This means architecture is global while liquidity is city-by-city.

### Google as identity resolver, not inventory
Google Places is the preferred first resolver for business identity because of its global coverage and user familiarity.

Claim/add flow:
1. User searches for their business through Google Places.
2. User selects the matching Google result.
3. ComeVisit persists the Google Place ID as an external reference, not Google's catalog as our own database.
4. Public ComeVisit content is owner/community supplied and belongs to our own place model.
5. A Google Business Profile OAuth verification can be used when available to prove the signed-in user owns/manages the selected business.

Fallback ownership verification methods can include domain email, DNS and manual review.

A claim may exist before a ComeVisit place exists. After verification, ComeVisit creates or links the native place record.

### Traveler layer
- Search any city.
- See useful local places grouped by simple intent: Eat, Drink, Do, See, Stay, Shop, Night, Useful.
- Organic content is not ranked by payment.
- Empty cities are contributor acquisition surfaces, but should not be actively marketed or SEO-indexed as tourist destinations until useful.

### Business layer
- Ownership verification and payment are separate concepts.
- Preferred product direction: verification/claim is free; the first paid competitive action can start at $1.
- Every live city can have a **City Crown**: the top sponsored placement.
- Categories can have their own sponsored crowns.
- Paid amount is public.
- The exact amount required to overtake the current leader is public.
- Clicks / visits sent are public.
- Recent takeovers and activity should be visible.
- Sponsored placement must always be labeled as sponsored.

## Why this borrows from the Outbid / Lugarcito wave
The important mechanic is not “directory monetization.” It is turning advertising into a public competitive game.

Observed recurring mechanics across the August 2026 pay-to-rank wave:
1. Radical simplicity: identity/URL + amount + payment.
2. Public bid totals and public rank.
3. Exact “pay $1 more” CTA.
4. Live activity (“claimed X minutes ago”).
5. Visible traffic/click counters.
6. Scarcity or resets to prevent a large early bid from freezing the game.
7. Niche boards create a more legible reason to pay than generic boards.
8. The leaderboard itself becomes spectator content and social proof.

## ComeVisit-specific advantage
Generic bid boards have no enduring reason for consumers to return once novelty fades. A city guide can have repeat utility independent of the auction. The auction monetizes demand that already has a useful reason to exist.

## Audience / cold-start model
Global product does not mean global launch.

A city becomes **live** only after reaching a useful supply threshold. Before then it is a build surface for locals and businesses, not a tourist acquisition target.

Preferred launch loops:
- Founding locals / creators build the first useful set of places intentionally.
- Founding businesses claim themselves rather than being prelisted.
- City and category crown takeovers generate shareable social assets.
- Hotels, hostels, concierges and local creators distribute high-intent QR/links to tourists.
- Empty/thin city pages remain `noindex`; useful live cities become SEO surfaces.
- Launch by city, concentrate liquidity, then replicate.

## Crown mechanics to test
- City Crown and Category Crowns.
- Short seasons (24h or 7 days) rather than permanent cumulative lock-in.
- A challenger needs to exceed the leader's season total; prior spend can count toward the challenger's own season total.
- Exact amount needed to take #1 is always shown.
- All paid placements remain clearly Sponsored.
- Optional high-intent takeover windows: Friday night, ski day, festival, match day.

## Payment direction
ComeVisit sells advertising/visibility directly; it is not initially a marketplace paying third-party sellers.

Preferred checkout is card-first because it minimizes merchant friction worldwide. Crypto can be a secondary option later, not the default acquisition path.

Provider choice should be abstracted in code so payment processor/legal merchant setup can change without changing the promotion model.

## Guardrail
Never label sponsored rank as “best”, “top rated”, or “recommended”. Organic usefulness is the trust engine; public paid competition is the monetization engine.

## Demo data
Synthetic launch/demo listings are allowed for product demonstration only when clearly marked as demo/preview data. They must never be presented as actual traffic, actual bids or actual merchants without disclosure.
