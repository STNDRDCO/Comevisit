'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CityPulse, CountryPulse, DbCity, DbLeaderboardEntry, DbPlace, DbSeason, fetchCities, fetchCityBundle, fetchWorldPulse, submitPlace } from '../lib/supabase-public';

type Category = 'All' | 'Eat' | 'Drink' | 'Do' | 'See' | 'Stay' | 'Shop' | 'Night' | 'Useful';
const categories:Category[]=['All','Eat','Drink','Do','See','Stay','Shop','Night','Useful'];
const fallbackImage='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';
const previewWatching:Record<string,string>={Tokyo:'9.8k',Paris:'12.7k','Buenos Aires':'5.1k',Bariloche:'2.4k'};

function labelCategory(c:DbPlace['category']){return (c[0].toUpperCase()+c.slice(1)) as Exclude<Category,'All'>}
function priceTier(n:number|null){return n? '$'.repeat(n):'—'}
function money(cents:number){return cents%100===0?`$${cents/100}`:`$${(cents/100).toFixed(2)}`}
function timeLeft(endsAt:string|null, now:number){
  if(!endsAt)return 'no active season';
  const ms=new Date(endsAt).getTime()-now;
  if(ms<=0)return 'season ended';
  const d=Math.floor(ms/86400000); const h=Math.floor((ms%86400000)/3600000); const m=Math.floor((ms%3600000)/60000);
  return d>0?`${d}d ${h}h left`:`${h}h ${m}m left`;
}

export default function Home(){
  const [cities,setCities]=useState<DbCity[]>([]);
  const [cityName,setCityName]=useState('Tokyo');
  const [city,setCity]=useState<DbCity|null>(null);
  const [places,setPlaces]=useState<DbPlace[]>([]);
  const [season,setSeason]=useState<DbSeason|null>(null);
  const [leaderboard,setLeaderboard]=useState<DbLeaderboardEntry[]>([]);
  const [cityPulse,setCityPulse]=useState<CityPulse[]>([]);
  const [countryPulse,setCountryPulse]=useState<CountryPulse[]>([]);
  const [category,setCategory]=useState<Category>('All');
  const [query,setQuery]=useState('');
  const [modal,setModal]=useState<'bid'|'add'|'claim'|null>(null);
  const [loading,setLoading]=useState(true);
  const [submitStatus,setSubmitStatus]=useState('');
  const [now,setNow]=useState(Date.now());

  useEffect(()=>{fetchCities().then(setCities).catch(console.error);fetchWorldPulse().then(p=>{setCityPulse(p.cities);setCountryPulse(p.countries)}).catch(console.error)},[]);
  useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),30000);return()=>window.clearInterval(timer)},[]);
  useEffect(()=>{
    let live=true; setLoading(true);
    fetchCityBundle(cityName).then(bundle=>{
      if(!live)return;
      if(bundle){setCity(bundle.city);setPlaces(bundle.places);setSeason(bundle.season);setLeaderboard(bundle.leaderboard)}
      else{setCity(null);setPlaces([]);setSeason(null);setLeaderboard([])}
      setLoading(false)
    }).catch(()=>{if(live){setCity(null);setPlaces([]);setSeason(null);setLeaderboard([]);setLoading(false)}});
    return()=>{live=false}
  },[cityName]);

  const visible=useMemo(()=>category==='All'?places:places.filter(p=>labelCategory(p.category)===category),[category,places]);
  const activeSeason=season && new Date(season.starts_at).getTime()<=now && new Date(season.ends_at).getTime()>now ? season : null;
  const board=activeSeason?leaderboard:[];
  const leader=board[0]??null;
  const crownPlace=leader?places.find(p=>p.id===leader.place_id):null;
  const minIncrement=activeSeason?.min_increment_cents??100;
  const takeTotal=(leader?.total_cents??0)+minIncrement;
  const displayCity=city?.name??cityName;
  const displayCountry=city?.country_name??'Local guide';
  const tagline=city?.hero_copy??'This city is waiting for locals to build it.';

  function search(e:FormEvent){e.preventDefault();const clean=query.trim();if(!clean)return;const match=cities.find(c=>c.name.toLowerCase()===clean.toLowerCase());setCityName(match?.name??clean);setCategory('All')}
  function choose(name:string){setCityName(name);setCategory('All');window.scrollTo({top:430,behavior:'smooth'})}

  async function addPlace(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setSubmitStatus('Saving…');
    const fd=new FormData(e.currentTarget);
    try{
      await submitPlace({city_name:displayCity,country_name:city?.country_name,place_name:String(fd.get('place_name')||''),category:String(fd.get('category')||'eat').toLowerCase() as DbPlace['category'],website_url:String(fd.get('website_url')||'')||undefined,instagram_url:String(fd.get('instagram_url')||'')||undefined,note:String(fd.get('note')||'')||undefined,submitter_email:String(fd.get('email')||'')||undefined});
      setSubmitStatus('Submitted. It is now in the moderation queue.');
      e.currentTarget.reset();
    }catch{setSubmitStatus('Could not submit. Try again.')}
  }

  return <main>
    <header className="nav shell"><div className="brand">COME<span>VISIT</span></div><div className="navright"><span className="live">● LIVE CITIES</span><button onClick={()=>setModal('claim')}>For local businesses</button></div></header>

    <section className="hero shell"><div className="kicker">THE WORLD, BUILT BY LOCALS</div><h1>Land somewhere.<br/><em>Know what to do.</em></h1><p>Discover what to eat, see and do anywhere — then watch locals and businesses build the world in public.</p><form onSubmit={search} className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Where are you going?"/><button>Explore</button></form><small>Search any city. Launch markets are demo-seeded and clearly labeled.</small></section>

    <section className="shell model"><div><span className="eyebrow">WORLD PULSE · LIVE DATABASE</span><h2>The world is being built.<br/>Watch where it moves.</h2><p>Countries and cities rank independently by community activity and competitive Crown volume. Demo markets are labeled; real published places remain separate.</p></div><div className="board">{countryPulse.slice(0,3).map((c,i)=><div className={i===0?'row winner':'row'} key={c.country_code}><b>#{i+1}</b><span><strong>{c.country_name}</strong><small>{c.active_cities} cit{c.active_cities===1?'y':'ies'} · {c.published_places} real places · {c.verified_businesses} verified</small></span><em>{money(c.crown_volume_cents)}</em></div>)}</div></section>

    <section className="shell model"><div><span className="eyebrow">MOST COMPETITIVE CITIES · THIS WEEK</span><h2>City versus city.</h2><p>Crown volume is only one leaderboard. Next come Most Built, Fastest Growing and Most Active, so a city can win without spending the most.</p></div><div className="board">{cityPulse.slice(0,5).map((c,i)=><div className={i===0?'row winner':'row'} key={c.city_id}><b>#{i+1}</b><span><strong>{c.city_name}</strong><small>{c.country_name} · {c.crown_bid_events} market moves · {c.published_places} real places</small></span><em>{money(c.crown_volume_cents)}</em></div>)}</div></section>

    <section className="cityswitch shell"><div><span className="eyebrow">OPEN NOW</span><h2>Jump into a city</h2></div><div className="citybuttons">{cities.map(c=><button key={c.id} className={c.name===cityName?'active':''} onClick={()=>choose(c.name)}>{c.name}</button>)}</div></section>

    <section className="cityhero shell"><div><span className="country">{displayCountry}</span><h2>{displayCity}</h2><p>{tagline}</p></div><div className="stats"><span><b>{previewWatching[displayCity]??'new'}</b> exploring now</span><span><b>{places.length}</b> loaded places</span><small>{city?'Demo catalog · live database':'No catalog yet'}</small></div></section>

    <section className="shell crown"><div><div className="eyebrow">♛ WEEKLY CITY CROWN · SPONSORED</div><h3>{crownPlace?.name??'No one'} {crownPlace?'leads':'has claimed'} {displayCity} this week.</h3><p>Businesses accumulate spend during the season. Highest total owns the sponsored crown; organic results are never sold.</p><div className="crowndata"><span>{leader?`${money(leader.total_cents)} leader total`:'Crown open'}</span><span>{activeSeason?timeLeft(activeSeason.ends_at,now):'Next season soon'}</span><span>{activeSeason?.is_demo?'Demo market':'Live market'}</span></div></div><button className="take" onClick={()=>setModal('bid')}><small>TAKE THE CROWN</small><b>{money(takeTotal)}</b><span>↗</span></button></section>

    <section className="shell filters">{categories.map(c=><button key={c} className={c===category?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</section>

    {loading?<section className="shell empty"><div>✦</div><h3>Loading {displayCity}…</h3></section>:places.length===0?<section className="shell empty"><div>✦</div><h3>Be one of the first locals to build {displayCity}.</h3><p>Add the places travelers should actually know. Contributions are free.</p><button onClick={()=>setModal('add')}>+ Add the first place</button></section>:<section className="shell grid">{visible.map(p=><article key={p.id} className={crownPlace?.id===p.id?'card paid':'card'}><div className="photo" style={{backgroundImage:`url(${p.image_url||fallbackImage})`}}>{crownPlace?.id===p.id?<><span className="badge">CITY CROWN</span><span className="paidtag">Sponsored · {leader?money(leader.total_cents):'$0'}</span></>:p.is_demo?<span className="badge">DEMO PLACE</span>:null}</div><div className="body"><div className="meta"><span>{labelCategory(p.category)}</span><span>{priceTier(p.price_tier)}</span></div><h3>{p.name}</h3><p>{p.short_description||'Local recommendation.'}</p><div className="bottom"><span>⌖ {p.neighborhood||displayCity}</span><button>Open ↗</button></div></div></article>)}</section>}

    <section className="shell strip"><div><span className="eyebrow">THE CITY IS OPEN</span><h2>Know a place travelers should see?</h2><p>Add it free. Own a business? Claim and verify it free; paid visibility starts only when you choose to compete.</p></div><div><button className="ghost" onClick={()=>setModal('add')}>+ Add a place</button><button onClick={()=>setModal('claim')}>Claim your business · free</button></div></section>

    <section className="shell model"><div><span className="eyebrow">THIS WEEK'S MARKET</span><h2>Travel guide in front.<br/>Attention market underneath.</h2><p>Each Crown resets by season. A business keeps its cumulative spend during the week; to move from $185 to $189 it adds only $4. Then the board resets and competition starts fresh.</p></div><div className="board">{board.slice(0,3).map(entry=><div className={entry.rank===1?'row winner':'row'} key={entry.place_id}><b>#{entry.rank}</b><span><strong>{entry.place_name}</strong><small>{entry.bid_count} bid{entry.bid_count===1?'':'s'} · last move {new Date(entry.last_bid_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</small></span><em>{money(entry.total_cents)}</em></div>)}{board.length===0?<div className="row winner"><b>#1</b><span><strong>Open Crown</strong><small>Be the first business this season</small></span><em>{money(minIncrement)}</em></div>:null}<button onClick={()=>setModal('bid')}>Take #1 at {money(takeTotal)} ↗</button></div></section>

    <footer className="shell footer"><div className="brand">COME<span>VISIT</span></div><p>The world, built by locals.</p><span>v0.2.3 · World Pulse live</span></footer>

    {modal?<div className="overlay" onMouseDown={()=>setModal(null)}><div className="modal" onMouseDown={e=>e.stopPropagation()}><button className="x" onClick={()=>setModal(null)}>×</button><span className="eyebrow">{modal==='bid'?'WEEKLY CROWN':modal==='claim'?'BUSINESS OWNERS':'LOCALS'}</span><h2>{modal==='bid'?`Take the ${displayCity} crown at ${money(takeTotal)}`:modal==='claim'?'Find and verify your business — free':`Add a place to ${displayCity}`}</h2>{modal==='add'?<form onSubmit={addPlace} style={{display:'grid',gap:12}}><input required name="place_name" placeholder="Place name"/><select name="category" defaultValue="eat"><option>eat</option><option>drink</option><option>do</option><option>see</option><option>stay</option><option>shop</option><option>night</option><option>useful</option></select><input name="website_url" placeholder="Website (optional)"/><input name="instagram_url" placeholder="Instagram (optional)"/><input name="email" type="email" placeholder="Your email (optional)"/><textarea name="note" placeholder="Why should travelers know it?"/><button type="submit">Submit place</button>{submitStatus?<small>{submitStatus}</small>:null}</form>:modal==='claim'?<><p>The claim flow will search an external business identity such as Google Places, then verify ownership. ComeVisit does not prelist the world and payment is not proof of ownership.</p><button onClick={()=>setModal(null)}>Continue soon</button></>:<><p>The wallet, season ledger and atomic bidding engine are already live. Checkout is intentionally provider-agnostic: once a payment provider is connected, funding the wallet activates real bids without changing this model.</p><p><strong>Important:</strong> if your business already spent in this season, you only pay the difference between your current total and the target total.</p><button onClick={()=>setModal(null)}>Got it</button></>}</div></div>:null}
  </main>
}