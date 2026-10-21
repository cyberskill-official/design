import {readFileSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {collectTokenDeclarations} from './token-declarations.mjs';
import {declarationGraphReference} from './token-graph-reference.mjs';
import {projectBaseTokens} from './base-token-exports.mjs';
import {projectThemeTokens} from './theme-token-exports.mjs';
import {projectDtcg} from './project-dtcg.mjs';

/** Complete projections from authored inputs. Generated JSON/JS/DTCG are never seeds. */
export function tokenExportSeed(root,elementCss,elements,elementsDark) {
 const rootUrl=root instanceof URL?root:pathToFileURL(root.replace(/\/$/,'')+'/');
 const read=p=>JSON.parse(readFileSync(new URL(p,rootUrl),'utf8'));
 const metadata=read('tokens/export-metadata.json'),authored=read('tokens/base-inventory.json');
 if(metadata.schemaVersion!==1)throw Error('Unsupported token export metadata');
 const version=readFileSync(new URL('VERSION',rootUrl),'utf8').trim();
 const graph=collectTokenDeclarations(fileURLToPath(rootUrl),'styles.css',{'tokens/elements.css':elementCss});
 graph.generator='scripts/generate-token-declarations.mjs';
 const reference=declarationGraphReference(JSON.stringify(graph,null,2)+'\n');
 const blank={$meta:{...structuredClone(metadata.json),version,declarationGraph:reference},root:{},themes:{},elements,densities:{},contrasts:{}};
 const json=projectThemeTokens(rootUrl,projectBaseTokens(graph,blank,authored));
 const dtcg=structuredClone(metadata.dtcg),ext=dtcg.$extensions['com.cyberskill'];
 ext.version=version;
 ext.overrides={themes:json.themes,elements,elementsDark,densities:json.densities,contrasts:json.contrasts};
 ext.declarationGraph=reference;
 // A stable field order also makes the theme stage's density rewrite idempotent.
 for(const [group,definitions]of Object.entries(authored.groups))dtcg[group]={...authored.groupMetadata?.[group],...Object.fromEntries(Object.entries(definitions).map(([name,definition])=>[name,{$type:definition.$type,$value:null,...definition}]))};
 return {json,dtcg:projectDtcg(dtcg,json,authored).doc};
}
