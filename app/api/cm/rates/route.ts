import {NextResponse} from 'next/server';

export async function GET(){
  try{
    const r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=ars,usd',{next:{revalidate:300},headers:{accept:'application/json'}});
    if(!r.ok)throw new Error('rate');
    const x=await r.json();const ars=Number(x?.bitcoin?.ars),usd=Number(x?.bitcoin?.usd);
    if(!ars||!usd)throw new Error('rate');
    return NextResponse.json({data:{btc_ars:ars,btc_usd:usd,source:'CoinGecko',source_url:'https://www.coingecko.com/en/coins/bitcoin'}},{headers:{'Cache-Control':'public, s-maxage=300, stale-while-revalidate=900'}});
  }catch{
    return NextResponse.json({error:'rates_unavailable'},{status:502});
  }
}
