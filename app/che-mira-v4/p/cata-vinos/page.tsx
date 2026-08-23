import Link from 'next/link';
import '../../style.css';

export default function CataVinos(){
  return <main className="cm4detail">
    <header className="topbar">
      <Link href="/che-mira-v4" className="logo">CHE, MIRÁ</Link>
      <div className="city">BUENOS AIRES <span>● EN VIVO</span></div>
      <Link href="/che-mira-v4" className="publish">Ver qué hay</Link>
    </header>

    <section className="detailWrap">
      <div className="detailBadge"><span>HOY · 20:30</span><i>Publicado hace 1 min · ✓ reclamado por el organizador</i></div>
      <h1>Cata de vinos naturales</h1>
      <p className="detailLead">6 etiquetas + picada en Villa Crespo. Esta publicación te lleva directo a donde el organizador quiere cerrar la reserva.</p>

      <div className="detailMeta">
        <div><small>CUÁNDO</small><b>Hoy · 20:30</b></div>
        <div><small>DÓNDE</small><b>Villa Crespo</b></div>
        <div><small>PRECIO</small><b>$35.000</b></div>
      </div>

      <div className="externalCta">
        <a href="#">Reservar por WhatsApp ↗</a>
        <button>Agregar al calendario</button>
      </div>

      <div className="sharePanel">
        <div><span className="kicker">CHE, MIRÁ ESTO</span><h2>Compartilo donde ya tenés gente.</h2><p>Esta ficha funciona como un link simple: WhatsApp, Stories, bio, newsletter, QR o lo que uses.</p></div>
        <div className="shareActions"><button>Copiar link</button><button>WhatsApp</button><button>Compartir</button><button>Generar QR</button></div>
      </div>

      <div className="statsStrip">
        <div><small>TRÁFICO DE ESTA PUBLICACIÓN · DEMO</small><br/><strong>Traer gente también vale.</strong></div>
        <p><b>128</b><span>VISITAS</span></p>
        <p><b>37</b><span>CLICKS AFUERA</span></p>
        <p><b>+$4.200</b><span>CRÉDITO OJO</span></p>
      </div>

      <div className="claimBox">
        <div><strong>¿Esto es tuyo?</strong><p>Si alguien lo publicó antes que vos, podés reclamarlo y tomar control de la información y el link de salida.</p></div>
        <button>Reclamar publicación</button>
      </div>
    </section>

    <section className="moreAfter">
      <span className="kicker">YA QUE ESTÁS ACÁ</span>
      <h2>Che, mirá qué más está pasando hoy.</h2>
      <div className="moreRows">
        <article><small>HACE 7 MIN · HOY 23:45</small><h3>DJ set + vinilos</h3><p>Chacarita · Entrada libre</p></article>
        <article><small>HACE 26 MIN · HOY 21:30</small><h3>Stand up en vivo</h3><p>Almagro · $7.000</p></article>
      </div>
    </section>

    <footer><Link href="/che-mira-v4">← VOLVER AL FEED</Link><span>CHE, MIRÁ · PUBLICACIÓN DEMO</span><b>EL POST TRAE LA AUDIENCIA.</b></footer>
  </main>
}
