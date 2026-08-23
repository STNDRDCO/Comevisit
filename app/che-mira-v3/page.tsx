'use client';

import Link from 'next/link';
import {useMemo,useState} from 'react';
import './style.css';

type WindowKey='TODO'|'HOY'|'MAÑANA'|'ESTA NOCHE'|'FINDE'|'MÁS ADELANTE';

const filters:WindowKey[]=['TODO','HOY','MAÑANA','ESTA NOCHE','FINDE','MÁS ADELANTE'];

const listings=[
  {posted:'HACE 2 MIN',window:'MÁS ADELANTE' as WindowKey,eventDate:'SÁB 5 SEP · 23:30',title:'Festival japonés',place:'Chacarita',detail:'Comida, música y feria. Una sola fecha.',price:'$18.000',cta:'Ver Instagram ↗'},
  {posted:'HACE 5 MIN',window:'HOY' as WindowKey,eventDate:'HOY · 20:30',title:'Cata de vinos naturales',place:'Villa Crespo',detail:'6 etiquetas + picada.',price:'$35.000',cta:'Reservar por WhatsApp ↗'},
  {posted:'HACE 8 MIN',window:'ESTA NOCHE' as WindowKey,eventDate:'HOY · 23:45',title:'DJ set + vinilos',place:'Chacarita',detail:'Vinilos, birras frías y patio abierto.',price:'Entrada libre',cta:'Ver Instagram ↗'},
  {posted:'HACE 14 MIN',window:'FINDE' as WindowKey,eventDate:'SÁB 29 AGO · 12:00',title:'Feria de diseño',place:'Palermo',detail:'Diseño local, libros, edición y música.',price:'Gratis',cta:'Ir a la web ↗'},
  {posted:'HACE 22 MIN',window:'MAÑANA' as WindowKey,eventDate:'LUN 24 AGO · 19:00',title:'Taller de pasta fresca',place:'Caballito',detail:'Amasás, cocinás y cenás.',price:'$28.000',cta:'Abrir checkout ↗'},
  {posted:'HACE 31 MIN',window:'HOY' as WindowKey,eventDate:'HOY · 21:30',title:'Stand up en vivo',place:'Almagro',detail:'4 comediantes, un bar, muchas risas.',price:'$7.000',cta:'Comprar entrada ↗'},
  {posted:'HACE 44 MIN',window:'MÁS ADELANTE' as WindowKey,eventDate:'VIE 4 SEP · 20:00',title:'Cena en seis pasos',place:'Palermo',detail:'Menú de estación. Cupos limitados.',price:'$48.000',cta:'Ir a la web ↗'},
];

const ojoMarkets:Record<WindowKey,{title:string,place:string,date:string,bid:string}[]>={
  'TODO':[
    {title:'Fiesta Bohemia',place:'Chacarita',date:'HOY · 23:30',bid:'$24.800'},
    {title:'Festival japonés',place:'Chacarita',date:'SÁB 5 SEP',bid:'$19.400'},
    {title:'Noche de Pizzas',place:'Villa Urquiza',date:'HOY · 21:00',bid:'$15.300'},
  ],
  'HOY':[
    {title:'Fiesta Bohemia',place:'Chacarita',date:'HOY · 23:30',bid:'$24.800'},
    {title:'Noche de Pizzas',place:'Villa Urquiza',date:'HOY · 21:00',bid:'$15.300'},
    {title:'Cata de vinos',place:'Villa Crespo',date:'HOY · 20:30',bid:'$11.900'},
  ],
  'MAÑANA':[
    {title:'Taller de pasta',place:'Caballito',date:'LUN · 19:00',bid:'$9.800'},
    {title:'Sauna nocturno',place:'Núñez',date:'LUN · 20:00',bid:'$7.400'},
  ],
  'ESTA NOCHE':[
    {title:'Fiesta Bohemia',place:'Chacarita',date:'23:30',bid:'$24.800'},
    {title:'DJ set + vinilos',place:'Chacarita',date:'23:45',bid:'$18.200'},
    {title:'Stand up en vivo',place:'Almagro',date:'21:30',bid:'$12.600'},
  ],
  'FINDE':[
    {title:'Feria de diseño',place:'Palermo',date:'SÁB · 12:00',bid:'$21.000'},
    {title:'Brunch de autor',place:'Colegiales',date:'DOM · 11:30',bid:'$13.900'},
  ],
  'MÁS ADELANTE':[
    {title:'Festival japonés',place:'Chacarita',date:'SÁB 5 SEP',bid:'$19.400'},
    {title:'Cena en seis pasos',place:'Palermo',date:'VIE 4 SEP',bid:'$14.800'},
  ],
};

export default function CheMiraV3(){
  const [filter,setFilter]=useState<WindowKey>('TODO');
  const visible=useMemo(()=>filter==='TODO'?listings:listings.filter(x=>x.window===filter),[filter]);
  const market=ojoMarkets[filter];

  return <main className="cm3">
    <header className="topbar">
      <Link href="/che-mira-v3" className="logo">CHE, MIRÁ</Link>
      <div className="city">BUENOS AIRES <span>● EN VIVO</span></div>
      <button className="publish">+ Publicar</button>
    </header>

    <section className="intro">
      <p className="kicker">QUÉ ACABA DE APARECER</p>
      <h1>Che, mirá<br/><em>qué hay.</em></h1>
      <div className="promise"><p>Un feed abierto. Lo último que se publica, arriba.</p><strong>Entrar cuesta poco.<br/>Destacarte se disputa.</strong></div>
    </section>

    <section className="filters" aria-label="Ventana temporal">
      {filters.map(x=><button onClick={()=>setFilter(x)} className={filter===x?'selected':''} key={x}>{x}</button>)}
    </section>

    <div className="layout">
      <section className="feed">
        <div className="feedHead"><div><span>LISTADO ABIERTO · ORDEN CRONOLÓGICO</span><h2>Recién publicados.</h2></div><p>Editar no te vuelve a subir.</p></div>
        <div className="rows">
          {visible.map(x=><article className="listing" key={x.posted+x.title}>
            <div className="posted"><span>{x.posted}</span><small>PUBLICADO</small></div>
            <div className="main">
              <div className="date">{x.eventDate}</div>
              <h3>{x.title}</h3>
              <p className="place">⌖ {x.place}</p>
              <p>{x.detail}</p>
            </div>
            <div className="action"><strong>{x.price}</strong><button>{x.cta}</button></div>
          </article>)}
          {visible.length===0&&<div className="empty">Todavía no se publicó nada para esta ventana.</div>}
        </div>
      </section>

      <aside className="ojo">
        <div className="ojoTop"><span>ATENCIÓN PATROCINADA</span><h2>OJO ACÁ</h2><p>{filter==='TODO'?'Lo que está comprando atención ahora.':`Ranking · ${filter}`}</p></div>
        <div className="ojoList">{market.map((x,i)=><article key={x.title}>
          <b className="rank">{i+1}</b>
          <div className="who"><strong>{x.title}</strong><span>{x.place} · {x.date}</span></div>
          <div className="money"><small>PUJA</small><b>{x.bid}</b></div>
        </article>)}</div>
        <button className="take">Entrá a Ojo Acá</button>
        <p className="rule">Más paga, más arriba. Sin algoritmo oculto.</p>
      </aside>
    </div>

    <section className="economics">
      <div><span>PUBLICAR</span><h3>Primera vez, gratis.</h3><p>Después, un cargo mínimo por publicación para frenar basura y spam.</p></div>
      <div><span>FEED ABIERTO</span><h3>La plata no lo ordena.</h3><p>Acá manda una sola cosa: cuándo publicaste.</p></div>
      <div><span>OJO ACÁ</span><h3>La atención sí se compra.</h3><p>Entrás al ranking patrocinado de la ventana que corresponda.</p></div>
    </section>

    <section className="ruleBlock"><p>UNA PUBLICACIÓN = UN EVENTO</p><h2>Subís una vez. Podés editar.<br/>No podés resetear el reloj.</h2><span>Cuando el evento pasa, desaparece del feed activo.</span></section>

    <footer><Link href="/che-mira-v2">← V2</Link><span>CHE, MIRÁ · V3 DEMO</span><b>ENTRAR CUESTA POCO. LA ATENCIÓN VALE LO QUE EL MERCADO DIGA.</b></footer>
  </main>
}
