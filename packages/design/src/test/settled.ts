// Tests only. The test browser asks for reduced motion, which keeps short fades (120 to 180ms). Here every recipe ends
// at once, so axe and the assertions always look at a settled overlay, never at a popover halfway through its fade.
import tokens from '../../tokens/foundations.json';

const style = document.createElement('style');
style.textContent = `:root:root { ${Object.keys(tokens.motion).filter(k => !k.startsWith('$')).map(k => `--motion-${k}: 1ms linear;`).join(' ')} }`;
document.head.append(style);
