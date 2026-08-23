'use client';

import Link from 'next/link';
import {useMemo,useState} from 'react';
import './style.css';

type WindowKey='TODO'|'HOY'|'MAÑANA'|'ESTA NOCHE'|'FINDE'|'MÁS ADELANTE';

const filters:WindowKey[]=['TODO','HOY','MAÑANA','ESTA NOCHE','FINDE','MÁS ADELANTE'];

const listings=[
  {posted:'HACE 1 MIN',window:'HOY' as WindowKey,eventDate:'HOY · 20:30',title:'Cata de vinos naturales',place:'Villa Crespo',detail:'6 etiquetas + picada. Cupos limitados.',price:'$35.000',cta:'Reservar por WhatsApp ↗',source:'SUBIDO POR @VINOSDELAGRUTA',claimed:true,href:'/che-mira-v4/p/cata-vinos'},
  {posted:'HACE 3 MIN',window:'MÁS ADELANTE' as WindowKey,eventDate:'SÁB 5 SEP · 23:30',title:'Festival japonés',place:'Chacarita',detail:'Comida, música y feria. Una sola fecha.',price:'$18.000',cta:'Ver Instagram ↗',source:'SUBIDO POR @MARIANITA',claimed:false},
  {posted:'HACE 7 MIN',window:'ESTA NOCHE' as WindowKey,eventDate:'HOY · 23:45',title:'DJ set + vinilos',place:'Chacarita',detail:'Vinilos, birras frías y patio abierto.',price:'Entrada libre',cta:'Ver Instagram ↗',source:'SUBIDO POR EL LUGAR',claimed:true},
  {posted:'HACE 12 MIN',window:'FINDE' as WindowKey,eventDate:'SÁB 29 AGO · 12:00',title:'Feria de diseño',place:'Palermo',detail:'Diseño local, libros, edición y música.',price:'Gratis',cta:'Ir a la web ↗',source:'SUBIDO POR @LUCHOBA',claimed:false},
  {posted:'HACE 18 MIN',window:'MAÑANA' as WindowKey,eventDate:'LUN 24 AGO · 19:00',title:'Taller de pasta fresca',place:'Caballito',detail:'Amasás, cocinás y cenás.',price:'$28.000',cta:'Abrir checkout ↗',source:'SUBIDO POR EL ORGANIZADOR',claimed:true},
  {posted:'HACE 26 MIN',window:'HOY' as WindowKey,eventDate:'HOY · 21:30',title:'Stand up en vivo',place:'Almagro',detail:'4 comediantes, un bar, muchas risas.',price:'$7.000',cta:'Comprar entrada ↗',source:'SUBIDO POR @SOFICRUZ',claimed:false},
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
    {title:'Cata de vinos naturales',place:'Villa Crespo',date:'HOY · 20:30',bid:'$11.900'},
  ],
  'MAÑANA':[
    {title:'Taller de pasta fresca',place:'Caballito',date:'LUN · 19:00',bid:'$9.800'},
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

export default function CheMiraV4(){
  const [filter,setFilter]=useState<WindowKey>('TODO');
  const visible=useMemo(()=>filter==='TODO'?listings:listings.filter(x=>x.window===filter),[filter]);
  const market=ojoMarkets[filter];

  return <main className="cm4">
    <header className="topbar">
      <Link href="/che-mira-v4" className="logo">CHE, MIRÁ</Link>
      <div className="city">BUENOS AIRES <span>● EN VIVO</span></div>
      <button className="publish">+ Subir algo</button>
    </header>

    <section className="intro">
      <p className="kicker">LO QUE LA GENTE ACABA DE SUBIR</p>
      <h1>Che, mirá<br/><em>esto.</em></h1>
      <div className="promise"><p>Cualquiera puede señalar algo que está pasando. Cada publicación tiene su propio link para compartir.</p><strong>Publicás.<br/>Compartís.<br/>Traés gente.</strong></div>
    </section>

    <section className="filters" aria-label="Ventana temporal">
      {filters.map(x=><button onClick={()=>setFilter(x)} className={filter===x?'selected':''} key={x}>{x}</button>)}
    </section>

    <div className="layout">
      <section className="feed">
        <div className="feedHead"><div><span>FEED ABIERTO · ORDEN DE PUBLICACIÓN</span><h2>Recién subido.</h2></div><p>No hay recomendación ni ranking pago acá.</p></div>
        <div className="rows">
          {visible.map(x=><article className="listing" key={x.posted+x.title}>
            <div className="posted"><span>{x.posted}</span><small>{x.source}</small>{x.claimed?<i>✓ RECLAMADO</i>:<i className="unclaimed">SIN RECLAMAR</i>}</div>
            <div className="main">
              <div className="date">{x.eventDate}</div>
              <h3>{x.title}</h3>
              <p className="place">⌖ {x.place}</p>
              <p>{x.detail}</p>
            </div>
            <div className="action"><strong>{x.price}</strong>{x.href?<Link className="open" href={x.href}>Abrir publicación ↗</Link>:<button>{x.cta}</button>}</div>
          </article>)}
          {visible.length===0&&<div className="empty">Todavía no se subió nada para esta ventana.</div>}
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

    <section className="shareLoop">
      <div className="loopCopy"><span>EL LOOP</span><h2>Tu publicación no espera audiencia.<br/>La trae.</h2><p>Usala como link único para mandar toda la info. Quien entra por tu publicación puede terminar descubriendo qué más está pasando.</p></div>
      <div className="loopSteps">
        <article><b>01</b><h3>Subís algo.</h3><p>Puede hacerlo el organizador o cualquier persona que lo encontró.</p></article>
        <article><b>02</b><h3>Te damos un link.</h3><p>Lo compartís por Instagram, WhatsApp, bio, QR o donde quieras.</p></article>
        <article><b>03</b><h3>Traés atención.</h3><p>Medimos visitas y clicks que llegaron por tu publicación.</p></article>
        <article><b>04</b><h3>Ganás Ojo.</h3><p>El tráfico real puede convertirse en créditos para comprar atención.</p></article>
      </div>
    </section>

    <section className="creditDemo">
      <div><span>CRÉDITOS OJO · DEMO</span><h2>La distribución también vale.</h2><p>No premiamos badges. Premiamos traer gente real.</p></div>
      <div className="creditCard"><small>TU ÚLTIMA PUBLICACIÓN</small><strong>Cata de vinos naturales</strong><div className="metrics"><p><b>128</b><span>visitas</span></p><p><b>37</b><span>clicks afuera</span></p><p><b>+$4.200</b><span>crédito Ojo</span></p></div><button>Usar crédito en Ojo Acá</button></div>
    </section>

    <section className="claimBlock">
      <span>NO HACE FALTA SER EL DUEÑO PARA SEÑALAR ALGO</span>
      <h2>¿Lo viste? Subilo.<br/>¿Es tuyo? Reclámalo.</h2>
      <p>Así el supply puede aparecer antes de que cada negocio o productor conozca Che, Mirá. Después el organizador puede tomar control de la publicación.</p>
    </section>

    <section className="economics">
      <div><span>PUBLICAR</span><h3>Primera vez, gratis.</h3><p>Después, microcargo para evitar spam. El monto todavía es parte del test.</p></div>
      <div><span>COMPARTIR</span><h3>Siempre gratis.</h3><p>Cada publicación funciona como una ficha simple y compartible.</p></div>
      <div><span>OJO ACÁ</span><h3>La atención se disputa.</h3><p>Pagás o usás créditos ganados trayendo tráfico real.</p></div>
    </section>

    <footer><Link href="/che-mira-v3">← V3</Link><span>CHE, MIRÁ · V4 GROWTH LOOP</span><b>NO ESPERAMOS LA AUDIENCIA. LOS POSTS LA TRAEN.</b></footer>
  </main>
}
