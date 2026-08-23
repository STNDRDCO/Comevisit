'use client';

import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {isCheToday,eventLabel,ago,money} from './lib';
import {SignalIcon,PlatformIcon,signalFor,platformFor} from './signals';
import './style.css';

type Listing={slug:string;title:string;category:string;neighborhood:string;starts_at:string;published_at:string;price_label:string|null;description:string|null;destination_type:string;destination_url:string};
type Bid={amount_minor:number;listing:null|{slug:string;title:string;neighborhood:string;starts_at:string}};
type Pulse={live_today:number;scheduled_tomorrow:number;published_today:number;viewers_today:number;viewers_now:number;home_views_today:number;outbound_clicks_today:number};

const plural=(n:number,one:string,many:string)=>`${n} ${n===1?one:many}`;

export default function CheMiraV6(){
 const[listings,setListings]=useState<Listing[]>([]);const[bids,setBids]=useState<Bid[]>([]);const[pulse,setPulse]=useState<Pulse|null>(null);const[loading,setLoading]=useState(true);const[error,setError]=useState(false);const[saved,setSaved]=useState<string[]>([]);
 useEffect(()=>{
  try{setSaved(JSON.parse(localStorage.getItem('cm5_saved')||'[]'))}catch{}
  let sid='';try{sid=localStorage.getItem('cm_session_id')||crypto.randomUUID();localStorage.setItem('cm_session_id',sid)}catch{}
  const track=(event:string)=>sid&&fetch('/api/cm/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,sessionId:sid,properties:{surface:'v6_today'}})}).catch(()=>{});
  const loadPulse=()=>fetch('/api/cm/pulse').then(r=>r.ok?r.json():Promise.reject()).then(x=>setPulse(x.data||null)).catch(()=>{});
  track('home_view');track('presence');loadPulse();
  const presenceTimer=setInterval(()=>track('presence'),60000),pulseTimer=setInterval(loadPulse,30000);
  fetch('/api/cm/listings?today=1').then(r=>{if(!r.ok)throw new Error();return r.json()}).then(x=>setListings(Array.isArray(x.data)?x.data:[])).catch(()=>setError(true)).finally(()=>setLoading(false));
  fetch('/api/cm/ojo?market=TODAY').then(r=>r.ok?r.json():Promise.reject()).then(x=>setBids(Array.isArray(x.data)?x.data:[])).catch(()=>setBids([]));
  return()=>{clearInterval(presenceTimer);clearInterval(pulseTimer)};
 },[]);
 const recent=useMemo(()=>listings.filter(x=>isCheToday(x.starts_at)).sort((a,b)=>new Date(b.published_at).getTime()-new Date(a.published_at).getTime()).slice(0,12),[listings]);
 const fullMarket=bids.filter(x=>x.listing&&isCheToday(x.listing.starts_at));const market=fullMarket.slice(0,5);
 const toggle=(slug:string)=>setSaved(prev=>{const next=prev.includes(slug)?prev.filter(x=>x!==slug):[...prev,slug];localStorage.setItem('cm5_saved',JSON.stringify(next));return next});
 return <main className="cm6"><header className="cm6Top"><Link href="/che-mira-v6" className="cm6Logo">CHE, MIRÁ</Link><nav><Link href="/che-mira-v6/explorar">Explorar hoy</Link><a href="#ojo">Ojo Acá</a><Link href="/che-mira-v5/guardados">Mis planes</Link><Link href="/che-mira-v6/publicar" className="cm6Publish">+ Publicar</Link></nav></header>
 <section className="cm6Hero cm6HeroToday"><h1>Hoy en Buenos Aires.</h1><p>Lo que está pasando, salió, abrió, apareció o se está ofreciendo hoy.</p></section>
 {pulse&&<section className="cm6Pulse" aria-label="Pulso de hoy"><div className={pulse.viewers_now>0?'live':''}><i/>{pulse.viewers_now>0?`${plural(pulse.viewers_now,'persona','personas')} mirando ahora`:`${plural(pulse.viewers_today,'persona pasó','personas pasaron')} por acá hoy`}</div><div><b>{pulse.live_today}</b><span>cosas vivas hoy</span></div><div><b>{pulse.scheduled_tomorrow}</b><span>ya esperan mañana</span></div><div><b>{pulse.outbound_clicks_today}</b><span>salidas generadas hoy</span></div></section>}
 <section id="ojo" className="cm6Ojo"><div className="cm6OjoHead"><div><h2>OJO ACÁ</h2><p>Algunos quieren que los mires primero. Están pagando para llamar tu atención.</p></div><div><b>HOY</b><small>Más paga, más arriba.</small></div></div>{market.length?<><div className="cm6Ranks">{market.map((x,i)=><Link href={`/che-mira-v6/p/${x.listing!.slug}?src=ojo`} key={x.listing!.slug}><b>#{i+1}</b><div><small>{x.listing!.neighborhood} · {eventLabel(x.listing!.starts_at)}</small><h3>{x.listing!.title}</h3></div><strong>{money(x.amount_minor)}</strong></Link>)}</div><div className="cm6OjoFoot"><span>{fullMarket.length} {fullMarket.length===1?'persona está':'personas están'} pagando para llamar tu atención hoy.</span><Link href="/che-mira-v6/ojo">{fullMarket.length>market.length?`Ver las ${fullMarket.length} →`:'Ver ranking completo →'}</Link></div></>:<div className="cm6OjoEmpty">Todavía nadie está pagando para llamar tu atención hoy.</div>}</section>
 <section className="cm6Recent"><div className="cm6SectionHead"><div><span>EL FEED SE MUEVE CON CADA PUBLICACIÓN</span><h2>Lo último que apareció.</h2><p>Cada cosa nueva sube arriba. A las 6:00, el día se limpia.</p></div><Link href="/che-mira-v6/explorar">Explorar todo lo de hoy →</Link></div>{loading&&<div className="cm6State">Cargando la ciudad…</div>}{error&&<div className="cm6State error"><b>No pudimos cargar CHE, MIRÁ.</b><span>Probá de nuevo en un momento.</span></div>}{!loading&&!error&&<div className="cm6RecentList">{recent.map(x=>{const sig=signalFor(x);const platform=platformFor(x);return <article key={x.slug}><div className="cm6Posted"><b>{ago(x.published_at)}</b><span>APARECIÓ</span></div><div className="cm6Kind" title={sig.label}><SignalIcon kind={sig.kind}/></div><div className="cm6Event"><div className="cm6EventMeta"><span>{eventLabel(x.starts_at)}</span><b>{sig.label}</b></div><h3><Link href={`/che-mira-v6/p/${x.slug}?src=feed`}>{x.title}</Link></h3><p>{x.neighborhood}{x.description?` · ${x.description}`:''}</p></div><div className="cm6EventEnd"><strong>{x.price_label||'Consultar'}</strong><div className="cm6MicroActions"><a className="cm6Platform" href={`/api/cm/go?slug=${encodeURIComponent(x.slug)}`} target="_blank" rel="noreferrer" title={`Abrir ${platform.label}`}><PlatformIcon kind={platform.kind}/><span>{platform.label}</span></a><button onClick={()=>toggle(x.slug)} aria-label={saved.includes(x.slug)?'Quitar de guardados':'Guardar'}>{saved.includes(x.slug)?'♥':'♡'}</button></div></div></article>})}{recent.length===0&&<div className="cm6State"><b>Hoy todavía está vacío.</b><span>Si algo merece atención hoy, puede aparecer acá.</span></div>}</div>}</section>
 <section className="cm6PostCall"><span>¿TENÉS ALGO QUE MERECE ATENCIÓN HOY?</span><h2>Hacelo aparecer.</h2><p>Una promo que termina hoy. Un plato fuera de carta. Una canción que acaba de salir. Una fiesta. Una muestra. Un lugar que abrió. Si importa hoy, entra.</p><div className="cm6Examples"><span><SignalIcon kind="promo"/>Promo</span><span><SignalIcon kind="food"/>Comer</span><span><SignalIcon kind="music"/>Música</span><span><SignalIcon kind="party"/>Fiesta</span><span><SignalIcon kind="culture"/>Cultura</span><span><SignalIcon kind="experience"/>Algo nuevo</span></div><Link href="/che-mira-v6/publicar">+ Publicar algo →</Link></section>
 <section className="cm6ExploreCta"><div><span>¿BUSCÁS ALGO PUNTUAL?</span><h2>Filtrá lo de hoy.</h2><p>Qué, dónde y cuánto. Nada de calendario infinito.</p></div><Link href="/che-mira-v6/explorar">Explorar hoy →</Link></section>
 <footer><span>CHE, MIRÁ · HOY EN BUENOS AIRES</span><span>Hoy aparece. Mañana se renueva.</span></footer></main>
}
