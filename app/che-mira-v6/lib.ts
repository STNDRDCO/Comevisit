export const BA='America/Argentina/Buenos_Aires';

const parts=(d:Date)=>new Intl.DateTimeFormat('en-CA',{timeZone:BA,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',weekday:'short',hour12:false}).formatToParts(d).reduce<Record<string,string>>((a,p)=>{a[p.type]=p.value;return a},{});
export const dayKey=(d:Date)=>{const p=parts(d);return`${p.year}-${p.month}-${p.day}`};
export const addDays=(d:Date,n:number)=>new Date(d.getTime()+n*86400000);

function socialStart(now=new Date()){
 const p=parts(now);const hour=Number(p.hour);const base=new Date(`${p.year}-${p.month}-${p.day}T06:00:00-03:00`);
 return hour<6?new Date(base.getTime()-86400000):base;
}
export function cheDayBounds(now=new Date()){const start=socialStart(now);return{start,end:new Date(start.getTime()+86400000)}}
export function isCheToday(iso:string,now=new Date()){
 const d=new Date(iso);if(Number.isNaN(d.getTime()))return false;const{start,end}=cheDayBounds(now);return d>=start&&d<end;
}
export function isFutureCheDay(iso:string,now=new Date()){const d=new Date(iso);if(Number.isNaN(d.getTime()))return false;return d>=cheDayBounds(now).end}

export function eventLabel(iso:string,now=new Date()){
 const d=new Date(iso),p=parts(d),time=`${p.hour}:${p.minute}`;
 if(isCheToday(iso,now))return`HOY · ${time}`;
 return`${new Intl.DateTimeFormat('es-AR',{timeZone:BA,weekday:'short',day:'numeric',month:'short'}).format(d).toUpperCase()} · ${time}`;
}

export function ago(iso:string){const m=Math.max(0,Math.round((Date.now()-new Date(iso).getTime())/60000));if(m<60)return`HACE ${Math.max(1,m)} MIN`;const h=Math.floor(m/60);return h<24?`HACE ${h} H`:`HACE ${Math.floor(h/24)} D`}
export const money=(minor:number)=>'$'+new Intl.NumberFormat('es-AR').format(minor);
export const ctaLabel=(type:string)=>type==='instagram'?'Ver Instagram ↗':type==='whatsapp'?'Abrir WhatsApp ↗':type==='checkout'?'Comprar entrada ↗':'Ir a la web ↗';
