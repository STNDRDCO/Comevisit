import Link from 'next/link';
import './style.css';

const feed = [
  {window:'AHORA',time:'18:30',title:'DJ set + vinilos',place:'Chacarita',detail:'Vinilos, birras frías y patio abierto.',price:'Entrada libre',cta:'Ver Instagram ↗'},
  {window:'HOY',time:'20:00',title:'Cata de vinos naturales',place:'Villa Crespo',detail:'6 etiquetas + picada. Cupos limitados.',price:'$35.000',cta:'Reservar por WhatsApp ↗'},
  {window:'ESTA NOCHE',time:'21:30',title:'Stand up en vivo',place:'Almagro',detail:'4 comediantes, un bar, muchas risas.',price:'$7.000',cta:'Comprar entrada ↗'},
  {window:'HOY',time:'20:30',title:'Cena en pasos',place:'Palermo',detail:'Menú de estación en 6 pasos.',price:'$48.000',cta:'Ir a la web ↗'},
  {window:'AHORA',time:'17:00',title:'Taller de pasta',place:'Caballito',detail:'Manos en la masa. Incluye receta + vino.',price:'$28.000',cta:'Abrir checkout ↗'},
  {window:'HOY',time:'11:00',title:'Feria de diseño',place:'Palermo',detail:'Diseño local, libros, edición y más.',price:'Gratis',cta:'Ver más ↗'},
];

const ojo = [
  {rank:1,title:'Fiesta Bohemia',place:'Chacarita',bid:'$24.800'},
  {rank:2,title:'Noche de Pizzas',place:'Villa Urquiza',bid:'$15.300'},
  {rank:3,title:'Cocktails de Autor',place:'Recoleta',bid:'$11.900'},
];

export default function CheMiraV2(){
  return <main className="cm2">
    <header className="topbar">
      <Link href="/che-mira-v2" className="logo">CHE, MIRÁ</Link>
      <nav><a className="active" href="#ahora">Ahora</a><a href="#ahora">Hoy</a><a href="#ahora">Esta noche</a><a href="#ahora">Comer</a><a href="#ahora">Salir</a><a href="#ahora">Hacer</a></nav>
      <button className="publish">Publicar</button>
    </header>

    <section className="intro">
      <p className="city">BUENOS AIRES · EN VIVO</p>
      <h1>Lo que está pasando,<br/><em>ahora.</em></h1>
      <div className="introBottom"><p>Publicaciones simples. Links directos. Sin vueltas.</p><strong>Listar es gratis.<br/>La atención no.</strong></div>
    </section>

    <section className="filters" aria-label="filtros">
      {['Ahora','Hoy','Esta noche','Mañana','Finde'].map((x,i)=><button className={i===0?'selected':''} key={x}>{x}</button>)}
    </section>

    <div className="layout">
      <section id="ahora" className="feed">
        <div className="feedHead"><div><span>LISTADO ABIERTO</span><h2>Qué hay.</h2></div><button className="add">+ Publicá lo tuyo</button></div>
        <div className="rows">
          {feed.map((x,i)=><article className="listing" key={x.title}>
            <div className="when"><span className={x.window==='ESTA NOCHE'?'night':''}>{x.window}</span><b>{x.time}</b></div>
            <div className="main"><h3>{x.title}</h3><p className="place">⌖ {x.place}</p><p>{x.detail}</p></div>
            <div className="action"><strong>{x.price}</strong><button>{x.cta}</button></div>
          </article>)}
        </div>
        <div className="neutrality"><span>CHE, MIRÁ NO RECOMIENDA</span><p>Acá cualquiera puede listar lo suyo. El orden orgánico no se compra. Las posiciones pagas viven separadas en <b>Ojo Acá</b>.</p></div>
      </section>

      <aside className="ojo">
        <div className="ojoTop"><span>ATENCIÓN PATROCINADA</span><h2>OJO ACÁ</h2><p>Estos están pagando para que los mires ahora.</p></div>
        <div className="ojoList">{ojo.map(x=><article key={x.rank}><b className="rank">{x.rank}</b><div><strong>{x.title}</strong><span>{x.place}</span></div><div className="money"><small>OFERTA</small><b>{x.bid}</b></div></article>)}</div>
        <button className="take">Tomá el Ojo Acá</button>
        <p className="rule">Pagás por visibilidad. No por prestigio.</p>
      </aside>
    </div>

    <section className="how">
      <div><span>01</span><h3>Publicás.</h3><p>Título, cuándo, dónde y link.</p></div>
      <div><span>02</span><h3>Mandás adonde quieras.</h3><p>Instagram, WhatsApp, web o checkout.</p></div>
      <div><span>03</span><h3>Querés más ojos.</h3><p>Comprás Ojo Acá. Público y separado.</p></div>
    </section>

    <footer><span>CHE, MIRÁ · PROTOTIPO</span><span>LISTAR ES GRATIS. LA ATENCIÓN NO.</span></footer>
  </main>
}
