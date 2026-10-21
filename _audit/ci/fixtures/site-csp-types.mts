import {designCsp,buildCspManifest,loadSitePolicy} from '../../../scripts/lib/site-csp.mjs';
import type {CspManifest,InlineScriptPermission} from '../../../scripts/lib/site-csp.mjs';
import {buildSiteRoutes,resolveSiteRequest} from '../../../scripts/lib/site-routes.mjs';
import {compileSiteJsx} from '../../../scripts/lib/site-jsx.mjs';
import {dcLogicScriptSource} from '../../../scripts/template-runtime/dc-logic-source.mjs';
const manifest:CspManifest=buildCspManifest([{path:'index.html',html:'<script>window.ok=true</script>'}]);
const policy=loadSitePolicy();const config=buildSiteRoutes(manifest,{policy});
const resolved=resolveSiteRequest(config,'/?probe=1');const status:number=resolved.status;
const compiled=compileSiteJsx('<p>Static</p>','index.html',{publicRoot:'.',classifiedPaths:new Set<string>()});const count:number=compiled.blocks;
const text:string=dcLogicScriptSource('class Component extends DCLogic {}','Component');
for(const permission of manifest.pages[0].scripts)if(permission.kind==='dc-logic-wrapper'){const token:string=permission.token;const source:string=permission.logicSha256;}
// @ts-expect-error The shared producer accepts string source only.
dcLogicScriptSource({},'Component');
// @ts-expect-error Permission metadata must preserve the discriminated wrapper source identity.
const incomplete:InlineScriptPermission={kind:'dc-logic-wrapper',line:1,hash:'hash',bytes:0};
// @ts-expect-error Public route identity is a string path, not a boolean.
designCsp('',{path:true});
// @ts-expect-error The classified source boundary is an explicit set.
compileSiteJsx('','index.html',{publicRoot:'.',classifiedPaths:[]});
