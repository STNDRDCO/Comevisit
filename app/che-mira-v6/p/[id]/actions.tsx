'use client';

import {useEffect,useState} from 'react';

type Props={slug:string;title:string;startsAt:string;venue:string;neighborhood:string};
export default function DetailActions({slug,title,startsAt,venue,neighborhood}:Props){
 const[saved,setSaved]=useState(false);const[copied,setCopied]=useState(false);
 useEffect(()=>{try{const ids=JSON.parse(localStorage.getItem('cm5_saved')||'[]') as string[];setSaved(ids.includes(slug))}catch{}const src=new URLSearchParams(location.search).get('src')||'direct';fetch('/api/cm/view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug,ref:src})}).catch(()=>{})},[slug]);
 const track=(event:string)=>fetch('/api/cm/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,listing:slug,properties:{path:`/che-mira-v6/p/${slug}`}})}).catch(()=>{});
 const toggle=()=>{let ids:string[]=[];try{ids=JSON.parse(localStorage.getItem('cm5_saved')||'[]')}catch{}const next=ids.includes(slug)?ids.filter(x=>x!==slug):[...ids,slug];localStorage.setItem('cm5_saved',JSON.stringify(next));setSaved(next.includes(slug));track(next.includes(slug)?'save':'unsave')};
 const share=async()=>{const url=`${location.origin}/che-mira-v6/p/${slug}?src=share`;track('share');if(navigator.share){await navigator.share({title,url}).catch(()=>{});return}await navigator.clipboard?.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1200)};
 const calendar=()=>{const start=new Date(startsAt),end=new Date(start.getTime()+2*3600000),fmt=(d:Date)=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${fmt(start)}\nDTEND:${fmt(end)}\nSUMMARY:${title.replace(/,/g,'\\,')}\nLOCATION:${`${venue||neighborhood}`.replace(/,/g,'\\,')}\nURL:${location.origin}/che-mira-v6/p/${slug}\nEND:VEVENT\nEND:VCALENDAR`;const blob=new Blob([ics],{type:'text/calendar'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${slug}.ics`;a.click();URL.revokeObjectURL(a.href)};
 return <div className="detail6Actions"><button onClick={toggle}>{saved?'♥ Guardado':'♡ Guardar'}</button><button onClick={share}>{copied?'Copiado ✓':'Compartir ↗'}</button><button onClick={calendar}>Calendario +</button></div>
}
