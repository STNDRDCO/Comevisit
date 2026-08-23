'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import './style.css';

type SavedItem={id:string;title:string;date:string;place:string;category:string;price:string};
const items:Record<string,SavedItem>={
  cata:{id:'cata',title:'Cata de vinos naturales',date:'HOY · 20:30',place:'VILLA CRESPO',category:'EXPERIENCIAS',price:'$35.000'},
  dj:{id:'dj',title:'DJ set + vinilos',date:'HOY · 23:45',place:'CHACARITA',category:'MÚSICA',price:'GRATIS'},
  parrilla:{id:'parrilla',title:'Menú de parrilla por pasos',date:'HOY · 21:00',place:'PALERMO',category:'COMER',price:'$52.000'},
  standup:{id:'standup',title:'Stand up en vivo',date:'HOY · 21:30',place:'ALMAGRO',category:'CULTURA',price:'$7.000'},
  pasta:{id:'pasta',title:'Taller de pasta fresca',date:'LUN 24 AGO · 19:00',place:'CABALLITO',category:'EXPERIENCIAS',price:'$28.000'},
  feria:{id:'feria',title:'Feria de diseño independiente',date:'SÁB 29 AGO · 12:00',place:'PALERMO',category:'CULTURA',price:'GRATIS'},
  jazz:{id:'jazz',title:'Jazz en un living',date:'HOY · 22:00',place:'COLEGIALES',category:'MÚSICA',price:'$14.000'},
  brunch:{id:'brunch',title:'Brunch de autor',date:'DOM 30 AGO · 11:30',place:'COLEGIALES',category:'COMER',price:'$22.000'},
  festival:{id:'festival',title:'Festival japonés',date:'SÁB 5 SEP · 14:00',place:'CHACARITA',category:'CULTURA',price:'$18.000'},
  rooftop:{id:'rooftop',title:'Sunset en rooftop',date:'LUN 24 AGO · 18:30',place:'PALERMO',category:'SALIR',price:'$12.000'},
};

export default function Guardados(){
  const [ids,setIds]=useState<string[]>([]);
  useEffect(()=>setIds(JSON.parse(localStorage.getItem('cm5_saved')||'[]')),[ ]);
  const remove=(id:string)=>{const next=ids.filter(x=>x!==id);setIds(next);localStorage.setItem('cm5_saved',JSON.stringify(next))};
  const saved=ids.map(id=>items[id]).filter(Boolean);

  return <main className="savedPage">
    <header className="savedTop"><Link href="/che-mira-v5" className="savedLogo">CHE, MIRÁ</Link><Link className="publish" href="/che-mira-v5/publicar">+ Publicar</Link></header>
    <section className="savedHero"><span>MIS PLANES</span><h1>Guardados.</h1><p>Un lugar para volver a lo que te interesó. No cambia ningún ranking.</p></section>
    <section className="savedList">
      {saved.map(x=><article key={x.id}><div className="savedWhen"><strong>{x.date}</strong><span>{x.category}</span></div><div><h2><Link href={`/che-mira-v5/p/${x.id}`}>{x.title}</Link></h2><p>{x.place}</p></div><div className="savedActions"><b>{x.price}</b><button onClick={()=>remove(x.id)}>Quitar</button><Link href={`/che-mira-v5/p/${x.id}`}>Abrir ↗</Link></div></article>)}
      {saved.length===0&&<div className="savedEmpty"><h2>Todavía no guardaste nada.</h2><p>Usá ♡ cuando algo te interese y lo vas a encontrar acá.</p><Link href="/che-mira-v5#explorar">Explorar →</Link></div>}
    </section>
  </main>
}
