import Link from 'next/link';
import './v5.css';

const leaders=[
  {rank:1,name:'Don Julio',area:'Palermo',kind:'Parrilla',total:'US$188',delta:'US$1 to beat',moves:'8 moves'},
  {rank:2,name:'El Preferido',area:'Palermo',kind:'Bodegón',total:'US$163',delta:'US$26 to take #1',moves:'7 moves'},
  {rank:3,name:'Julia',area:'Villa Crespo',kind:'Autor',total:'US$121',delta:'US$68 to take #1',moves:'4 moves'},
  {rank:4,name:'Atte. Pizzeria',area:'Chacarita',kind:'Pizza',total:'US$96',delta:'US$93 to take #1',moves:'5 moves'},
  {rank:5,name:'Naranjo Bar',area:'Chacarita',kind:'Wine bar',total:'US$71',delta:'US$118 to take #1',moves:'3 moves'},
];

const organic=[
  {name:'El Preferido',area:'Palermo',kind:'Bodegón',note:'Porteño classics, vermouth, milanesas and a room people actually remember.'},
  {name:'Atte. Pizzeria',area:'Chacarita',kind:'Pizza',note:'A modern Buenos Aires pizza reference without pretending to be Naples.'},
  {name:'Naranjo Bar',area:'Chacarita',kind:'Wine',note:'Natural wine, sharp small plates and neighborhood energy.'},
  {name:'Julia',area:'Villa Crespo',kind:'Dinner',note:'Tiny room, serious cooking, exactly the kind of place visitors want a local to send them to.'},
  {name:'Don Julio',area:'Palermo',kind:'Parrilla',note:'The heavyweight. It does not need ComeVisit — which is precisely why everyone wants to beat it.'},
  {name:'La Mezzetta',area:'Villa Ortúzar',kind:'Pizza',note:'Standing-room porteño pizza, fugazzeta and zero interest in behaving like a global brand.'},
  {name:'El Ferroviario',area:'Liniers',kind:'Parrilla',note:'Huge grills, huge tables, a very different Buenos Aires from the tourist circuit.'},
  {name:'Café Paulín',area:'Centro',kind:'Bodegón',note:'Counter culture, sandwiches and downtown Buenos Aires in one room.'},
];

const markets=[
  ['ARGENTINA','US$188'],['PARRILLA','US$124'],['PIZZA','US$79'],['BODEGÓN','US$64'],['PALERMO','US$53'],['CHACARITA','US$31']
];

export default function V5(){
  return <main className="v5">
    <header className="topbar"><Link href="/" className="logo">COME<span>VISIT</span></Link><div className="topactions"><span>ARGENTINA · FOOD FIGHT · LIVE</span><button>CLAIM YOUR RESTAURANT</button></div></header>

    <section className="hero">
      <div className="heroCopy"><div className="eyebrow">ARGENTINA'S PUBLIC RESTAURANT MARKET</div><h1>Argentina eats.<br/><em>Restaurants fight.</em></h1><p>One country. One food arena. Find where to eat and watch restaurants compete publicly for attention. Every sponsored dollar is visible. Organic discovery stays organic.</p></div>
      <div className="ticker"><span>LIVE · DEMO MARKET</span><strong>ARGENTINA</strong><div><b>US$639</b><small>COMPETED THIS WEEK</small></div><div><b>17</b><small>RESTAURANTS IN THE FIGHT</small></div><div><b>05:42:17</b><small>WEEKLY CROWN CLOSES</small></div></div>
    </section>

    <section className="marketNav">{markets.map((m,i)=><button className={i===0?'active':''} key={m[0]}>{m[0]} · {m[1]}</button>)}</section>

    <section className="crown">
      <div className="crownTitle"><span>♛ ARGENTINA CROWN · SPONSORED · PUBLIC BIDDING</span><h2>#1 Don Julio</h2><p>Palermo · Parrilla · eight public moves this week</p></div>
      <div className="crownPrice"><small>CURRENT CROWN</small><b>US$188</b><button>TAKE ARGENTINA FOR US$189 ↗</button></div>
    </section>

    <section className="split">
      <div className="boardWrap">
        <div className="sectionHead"><span>THE ARGENTINA BOARD</span><h2>Make them fight for #1.</h2><p>No stars. No secret relevance score. The sponsored board is a transparent attention market.</p></div>
        <div className="board">{leaders.map(x=><div className={`leader ${x.rank===1?'winner':''}`} key={x.rank}><div className="rank">#{x.rank}</div><div className="identity"><strong>{x.name}</strong><span>{x.area} · {x.kind}</span></div><div className="move"><small>{x.moves}</small><span>{x.delta}</span></div><div className="money">{x.total}</div></div>)}</div>
      </div>
      <aside className="rules"><span>THE RULES</span><h3>Paying buys attention.<br/>Not reputation.</h3><p>A restaurant can claim its listing for free. If it wants sponsored visibility, it enters a market and bids publicly.</p><ol><li>Claim free.</li><li>Pick a fight: Argentina, Parrilla, Pizza, neighborhood.</li><li>Add only what is needed to overtake.</li><li>Hold the Crown until somebody takes it.</li></ol><div className="clean">THE ORGANIC LIST NEVER MOVES BECAUSE OF MONEY.</div></aside>
    </section>

    <section className="viral"><div><span>THE GROWTH LOOP</span><h2>The loser is distribution too.</h2><p>Every takeover creates a public moment. The winner shares it. The loser sees it. Food media screenshots it. Fans argue. The next restaurant has a reason to enter.</p></div><div className="sharecard"><small>COME<span>VISIT</span> · ARGENTINA</small><h3>EL PREFERIDO JUST TOOK<br/>THE #1 CROWN FROM DON JULIO.</h3><div><b>US$189</b><span>NEW #1 · PUBLIC BID</span></div></div></section>

    <section className="organic">
      <div className="sectionHead"><span>THE FOOD MAP UNDERNEATH</span><h2>Worth eating, whether they pay or not.</h2><p>These are temporary seed examples while we import the exact restaurants from the shared Google Maps list. In the actual product, inclusion is independent from bidding.</p></div>
      <div className="organicGrid">{organic.map((x,i)=><article key={x.name}><div className="num">0{i+1}</div><div className="tag">{x.kind}</div><h3>{x.name}</h3><p>{x.note}</p><span>{x.area}</span></article>)}</div>
    </section>

    <section className="cta"><span>RESTAURANTS OF ARGENTINA</span><h2>Your place is free.<br/>Your position is not.</h2><div><button>FIND & CLAIM YOUR RESTAURANT</button><button className="ghost">WATCH THE FIGHTS</button></div></section>

    <footer><Link href="/lab">← PRODUCT LAB</Link><span>V5 ARGENTINA PROTOTYPE · DEMO BIDS · NO REAL PAYMENTS</span></footer>
  </main>
}
