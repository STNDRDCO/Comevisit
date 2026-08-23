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

export type DbCrown = {
  city_id: string;
  promotion_id: string;
  place_id: string;
  amount_cents: number;
  currency: string;
  starts_at: string;
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

export async function fetchCityBundle(cityName: string) {
  const city = (await supabaseFetch<DbCity[]>(`cities?select=*&name=ilike.${encodeURIComponent(cityName)}&limit=1`))[0];
  if (!city) return null;
  const [places, crowns] = await Promise.all([
    supabaseFetch<DbPlace[]>(`places?select=*&city_id=eq.${city.id}&order=created_at.asc`),
    supabaseFetch<DbCrown[]>(`active_city_crowns?select=*&city_id=eq.${city.id}&limit=1`),
  ]);
  return {city, places, crown: crowns[0] || null};
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
