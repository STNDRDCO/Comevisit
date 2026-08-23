'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

export default function V6Tracker(){
 const path=usePathname();
 useEffect(()=>{
  let sessionId='';try{sessionId=localStorage.getItem('cm_session_id')||crypto.randomUUID();localStorage.setItem('cm_session_id',sessionId)}catch{}
  if(!sessionId)return;
  const send=(event:string)=>fetch('/api/cm/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,sessionId,properties:{path,version:'v6.1-today'}})}).catch(()=>{});
  const pageEvent=path==='/che-mira-v6'?'home_view':path==='/che-mira-v6/explorar'?'explore_view':null;if(pageEvent)send(pageEvent);
  send('presence');const timer=setInterval(()=>send('presence'),60000);return()=>clearInterval(timer);
 },[path]);
 return null;
}
