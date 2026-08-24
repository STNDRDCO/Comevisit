'use client';

import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {isCheToday,eventLabel,ago,money} from './lib';
import {SignalIcon,PlatformIcon,signalFor,platformFor} from './signals';
import './style.css';

type Listing={slug:string;title:string;category:string;neighborhood:string;starts_at:string;published_at:string;price_label:string|null;description:string|null;destination_type:string;destination_url:string};
type Bid={amount_minor:number;listing:Listing|null};
type Pulse={live_today:number;scheduled_tomorrow:number;published_today:number;viewers_today:number;viewers_now:number;home_views_today:number;outbound_clicks_today:number;attention_today_minor:number;attention_tomorrow_minor:number;paid_today:number;paid_tomorrow:number};

const plural=(n:number,one:string,many:string)=>`${n} ${n===1?one:many}`;

export default function CheMiraV6(){
 const[listings,setListings]=useState<Listing[]>([]);const[bids,setBids]=useState<Bid[]>([]);const[pulse,setPulse]=useState<Pulse|null>(null);const[loading,setLoading]=useState(true);const[error,setError]=useState(false);const[showFree,setShowFree]=useState(false);const[saved,setSaved]=useState<string[]>([]);
 useEffect(()=>{
  try{setSaved(JSON.parse(localStorage.getItem('cm5_saved')||'[]'))}catch{}
  const loadPulse=()=>fetch('/api/cm/pulse').then(r=>r.ok?r.json():Promise.reject()).then(x=>setPulse(x.data||null)).catch(()=>{});
  loadPulse();const pulseTimer=setInterval(loadPulse,15000);
  fetch('/api/cm/listings?today=1').then(r=>{if(!r.ok)throw new Error();return r.json()}).then(x=>setListings(Array.isArray(x.data)?x.data:[])).catch(()=>setError(true)).finally(()=>setLoading(false));
  fetch('/api/cm/ojo?market=TODAY').then(r=>r.ok?r.json():Promise.reject()).then(x=>setBids(Array.isArray(x.data)?x.data:[])).catch(()=>setBids([]));
  return()=>clearInterval(pulseTimer);
 },[]);
 const todayListings=useMemo(()=>listings.filter(x=>isCheToday(x.starts_at)),[listings]);
 const paid=useMemo(()=>bids.filter(x=>x.listing&&isCheToday(x.listing.starts_at)).sort((a,b)=>b.amount_minor-a.amount_minor),[bids]);
 const paidSlugs=useMemo(()=>new Set(paid.map(x=>x.listing!.slug)),[paid]);
 const free=useMemo(()=>todayListings.filter(x=>!paidSlugs.has(x.slug)).sort((a,b)=>new Date(b.published_at).getTime()-new Date(a.published_at).getTime()),[todayListings,paidSlugs]);
 const attentionToday=pulse?.attention_today_minor??paid.reduce((s,x)=>s+x.amount_minor,0);const paidToday=pulse?.paid_today??paid.length;
 const toggle=(slug:string)=>setSaved(prev=>{const next=prev.includes(slug)?prev.filter(x=>x!==slug):[...prev,slug];localStorage.setItem('cm5_saved',JSON.stringify(next));return next});
 const revealFree=showFree||paid.length===0;
 return <main className="cm6"><header className="cm6Top"><Link href="/che-mira-v6" className="cm6Logo">CHE, MIRÁ</Link><nav><a href="#ranking">Hoy</a><Link href="/che-mira-v6/explorar">Explorar</Link><Link href="/che-mira-v5/guardados">Mis planes</Link><Link href="/che-mira-v6/publicar" className="cm6Publish">+ Publicar</Link></nav></header>

 <section className="cm6AttentionHero"><span>HOY · BUENOS AIRES</span><h1>Hoy hay <em>{pulse?money(attentionToday):'—'}</em> tratando de llamar tu atención.</h1><p>{paidToday?`${plural(paidToday,'publicación puso plata','publicaciones pusieron plata')} para aparecer primero.`:'Todavía nadie puso plata para aparecer primero.'} A las 6:00, arranca otro día.</p></section>

 {pulse&&<><section className="cm6BigPulse" aria-label="Pulso de atención"><div className={pulse.viewers_now>0?'live':''}><i/><b>{pulse.viewers_now}</b><span>mirando ahora</span></div><div><b>{pulse.viewers_today}</b><span>{pulse.viewers_today===1?'miró hoy':'miraron hoy'}</span></div><div><b>{pulse.live_today}</b><span>cosas hoy</span></div><div className="tomorrow"><b>{money(pulse.attention_tomorrow_minor)}</b><span>ya puestos mañana</span><small>{plural(pulse.scheduled_tomorrow,'cosa esperando','cosas esperando')} · todavía no se muestran</small></div></section></>}

 <section id="ranking" className="cm6Market"><div className="cm6MarketHead"><span>PUSIERON PLATA PARA QUE MIRES PRIMERO</span><div><b>{plural(paid.length,'publicación compitiendo','publicaciones compitiendo')}</b><strong>{money(attentionToday)}</strong></div></div>
 {loading&&<div className="cm6State">Cargando lo de hoy…</div>}{error&&<div className="cm6State error"><b>No pudimos cargar CHE, MIRÁ.</b><span>Probá de nuevo en un momento.</span></div>}
 {!loading&&!error&&paid.length>0&&<div className="cm6PaidList">{paid.map((x,i)=>{const item=x.listing!,sig=signalFor(item),platform=platformFor(item);return <Link className="cm6PaidRow" href={`/che-mira-v6/p/${item.slug}?src=ranking`} key={item.slug}><div className="cm6Rank">#{i+1}</div><div className="cm6Kind hot" title={sig.label}><SignalIcon kind={sig.kind}/></div><div className="cm6PaidCopy"><div className="cm6EventMeta"><span>{eventLabel(item.starts_at)}</span><b>{sig.label}</b><span className="cm6Source"><PlatformIcon kind={platform.kind}/>{platform.label}</span></div><h2>{item.title}</h2><p>{item.neighborhood}{item.description?` · ${item.description}`:''}</p></div><div className="cm6Bid"><small>PUSO</small><strong>{money(x.amount_minor)}</strong></div></Link>})}</div>}
 {!loading&&!error&&paid.length===0&&<div className="cm6NoPaid"><b>Hoy nadie puso plata todavía.</b><span>Entonces manda el orden de publicación.</span></div>}

 {!loading&&!error&&free.length>0&&!revealFree&&<button className="cm6RevealFree" onClick={()=>setShowFree(true)}>VER {free.length} {free.length===1?'QUE APARECIÓ':'QUE APARECIERON'} SIN PAGAR ↓</button>}
 {revealFree&&!loading&&!error&&<div className="cm6FreeBlock"><div className="cm6FreeHead"><span>{paid.length?'NO PUSIERON PLATA · LO ÚLTIMO PRIMERO':'LO ÚLTIMO PRIMERO'}</span><b>{plural(free.length,'publicación','publicaciones')}</b></div><div className="cm6RecentList">{free.map(x=>{const sig=signalFor(x),platform=platformFor(x);return <article key={x.slug}><div className="cm6Posted"><b>{ago(x.published_at)}</b><span>APARECIÓ</span></div><div className="cm6Kind" title={sig.label}><SignalIcon kind={sig.kind}/></div><div className="cm6Event"><div className="cm6EventMeta"><span>{eventLabel(x.starts_at)}</span><b>{sig.label}</b></div><h3><Link href={`/che-mira-v6/p/${x.slug}?src=free`}>{x.title}</Link></h3><p>{x.neighborhood}{x.description?` · ${x.description}`:''}</p></div><div className="cm6EventEnd"><strong>{x.price_label||'Consultar'}</strong><div className="cm6MicroActions"><a className="cm6Platform" href={`/api/cm/go?slug=${encodeURIComponent(x.slug)}`} target="_blank" rel="noreferrer" title={`Abrir ${platform.label}`}><PlatformIcon kind={platform.kind}/><span>{platform.label}</span></a><button onClick={()=>toggle(x.slug)} aria-label={saved.includes(x.slug)?'Quitar de guardados':'Guardar'}>{saved.includes(x.slug)?'♥':'♡'}</button></div></div></article>})}{free.length===0&&<div className="cm6State">Hoy todo lo que está publicado está compitiendo con plata.</div>}</div></div>}
 </section>

 <section className="cm6TomorrowStrip"><span>MAÑANA TODAVÍA NO SE VE</span><strong>{pulse?money(pulse.attention_tomorrow_minor):'—'}</strong><p>ya están puestos para llamar tu atención mañana. {pulse?plural(pulse.scheduled_tomorrow,'cosa espera','cosas esperan'):''}. Recién aparecen cuando cambia el día.</p></section>

 <section className="cm6PostCall"><span>¿TENÉS ALGO QUE MERECE ATENCIÓN HOY?</span><h2>Hacelo aparecer.</h2><p>Una promo que termina hoy. Un plato fuera de carta. Una canción que salió. Últimas entradas. Una fiesta. Algo que abrió. Si importa hoy, entra.</p><div className="cm6Examples"><span><SignalIcon kind="promo"/>Promo</span><span><SignalIcon kind="food"/>Comer</span><span><SignalIcon kind="new"/>Nuevo</span><span><SignalIcon kind="ticket"/>Últimas</span><span><SignalIcon kind="music"/>Música</span><span><SignalIcon kind="party"/>Fiesta</span></div><Link href="/che-mira-v6/publicar">+ Publicar algo →</Link></section>
 <section className="cm6ExploreCta"><div><span>¿BUSCÁS ALGO PUNTUAL?</span><h2>Filtrá lo de hoy.</h2><p>Qué, dónde y cuánto. Lo de mañana no está para mirar.</p></div><Link href="/che-mira-v6/explorar">Explorar hoy →</Link></section>
 <footer><span>CHE, MIRÁ · BUENOS AIRES</span><span>Plata arriba. Recencia abajo. Mañana arranca otra vez.</span></footer></main>
}
