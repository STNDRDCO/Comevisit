import Link from 'next/link';
import './v5.css';

const leaders=[
  {rank:1,name:'Fonda Sur',area:'Palermo',kind:'Steak',total:'$83',delta:'+$1 to beat',moves:'4 moves'},
  {rank:2,name:'Mesa Chica',area:'Palermo',kind:'Bodegón',total:'$61',delta:'+$23 to take #1',moves:'3 moves'},
  {rank:3,name:'Casa Fantasma',area:'Chacarita',kind:'Late night',total:'$47',delta:'+$37 to take #1',moves:'1 move'},
];

const organic=[
  {name:'El Preferido',area:'Palermo',kind:'Bodegón',note:'Classic porteño food, strong wine list.'},
  {name:'Atte. Pizzeria',area:'Chacarita',kind:'Pizza',note:'Modern porteño pizza worth crossing town for.'},
  {name:'Naranjo Bar',area:'Chacarita',kind:'Wine',note:'Natural wine, small plates, neighborhood energy.'},
  {name:'Julia',area:'Villa Crespo',kind:'Dinner',note:'Tiny room, serious cooking, book ahead.'},
];

export default function V5(){
  return <main className="v5">
    <header className="topbar"><Link href="/" className="logo">COME<span>VISIT</span></Link><div className="topactions"><span>BUENOS AIRES · LIVE</span><button>CLAIM YOUR RESTAURANT</button></div></header>

    <section className="hero">
      <div className="heroCopy"><div className="eyebrow">THE FOOD MARKET OF THE CITY</div><h1>Who owns<br/><em>dinner tonight?</em></h1><p>Find where to eat. See which restaurants are fighting for attention. Sponsored positions are bought in public; organic discovery stays organic.</p></div>
      <div className="ticker"><span>LIVE MARKET</span><strong>BUENOS AIRES</strong><div><b>$191</b><small>COMPETED TONIGHT</small></div><div><b>3</b><small>RESTAURANTS FIGHTING</small></div><div><b>01:42:17</b><small>MARKET CLOSES</small></div></div>
    </section>

    <section className="marketNav"><button className="active">Tonight</button><button>Steak</button><button>Pizza</button><button>Sushi</button><button>Coffee</button><button>Late night</button><button>Palermo</button></section>

    <section className="crown">
      <div className="crownTitle"><span>♛ SPONSORED CROWN · PUBLIC AUCTION</span><h2>#1 Fonda Sur</h2><p>Palermo · Steak · leading with four moves tonight</p></div>
      <div className="crownPrice"><small>CURRENT CROWN</small><b>$83</b><button>TAKE #1 FOR $84 ↗</button></div>
    </section>

    <section className="split">
      <div className="boardWrap">
        <div className="sectionHead"><span>LIVE BOARD</span><h2>Restaurants competing now</h2></div>
        <div className="board">{leaders.map(x=><div className={`leader ${x.rank===1?'winner':''}`} key={x.rank}><div className="rank">#{x.rank}</div><div className="identity"><strong>{x.name}</strong><span>{x.area} · {x.kind}</span></div><div className="move"><small>{x.moves}</small><span>{x.delta}</span></div><div className="money">{x.total}</div></div>)}</div>
      </div>
      <aside className="rules"><span>HOW THIS WORKS</span><h3>No mystery ranking.</h3><p>Every sponsored dollar is visible. Restaurants accumulate spend during the market window. Highest total owns the Crown.</p><ol><li>Claim your restaurant free.</li><li>Add balance.</li><li>Choose a market.</li><li>Bid only the difference needed to lead.</li></ol><div className="clean">Organic results are never sold.</div></aside>
    </section>

    <section className="organic">
      <div className="sectionHead"><span>ORGANIC DISCOVERY</span><h2>Good places, whether they pay or not.</h2><p>ComeVisit still has to be useful when nobody bids.</p></div>
      <div className="organicGrid">{organic.map((x,i)=><article key={x.name}><div className="num">0{i+1}</div><div className="tag">{x.kind}</div><h3>{x.name}</h3><p>{x.note}</p><span>{x.area}</span></article>)}</div>
    </section>

    <section className="viral"><div><span>THE SHAREABLE LOOP</span><h2>Every takeover becomes content.</h2><p>When a restaurant takes #1, ComeVisit creates a public moment worth sharing — for the winner, the loser, local food accounts and people watching the market.</p></div><div className="sharecard"><small>COME<span>VISIT</span> · BUENOS AIRES</small><h3>FONDA SUR JUST TOOK<br/>THE DINNER CROWN.</h3><div><b>$83</b><span>NEW #1 · TONIGHT</span></div></div></section>

    <section className="cta"><span>OWN A RESTAURANT?</span><h2>Your listing is free.<br/>Attention is a market.</h2><div><button>FIND & CLAIM YOUR RESTAURANT</button><button className="ghost">SEE ALL MARKETS</button></div></section>

    <footer><Link href="/lab">← PRODUCT LAB</Link><span>V5 B PROTOTYPE · NO REAL PAYMENTS</span></footer>
  </main>
}
