/** Keep the original capture platform only for byte-identical generated artifacts. */
export function retainModeCaptureOrigin(bundle, previousIndex, previousFiles) {
 if(typeof previousIndex?.renderer?.platform!=='string'||!previousIndex.renderer.platform.trim())return false;
 const candidate=structuredClone(bundle.index);candidate.renderer.platform=previousIndex.renderer.platform;
 if(JSON.stringify(candidate)!==JSON.stringify(previousIndex))return false;
 if(Object.keys(previousFiles).sort().join('\n')!==Object.keys(bundle.files).sort().join('\n'))return false;
 if(Object.entries(bundle.files).some(([name,text])=>previousFiles[name]!==text))return false;
 bundle.index.renderer.platform=previousIndex.renderer.platform;return true;
}
