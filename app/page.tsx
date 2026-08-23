'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { DbCity, DbPlace, fetchCities, fetchCityBundle, submitPlace } from '../lib/supabase-public';

type Category = 'All' | 'Eat' | 'Drink' | 'Do' | 'See' | 'Stay' | 'Shop' | 'Night' | 'Useful';
const categories:Category[]=['All','Eat','Drink','Do','See','Stay','Shop','Night','Useful'];
const fallbackImage='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';
const previewWatching:Record<string,string>={Tokyo:'9.8k',Paris:'12.7k','Buenos Aires':'5.1k',Bariloche:'2.4k'};

function labelCategory(c:DbPlace['category']){return (c[0].toUpperCase()+c.slice(1)) as Exclude<Category,'All'>}
function priceTier(n:number|null){return n? '$'.repeat(n):'—'}

export default function Home(){
  const [cities,setCities]=useState<DbCity[]>([]);
  const [cityName,setCityName]=useState('Tokyo');
  const [city,setCity]=useState<DbCity|null>(null);
  const [places,setPlaces]=useState<DbPlace[]>([]);
  const [crown,setCrown]=useState<{place_id:string;amount_cents:number;starts_at:string}|null>(null);
  const [category,setCategory]=useState<Category>('All');
  const [query,setQuery]=useState('');
  const [modal,setModal]=useState<'bid'|'add'|'claim'|null>(null);
  const [loading,setLoading]=useState(true);
  const [submitStatus,setSubmitStatus]=useState('');

  useEffect(()=>{fetchCities().then(setCities).catch(console.error)},[]);
  useEffect(()=>{
    let live=true; setLoading(true);
    fetchCityBundle(cityName).then(bundle=>{if(!live)return;if(bundle){setCity(bundle.city);setPlaces(bundle.places);setCrown(bundle.crown)}else{setCity(null);setPlaces([]);setCrown(null)}setLoading(false)}).catch(()=>{if(live){setCity(null);setPlaces([]);setCrown(null);setLoading(false)}});
    return()=>{live=false}
  },[cityName]);

  const visible=useMemo(()=>category==='All'?places:places.filter(p=>labelCategory(p.category)===category),[category,places]);
  const crownPlace=crown?places.find(p=>p.id===crown.place_id):null;
  const crownBid=crown?Math.round(crown.amount_cents/100):1;
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
      setSubmitStatus('Submitted. A real row was added to the moderation queue.');
      e.currentTarget.reset();
    }catch{setSubmitStatus('Could not submit. Try again.')}
  }

  return <main>
    <header className="nav shell"><div className="brand">COME<span>VISIT</span></div><div className="navright"><span className="live">● LIVE CITIES</span><button onClick={()=>setModal('claim')}>For local businesses</button></div></header>

    <section className="hero shell"><div className="kicker">THE WORLD, BUILT BY LOCALS</div><h1>Land somewhere.<br/><em>Know what to do.</em></h1><p>ComeVisit is the fast local layer between “I arrived” and “I know where I’m going.” Restaurants, bars, stays, walks and experiences — without the review-site sludge.</p><form onSubmit={search} className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Where are you going?"/><button>Explore</button></form><small>Search any city. Seed cities are backed by Supabase and marked as demo content.</small></section>

    <section className="cityswitch shell"><div><span className="eyebrow">OPEN NOW</span><h2>Jump into a city</h2></div><div className="citybuttons">{cities.map(c=><button key={c.id} className={c.name===cityName?'active':''} onClick={()=>choose(c.name)}>{c.name}</button>)}</div></section>

    <section className="cityhero shell"><div><span className="country">{displayCountry}</span><h2>{displayCity}</h2><p>{tagline}</p></div><div className="stats"><span><b>{previewWatching[displayCity]??'new'}</b> exploring now</span><span><b>{places.length}</b> loaded places</span><small>{city?'Demo catalog · live database':'No catalog yet'}</small></div></section>

    <section className="shell crown"><div><div className="eyebrow">♛ LIVE CITY CROWN · SPONSORED</div><h3>{crownPlace?.name??'Unclaimed'} {crownPlace?'owns':'can own'} {displayCity} right now.</h3><p>Highest verified promotion wins the city crown. Organic results below are not sold.</p><div className="crowndata"><span>${crownBid} on the board</span><span>{crown?'Stored in Supabase':'Open crown'}</span><span>{crown?'demo promotion':'first mover'}</span></div></div><button className="take" onClick={()=>setModal('bid')}><small>TAKE THE CROWN</small><b>${crownBid+1}</b><span>↗</span></button></section>

    <section className="shell filters">{categories.map(c=><button key={c} className={c===category?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</section>

    {loading?<section className="shell empty"><div>✦</div><h3>Loading {displayCity}…</h3></section>:places.length===0?<section className="shell empty"><div>✦</div><h3>Be one of the first locals to build {displayCity}.</h3><p>Add the places travelers should actually know. Contributions are free.</p><button onClick={()=>setModal('add')}>+ Add the first place</button></section>:<section className="shell grid">{visible.map(p=><article key={p.id} className={crownPlace?.id===p.id?'card paid':'card'}><div className="photo" style={{backgroundImage:`url(${p.image_url||fallbackImage})`}}>{crownPlace?.id===p.id?<><span className="badge">CITY CROWN</span><span className="paidtag">Sponsored · ${crownBid}</span></>:p.is_demo?<span className="badge">DEMO PLACE</span>:null}</div><div className="body"><div className="meta"><span>{labelCategory(p.category)}</span><span>{priceTier(p.price_tier)}</span></div><h3>{p.name}</h3><p>{p.short_description||'Local recommendation.'}</p><div className="bottom"><span>⌖ {p.neighborhood||displayCity}</span><button>Open ↗</button></div></div></article>)}</section>}

    <section className="shell strip"><div><span className="eyebrow">THE CITY IS OPEN</span><h2>Know a place travelers should see?</h2><p>Add it free. Submissions now go to a real moderation queue in Supabase.</p></div><div><button className="ghost" onClick={()=>setModal('add')}>+ Add a place</button><button onClick={()=>setModal('claim')}>Claim your place · $1</button></div></section>

    <section className="shell model"><div><span className="eyebrow">THE MODEL</span><h2>Travel guide in front.<br/>Attention market underneath.</h2><p>Organic discovery stays useful. Sponsored positions are explicit and competitive. City and category crowns can reset so attention stays liquid instead of being permanently captured by one early bidder.</p></div><div className="board"><div className="row winner"><b>#1</b><span><strong>{crownPlace?.name??'Open'}</strong><small>City Crown</small></span><em>${crownBid}</em></div><div className="row"><b>#2</b><span><strong>Category leader</strong><small>Next market</small></span><em>${Math.max(2,Math.round(crownBid*.42))}</em></div><div className="row"><b>#3</b><span><strong>New challenger</strong><small>Entry layer</small></span><em>${Math.max(1,Math.round(crownBid*.23))}</em></div><button onClick={()=>setModal('bid')}>Take #1 for ${crownBid+1} ↗</button></div></section>

    <footer className="shell footer"><div className="brand">COME<span>VISIT</span></div><p>Find the city. Build the city. Own attention in the city.</p><span>v0.2.1 · Supabase connected</span></footer>

    {modal?<div className="overlay" onMouseDown={()=>setModal(null)}><div className="modal" onMouseDown={e=>e.stopPropagation()}><button className="x" onClick={()=>setModal(null)}>×</button><span className="eyebrow">{modal==='bid'?'LIVE PROMOTION':modal==='claim'?'OWNERS':'LOCALS'}</span><h2>{modal==='bid'?`Take the ${displayCity} crown for $${crownBid+1}`:modal==='claim'?'Claim your place for $1':`Add a place to ${displayCity}`}</h2>{modal==='add'?<form onSubmit={addPlace} style={{display:'grid',gap:12}}><input required name="place_name" placeholder="Place name"/><select name="category" defaultValue="eat"><option>eat</option><option>drink</option><option>do</option><option>see</option><option>stay</option><option>shop</option><option>night</option><option>useful</option></select><input name="website_url" placeholder="Website (optional)"/><input name="instagram_url" placeholder="Instagram (optional)"/><input name="email" type="email" placeholder="Your email (optional)"/><textarea name="note" placeholder="Why should travelers know it?"/><button type="submit">Submit place</button>{submitStatus?<small>{submitStatus}</small>:null}</form>:<><p>{modal==='bid'?'The promotion ledger is real now, but checkout is intentionally not enabled yet. Stripe comes next.':'Ownership verification is modeled in the database; authentication and payment are the next implementation step.'}</p><button onClick={()=>setModal(null)}>Got it</button></>}</div></div>:null}
  </main>
}
