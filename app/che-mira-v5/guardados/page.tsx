'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import './style.css';

type SavedItem={id:string;title:string;date:string;place:string;category:string;price:string};
type RemoteListing={slug:string;title:string;category:string;neighborhood:string;starts_at:string;price_label:string|null};
const aliases:Record<string,string>={cata:'cata-vinos-naturales',dj:'dj-set-vinilos',parrilla:'menu-parrilla-pasos',standup:'standup-en-vivo',pasta:'taller-pasta-fresca',feria:'feria-diseno-independiente',jazz:'jazz-en-un-living',brunch:'brunch-de-autor',festival:'festival-japones',rooftop:'sunset-rooftop'};
const formatDate=(iso:string)=>new Intl.DateTimeFormat('es-AR',{timeZone:'America/Argentina/Buenos_Aires',weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso)).replace(',',' ·').toUpperCase();

export default function Guardados(){
  const [ids,setIds]=useState<string[]>([]);
  const [catalog,setCatalog]=useState<Record<string,SavedItem>>({});
  useEffect(()=>{
    const stored=JSON.parse(localStorage.getItem('cm5_saved')||'[]') as string[];setIds(stored);
    fetch('/api/cm/listings').then(r=>r.ok?r.json():Promise.reject()).then(({data}:{data:RemoteListing[]})=>{const next:Record<string,SavedItem>={};for(const x of data){next[x.slug]={id:x.slug,title:x.title,date:formatDate(x.starts_at),place:x.neighborhood,category:x.category,price:x.price_label||'Consultar'}}setCatalog(next)}).catch(()=>{});
  },[]);
  const remove=(id:string)=>{const next=ids.filter(x=>x!==id);setIds(next);localStorage.setItem('cm5_saved',JSON.stringify(next))};
  const saved=ids.map(original=>{const id=aliases[original]||original;return catalog[id]}).filter(Boolean);

  return <main className="savedPage">
    <header className="savedTop"><Link href="/che-mira-v5" className="savedLogo">CHE, MIRÁ</Link><Link className="publish" href="/che-mira-v5/publicar">+ Publicar</Link></header>
    <section className="savedHero"><span>MIS PLANES</span><h1>Guardados.</h1><p>Un lugar para volver a lo que te interesó. No cambia ningún ranking.</p></section>
    <section className="savedList">
      {saved.map(x=><article key={x.id}><div className="savedWhen"><strong>{x.date}</strong><span>{x.category}</span></div><div><h2><Link href={`/che-mira-v5/p/${x.id}`}>{x.title}</Link></h2><p>{x.place}</p></div><div className="savedActions"><b>{x.price}</b><button onClick={()=>remove(x.id)}>Quitar</button><Link href={`/che-mira-v5/p/${x.id}`}>Abrir ↗</Link></div></article>)}
      {saved.length===0&&<div className="savedEmpty"><h2>Todavía no guardaste nada.</h2><p>Usá ♡ cuando algo te interese y lo vas a encontrar acá.</p><Link href="/che-mira-v5#explorar">Explorar →</Link></div>}
      {ids.length>0&&saved.length===0&&<div className="savedEmpty"><h2>Cargando tus guardados…</h2></div>}
    </section>
  </main>
}
