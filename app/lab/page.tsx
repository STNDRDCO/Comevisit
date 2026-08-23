import Link from 'next/link';
import './lab.css';

const concepts = [
  {
    id:'utility',
    label:'A · FOODIE UTILITY',
    title:'Eat like you know the city.',
    deck:'The calm, consumer-first version. ComeVisit earns trust by helping you decide where to eat fast. Competition is present but secondary.',
    chips:['Steak','Pizza','Coffee','Wine','Late night'],
    places:[
      ['Don Julio','Palermo','Steak','4.2 km'],
      ['El Preferido','Palermo','Bodegón','3.9 km'],
      ['Atte. Pizzeria','Chacarita','Pizza','2.8 km'],
    ],
    footer:'Best if we want a durable consumer brand first.'
  },
  {
    id:'market',
    label:'B · COMPETITIVE FOOD MARKET',
    title:'Who owns dinner tonight?',
    deck:'The loud version. Rankings, money and local competition are visible enough to become the story people screenshot and share.',
    chips:['Tonight','Palermo','Steak','Pizza','Sushi'],
    places:[
      ['#1 Fonda Sur','Palermo','+$1 to beat','$83'],
      ['#2 Mesa Chica','Palermo','2 bids','$61'],
      ['#3 Casa Fantasma','Chacarita','1 bid','$47'],
    ],
    footer:'Best if the growth loop itself is the product story.'
  },
  {
    id:'creator',
    label:'C · CREATOR-LED FOOD MAP',
    title:'Buenos Aires, by people who actually eat here.',
    deck:'The social version. Local food creators, chefs and obsessives build lists; restaurants claim and compete beneath trusted taste.',
    chips:['By locals','Chef picks','Hidden gems','Cheap eats','Worth the trip'],
    places:[
      ['Kevin’s 12','Buenos Aires','12 places','Creator list'],
      ['Vale Food Map','Buenos Aires','28 places','Creator list'],
      ['Late-night BA','Buenos Aires','9 places','Community list'],
    ],
    footer:'Best if creators are our cold-start distribution engine.'
  }
]

export default function Lab(){
  return <main className="lab">
    <header className="labnav"><Link href="/">COME<span>VISIT</span></Link><div>V5 PRODUCT LAB · NOT PRODUCTION</div></header>
    <section className="labhero">
      <p>THREE DIFFERENT BUSINESSES HIDING INSIDE THE SAME IDEA</p>
      <h1>What should<br/><em>ComeVisit become?</em></h1>
      <div className="thesis">We are not choosing colors. We are choosing the growth loop. Each direction below changes who creates supply, why restaurants care and what becomes shareable.</div>
    </section>
    <section className="concepts">
      {concepts.map((c,i)=><article className={`concept ${c.id}`} key={c.id}>
        <div className="concepttop"><span>{c.label}</span><b>0{i+1}</b></div>
        <h2>{c.title}</h2>
        <p>{c.deck}</p>
        <div className="chips">{c.chips.map(x=><span key={x}>{x}</span>)}</div>
        <div className="mock">
          <div className="mockhead"><span>BUENOS AIRES</span><em>{c.id==='market'?'LIVE MARKET':'FOOD MAP'}</em></div>
          {c.places.map((p,idx)=><div className={`mockrow ${idx===0?'hot':''}`} key={p[0]}>
            <strong>{p[0]}</strong><span>{p[1]}</span><small>{p[2]}</small><b>{p[3]}</b>
          </div>)}
        </div>
        <footer>{c.footer}</footer>
      </article>)}
    </section>
    <section className="verdict">
      <span>WORKING VERDICT</span>
      <h2>Utility in front. Creator distribution for cold start. Competition underneath.</h2>
      <p>V5 should not choose one of these literally. My current bet is A as the consumer experience, C as the supply/distribution mechanism, and B as the monetization spectacle. That combination is much harder to copy than “restaurants pay to rank.”</p>
    </section>
  </main>
}
