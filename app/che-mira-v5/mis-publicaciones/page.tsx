'use client';

import Link from 'next/link';
import {useState} from 'react';
import './style.css';

type Status='ACTIVAS'|'PRÓXIMAS'|'VENCIDAS';
type Pub={id:string;status:Status;title:string;date:string;place:string;published:string;views:number;clicks:number;price:string;promoted:boolean};

const data:Pub[]=[
  {id:'cata',status:'ACTIVAS',title:'Cata de vinos naturales',date:'HOY · 20:30',place:'Villa Crespo',published:'Hace 1 h',views:128,clicks:37,price:'$35.000',promoted:true},
  {id:'dj',status:'ACTIVAS',title:'DJ set + vinilos',date:'HOY · 23:45',place:'Chacarita',published:'Hace 3 h',views:86,clicks:21,price:'Gratis',promoted:false},
  {id:'pasta',status:'PRÓXIMAS',title:'Taller de pasta fresca',date:'LUN 24 AGO · 19:00',place:'Caballito',published:'Ayer',views:54,clicks:12,price:'$28.000',promoted:false},
  {id:'festival',status:'PRÓXIMAS',title:'Festival japonés',date:'SÁB 5 SEP · 14:00',place:'Chacarita',published:'Hace 2 días',views:91,clicks:19,price:'$18.000',promoted:true},
  {id:'old1',status:'VENCIDAS',title:'Brunch del domingo',date:'DOM 16 AGO · 11:30',place:'Colegiales',published:'Hace 10 días',views:174,clicks:42,price:'$22.000',promoted:false},
];

export default function MisPublicaciones(){
  const [status,setStatus]=useState<Status>('ACTIVAS');
  const rows=data.filter(x=>x.status===status);
  return <main className="myPub">
    <header className="myTop"><Link href="/che-mira-v5" className="myLogo">CHE, MIRÁ</Link><nav><Link href="/che-mira-v5/guardados">Guardados</Link><Link href="/che-mira-v5/publicar" className="newPub">+ Nueva publicación</Link></nav></header>

    <section className="myHero"><div><span>PARA QUIEN PUBLICA</span><h1>Mis publicaciones.</h1></div><div className="summary"><p><b>2</b><span>activas</span></p><p><b>214</b><span>visitas</span></p><p><b>58</b><span>clicks afuera</span></p></div></section>

    <section className="statusTabs">{(['ACTIVAS','PRÓXIMAS','VENCIDAS'] as Status[]).map(x=><button key={x} className={status===x?'active':''} onClick={()=>setStatus(x)}>{x}</button>)}</section>

    <section className="pubTable">
      <div className="tableHead"><span>PUBLICACIÓN</span><span>RENDIMIENTO</span><span>ACCIONES</span></div>
      {rows.map(x=><article key={x.id}>
        <div className="pubInfo"><div className="pubFlags"><span>{x.date}</span>{x.promoted&&<b>OJO ACÁ</b>}</div><h2>{x.title}</h2><p>{x.place} · {x.price}</p><small>Publicado {x.published}. Editar no cambia esta antigüedad.</small></div>
        <div className="pubMetrics"><p><b>{x.views}</b><span>visitas</span></p><p><b>{x.clicks}</b><span>clicks afuera</span></p><p><b>{x.views?Math.round(x.clicks/x.views*100):0}%</b><span>CTR</span></p></div>
        <div className="pubActions"><Link href={x.id.startsWith('old')?'#':`/che-mira-v5/p/${x.id}`}>Ver ↗</Link><button>Editar</button><button>Compartir</button>{status!=='VENCIDAS'&&<Link className="attention" href={`/che-mira-v5/ojo?listing=${x.id}`}>{x.promoted?'Subir posición':'Dar más atención'}</Link>}{status!=='VENCIDAS'&&<button className="cancel">Cancelar</button>}</div>
      </article>)}
      {rows.length===0&&<div className="noRows">No hay publicaciones en este estado.</div>}
    </section>

    <section className="dashboardRule"><span>REGLA DEL FEED</span><h2>Podés corregir. No podés volver a nacer.</h2><p>Editar título, precio, link o descripción mantiene intacto el momento original de publicación.</p></section>
  </main>
}
