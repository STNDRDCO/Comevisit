export type WindowKey='HOY'|'ESTA NOCHE'|'MAÑANA'|'FINDE'|'PRÓXIMOS';
export const WINDOWS:WindowKey[]=['HOY','ESTA NOCHE','MAÑANA','FINDE','PRÓXIMOS'];
export const BA='America/Argentina/Buenos_Aires';

const parts=(d:Date)=>new Intl.DateTimeFormat('en-CA',{timeZone:BA,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',weekday:'short',hour12:false}).formatToParts(d).reduce<Record<string,string>>((a,p)=>{a[p.type]=p.value;return a},{});
export const dayKey=(d:Date)=>{const p=parts(d);return`${p.year}-${p.month}-${p.day}`};
export const addDays=(d:Date,n:number)=>new Date(d.getTime()+n*86400000);

export function eligible(iso:string,window:WindowKey,now=new Date()){
  const d=new Date(iso);if(Number.isNaN(d.getTime())||d.getTime()<now.getTime()-6*3600000)return false;
  const p=parts(d),eventDay=`${p.year}-${p.month}-${p.day}`,today=dayKey(now),tomorrow=dayKey(addDays(now,1));
  const hour=Number(p.hour),weekday=p.weekday;
  if(window==='HOY')return eventDay===today;
  if(window==='ESTA NOCHE')return(eventDay===today&&hour>=18)||(eventDay===tomorrow&&hour<4);
  if(window==='MAÑANA')return eventDay===tomorrow;
  if(window==='FINDE'){const delta=Math.floor((new Date(`${eventDay}T12:00:00-03:00`).getTime()-new Date(`${today}T12:00:00-03:00`).getTime())/86400000);return delta>=0&&delta<=7&&(weekday==='Sat'||weekday==='Sun')}
  return d.getTime()>=now.getTime()-15*60000;
}

export function eventLabel(iso:string){
 const d=new Date(iso),p=parts(d),today=dayKey(new Date()),tomorrow=dayKey(addDays(new Date(),1)),key=`${p.year}-${p.month}-${p.day}`,time=`${p.hour}:${p.minute}`;
 if(key===today)return`HOY · ${time}`;if(key===tomorrow)return`MAÑANA · ${time}`;
 return`${new Intl.DateTimeFormat('es-AR',{timeZone:BA,weekday:'short',day:'numeric',month:'short'}).format(d).toUpperCase()} · ${time}`;
}

export function ago(iso:string){const m=Math.max(0,Math.round((Date.now()-new Date(iso).getTime())/60000));if(m<60)return`HACE ${Math.max(1,m)} MIN`;const h=Math.floor(m/60);return h<24?`HACE ${h} H`:`HACE ${Math.floor(h/24)} D`}
export const money=(minor:number)=>'$'+new Intl.NumberFormat('es-AR').format(minor);
export const ctaLabel=(type:string)=>type==='instagram'?'Ver Instagram ↗':type==='whatsapp'?'Abrir WhatsApp ↗':type==='checkout'?'Comprar entrada ↗':'Ir a la web ↗';
