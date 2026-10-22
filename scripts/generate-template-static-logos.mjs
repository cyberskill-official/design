import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const source=JSON.parse(readFileSync('scripts/template-static-logos.json')),manifest=JSON.parse(readFileSync('_ds_manifest.json')),check=process.argv.includes('--check');
assert.equal(source.schemaVersion,1);assert.equal(source.asset,'assets/logo-mark.svg');assert.equal(createHash('sha256').update(readFileSync(source.asset)).digest('hex'),source.assetSha256,'Official logo asset requires explicit review');
assert.deepEqual(source.templates.map(x=>x.path).sort(),manifest.templates.map(x=>x.entryPath).sort(),'Every template has an explicit strategy');
let count=0;
for(const entry of source.templates){let html=readFileSync(entry.path,'utf8');const imports=[...html.matchAll(/<x-import\b[^>]*>/g)].map(x=>x[0]),names=imports.map(tag=>/component-from-global-scope="([^"]+)"/.exec(tag)?.[1]);
 if(entry.strategy==='components'){assert(names.some(name=>name!=='CyberSkillDS.Logo'),'Component templates must retain actual imports');assert(!html.includes('name="cs-template-library"'),'Component template cannot omit its bundle');continue}
 assert.equal(entry.strategy,'static-logo');assert(entry.logos.length);assert(names.every(name=>name==='CyberSkillDS.Logo'),'Refuse static adoption with non-Logo imports');
 let occurrence=0;html=html.replace(/<x-import\b[^>]*component-from-global-scope="CyberSkillDS\.Logo"[^>]*>\s*<\/x-import>/g,tag=>{const attrs=Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(x=>[x[1],x[2]]));assert.deepEqual(Object.keys(attrs).sort(),['component-from-global-scope','hint-size','size']);assert.equal(Number(attrs.size),entry.logos[occurrence]?.size);assert.equal(attrs['hint-size'],entry.logos[occurrence]?.hintSize);const size=entry.logos[occurrence++].size;return `<img data-cs-official-logo="" class="cs-logo" width="${size}" height="${size}" role="img" alt="CyberSkill" title="CyberSkill">`});
 const images=[...html.matchAll(/<img data-cs-official-logo=""[^>]*>/g)].map(x=>x[0]);assert.equal(images.length,entry.logos.length,'Exact original logo count');for(let i=0;i<images.length;i++){const size=entry.logos[i].size;assert.equal(images[i],`<img data-cs-official-logo="" class="cs-logo" width="${size}" height="${size}" role="img" alt="CyberSkill" title="CyberSkill">`)}
 if(!html.includes('<meta name="cs-template-library" content="static-logo">'))html=html.replace('<head>','<head>\n<meta name="cs-template-library" content="static-logo">');assert.equal(html.split('<meta name="cs-template-library" content="static-logo">').length,2);assert(!html.includes('<x-import'),'No component dependency may remain');
 if(check)assert.equal(readFileSync(entry.path,'utf8'),html,'Stale static logo adoption: '+entry.path);else writeFileSync(entry.path,html);count++;
}
console.log(`PASS official static logo ${check?'freshness':'adoption'}: ${count} Logo-only templates; other component imports preserved.`);
