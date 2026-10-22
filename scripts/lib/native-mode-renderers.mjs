function literal(text,lang){
 const slash=String.fromCharCode(92);let output='"';
 for(const c of text){
  const code=c.codePointAt(0);
  if(code>=0xd800&&code<=0xdfff)throw Error('Unsupported unpaired native Unicode surrogate');
  if(code===92)output+=slash+slash;
  else if(code===34)output+=slash+'"';
  else if(code===10)output+=slash+'n';
  else if(code===13)output+=slash+'r';
  else if(code===9)output+=slash+'t';
  else if(code===36&&lang!=='swift')output+=slash+'$';
  else if(code<32||code===127||code===0x2028||code===0x2029)output+=slash+(lang==='swift'?'u{'+code.toString(16)+'}':'u'+code.toString(16).padStart(4,'0'));
  else output+=c;
 }
 return output+'"';
}
const variants=['sand','clay','plasma','lava','mist','ocean','bamboo','forest','titanium','steel'];
const enums={Theme:['light','dark','system'],ColorScheme:['light','dark'],Element:['tho','hoa','thuy','moc','kim'],Variant:variants,Density:['comfortable','compact'],Contrast:['standard','high'],Style:['liquid-glass'],ColorSpace:['srgb','oklab'],LengthUnit:['px','rem'],DurationUnit:['ms','s']};
const member=s=>s==='liquid-glass'?'liquidGlass':s;
const kotlinMember=s=>member(s).replace(/[A-Z]/g,c=>'_'+c).toUpperCase();
const typeNames={color:'CSColorValue',dimension:'CSDimension',number:'Double',shadow:'[CSShadow]',duration:'CSDuration',cubicBezier:'CSCubicBezier',fontFamily:'[String]'};
const num=n=>{if(!Number.isFinite(n))throw Error('Nonfinite native number');return Number.isInteger(n)?String(n)+'.0':String(n);};
function header(model){return '// GENERATED explicit CyberSkill native data packs. Do not edit.\n// Canonical mode source '+model.provenance.modeSourceHash+'\n// Mode index sha256 '+model.provenance.modeIndexSha256+'\n// Data only: explicit axes; preserved color spaces/units; no OS inference or UI conversion.\n';}
function value(v,lang){
 const q=text=>literal(text,lang);
 const s=lang==='swift',k=lang==='kt',enumValue=(t,x)=>s?'.'+member(x):k?'CS'+t+'.'+kotlinMember(x):'CS'+t+'.'+member(x);
 const array=xs=>s?'['+xs.join(', ')+']':k?'listOf('+xs.join(', ')+')':'['+xs.join(', ')+']';
 const length=x=>s?`CSDimension(value: ${num(x.value)}, unit: ${enumValue('LengthUnit',x.unit)})`:`CSDimension(${num(x.value)}, ${enumValue('LengthUnit',x.unit)})`;
 const color=x=>s?`CSColorValue(colorSpace: ${enumValue('ColorSpace',x.colorSpace)}, components: ${array(x.components.map(num))}, alpha: ${num(x.alpha)})`:`CSColorValue(${enumValue('ColorSpace',x.colorSpace)}, ${array(x.components.map(num))}, ${num(x.alpha)})`;
 const shadow=x=>{if(Object.keys(x).sort().join(',')!=='blur,color,offsetX,offsetY,spread')throw Error('Unsupported native shadow fields');const args=[color(x.color),length(x.offsetX),length(x.offsetY),length(x.blur),length(x.spread)];return s?`CSShadow(color: ${args[0]}, offsetX: ${args[1]}, offsetY: ${args[2]}, blur: ${args[3]}, spread: ${args[4]})`:`CSShadow(${args.join(', ')})`;};
 let payload;
 switch(v.type){case'number':payload=num(v.value);break;case'color':payload=color(v.value);break;case'dimension':payload=length(v.value);break;case'shadow':payload=array(v.value.map(shadow));break;case'duration':payload=s?`CSDuration(value: ${num(v.value.value)}, unit: ${enumValue('DurationUnit',v.value.unit)})`:`CSDuration(${num(v.value.value)}, ${enumValue('DurationUnit',v.value.unit)})`;break;case'cubicBezier':payload=s?`CSCubicBezier(x1: ${num(v.value[0])}, y1: ${num(v.value[1])}, x2: ${num(v.value[2])}, y2: ${num(v.value[3])})`:`CSCubicBezier(${v.value.map(num).join(', ')})`;break;case'fontFamily':payload=array(v.value.map(q));break;default:throw Error('Unsupported native type');}
 return s?`.${v.type}(${payload})`:k?`CSNativeValue.${v.type[0].toUpperCase()+v.type.slice(1)}(${payload})`:`_CS${v.type[0].toUpperCase()+v.type.slice(1)}(${payload})`;
}
export function renderSwiftModes(model){
 const q=text=>literal(text,'swift');
 const lines=[header(model),'import Foundation',''];
 for(const [name,entries]of Object.entries(enums))lines.push(`public enum CS${name}: String { ${entries.map(e=>'case '+member(e)+(member(e)!==e?' = '+q(e):'')).join('; ')} }`);
 lines.push(`public struct CSColorValue { public let colorSpace: CSColorSpace; public let components: [Double]; public let alpha: Double }
public struct CSDimension { public let value: Double; public let unit: CSLengthUnit }
public struct CSDuration { public let value: Double; public let unit: CSDurationUnit }
public struct CSCubicBezier { public let x1: Double; public let y1: Double; public let x2: Double; public let y2: Double }
public struct CSShadow { public let color: CSColorValue; public let offsetX: CSDimension; public let offsetY: CSDimension; public let blur: CSDimension; public let spread: CSDimension }
public struct CSOmittedToken { public let name: String; public let reason: String; public let resolvedCss: String }
public enum CSModeError: Error { case invalidSelection }
private enum CSNativeValue { case color(CSColorValue), dimension(CSDimension), number(Double), shadow([CSShadow]), duration(CSDuration), cubicBezier(CSCubicBezier), fontFamily([String]) }
private let csModeValues: [CSNativeValue] = [`);
 lines.push(...model.values.map(v=>'  '+value(v,'swift')+','),']','private let csModeRows: [[Int]] = [',...model.rows.map(r=>'  ['+r.join(',')+'],'),']','private let csModeOmissions: [CSOmittedToken] = [',...model.omissions.map(o=>`  CSOmittedToken(name: ${q(o.name)}, reason: ${q(o.reason)}, resolvedCss: ${q(o.resolvedCss)}),`),']','private let csModeOmissionRows: [[Int]] = [',...model.omissionRows.map(r=>'  ['+r.join(',')+'],'),']','private let csModeMap: [String: (Int, Int)] = [',...model.modes.map(m=>`  ${q(m.id)}: (${m.row}, ${m.omissions}),`),']');
 lines.push(`public struct CSTokenModePack {
  public let id: String
  private let row: Int
  private let omissionRow: Int
  fileprivate init(id: String, row: Int, omissionRow: Int) { self.id = id; self.row = row; self.omissionRow = omissionRow }
  public var omissions: [CSOmittedToken] { csModeOmissionRows[omissionRow].map { csModeOmissions[$0] } }`);
 model.tokens.forEach((t,i)=>lines.push(`  public var ${t.name}: ${typeNames[t.type]} { if case let .${t.type}(v) = csModeValues[csModeRows[row][${i}]] { return v }; preconditionFailure("Generated native token type mismatch") }`));
 lines.push(`}
public enum CSModes {
  public static let sourceHash = ${q(model.provenance.modeSourceHash)}
  public static let availableModeIDs: [String] = [${model.modes.map(m=>q(m.id)).join(',')}]
  public static func resolve(theme: CSTheme, colorScheme: CSColorScheme, element: CSElement?, variant: CSVariant?, density: CSDensity, contrast: CSContrast, style: CSStyle) throws -> CSTokenModePack {
    guard style == .liquidGlass, theme == .system || theme.rawValue == colorScheme.rawValue else { throw CSModeError.invalidSelection }
    let themeID = theme == .system ? "system-" + colorScheme.rawValue : theme.rawValue
    let elementID = (element?.rawValue ?? "default") + (variant.map { "-" + $0.rawValue } ?? "")
    let id = [themeID, elementID, density.rawValue, contrast.rawValue].joined(separator: "__")
    guard let row = csModeMap[id] else { throw CSModeError.invalidSelection }
    return CSTokenModePack(id: id, row: row.0, omissionRow: row.1)
  }
}`);return lines.join('\n')+'\n';
}
export function renderKotlinModes(model){
 const q=text=>literal(text,'kt');
 const lines=[header(model),'package world.cyberskill.tokens',''];
 for(const [name,entries]of Object.entries(enums))lines.push(`enum class CS${name}(val css: String) { ${entries.map(e=>kotlinMember(e)+'('+q(e)+')').join(', ')} }`);
 lines.push(`data class CSColorValue(val colorSpace: CSColorSpace, val components: List<Double>, val alpha: Double)
data class CSDimension(val value: Double, val unit: CSLengthUnit)
data class CSDuration(val value: Double, val unit: CSDurationUnit)
data class CSCubicBezier(val x1: Double, val y1: Double, val x2: Double, val y2: Double)
data class CSShadow(val color: CSColorValue, val offsetX: CSDimension, val offsetY: CSDimension, val blur: CSDimension, val spread: CSDimension)
data class CSOmittedToken(val name: String, val reason: String, val resolvedCss: String)
private sealed class CSNativeValue {
  data class Color(val value: CSColorValue): CSNativeValue()
  data class Dimension(val value: CSDimension): CSNativeValue()
  data class Number(val value: Double): CSNativeValue()
  data class Shadow(val value: List<CSShadow>): CSNativeValue()
  data class Duration(val value: CSDuration): CSNativeValue()
  data class CubicBezier(val value: CSCubicBezier): CSNativeValue()
  data class FontFamily(val value: List<String>): CSNativeValue()
}
private val csModeValues: List<CSNativeValue> = listOf(`);
 lines.push(...model.values.map(v=>'  '+value(v,'kt')+','),')','private val csModeRows: List<List<Int>> = listOf(',...model.rows.map(r=>'  '+q(r.join(','))+','),`).map { row -> row.split(',').map { it.toInt() } }`,'private val csModeOmissions: List<CSOmittedToken> = listOf(',...model.omissions.map(o=>`  CSOmittedToken(${q(o.name)}, ${q(o.reason)}, ${q(o.resolvedCss)}),`),')','private val csModeOmissionRows: List<List<Int>> = listOf(',...model.omissionRows.map(r=>'  '+q(r.join(','))+','),`).map { row -> row.split(',').map { it.toInt() } }`,'private val csModeMap: Map<String, Pair<Int, Int>> = mapOf(',...model.modes.map(m=>`  ${q(m.id)} to Pair(${m.row}, ${m.omissions}),`),')');
 lines.push(`class CSTokenModePack internal constructor(val id: String, private val row: Int, private val omissionRow: Int) {
  val omissions: List<CSOmittedToken> get() = csModeOmissionRows[omissionRow].map { csModeOmissions[it] }`);
 const types={...typeNames,number:'Double',shadow:'List<CSShadow>',fontFamily:'List<String>'};
 model.tokens.forEach((t,i)=>lines.push(`  val ${t.name}: ${types[t.type]} get() = (csModeValues[csModeRows[row][${i}]] as CSNativeValue.${t.type[0].toUpperCase()+t.type.slice(1)}).value`));
 lines.push(`}
object CSModes {
  const val sourceHash: String = ${q(model.provenance.modeSourceHash)}
  val availableModeIDs: List<String> = listOf(${model.modes.map(m=>q(m.id)).join(',')})
  fun resolve(theme: CSTheme, colorScheme: CSColorScheme, element: CSElement?, variant: CSVariant?, density: CSDensity, contrast: CSContrast, style: CSStyle): CSTokenModePack {
    require(style == CSStyle.LIQUID_GLASS && (theme == CSTheme.SYSTEM || theme.css == colorScheme.css)) { "Invalid explicit CyberSkill mode selection" }
    val themeID = if (theme == CSTheme.SYSTEM) "system-" + colorScheme.css else theme.css
    val elementID = (element?.css ?: "default") + (variant?.let { "-" + it.css } ?: "")
    val id = listOf(themeID, elementID, density.css, contrast.css).joinToString("__")
    val row = csModeMap[id] ?: throw IllegalArgumentException("Invalid explicit CyberSkill mode selection")
    return CSTokenModePack(id, row.first, row.second)
  }
}`);return lines.join('\n')+'\n';
}
export function renderDartModes(model){
 const q=text=>literal(text,'dart');
 const lines=[header(model),'// Requires Dart null safety (Dart >=2.12). No Flutter import is required.',''];
 for(const [name,entries]of Object.entries(enums)){lines.push(`enum CS${name} { ${entries.map(member).join(', ')} }`);if(['Theme','ColorScheme','Element','Variant','Density','Contrast'].includes(name))lines.push(`const _cs${name}Names = <String>[${entries.map(q).join(',')}];`);}
 lines.push(`class CSColorValue { final CSColorSpace colorSpace; final List<double> components; final double alpha; const CSColorValue(this.colorSpace, this.components, this.alpha); }
class CSDimension { final double value; final CSLengthUnit unit; const CSDimension(this.value, this.unit); }
class CSDuration { final double value; final CSDurationUnit unit; const CSDuration(this.value, this.unit); }
class CSCubicBezier { final double x1; final double y1; final double x2; final double y2; const CSCubicBezier(this.x1, this.y1, this.x2, this.y2); }
class CSShadow { final CSColorValue color; final CSDimension offsetX; final CSDimension offsetY; final CSDimension blur; final CSDimension spread; const CSShadow(this.color, this.offsetX, this.offsetY, this.blur, this.spread); }
class CSOmittedToken { final String name; final String reason; final String resolvedCss; const CSOmittedToken(this.name, this.reason, this.resolvedCss); }
abstract class _CSNativeValue { const _CSNativeValue(); }`);
 const types={...typeNames,number:'double',shadow:'List<CSShadow>',fontFamily:'List<String>'};
 for(const [type,name]of Object.entries(types))lines.push(`class _CS${type[0].toUpperCase()+type.slice(1)} extends _CSNativeValue { final ${name} value; const _CS${type[0].toUpperCase()+type.slice(1)}(this.value); }`);
 lines.push('const _csModeValues = <_CSNativeValue>[',...model.values.map(v=>'  '+value(v,'dart')+','),'];','const _csModeRows = <List<int>>[',...model.rows.map(r=>'  ['+r.join(',')+'],'),'];','const _csModeOmissions = <CSOmittedToken>[',...model.omissions.map(o=>`  CSOmittedToken(${q(o.name)}, ${q(o.reason)}, ${q(o.resolvedCss)}),`),'];','const _csModeOmissionRows = <List<int>>[',...model.omissionRows.map(r=>'  ['+r.join(',')+'],'),'];','const _csModeMap = <String, List<int>>{',...model.modes.map(m=>`  ${q(m.id)}: [${m.row}, ${m.omissions}],`),'};');
 lines.push(`class CSTokenModePack {
  final String id; final int _row; final int _omissionRow;
  const CSTokenModePack._(this.id, this._row, this._omissionRow);
  List<CSOmittedToken> get omissions => List<CSOmittedToken>.unmodifiable(_csModeOmissionRows[_omissionRow].map((i) => _csModeOmissions[i]));`);
 model.tokens.forEach((t,i)=>lines.push(`  ${types[t.type]} get ${t.name} => (_csModeValues[_csModeRows[_row][${i}]] as _CS${t.type[0].toUpperCase()+t.type.slice(1)}).value;`));
 lines.push(`}
class CSModes {
  CSModes._();
  static const sourceHash = ${q(model.provenance.modeSourceHash)};
  static const availableModeIDs = <String>[${model.modes.map(m=>q(m.id)).join(',')}];
  static CSTokenModePack resolve({required CSTheme theme, required CSColorScheme colorScheme, required CSElement? element, required CSVariant? variant, required CSDensity density, required CSContrast contrast, required CSStyle style}) {
    final themeName = _csThemeNames[theme.index]; final schemeName = _csColorSchemeNames[colorScheme.index];
    if (style != CSStyle.liquidGlass || (theme != CSTheme.system && themeName != schemeName)) { throw ArgumentError('Invalid explicit CyberSkill mode selection'); }
    final themeID = theme == CSTheme.system ? 'system-' + schemeName : themeName;
    final elementID = (element == null ? 'default' : _csElementNames[element.index]) + (variant == null ? '' : '-' + _csVariantNames[variant.index]);
    final id = [themeID, elementID, _csDensityNames[density.index], _csContrastNames[contrast.index]].join('__');
    final row = _csModeMap[id]; if (row == null) { throw ArgumentError('Invalid explicit CyberSkill mode selection'); }
    return CSTokenModePack._(id, row[0], row[1]);
  }
}`);return lines.join('\n')+'\n';
}
export function renderNativeModes(model){return {'tokens/native/CSModes.swift':renderSwiftModes(model),'tokens/native/CSModes.kt':renderKotlinModes(model),'tokens/native/cs_modes.dart':renderDartModes(model)};}
