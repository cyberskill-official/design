import type {CspManifest,SitePolicy} from './site-csp.mjs';
export type StaticRoute = {src:string;dest?:string;status?:308;continue?:true;headers:Record<string,string>} | {handle:'filesystem'};
export interface StaticDeployment {version:3;routes:StaticRoute[]}
export function buildSiteRoutes(manifest:CspManifest,options?:{policy?:SitePolicy;generatedDirectoryIndexes?:string[]}):StaticDeployment;
/** This resolves the generated subset for local tests; it does not claim platform acceptance. */
export function resolveSiteRequest(config:StaticDeployment,url:string):{headers:Record<string,string>;status:number;path?:string;location?:string};
