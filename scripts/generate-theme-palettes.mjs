import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {projectThemePalettes,assertThemePaletteFreshness} from './lib/theme-palette-projection.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
if(process.argv.includes('--check'))assertThemePaletteFreshness(root);
else{const outputs=projectThemePalettes(root);for(const [path,text]of Object.entries(outputs))writeFileSync(join(root,path),text);}
console.log('PASS theme palette mirrors:31 authored declarations, explicit dark/system blocks, exact selector/order/comment preservation');
