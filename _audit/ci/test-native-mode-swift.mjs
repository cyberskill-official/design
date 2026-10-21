import assert from 'node:assert/strict';import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';import {resolve,join} from 'node:path';import {tmpdir} from 'node:os';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {readNativeModeModel} from '../../scripts/lib/native-mode-packs.mjs';import {expectedNativeModes,assertNativeObservations,assertNativeRequests} from './lib/native-mode-proof.mjs';
const root=resolve('.'),model=readNativeModeModel(root),expected=expectedNativeModes(root),source=readFileSync(join(root,'tokens/native/CSModes.swift'),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const swift=spawnSync('swiftc',['--version'],{encoding:'utf8'});assert.equal(swift.status,0,'Swift compiler is required for this platform validation; do not treat source-only checks as compilation');
const temp=mkdtempSync(join(tmpdir(),'cs-mode-swift-'));const q=JSON.stringify;
const encoders=`import Foundation
func encode(_ n: Double) -> Any { let hex = String(n.bitPattern, radix: 16); return "0x" + String(repeating: "0", count: 16 - hex.count) + hex }
func encode(_ x: CSDimension) -> Any { return ["value": encode(x.value), "unit": x.unit.rawValue] }
func encode(_ x: CSDuration) -> Any { return ["value": encode(x.value), "unit": x.unit.rawValue] }
func encode(_ x: CSColorValue) -> Any { return ["colorSpace": x.colorSpace.rawValue, "components": x.components.map { encode($0) }, "alpha": encode(x.alpha)] }
func encode(_ x: CSCubicBezier) -> Any { return [encode(x.x1), encode(x.y1), encode(x.x2), encode(x.y2)] }
func encode(_ x: CSShadow) -> Any { return ["color": encode(x.color), "offsetX": encode(x.offsetX), "offsetY": encode(x.offsetY), "blur": encode(x.blur), "spread": encode(x.spread)] }
func encode(_ x: [CSShadow]) -> Any { return x.map { encode($0) } }
func encode(_ x: [String]) -> Any { return x }
func omitted(_ x: CSOmittedToken) -> [String: Any] { return ["name": x.name, "reason": x.reason, "resolvedCss": x.resolvedCss] }
var packs: [CSTokenModePack] = []
`;
const requests=model.modes.map(({axes:a})=>`packs.append(try CSModes.resolve(theme: .${a.theme}, colorScheme: .${a.colorScheme}, element: ${a.element?'.'+a.element:'nil'}, variant: ${a.variant?'.'+a.variant:'nil'}, density: .${a.density}, contrast: .${a.contrast}, style: .liquidGlass))`).join('\n');
let main=encoders+requests+'\nvar observations: [[String: Any]] = []\nfor pack in packs {\nvar values: [String: Any] = [:]\n';
for(const token of model.tokens)main+=`values[${q(token.css)}] = encode(pack.${token.name})\n`;
main+=`observations.append(["id": pack.id, "values": values, "omissions": pack.omissions.map { omitted($0) }])
}
var requests: [[String: Any]] = []
let themes: [CSTheme] = [.light, .dark, .system]
let schemes: [CSColorScheme] = [.light, .dark]
let elements: [CSElement?] = [nil, .tho, .hoa, .thuy, .moc, .kim]
let variants: [CSVariant?] = [nil, .sand, .clay, .plasma, .lava, .mist, .ocean, .bamboo, .forest, .titanium, .steel]
for theme in themes { for scheme in schemes { for element in elements { for variant in variants { for density in [CSDensity.comfortable, .compact] { for contrast in [CSContrast.standard, .high] {
let axes: [String: Any] = ["theme": theme.rawValue, "colorScheme": scheme.rawValue, "element": element?.rawValue as Any? ?? NSNull(), "variant": variant?.rawValue as Any? ?? NSNull(), "density": density.rawValue, "contrast": contrast.rawValue, "style": "liquid-glass"]
do { let pack = try CSModes.resolve(theme: theme, colorScheme: scheme, element: element, variant: variant, density: density, contrast: contrast, style: .liquidGlass); requests.append(["axes": axes, "accepted": true, "id": pack.id]) }
catch CSModeError.invalidSelection { requests.append(["axes": axes, "accepted": false]) }
} } } } } }
let data = try JSONSerialization.data(withJSONObject: ["packs": observations, "requests": requests, "available": CSModes.availableModeIDs])
FileHandle.standardOutput.write(data)
`;
try{
 writeFileSync(join(temp,'main.swift'),main);
 function execute(text){const path=join(temp,'CSModes.swift');writeFileSync(path,text);const compiled=spawnSync('swiftc',[path,join(temp,'main.swift'),'-o',join(temp,'proof')],{encoding:'utf8',timeout:180000,maxBuffer:4e6});assert.equal(compiled.status,0,compiled.stderr);const run=spawnSync(join(temp,'proof'),[],{encoding:'utf8',timeout:120000,maxBuffer:48e6});assert.equal(run.status,0,run.stderr);return JSON.parse(run.stdout);}
 const result=execute(source);assertNativeObservations(result.packs,expected,{bits:true});assertNativeRequests(result.requests,expected);assert.deepEqual(result.available,[...expected.keys()]);
 const negatives=[];
 for(const [name,mutate]of [['color-space mutation',s=>s.replace('colorSpace: .oklab','colorSpace: .srgb')],['length-unit mutation',s=>s.replace('unit: .rem','unit: .px')],['getter-slot mutation',s=>s.replace('csModeRows[row][0]','csModeRows[row][1]')]]){const changed=mutate(source);assert.notEqual(changed,source);const observed=execute(changed);assert.throws(()=>assertNativeObservations(observed.packs,expected,{bits:true}),/Native getter mismatch/);negatives.push(name);}
 writeFileSync(join(temp,'CSModes.swift'),source);
 for(const [name,client]of [['required density','func invalid() { _ = try? CSModes.resolve(theme: .system, colorScheme: .dark, element: nil, variant: nil, contrast: .standard, style: .liquidGlass) }'],['unsupported automatic theme','func invalid() { _ = try? CSModes.resolve(theme: .auto, colorScheme: .dark, element: nil, variant: nil, density: .compact, contrast: .standard, style: .liquidGlass) }']]){writeFileSync(join(temp,'invalid.swift'),client);const check=spawnSync('swiftc',['-typecheck',join(temp,'CSModes.swift'),join(temp,'invalid.swift')],{encoding:'utf8',timeout:120000,maxBuffer:4e6});assert.notEqual(check.status,0,name);negatives.push(name);}
 mkdirSync('test-results/native-mode-packs',{recursive:true});writeFileSync('test-results/native-mode-packs/swift.json',JSON.stringify({pass:true,compiler:swift.stdout.trim(),platform:process.platform+'-'+process.arch,sourceSha256:hash(source),modeSourceHash:model.provenance.modeSourceHash,modeCount:256,gettersPerMode:194,getterObservations:49664,axisRequests:1584,acceptedRequests:256,numberComparison:'Exact IEEE754 Double bit patterns; no rounding/tolerance',negativeCases:negatives,scope:'Actual Swift compilation/execution of every typed getter, omission and axis combination; data-only API. No UI rendering/device/manual acceptance.'},null,2)+'\n');console.log('PASS compiled Swift native packs:49,664 exact getter observations,256omission lists,1,584axis requests (256accepted),3executed semantic mutations and2invalid-client compile negatives');
}finally{rmSync(temp,{recursive:true,force:true});}
