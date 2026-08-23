'use client';

import { FormEvent, useMemo, useState } from 'react';

type Category = 'All' | 'Eat' | 'Drink' | 'Do' | 'See' | 'Stay' | 'Shop' | 'Night';
type Place = { name:string; category:Exclude<Category,'All'>; area:string; blurb:string; price:string; bid?:number; clicks?:number; sponsored?:boolean; badge?:string; image:string };
type City = { name:string; country:string; tagline:string; watching:string; places:number; crown:{name:string;bid:number;clicks:number;since:string}; listings:Place[] };

const art = {
  food:'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
  ramen:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
  bar:'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80',
  mountain:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  lake:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  hotel:'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  night:'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  shop:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
};

const cities:Record<string,City> = {
  Tokyo:{ name:'Tokyo',country:'Japan',tagline:'A city too big to “do”. Pick a mood, pick a neighborhood, start there.',watching:'9.8k',places:1268,crown:{name:'Kado Yakitori',bid:188,clicks:1204,since:'6 min'},listings:[
    {name:'Kado Yakitori',category:'Eat',area:'Shinjuku',blurb:'Smoke, skewers and a counter that moves at its own rhythm.',price:'$$',sponsored:true,bid:188,clicks:1204,badge:'CITY CROWN',image:art.food},
    {name:'Midnight Vinyl',category:'Night',area:'Shibuya',blurb:'Tiny room, deep records, excellent highballs.',price:'$$',sponsored:true,bid:61,clicks:519,badge:'#1 NIGHT',image:art.night},
    {name:'Yanaka Walk',category:'See',area:'Taito',blurb:'Old Tokyo texture without making a day out of it.',price:'$',badge:'LOCAL ESSENTIAL',image:art.shop},
    {name:'Morning Sumo Practice',category:'Do',area:'Ryogoku',blurb:'An early, close look at a living tradition.',price:'$$',image:art.mountain},
    {name:'Nagi Coffee',category:'Drink',area:'Kiyosumi',blurb:'Serious coffee in a quiet corner of the city.',price:'$$',image:art.bar},
    {name:'Hotel Nami',category:'Stay',area:'Ginza',blurb:'Compact, calm and very well connected.',price:'$$$',image:art.hotel},
    {name:'Kōenji Archive',category:'Shop',area:'Kōenji',blurb:'Vintage clothing without the polished tourist markup.',price:'$$',image:art.shop},
    {name:'Ramen After Rain',category:'Eat',area:'Nakano',blurb:'A counter spot locals keep returning to late.',price:'$',image:art.ramen}
  ]},
  Paris:{ name:'Paris',country:'France',tagline:'Skip the checklist. Find the table, street or room you will talk about later.',watching:'12.7k',places:1511,crown:{name:'Le Petit Feu',bid:242,clicks:1880,since:'4 min'},listings:[
    {name:'Le Petit Feu',category:'Eat',area:'11e',blurb:'Tiny kitchen, big plates, always louder after nine.',price:'$$$',sponsored:true,bid:242,clicks:1880,badge:'CITY CROWN',image:art.food},
    {name:'Verre 19',category:'Drink',area:'19e',blurb:'Natural wine, zero ceremony.',price:'$$',sponsored:true,bid:81,clicks:608,badge:'#1 DRINK',image:art.bar},
    {name:'Canal at Blue Hour',category:'See',area:'Canal Saint-Martin',blurb:'Walk north, sit by the water, do nothing useful.',price:'$',badge:'LOCAL ESSENTIAL',image:art.lake},
    {name:'Atelier Bread',category:'Do',area:'10e',blurb:'Three hours of flour, butter and useful knowledge.',price:'$$',image:art.food},
    {name:'Maison Onze',category:'Stay',area:'11e',blurb:'Small hotel, no lobby theatre, excellent beds.',price:'$$$',image:art.hotel},
    {name:'Basement 03',category:'Night',area:'3e',blurb:'A basement, a red light, a very late closing time.',price:'$$',image:art.night},
    {name:'Objet 8',category:'Shop',area:'8e',blurb:'Independent design and things worth carrying home.',price:'$$$',image:art.shop}
  ]},
  'Buenos Aires':{ name:'Buenos Aires',country:'Argentina',tagline:'Come hungry, stay late, walk farther than planned.',watching:'5.1k',places:642,crown:{name:'Mesa Chica',bid:96,clicks:723,since:'11 min'},listings:[
    {name:'Mesa Chica',category:'Eat',area:'Palermo',blurb:'A noisy little room, charcoal and dishes built for sharing.',price:'$$$',sponsored:true,bid:96,clicks:723,badge:'CITY CROWN',image:art.food},
    {name:'Bar Nómade',category:'Drink',area:'Chacarita',blurb:'Sharp cocktails, dim light, good music.',price:'$$',sponsored:true,bid:34,clicks:280,badge:'#1 DRINK',image:art.bar},
    {name:'San Telmo Sunday',category:'See',area:'San Telmo',blurb:'Walk, browse, eat, watch. No itinerary needed.',price:'$',badge:'LOCAL ESSENTIAL',image:art.shop},
    {name:'Tango After Dark',category:'Do',area:'Almagro',blurb:'A late class followed by a real neighborhood milonga.',price:'$$',image:art.night},
    {name:'Casa Sur',category:'Stay',area:'Recoleta',blurb:'Quiet rooms in a city that rarely is.',price:'$$$',image:art.hotel},
    {name:'Club 2AM',category:'Night',area:'Villa Crespo',blurb:'Doors late, dance floor later.',price:'$$',image:art.night},
    {name:'Hecho Acá',category:'Shop',area:'Colegiales',blurb:'Objects, books and clothes from independent makers.',price:'$$',image:art.shop}
  ]},
  Bariloche:{ name:'Bariloche',country:'Argentina',tagline:'Lakes, mountains, fire, chocolate and a very good reason to stay one more day.',watching:'2.4k',places:184,crown:{name:'Fuego Sur',bid:74,clicks:391,since:'18 min'},listings:[
    {name:'Fuego Sur',category:'Eat',area:'Centro',blurb:'Patagonian grill, open fire and long-table energy.',price:'$$$',sponsored:true,bid:74,clicks:391,badge:'CITY CROWN',image:art.food},
    {name:'Lago & Hops',category:'Drink',area:'Km 4',blurb:'Cold pints, lake views, no rush.',price:'$$',sponsored:true,bid:29,clicks:144,badge:'#1 DRINK',image:art.bar},
    {name:'Cerro Campanario',category:'See',area:'Circuito Chico',blurb:'One of those views that makes the whole trip click.',price:'$',badge:'LOCAL ESSENTIAL',image:art.mountain},
    {name:'Hidden Bay Kayak',category:'Do',area:'Bahía López',blurb:'Small-group paddles through transparent water and quiet bays.',price:'$$',image:art.lake},
    {name:'Casa Arrayán',category:'Stay',area:'Llao Llao',blurb:'Warm wood, huge windows, breakfast worth waking up for.',price:'$$$',image:art.hotel},
    {name:'Noche Andina',category:'Night',area:'Centro',blurb:'Cocktails, DJs and a late crowd after the mountain.',price:'$$',image:art.night},
    {name:'Taller Sur',category:'Shop',area:'Centro',blurb:'Small-batch wool, ceramics and objects made locally.',price:'$$',image:art.shop}
  ]}
};

const categories:Category[]=['All','Eat','Drink','Do','See','Stay','Shop','Night'];

export default function Home(){
  const [cityName,setCityName]=useState('Tokyo');
  const [category,setCategory]=useState<Category>('All');
  const [query,setQuery]=useState('');
  const [modal,setModal]=useState<'bid'|'add'|'claim'|null>(null);
  const city=cities[cityName] ?? {name:cityName,country:'Local guide',tagline:'This city is waiting for locals to build it.',watching:'new',places:0,crown:{name:'Unclaimed',bid:1,clicks:0,since:'now'},listings:[]};
  const visible=useMemo(()=>category==='All'?city.listings:city.listings.filter(p=>p.category===category),[category,city]);
  function search(e:FormEvent){e.preventDefault();const clean=query.trim();if(!clean)return;const match=Object.keys(cities).find(k=>k.toLowerCase()===clean.toLowerCase());setCityName(match??clean);setCategory('All');}
  function choose(name:string){setCityName(name);setCategory('All');window.scrollTo({top:430,behavior:'smooth'});}
  return <main>
    <header className="nav shell"><div className="brand">COME<span>VISIT</span></div><div className="navright"><span className="live">● LIVE CITIES</span><button onClick={()=>setModal('claim')}>For local businesses</button></div></header>
    <section className="hero shell"><div className="kicker">THE WORLD, BUILT BY LOCALS</div><h1>Land somewhere.<br/><em>Know what to do.</em></h1><p>ComeVisit is the fast local layer between “I arrived” and “I know where I’m going.” Restaurants, bars, stays, walks and experiences — without the review-site sludge.</p><form onSubmit={search} className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Where are you going?"/><button>Explore</button></form><small>Try Tokyo, Paris, Buenos Aires, Bariloche — or type any city.</small></section>

    <section className="cityswitch shell"><div><span className="eyebrow">OPEN NOW</span><h2>Jump into a city</h2></div><div className="citybuttons">{Object.keys(cities).map(n=><button key={n} className={n===cityName?'active':''} onClick={()=>choose(n)}>{n}</button>)}</div></section>

    <section className="cityhero shell"><div><span className="country">{city.country}</span><h2>{city.name}</h2><p>{city.tagline}</p></div><div className="stats"><span><b>{city.watching}</b> exploring now</span><span><b>{city.places}</b> local places</span><small>Preview data</small></div></section>

    <section className="shell crown"><div><div className="eyebrow">♛ LIVE CITY CROWN · SPONSORED</div><h3>{city.crown.name} owns {city.name} right now.</h3><p>Highest verified promotion wins the city crown. The amount is public. Anyone can take it.</p><div className="crowndata"><span>${city.crown.bid} on the board</span><span>{city.crown.clicks} visits sent</span><span>claimed {city.crown.since} ago</span></div></div><button className="take" onClick={()=>setModal('bid')}><small>TAKE THE CROWN</small><b>${city.crown.bid+1}</b><span>↗</span></button></section>

    <section className="shell filters">{categories.map(c=><button key={c} className={c===category?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</section>

    {city.listings.length===0?<section className="shell empty"><div>✦</div><h3>Be one of the first locals to build {city.name}.</h3><p>Add the places travelers should actually know. Contributions are free.</p><button onClick={()=>setModal('add')}>+ Add the first place</button></section>:<section className="shell grid">{visible.map(p=><article key={p.name} className={p.sponsored?'card paid':'card'}><div className="photo" style={{backgroundImage:`url(${p.image})`}}>{p.badge?<span className="badge">{p.badge}</span>:null}{p.sponsored?<span className="paidtag">Sponsored · ${p.bid}</span>:null}</div><div className="body"><div className="meta"><span>{p.category}</span><span>{p.price}</span></div><h3>{p.name}</h3><p>{p.blurb}</p><div className="bottom"><span>⌖ {p.area}</span><button>Open ↗</button></div></div></article>)}</section>}

    <section className="shell strip"><div><span className="eyebrow">THE CITY IS OPEN</span><h2>Know a place travelers should see?</h2><p>Add it free. Own a listed business? Claim it for $1, see traffic and compete for sponsored attention.</p></div><div><button className="ghost" onClick={()=>setModal('add')}>+ Add a place</button><button onClick={()=>setModal('claim')}>Claim your place · $1</button></div></section>

    <section className="shell model"><div><span className="eyebrow">WHY THIS CAN SPREAD</span><h2>Travel guide in front.<br/>Attention market underneath.</h2><p>The traveler should never need to understand the auction. Businesses do. Organic discovery stays useful; the sponsored layer becomes a public game with visible bids, clicks, recent takeovers and an exact price to move up.</p></div><div className="board"><div className="row winner"><b>#1</b><span><strong>{city.crown.name}</strong><small>City Crown</small></span><em>${city.crown.bid}</em></div><div className="row"><b>#2</b><span><strong>Category leader</strong><small>Promoted locally</small></span><em>${Math.max(2,Math.round(city.crown.bid*.42))}</em></div><div className="row"><b>#3</b><span><strong>New challenger</strong><small>Joined 9m ago</small></span><em>${Math.max(1,Math.round(city.crown.bid*.23))}</em></div><button onClick={()=>setModal('bid')}>Take #1 for ${city.crown.bid+1} ↗</button></div></section>

    <footer className="shell footer"><div className="brand">COME<span>VISIT</span></div><p>Find the city. Build the city. Own attention in the city.</p><span>v0.2 · product preview</span></footer>

    {modal?<div className="overlay" onMouseDown={()=>setModal(null)}><div className="modal" onMouseDown={e=>e.stopPropagation()}><button className="x" onClick={()=>setModal(null)}>×</button><span className="eyebrow">{modal==='bid'?'LIVE PROMOTION':modal==='claim'?'OWNERS':'LOCALS'}</span><h2>{modal==='bid'?`Take the ${city.name} crown for $${city.crown.bid+1}`:modal==='claim'?'Claim your place for $1':`Add a place to ${city.name}`}</h2><p>{modal==='bid'?'In production, a verified payment raises your public total and updates the board instantly.':modal==='claim'?'Verify the business, edit its page, see traffic and unlock promotions.':'Contributions are free. Add somewhere genuinely useful for a traveler.'}</p><label>Place or business name<input placeholder="Start typing…"/></label><label>Website / Instagram<input placeholder="https://"/></label><button className="modalcta">{modal==='bid'?`Continue with $${city.crown.bid+1}`:modal==='claim'?'Start claim':'Add place'} ↗</button><small>Preview flow — no payment is taken.</small></div></div>:null}
  </main>;
}
