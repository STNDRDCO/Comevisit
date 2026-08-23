# Che Mira Radar Strategy

## Product lens

Che Mira is not narrowly an events product. Its long-term attention unit is: **"che, miren esto"**.

Anything public and timely that a person, venue, organizer, creator, brand or business wants others to notice can fit:

- an event
- a promotion
- a launch
- a restaurant or bar
- a new menu or opening
- a brand or product
- a cultural moment
- a meetup or community activity
- a recommendation or discovery

**Ojo aca** is the stronger editorial/attention layer: what is especially worth noticing now.

## Radar principle

Listening breadth should be extremely high. Posting selectivity should remain high.

"More is more" applies to the audience and signal universe, not to spam volume.

The radar should continuously search across:

1. Builders / founders / product launches
2. Paid rankings / attention-market experiments
3. Restaurants / bars / cafes / nightlife
4. Event organizers / ticketing / promoters / venues
5. Music / DJs / theater / cinema / comedy / galleries / culture
6. Brands / retail / fashion / design / beauty / lifestyle
7. Promotions / discounts / drops / collaborations / limited offers
8. Creators / influencers / recommendation accounts
9. Media / newsletters / city guides / curators
10. Tourism / hospitality / experiences
11. Communities / meetups / conferences / universities / coworking
12. Ordinary users asking what to do, where to eat, where to go
13. Ordinary users making unusually strong local recommendations
14. Accounts that repeatedly amplify other local projects and places
15. Local buzz signals: openings, queues, sold-out moments, viral places, sudden attention spikes

## Primary signal families

- attention_wave
- builders_launches
- events_now
- food_and_venues
- promos_and_commerce
- explicit_discovery_intent
- curator_hubs
- cultural_moments
- local_buzz

## Scoring philosophy

The model should score each opportunity using roughly:

- freshness: 24%
- audience fit: 18%
- natural conversational opening: 16%
- engagement velocity: 15%
- relationship value: 12%
- local relevance: 10%
- originality potential: 5%

The goal is not simply to find big accounts. A smaller live thread with a perfect opening can be more valuable than a huge generic trend.

## Action hierarchy

**Reply first** when the conversation is alive and Che Mira can add something interesting.

**Quote** when the source itself deserves amplification and Che Mira has a distinct frame.

**Original post** when several signals combine into a broader observation or trend.

**Follow** recurring high-value builders, curators, venues, organizers, brands and connectors.

**Watch** when an account/thread is likely to become useful but intervening now would be forced.

## Guardrails

- Most good replies should still work if the words "Che Mira" are removed.
- Never invent traction, availability, event details, relationships or metrics.
- Avoid repetitive startup language and repetitive catchphrases.
- Avoid politics, tragedy, crime and sensitive situations unless there is a compelling direct product reason.
- Treat restaurants, venues, brands and organizers as potential future participants in the attention marketplace, not merely as content targets.
- Sound like an interesting participant in Buenos Aires, not an account desperately trying to acquire users.

## Current implementation

The live project config is in `lib/attention-radar/projects.ts` and the xAI adapter consumes these strategy fields in `lib/attention-radar/xai.ts`.
