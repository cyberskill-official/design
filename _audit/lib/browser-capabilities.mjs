/** Feature guard for the declared modern browser floor; not version certification. */
export function inspectBrowserCapabilities(platform=globalThis) {
  const supports=(...args)=>{
    try{return Boolean(platform.CSS?.supports?.(...args));}catch{return false;}
  };
  const features={
    colorMixOklab:supports('color','color-mix(in oklab, #45210E 50%, #F4BA17)'),
    containerInlineSize:supports('container-type','inline-size'),
    relationalHas:supports('selector(:has(*))'),
    textWrapBalance:supports('text-wrap','balance'),
    inert:Boolean(platform.HTMLElement?.prototype && 'inert' in platform.HTMLElement.prototype),
  };
  return {pass:Object.values(features).every(Boolean),features};
}
export function requireBrowserCapabilities(platform=globalThis) {
  const report=inspectBrowserCapabilities(platform);
  if(!report.pass)throw Error('Required browser capabilities unavailable: '+Object.entries(report.features).filter(([,supported])=>!supported).map(([name])=>name).join(', '));
  return report;
}
