import type {ReactNode} from 'react';

type SignalInput={category:string;title:string;description?:string|null;destination_type?:string|null;destination_url?:string|null};
export type SignalKind='food'|'music'|'party'|'culture'|'experience'|'promo'|'ticket'|'new';
export type PlatformKind='instagram'|'spotify'|'whatsapp'|'tickets'|'web';

const hay=(s:string,re:RegExp)=>re.test(s.toLowerCase());

export function signalFor(x:SignalInput):{kind:SignalKind;label:string}{
 const text=`${x.title} ${x.description||''}`;
 if(hay(text,/promo|2x1|descuento|happy hour|beneficio|\boff\b|oferta/))return{kind:'promo',label:'PROMO'};
 if(hay(text,/últim[oa]s?|ultim[oa]s?|quedan\s+\d+|cupos?|entradas?\s+(finales|últimas|ultimas)/))return{kind:'ticket',label:'ÚLTIMAS'};
 if(hay(text,/nuevo|nueva|estreno|lanzamiento|sale hoy|salió hoy|salio hoy|acaba de salir|abrió hoy|abrio hoy|abre hoy/))return{kind:'new',label:'NUEVO'};
 if(x.category==='COMER')return{kind:'food',label:hay(text,/menú|menu|plato|cena|brunch|almuerzo|degustación|parrilla|fuera de carta/)?'COMER':'COMER'};
 if(x.category==='MÚSICA')return{kind:'music',label:'MÚSICA'};
 if(x.category==='SALIR')return{kind:'party',label:'SALIR'};
 if(x.category==='CULTURA')return{kind:'culture',label:'CULTURA'};
 return{kind:'experience',label:'EXPERIENCIA'};
}

export function platformFor(x:SignalInput):{kind:PlatformKind;label:string}{
 const url=(x.destination_url||'').toLowerCase();
 if(url.includes('instagram.com'))return{kind:'instagram',label:'Instagram'};
 if(url.includes('spotify.com'))return{kind:'spotify',label:'Spotify'};
 if(url.includes('wa.me')||url.includes('whatsapp.com')||x.destination_type==='whatsapp')return{kind:'whatsapp',label:'WhatsApp'};
 if(x.destination_type==='checkout')return{kind:'tickets',label:'Entradas'};
 return{kind:'web',label:'Web'};
}

const svg=(children:ReactNode)=><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;

export function SignalIcon({kind}:{kind:SignalKind}){
 if(kind==='food')return svg(<><path d="M7 3v8M4.5 3v5.2A2.8 2.8 0 0 0 7 11M9.5 3v5.2A2.8 2.8 0 0 1 7 11M7 11v10M16 3v18M16 3c3 2 3 7 0 9"/></>);
 if(kind==='music')return svg(<><path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>);
 if(kind==='party')return svg(<><path d="M5 19 19 5M8 5l1.2 3.8L13 10l-3.8 1.2L8 15l-1.2-3.8L3 10l3.8-1.2L8 5ZM17 14l.8 2.2L20 17l-2.2.8L17 20l-.8-2.2L14 17l2.2-.8L17 14Z"/></>);
 if(kind==='culture')return svg(<><path d="M5 6c2-2 4-2 7 0 3-2 5-2 7 0v8c-2 4-5 6-7 7-2-1-5-3-7-7V6Z"/><path d="M8 10h.01M16 10h.01M9 15c2 1.4 4 1.4 6 0"/></>);
 if(kind==='promo')return svg(<><path d="M4 12 12 4h6l2 2v6l-8 8-8-8Z"/><circle cx="15.5" cy="8.5" r="1"/><path d="m8 15 8-8"/></>);
 if(kind==='ticket')return svg(<><path d="M4 7h16v4a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V7Z"/><path d="M12 8.5v7"/></>);
 if(kind==='new')return svg(<><path d="M12 2.8 14 9l6.2 2-6.2 2-2 6.2-2-6.2-6.2-2 6.2-2 2-6.2Z"/><path d="m18.2 3.8.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z"/></>);
 return svg(<><path d="m12 3 2.2 5.2L20 10l-4.4 3.7L17 20l-5-3-5 3 1.4-6.3L4 10l5.8-1.8L12 3Z"/></>);
}

export function PlatformIcon({kind}:{kind:PlatformKind}){
 if(kind==='instagram')return svg(<><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.4" cy="6.7" r=".7" fill="currentColor" stroke="none"/></>);
 if(kind==='spotify')return svg(<><circle cx="12" cy="12" r="9"/><path d="M7 9.5c4-1 8-.6 11 1M7.8 13c3.4-.8 6.8-.4 9.4.8M8.6 16.2c2.8-.5 5.4-.2 7.7.8"/></>);
 if(kind==='whatsapp')return svg(<><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.7 2.8 2.1 4.2 5 5"/></>);
 if(kind==='tickets')return svg(<><path d="M4 7h16v4a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V7Z"/><path d="M12 8.5v7"/></>);
 return svg(<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.4 3.8 5.4 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3Z"/></>);
}
