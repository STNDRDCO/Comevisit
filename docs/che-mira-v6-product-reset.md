# CHE, MIRÁ — Product Reset / V6

Status: active product direction after v5. v5 and older routes are preserved as product history.

## Product sentence
CHE, MIRÁ shows what deserves attention now.

Three public systems, three transparent rules:
1. OJO ACÁ — ordered by paid attention.
2. RECIÉN PUBLICADO — ordered by `published_at`.
3. EXPLORAR — filtered by the user and ordered objectively by `starts_at`.

The consumer should not need to understand seeding, claims, pricing cohorts, wallets, credits or growth mechanics to use the product.

## Public IA
- Home: window selector → Ojo Acá top 3 → recently published → Explore CTA.
- Explore: search + when + what + where + price; objective ordering.
- Listing detail: facts, outbound CTA, save, share, calendar, claim/report as secondary actions.
- Publish: fast path first; advanced information optional.
- Organizer tools: behind account, not mixed into discovery.

## Time rules
Filters are eligibility windows, not exclusive buckets.
- HOY: event starts on the current Buenos Aires calendar day.
- ESTA NOCHE: today from 18:00 onward plus tomorrow 00:00–03:59.
- MAÑANA: next Buenos Aires calendar day.
- FINDE: next Saturday/Sunday in the upcoming 7 days.
- PRÓXIMOS: any future active event.
An event may belong to multiple windows.

## Ojo Acá language
Consumer: show position and amount. Avoid auction jargon.
Organizer: show current investment, position, and incremental amount required to move above another listing.
Internal model may still use bids/ledger.

## Alpha policy
Supply is scarce, therefore listing fees are not a launch priority. The system keeps pricing architecture but V6 should support a reversible alpha-free mode. Primary monetization test remains Ojo Acá.

## Typography / look & feel
Do not destroy the v5 direction. Default remains the familiar neutral system stack + Georgia editorial contrast.
V6 uses CSS tokens so a future alternate type system can be compared without rewriting components.
No external font dependency is introduced in this reset.

## UI rules
- Fewer cards; prefer whitespace, rules and typography.
- Cream paper base, charcoal, brick red, restrained ochre.
- Ojo Acá is hotter than the rest, but not a sportsbook.
- Mobile-first interaction; desktop is the expansion.
- Never silently show fictional fallback inventory in production.

## Core loops
Consumer: enter → filter → open → save/share → outbound action.
Organizer: publish → share → inspect performance → repeat/promote.
Marketplace: fund balance → invest in Ojo → transparent position.

## Alpha KPIs
Do not confuse seeded inventory with marketplace supply.
Track:
- active relevant listings per time window;
- % listings posted directly by third parties;
- organizer activation: first post → second post;
- organizer share rate;
- referred visits from publisher shares;
- outbound CTR;
- Ojo intent and paid conversion;
- consumer save/open/outbound funnel.
Initial target: 50–100 relevant listings/week with >=30% posted without internal intervention, then 50%, then 70%.

## Frozen until evidence
- full internal ticketing/checkout platform;
- reviews;
- consumer AI recommender/chat;
- broad social graph;
- historical prestige system;
- new cities;
- complex financial features;
- more claim/admin sophistication.

## Sprint sequence
A Product Reset — this document and information architecture.
B V6 UI/UX — simplified home, dedicated Explore, mobile-first tokenized design.
C Correctness — overlapping time filters, real errors/empty states, no fake fallback, tracking consistency.
D Supply — fast publish, repeat/share/performance loop.
E Consumer — discovery/filter/detail/save/share/calendar.
F Ojo — simplified public semantics, existing wallet/bid engine retained.
G Alpha — operate against third-party supply ratio and liquidity, not raw count.
H Growth — shareable detail/metadata, publisher referral attribution, organizer distribution.
I Commerce experiment — architecture remains `external | internal`, but internal consumer checkout is only activated after Ojo/discovery evidence and payment credentials are configured.
