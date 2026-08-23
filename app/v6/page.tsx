import Link from 'next/link';
import './v6.css';

const moments = [
  {label:'AHORA', count:'12'},
  {label:'HOY', count:'34'},
  {label:'ESTA NOCHE', count:'21'},
  {label:'MAÑANA', count:'18'},
  {label:'FINDE', count:'49'},
];

const sponsored = [
  {rank:1,title:'Rooftop Sunset',place:'Palermo',meta:'Hoy · 18:30',price:'$28.000',bid:'US$47',take:'US$48',tag:'TOMAR ALGO'},
  {rank:2,title:'Stand up en Chacarita',place:'Chacarita',meta:'Hoy · 22:00',price:'$18.000',bid:'US$39',take:'US$9 para pasar',tag:'CULTURA'},
  {rank:3,title:'Cata de vinos',place:'Villa Crespo',meta:'Hoy · 20:30',price:'$35.000',bid:'US$32',take:'US$16 para pasar',tag:'EXPERIENCIA'},
  {rank:4,title:'Cena en 6 pasos',place:'Palermo',meta:'Hoy · 21:00',price:'$65.000',bid:'US$24',take:'US$24 para pasar',tag:'COMER'},
];

const feed = [
  {title:'Taller de pasta fresca',place:'San Telmo',meta:'Hoy · 19:00',tag:'APRENDER',price:'$32.000',note:'Dos horas, grupo chico y cena incluida.',signal:'ARRANCA EN 4H'},
  {title:'Jazz en un living',place:'Colegiales',meta:'Hoy · 21:30',tag:'MÚSICA',price:'$14.000',note:'Formato íntimo. Pocas sillas. Sin escenario.',signal:'HOY'},
  {title:'Sauna + inmersión fría',place:'Palermo',meta:'Hoy · 20:00',tag:'BIENESTAR',price:'$25.000',note:'Turno abierto esta noche.',signal:'ÚLTIMOS TURNOS'},
  {title:'Navegación por el Delta',place:'Tigre',meta:'Mañana · 11:00',tag:'AIRE LIBRE',price:'$55.000',note:'Salida chica. Regreso después de almorzar.',signal:'MAÑANA'},
  {title:'Mesa comunal de cocina coreana',place:'Almagro',meta:'Hoy · 20:45',tag:'COMER',price:'$42.000',note:'Una sola mesa, menú fijo y sobremesa larga.',signal:'HOY'},
  {title:'DJ set + vinilos',place:'Villa Crespo',meta:'Hoy · 23:30',tag:'MÚSICA',price:'Gratis',note:'Bar chico, selector invitado, entrada libre.',signal:'ESTA NOCHE'},
];

const pulse = [
  ['11:34','Rooftop Sunset subió al #1 de ESTA NOCHE'],
  ['11:21','Cata de vinos entró al mercado con US$32'],
  ['10:58','Se publicó “Jazz en un living”'],
  ['10:44','Stand up defendió el #2'],
];

export default function V6(){
  return <main className="v6">
    <div className="marquee"><span>COME VISIT ARGENTINA</span><b>·</b><span>LO QUE IMPORTA AHORA</span><b>·</b><span>PUBLICAR ES GRATIS</span><b>·</b><span>LA ATENCIÓN SE DISPUTA</span></div>

    <header className="topbar">
      <Link href="/" className="logo">COME<span>VISIT</span></Link>
      <nav><a href="#feed">DESCUBRIR</a><a href="#como">CÓMO FUNCIONA</a><button>PUBLICÁ ALGO</button></nav>
    </header>

    <section className="hero">
      <div className="heroText">
        <div className="eyebrow">BUENOS AIRES · EN VIVO</div>
        <h1>¿Qué merece<br/><em>tu atención hoy?</em></h1>
        <p>Planes, aperturas, experiencias, mesas, shows y cosas que están pasando ahora. Lo relevante entra. Lo viejo vence.</p>
        <div className="heroActions"><button>VER QUÉ HAY HOY</button><button className="ghost">PUBLICÁ LO TUYO</button></div>
      </div>
      <aside className="supplyBox">
        <span>PARA QUIEN TIENE ALGO QUE MOVER</span>
        <h2>¿Tenés algo que merece atención ahora?</h2>
        <p>Publicalo gratis. Si querés más ojos encima, competí por una posición patrocinada.</p>
        <div><b>0%</b><small>COMISIÓN EN ESTA DEMO</small></div>
      </aside>
    </section>

    <section className="momentStrip">{moments.map((m,i)=><button className={i===1?'active':''} key={m.label}><span>{m.label}</span><b>{m.count}</b></button>)}</section>

    <section className="attentionMarket">
      <div className="sectionHead"><span>ATENCIÓN PATROCINADA · HOY</span><h2>Más atención, a la vista de todos.</h2><p>Esto no dice qué es mejor. Dice quién está pagando por estar más visible durante esta ventana.</p></div>
      <div className="marketGrid">
        <div className="board">{sponsored.map(x=><article className={x.rank===1?'top':''} key={x.rank}><div className="rank">#{x.rank}</div><div className="identity"><small>{x.tag}</small><strong>{x.title}</strong><span>{x.place} · {x.meta} · {x.price}</span></div><div className="bid"><small>PUJA</small><b>{x.bid}</b><span>{x.take}</span></div></article>)}</div>
        <aside className="marketCard"><span>POSICIÓN #1</span><h3>Rooftop Sunset</h3><p>Hoy · Palermo · 18:30</p><strong>US$47</strong><button>SUBÍ AL #1 POR US$48</button><small>PATROCINADO · PUJA DEMO</small></aside>
      </div>
    </section>

    <section id="feed" className="liveFeed">
      <div className="sectionHead"><span>TODO LO DEMÁS · ORGÁNICO</span><h2>Lo que está pasando.</h2><p>Ordenado por relevancia temporal y contexto. La plata no mueve esta parte.</p></div>
      <div className="feedGrid">{feed.map((x,i)=><article key={x.title}>
        <div className="feedTop"><span>{x.signal}</span><b>0{i+1}</b></div>
        <small>{x.tag}</small>
        <h3>{x.title}</h3>
        <p>{x.note}</p>
        <div className="feedMeta"><span>{x.place} · {x.meta}</span><strong>{x.price}</strong></div>
        <button>VER MÁS ↗</button>
      </article>)}</div>
    </section>

    <section className="livePulse">
      <div><span>PULSO</span><h2>Una ciudad que se mueve.</h2></div>
      <div className="pulseList">{pulse.map(([time,text])=><div key={time+text}><b>{time}</b><span>{text}</span></div>)}</div>
    </section>

    <section id="como" className="how">
      <div className="sectionHead"><span>EL MODELO</span><h2>Simple a propósito.</h2></div>
      <div className="steps">
        <article><b>01</b><h3>Posteá lo que importa ahora.</h3><p>Qué, dónde, cuándo, precio y link. Nada más.</p></article>
        <article><b>02</b><h3>Vence solo.</h3><p>Cuando deja de ser relevante, desaparece del feed.</p></article>
        <article><b>03</b><h3>Querés más atención.</h3><p>Pujás por una posición patrocinada, de forma pública.</p></article>
        <article><b>04</b><h3>El historial queda.</h3><p>Después vienen boards, crowns y prestigio acumulado.</p></article>
      </div>
    </section>

    <section className="manifesto">
      <div><span>PRINCIPIO</span><h2>Live primero.<br/>Archive después.</h2></div>
      <div><p>El feed corto-placista crea urgencia y hábito. El historial transforma esa actividad en status.</p><p><b>Pagar compra atención. No compra prestigio.</b></p></div>
    </section>

    <section className="cta">
      <span>COME VISIT · AHORA</span>
      <h2>¿Tenés algo que merece atención hoy?</h2>
      <p>Publicalo. Gratis.</p>
      <button>PUBLICÁ ALGO</button>
    </section>

    <footer><Link href="/v5">← V5 RESTAURANTES</Link><span>V6 PROTOTIPO · SIN PAGOS REALES</span></footer>
  </main>
}
