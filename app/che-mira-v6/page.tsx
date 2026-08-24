'use client';

import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {isCheToday,eventLabel,ago,money} from './lib';
import {SignalIcon,PlatformIcon,signalFor,platformFor} from './signals';
import './style.css';

type Listing={slug:string;title:string;category:string;neighborhood:string;starts_at:string;published_at:string;price_label:string|null;description:string|null;destination_type:string;destination_url:string};
type Bid={amount_minor:number;listing:Listing|null};
type Pulse={live_today:number;scheduled_tomorrow:number;published_today:number;viewers_today:number;viewers_now:number;home_views_today:number;outbound_clicks_today:number;attention_today_minor:number;attention_tomorrow_minor:number;paid_today:number;paid_tomorrow:number};
type Rates={btc_ars:number;btc_usd:number;source:string;source_url:string};
type PublicStat={views:number;seen:number;shares:number};
type Currency='ARS'|'USD'|'SATS';

const plural=(n:number,one:string,many:string)=>`${n} ${n===1?one:many}`;
const zeroStat:PublicStat={views:0,seen:0,shares:0};

function attentionValue(ars:number,currency:Currency,rates:Rates|null){
 if(currency==='ARS'||!rates)return money(ars);
 if(currency==='USD')return `US$${Math.round(ars*rates.btc_usd/rates.btc_ars).toLocaleString('es-AR')}`;
 return `${Math.round(ars/rates.btc_ars*100_000_000).toLocaleString('es-AR')} sats`;
}

export default function CheMiraV6(){
 const[listings,setListings]=useState<Listing[]>([]);const[bids,setBids]=useState<Bid[]>([]);const[pulse,setPulse]=useState<Pulse|null>(null);const[rates,setRates]=useState<Rates|null>(null);const[stats,setStats]=useState<Record<string,PublicStat>>({});const[loading,setLoading]=useState(true);const[error,setError]=useState(false);const[showFree,setShowFree]=useState(false);const[saved,setSaved]=useState<string[]>([]);const[seen,setSeen]=useState<string[]>([]);const[shared,setShared]=useState('');const[currency,setCurrency]=useState<Currency>('ARS');const[heroIndex,setHeroIndex]=useState(0);
 useEffect(()=>{
  try{setSaved(JSON.parse(localStorage.getItem('cm5_saved')||'[]'));setSeen(JSON.parse(localStorage.getItem('cm6_seen')||'[]'))}catch{}
  const loadPulse=()=>fetch('/api/cm/pulse').then(r=>r.ok?r.json():Promise.reject()).then(x=>setPulse(x.data||null)).catch(()=>{});
  loadPulse();const pulseTimer=setInterval(loadPulse,15000);
  fetch('/api/cm/rates').then(r=>r.ok?r.json():Promise.reject()).then(x=>setRates(x.data||null)).catch(()=>{});
  fetch('/api/cm/listings?today=1').then(r=>{if(!r.ok)throw new Error();return r.json()}).then(x=>setListings(Array.isArray(x.data)?x.data:[])).catch(()=>setError(true)).finally(()=>setLoading(false));
  fetch('/api/cm/ojo?market=TODAY').then(r=>r.ok?r.json():Promise.reject()).then(x=>setBids(Array.isArray(x.data)?x.data:[])).catch(()=>setBids([]));
  return()=>clearInterval(pulseTimer);
 },[]);
 const todayListings=useMemo(()=>listings.filter(x=>isCheToday(x.starts_at)),[listings]);
 const paid=useMemo(()=>bids.filter(x=>x.listing&&isCheToday(x.listing.starts_at)).sort((a,b)=>b.amount_minor-a.amount_minor),[bids]);
 const paidSlugs=useMemo(()=>new Set(paid.map(x=>x.listing!.slug)),[paid]);
 const free=useMemo(()=>todayListings.filter(x=>!paidSlugs.has(x.slug)).sort((a,b)=>new Date(b.published_at).getTime()-new Date(a.published_at).getTime()),[todayListings,paidSlugs]);
 const allSlugs=useMemo(()=>Array.from(new Set([...todayListings.map(x=>x.slug),...paid.map(x=>x.listing!.slug)])),[todayListings,paid]);
 useEffect(()=>{if(!allSlugs.length)return;const load=()=>fetch(`/api/cm/stats?slugs=${encodeURIComponent(allSlugs.join(','))}`).then(r=>r.ok?r.json():Promise.reject()).then(x=>setStats(x.data||{})).catch(()=>{});load();const timer=setInterval(load,20000);return()=>clearInterval(timer)},[allSlugs]);
 const attentionToday=pulse?.attention_today_minor??paid.reduce((s,x)=>s+x.amount_minor,0);const paidToday=pulse?.paid_today??paid.length;
 const attentionTomorrow=pulse?.attention_tomorrow_minor??0;
 const heroLines=useMemo(()=>{if(!pulse)return['Hoy se está armando.'];const lines=[`Hoy hay ${attentionValue(attentionToday,currency,rates)} compitiendo por tu atención.`,`${plural(paidToday,'publicación puso plata','publicaciones pusieron plata')} para que las mires primero hoy.`,`${plural(pulse.live_today,'cosa está','cosas están')} tratando de llamar tu atención hoy.`,`${plural(pulse.viewers_today,'persona miró','personas miraron')} CHE, MIRÁ hoy.`,`Mañana ya hay ${attentionValue(attentionTomorrow,currency,rates)} en juego.`];if(pulse.viewers_now>0)lines.splice(3,0,`${plural(pulse.viewers_now,'persona está','personas están')} mirando con vos ahora.`);return lines},[pulse,attentionToday,attentionTomorrow,currency,rates,paidToday]);
 useEffect(()=>{if(heroLines.length<2)return;const timer=setInterval(()=>setHeroIndex(i=>(i+1)%heroLines.length),4800);return()=>clearInterval(timer)},[heroLines.length]);
 useEffect(()=>{setHeroIndex(i=>Math.min(i,Math.max(0,heroLines.length-1)))},[heroLines.length]);
 const toggle=(slug:string)=>setSaved(prev=>{const next=prev.includes(slug)?prev.filter(x=>x!==slug):[...prev,slug];localStorage.setItem('cm5_saved',JSON.stringify(next));return next});
 const sessionId=()=>{try{const current=localStorage.getItem('cm_session_id')||crypto.randomUUID();localStorage.setItem('cm_session_id',current);return current}catch{return''}};
 const markSeen=async(slug:string)=>{if(seen.includes(slug))return;const next=[...seen,slug];setSeen(next);localStorage.setItem('cm6_seen',JSON.stringify(next));setStats(s=>({...s,[slug]:{...(s[slug]||zeroStat),seen:(s[slug]?.seen||0)+1}}));const r=await fetch('/api/cm/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'seen',sessionId:sessionId(),listing:slug,properties:{surface:'v6.3_home'}})}).catch(()=>null);if(!r?.ok){setSeen(prev=>prev.filter(x=>x!==slug));setStats(s=>({...s,[slug]:{...(s[slug]||zeroStat),seen:Math.max(0,(s[slug]?.seen||1)-1)}}))}};
 const share=async(item:Listing)=>{const url=`${location.origin}/che-mira-v6/p/${item.slug}?src=share`;let completed=false;try{if(navigator.share){await navigator.share({title:item.title,text:`CHE, MIRÁ · ${item.title}`,url});completed=true}else{await navigator.clipboard.writeText(url);completed=true;setShared(item.slug);setTimeout(()=>setShared(''),1800)}}catch{}if(completed){setStats(s=>({...s,[item.slug]:{...(s[item.slug]||zeroStat),shares:(s[item.slug]?.shares||0)+1}}));fetch('/api/cm/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'share',sessionId:sessionId(),listing:item.slug,properties:{surface:'v6.3_home'}})}).catch(()=>{})}};
 const revealFree=showFree||paid.length===0;
 const social=(item:Listing)=>{const st=stats[item.slug]||zeroStat;const didSee=seen.includes(item.slug);return <div className="cm6Social"><span className="cm6Views" title="Aperturas de esta publicación">◉ {st.views}</span><button className={didSee?'seen':''} onClick={()=>markSeen(item.slug)}>{didSee?'LO VI ✓':'LO VI'}{st.seen>0?` · ${st.seen}`:''}</button><button onClick={()=>share(item)} title="Compartir">{shared===item.slug?'COPIADO ✓':`↗${st.shares>0?` ${st.shares}`:''}`}</button></div>};
 return <main className="cm6"><header className="cm6Top"><Link href="/che-mira-v6" className="cm6Logo">CHE, MIRÁ</Link><nav><a href="#ranking">Hoy</a><Link href="/che-mira-v6/explorar">Explorar</Link><Link href="/che-mira-v5/guardados">Mis planes</Link><Link href="/che-mira-v6/publicar" className="cm6Publish">+ Publicar</Link></nav></header>

 <section className="cm6AttentionHero"><div className="cm6HeroTop"><span>HOY · BUENOS AIRES</span><div className="cm6Currency" aria-label="Moneda"><button className={currency==='ARS'?'active':''} onClick={()=>setCurrency('ARS')}>ARS</button><button className={currency==='USD'?'active':''} onClick={()=>setCurrency('USD')} disabled={!rates}>USD</button><button className={currency==='SATS'?'active':''} onClick={()=>setCurrency('SATS')} disabled={!rates}>SATS</button></div></div><h1 key={`${heroIndex}-${currency}`} className="cm6HeroLine">{heroLines[heroIndex]||heroLines[0]}</h1><div className="cm6HeroUnder"><p>Publicar es gratis. La plata ordena quién aparece primero.</p>{currency!=='ARS'&&rates&&<a href={rates.source_url} target="_blank" rel="noreferrer">≈ cotización {rates.source}</a>}</div></section>

 {pulse&&<section className="cm6LiveLine" aria-label="Pulso de atención"><span className={pulse.viewers_now>0?'live':''}><i/><b>{pulse.viewers_now}</b> mirando ahora</span><span><b>{pulse.viewers_today}</b> {pulse.viewers_today===1?'miró hoy':'miraron hoy'}</span><span><b>{pulse.live_today}</b> cosas hoy</span><span><b>{attentionValue(attentionTomorrow,currency,rates)}</b> mañana</span></section>}

 <section id="ranking" className="cm6Market"><div className="cm6MarketHead"><span>PUSIERON PLATA PARA QUE MIRES PRIMERO</span><div><b>{plural(paid.length,'publicación compitiendo','publicaciones compitiendo')}</b><strong>{attentionValue(attentionToday,currency,rates)}</strong></div></div>
 {loading&&<div className="cm6State">Cargando lo de hoy…</div>}{error&&<div className="cm6State error"><b>No pudimos cargar CHE, MIRÁ.</b><span>Probá de nuevo en un momento.</span></div>}
 {!loading&&!error&&paid.length>0&&<div className="cm6PaidList">{paid.map((x,i)=>{const item=x.listing!,sig=signalFor(item),platform=platformFor(item);return <article className="cm6PaidRow" key={item.slug}><div className="cm6Rank">#{i+1}</div><div className="cm6Kind hot" title={sig.label}><SignalIcon kind={sig.kind}/></div><div className="cm6PaidCopy"><div className="cm6EventMeta"><span>{eventLabel(item.starts_at)}</span><b>{sig.label}</b><a className="cm6Source" href={`/api/cm/go?slug=${encodeURIComponent(item.slug)}`} target="_blank" rel="noreferrer"><PlatformIcon kind={platform.kind}/>{platform.label}</a></div><h2><Link href={`/che-mira-v6/p/${item.slug}?src=ranking`}>{item.title}</Link></h2><p>{item.neighborhood}{item.description?` · ${item.description}`:''}</p>{social(item)}</div><div className="cm6Bid"><small>PUSO</small><strong>{attentionValue(x.amount_minor,currency,rates)}</strong></div></article>})}</div>}
 {!loading&&!error&&paid.length===0&&<div className="cm6NoPaid"><b>Hoy nadie puso plata todavía.</b><span>Entonces manda el orden de publicación.</span></div>}

 {!loading&&!error&&free.length>0&&!revealFree&&<button className="cm6RevealFree" onClick={()=>setShowFree(true)}>VER {free.length} {free.length===1?'QUE APARECIÓ':'QUE APARECIERON'} SIN PONER PLATA ↓</button>}
 {revealFree&&!loading&&!error&&<div className="cm6FreeBlock"><div className="cm6FreeHead"><span>{paid.length?'SIN PLATA · LO ÚLTIMO PRIMERO':'LO ÚLTIMO PRIMERO'}</span><b>{plural(free.length,'publicación','publicaciones')}</b></div><div className="cm6RecentList">{free.map(x=>{const sig=signalFor(x),platform=platformFor(x);return <article key={x.slug}><div className="cm6Posted"><b>{ago(x.published_at)}</b><span>APARECIÓ</span></div><div className="cm6Kind" title={sig.label}><SignalIcon kind={sig.kind}/></div><div className="cm6Event"><div className="cm6EventMeta"><span>{eventLabel(x.starts_at)}</span><b>{sig.label}</b></div><h3><Link href={`/che-mira-v6/p/${x.slug}?src=free`}>{x.title}</Link></h3><p>{x.neighborhood}{x.description?` · ${x.description}`:''}</p>{social(x)}</div><div className="cm6EventEnd"><strong>{x.price_label||'Consultar'}</strong><a className="cm6Platform" href={`/api/cm/go?slug=${encodeURIComponent(x.slug)}`} target="_blank" rel="noreferrer" title={`Abrir ${platform.label}`}><PlatformIcon kind={platform.kind}/><span>{platform.label}</span></a><button onClick={()=>toggle(x.slug)} aria-label={saved.includes(x.slug)?'Quitar de guardados':'Guardar'}>{saved.includes(x.slug)?'♥':'♡'}</button></div></article>})}{free.length===0&&<div className="cm6State">Hoy todo lo que está publicado está compitiendo con plata.</div>}</div></div>}
 </section>

 <section className="cm6TomorrowStrip"><span>MAÑANA TODAVÍA NO SE VE</span><strong>{pulse?attentionValue(attentionTomorrow,currency,rates):'—'}</strong><p>ya están en juego para mañana. {pulse?plural(pulse.scheduled_tomorrow,'cosa espera','cosas esperan'):''}. El contenido recién aparece cuando cambia el día.</p></section>

 <section className="cm6PostCall"><span>¿TENÉS ALGO QUE MERECE ATENCIÓN HOY?</span><h2>Hacelo aparecer.</h2><p>Una promo que termina hoy. Un plato fuera de carta. Una canción que salió. Últimas entradas. Una fiesta. Algo que abrió. Si importa hoy, entra.</p><div className="cm6Examples"><span><SignalIcon kind="promo"/>Promo</span><span><SignalIcon kind="food"/>Comer</span><span><SignalIcon kind="new"/>Nuevo</span><span><SignalIcon kind="ticket"/>Últimas</span><span><SignalIcon kind="music"/>Música</span><span><SignalIcon kind="party"/>Fiesta</span></div><Link href="/che-mira-v6/publicar">+ Publicar algo →</Link></section>
 <section className="cm6ExploreCta"><div><span>¿BUSCÁS ALGO PUNTUAL?</span><h2>Filtrá lo de hoy.</h2><p>Qué, dónde y cuánto. Lo de mañana no está para mirar.</p></div><Link href="/che-mira-v6/explorar">Explorar hoy →</Link></section>
 <footer><span>CHE, MIRÁ · BUENOS AIRES</span><span>Plata arriba. Recencia abajo. Mañana arranca otra vez.</span></footer></main>
}
