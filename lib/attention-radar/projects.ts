import type { RadarProject } from "./types";

const defaults: RadarProject[] = [
  {
    id: "che-mira",
    name: "Che Mira",
    markets: ["Argentina", "Buenos Aires", "CABA", "AMBA"],
    languages: ["es", "en"],
    mission:
      "Che Mira is an attention layer for anything a person, venue, brand, organizer, creator or business wants the world to notice: an event, promo, launch, place, product, restaurant, show, idea or moment. 'Ojo aca' represents what is especially worth noticing now.",
    objective:
      "Continuously discover people and conversations where Che Mira can become useful, recognizable and socially embedded by listening first, responding naturally, amplifying good things, asking sharp questions and only promoting itself when the fit is obvious.",
    topics: [
      "rankings pagos", "paid rankings", "attention markets", "attention economy", "paid placement", "leaderboards", "bidding for attention", "outbid", "Outbid.lol", "Lugarcito.online", "Subite.pro", "argentino.dev",
      "vibe coding", "meme apps", "indie hackers Argentina", "AI builders Argentina", "startups Argentina", "build in public Argentina", "product launches Argentina", "founder twitter Argentina",
      "que hacer hoy buenos aires", "planes buenos aires", "agenda buenos aires", "eventos buenos aires", "fiestas buenos aires", "recitales buenos aires", "teatro buenos aires", "cine buenos aires", "muestras buenos aires", "ferias buenos aires", "festivales buenos aires", "stand up buenos aires", "after office buenos aires", "pop ups buenos aires", "openings buenos aires",
      "restaurantes buenos aires", "bares buenos aires", "cafes buenos aires", "parrillas buenos aires", "wine bars buenos aires", "cocteleria buenos aires", "cervecerias buenos aires", "speakeasy buenos aires", "foodie buenos aires", "gastronomia argentina", "menu nuevo", "apertura restaurante", "happy hour", "promo gastronomica",
      "marcas argentinas", "brand launch argentina", "promo argentina", "descuento argentina", "oferta argentina", "2x1 buenos aires", "beneficios buenos aires", "sale argentina", "drops argentina", "limited edition argentina", "collabs argentina",
      "creadores argentina", "influencers buenos aires", "newsletter buenos aires", "medios cultura buenos aires", "recomendaciones buenos aires", "descubrimiento local", "local discovery", "cosas para hacer", "ojo aca", "miren esto", "che mira esto"
    ],
    accounts: ["agustinhooks_", "Cypher1984", "Anacarolinatz", "DolaritoApp"],
    audienceArchetypes: [
      "founders and builders launching products",
      "people building paid rankings, directories, discovery products or attention experiments",
      "restaurants, bars, cafes, parrillas, wine bars and nightlife venues",
      "event organizers, promoters, ticketing platforms, clubs and cultural venues",
      "musicians, DJs, comedians, actors, galleries, theaters, cinemas and independent culture",
      "brands launching products, drops, promos, collaborations or limited-time offers",
      "local businesses with something timely to announce",
      "creators, influencers, curators, newsletter writers and recommendation accounts",
      "media accounts covering Buenos Aires culture, food, nightlife, tech or city life",
      "tourism, hospitality and experience operators",
      "people publicly asking what to do, where to eat, where to go or what is happening",
      "people debating what deserves attention, visibility, ranking or discovery",
      "community organizers, clubs, meetups, conferences, coworking spaces and universities",
      "retail, fashion, design, art, beauty and lifestyle businesses with launches or promotions",
      "sports, gaming, hobby and niche communities organizing public moments",
      "accounts that repeatedly amplify other local products, places or events",
      "ordinary users posting an unusually strong recommendation or discovery"
    ],
    signalFamilies: {
      attention_wave: [
        "rankings pagos", "paid ranking", "outbid clone", "leaderboard", "pay to rank", "bid for visibility", "attention market", "ranking publicitario", "comprar posicion", "subir en ranking"
      ],
      builders_launches: [
        "lo hice", "lo arme", "lo lance", "shippe", "launch", "nuevo proyecto", "nueva app", "side project", "vibe coded", "hecho en una tarde", "MVP", "beta", "build in public"
      ],
      events_now: [
        "hoy", "esta noche", "manana", "este finde", "entradas", "sold out", "ultima fecha", "fecha nueva", "lineup", "grilla", "puertas", "show", "fiesta", "recital", "festival", "feria", "muestra", "funcion"
      ],
      food_and_venues: [
        "abrimos", "apertura", "nuevo menu", "menu especial", "happy hour", "reserva", "mesa", "chef invitado", "pop up", "takeover", "cata", "degustacion", "brunch", "nuevo plato"
      ],
      promos_and_commerce: [
        "promo", "descuento", "2x1", "beneficio", "sale", "oferta", "precio lanzamiento", "drop", "edicion limitada", "collab", "preventa", "cupos"
      ],
      explicit_discovery_intent: [
        "que hago hoy", "que hay hoy", "donde salgo", "donde comer", "recomienden", "alguna fiesta", "alguna muestra", "alguna feria", "plan para hoy", "plan para el finde"
      ],
      curator_hubs: [
        "apps utiles", "cosas que encontre", "proyectos argentinos", "recomendaciones", "agenda", "imperdibles", "lo mejor de", "hilo de", "descubri", "miren esto"
      ],
      cultural_moments: [
        "estreno", "inauguracion", "opening", "vernissage", "estrena", "presentacion", "firma", "charla", "workshop", "masterclass", "meetup", "conferencia"
      ],
      local_buzz: [
        "se lleno", "todos hablando", "viral", "boom", "se puso de moda", "cola", "agotado", "exploto", "tendencia", "nuevo lugar"
      ]
    },
    positiveSignals: [
      "posted in the last few hours",
      "early engagement velocity is rising",
      "there is a natural question or conversational opening",
      "the author is a connector who repeatedly amplifies others",
      "the subject is geographically or culturally relevant to Buenos Aires",
      "the post contains a real announcement, launch, event, promo or discovery",
      "Che Mira can add value without explaining itself",
      "the opportunity can create a relationship with a venue, organizer, builder, curator or brand",
      "the reply can be interesting even to people who do not know Che Mira"
    ],
    negativeSignals: [
      "national partisan politics unless directly relevant to an event or public cultural moment",
      "generic crypto chatter without a Buenos Aires, product or attention angle",
      "giveaways, engagement bait and obvious spam",
      "celebrity gossip with no actionable local angle",
      "old posts that are no longer conversationally alive",
      "massive global topics where Che Mira would look opportunistic or irrelevant",
      "tragedy, accidents, crime or sensitive personal situations",
      "posts requiring fake familiarity or forced self-promotion"
    ],
    actionRules: {
      reply: "Use when there is a live conversation and Che Mira can add a joke, useful observation, sharp question, recognition or genuinely relevant perspective. Prefer this over promotion.",
      quote: "Use when the source itself is worth amplifying to Che Mira's audience and Che Mira can add a distinct framing. Avoid quoting merely to hijack reach.",
      post: "Use when multiple signals form a broader trend or when a source inspires an original observation that stands alone better than a reply.",
      follow: "Use for recurring high-value builders, curators, venues, organizers, brands or local connectors even when no immediate reply is warranted.",
      watch: "Use when the account or thread could become useful soon but intervening now would feel forced."
    },
    scoringWeights: {
      freshness: 24,
      engagementVelocity: 15,
      audienceFit: 18,
      naturalOpening: 16,
      relationshipValue: 12,
      localRelevance: 10,
      originalityPotential: 5
    },
    guardrails: [
      "More is more for listening, not for low-quality posting.",
      "Cast a very wide net, then be selective about interventions.",
      "Never invent engagement metrics, quotes, event details, availability or relationships.",
      "Do not make every reply about Che Mira; most good replies should work even if the brand name is removed.",
      "Prefer curiosity, recognition, wit and useful questions over pitch language.",
      "Use Argentine Spanish naturally; lowercase is preferred, but readability beats gimmicks.",
      "Do not repeat the same 'internet argentina laboratorio' framing constantly.",
      "If a venue or brand is promoting something, treat it as a potential future participant in Che Mira, not merely as content bait."
    ],
    voice: "lowercase, sharp, playful, observant, Argentine, culturally aware, non-corporate, concise, never desperate for attention",
    maxResults: 12
  }
];

export function getProjects(): RadarProject[] {
  const raw = process.env.ATTENTION_RADAR_PROJECTS_JSON;
  if (!raw) return defaults;

  try {
    const parsed = JSON.parse(raw) as RadarProject[];
    return Array.isArray(parsed) && parsed.length ? parsed : defaults;
  } catch {
    return defaults;
  }
}

export function getProject(id: string): RadarProject | undefined {
  return getProjects().find((project) => project.id === id);
}
