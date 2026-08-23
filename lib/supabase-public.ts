export const SUPABASE_URL = 'https://wpherlcpgktqpyfcrqxs.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';

const headers = {
  apikey: SUPABASE_PUBLISHABLE_KEY,
  Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
  'Content-Type': 'application/json',
};

export type DbCity = {
  id: string;
  slug: string;
  name: string;
  country_name: string;
  country_code: string;
  hero_copy: string | null;
  timezone: string | null;
};

export type DbPlace = {
  id: string;
  city_id: string;
  slug: string;
  name: string;
  category: 'eat'|'drink'|'do'|'see'|'stay'|'shop'|'night'|'useful';
  neighborhood: string | null;
  short_description: string | null;
  image_url: string | null;
  price_tier: number | null;
  is_demo: boolean;
};

export type DbSeason = {
  id: string;
  city_id: string;
  category: DbPlace['category'] | null;
  starts_at: string;
  ends_at: string;
  status: 'scheduled'|'open'|'closed'|'cancelled';
  min_increment_cents: number;
  is_demo: boolean;
};

export type DbLeaderboardEntry = {
  season_id: string;
  place_id: string;
  place_name: string;
  category: DbPlace['category'];
  total_cents: number;
  bid_count: number;
  last_bid_at: string;
  rank: number;
};

export type CityPulse = {
  city_id:string;
  slug:string;
  city_name:string;
  country_name:string;
  country_code:string;
  published_places:number;
  verified_businesses:number;
  crown_volume_cents:number;
  crown_bid_events:number;
  last_activity_at:string;
};

export type CountryPulse = {
  country_code:string;
  country_name:string;
  active_cities:number;
  published_places:number;
  verified_businesses:number;
  crown_volume_cents:number;
  crown_bid_events:number;
  last_activity_at:string;
};

async function supabaseFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {...headers, ...(init?.headers || {})},
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function fetchCities() {
  return supabaseFetch<DbCity[]>('cities?select=*&order=name.asc');
}

export async function fetchWorldPulse(){
  const [cities,countries]=await Promise.all([
    supabaseFetch<CityPulse[]>('city_world_pulse?select=*&order=crown_volume_cents.desc'),
    supabaseFetch<CountryPulse[]>('country_world_pulse?select=*&order=crown_volume_cents.desc')
  ]);
  return {cities,countries};
}

export async function fetchCityBundle(cityName: string) {
  const city = (await supabaseFetch<DbCity[]>(`cities?select=*&name=ilike.${encodeURIComponent(cityName)}&limit=1`))[0];
  if (!city) return null;

  const [places, seasons] = await Promise.all([
    supabaseFetch<DbPlace[]>(`places?select=*&city_id=eq.${city.id}&order=created_at.asc`),
    supabaseFetch<DbSeason[]>(`crown_seasons?select=*&city_id=eq.${city.id}&category=is.null&status=eq.open&order=ends_at.asc&limit=1`),
  ]);

  const season = seasons[0] || null;
  const leaderboard = season
    ? await supabaseFetch<DbLeaderboardEntry[]>(`crown_leaderboard?select=*&season_id=eq.${season.id}&order=rank.asc`)
    : [];

  return {city, places, season, leaderboard};
}

export async function submitPlace(input: {
  city_name: string;
  country_name?: string;
  place_name: string;
  category: DbPlace['category'];
  website_url?: string;
  instagram_url?: string;
  note?: string;
  submitter_email?: string;
}) {
  await supabaseFetch<void>('place_submissions', {
    method: 'POST',
    headers: {'Prefer':'return=minimal'},
    body: JSON.stringify(input),
  });
}
