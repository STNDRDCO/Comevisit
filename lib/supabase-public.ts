export const SUPABASE_URL = 'https://wpherlcpgktqpyfcrqxs.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';

const headers = { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`, 'Content-Type': 'application/json' };

export type DbCity={id:string;slug:string;name:string;country_name:string;country_code:string;hero_copy:string|null;timezone:string|null};
export type DbPlace={id:string;city_id:string;slug:string;name:string;category:'eat'|'drink'|'do'|'see'|'stay'|'shop'|'night'|'useful';neighborhood:string|null;short_description:string|null;image_url:string|null;price_tier:number|null;is_demo:boolean};
export type DbSeason={id:string;city_id:string;market_id:string|null;category:DbPlace['category']|null;starts_at:string;ends_at:string;status:'scheduled'|'open'|'closed'|'cancelled';min_increment_cents:number;is_demo:boolean};
export type DbLeaderboardEntry={season_id:string;place_id:string;place_name:string;category:DbPlace['category'];total_cents:number;bid_count:number;last_bid_at:string;rank:number};
export type DbLiveMarket={id:string;city_id:string;slug:string;title:string;eyebrow:string|null;description:string|null;context_type:'now'|'tonight'|'weekend'|'weather'|'seasonal'|'event'|'evergreen';category:DbPlace['category']|null;starts_at:string|null;ends_at:string|null;status:'draft'|'live'|'ended'|'cancelled';sort_order:number;is_demo:boolean;place_count:number;verified_businesses:number;crown_volume_cents:number;bid_events:number};
export type DbLiveMarketPlace={market_id:string;place_id:string;editorial_note:string|null;sort_order:number;is_demo:boolean};
export type CityPulse={city_id:string;slug:string;city_name:string;country_name:string;country_code:string;published_places:number;verified_businesses:number;crown_volume_cents:number;crown_bid_events:number;last_activity_at:string};
export type CountryPulse={country_code:string;country_name:string;active_cities:number;published_places:number;verified_businesses:number;crown_volume_cents:number;crown_bid_events:number;last_activity_at:string};

async function supabaseFetch<T>(path:string,init?:RequestInit):Promise<T>{const res=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...init,headers:{...headers,...(init?.headers||{})}});if(!res.ok)throw new Error(`Supabase ${res.status}: ${await res.text()}`);if(res.status===204)return undefined as T;return res.json() as Promise<T>}
export async function fetchCities(){return supabaseFetch<DbCity[]>('cities?select=*&order=name.asc')}
export async function fetchWorldPulse(){const [cities,countries]=await Promise.all([supabaseFetch<CityPulse[]>('city_world_pulse?select=*&order=crown_volume_cents.desc'),supabaseFetch<CountryPulse[]>('country_world_pulse?select=*&order=crown_volume_cents.desc')]);return{cities,countries}}

export async function fetchCityBundle(cityName:string){
 const city=(await supabaseFetch<DbCity[]>(`cities?select=*&name=ilike.${encodeURIComponent(cityName)}&limit=1`))[0];if(!city)return null;
 const [places,seasons,markets,marketPlaces]=await Promise.all([
  supabaseFetch<DbPlace[]>(`places?select=*&city_id=eq.${city.id}&order=created_at.asc`),
  supabaseFetch<DbSeason[]>(`crown_seasons?select=*&city_id=eq.${city.id}&status=eq.open&order=ends_at.asc`),
  supabaseFetch<DbLiveMarket[]>(`live_market_cards?select=*&city_id=eq.${city.id}&order=sort_order.asc`),
  supabaseFetch<DbLiveMarketPlace[]>('live_market_places?select=market_id,place_id,editorial_note,sort_order,is_demo&order=sort_order.asc')
 ]);
 const season=seasons.find(s=>!s.market_id&&!s.category)||null;
 const leaderboard=season?await supabaseFetch<DbLeaderboardEntry[]>(`crown_leaderboard?select=*&season_id=eq.${season.id}&order=rank.asc`):[];
 const marketIds=new Set(markets.map(m=>m.id)); const relevantPlaces=marketPlaces.filter(mp=>marketIds.has(mp.market_id));
 const marketSeasons=seasons.filter(s=>s.market_id&&marketIds.has(s.market_id));
 const boards=await Promise.all(marketSeasons.map(async s=>[s.market_id!,await supabaseFetch<DbLeaderboardEntry[]>(`crown_leaderboard?select=*&season_id=eq.${s.id}&order=rank.asc`)] as const));
 return{city,places,season,leaderboard,markets,marketPlaces:relevantPlaces,marketSeasons,marketBoards:Object.fromEntries(boards) as Record<string,DbLeaderboardEntry[]>};
}

export async function submitPlace(input:{city_name:string;country_name?:string;place_name:string;category:DbPlace['category'];website_url?:string;instagram_url?:string;note?:string;submitter_email?:string}){await supabaseFetch<void>('place_submissions',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(input)})}
