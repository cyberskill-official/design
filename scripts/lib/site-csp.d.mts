export interface SitePolicy {
 schemaVersion: 1; maxCspBytes: 4096; maxRoutes: 2048;
 csp: Record<string, string[]>; headers: Record<string, string>;
 legacyRedirects: {src: string; dest: '/'; status: 308}[];
}
export type InlineScriptPermission = {kind:'html-inline';line:number|null;hash:string;bytes:number} | {kind:'dc-logic-wrapper';line:number|null;hash:string;bytes:number;token:string;logicSha256:string};
export interface CspPage {path:string;htmlSha256:string;csp:string;scripts:InlineScriptPermission[]}
export interface CspManifest {schemaVersion:1;purpose:string;serializerSha256:string|null;pages:CspPage[]}
export function loadSitePolicy(path?: URL|string): SitePolicy;
export function htmlScriptSources(html:string,path?:string):InlineScriptPermission[];
export function designCsp(html?:string,options?:{policy?:SitePolicy;path?:string}):{value:string;scripts:InlineScriptPermission[]};
export function buildCspManifest(files:{path:string;html:string}[],options?:{policy?:SitePolicy;serializerSource?:string}):CspManifest;
