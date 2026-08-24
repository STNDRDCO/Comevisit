import type {Metadata} from 'next';
import MobileNav from './mobile-nav';
import V6Tracker from './tracker';
import './mobile.css';
import './today.css';
export const metadata:Metadata={title:'CHE, MIRÁ — La atención de hoy en Buenos Aires',description:'Qué está tratando de llamar tu atención hoy en Buenos Aires. Plata arriba, recencia abajo.'};
export default function CheMiraV6Layout({children}:{children:React.ReactNode}){return <>{children}<V6Tracker/><MobileNav/></>}
