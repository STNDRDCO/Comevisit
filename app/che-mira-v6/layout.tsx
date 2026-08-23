import type {Metadata} from 'next';
import MobileNav from './mobile-nav';
import V6Tracker from './tracker';
import './mobile.css';
export const metadata:Metadata={title:'CHE, MIRÁ — Qué hay en Buenos Aires',description:'Qué está pasando ahora en Buenos Aires. Ojo Acá, recién publicado y una forma simple de explorar.'};
export default function CheMiraV6Layout({children}:{children:React.ReactNode}){return <>{children}<V6Tracker/><MobileNav/></>}
