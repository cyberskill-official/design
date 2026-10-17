import {fileURLToPath} from 'node:url';
import {inspectRepository} from './lib/ci-browser-prerequisites.mjs';
const checks = inspectRepository(fileURLToPath(new URL('../../', import.meta.url)));
console.log(`PASS CI browser prerequisites: ${checks.length} canonical unit/release entrypoints install Chromium, Firefox and WebKit before execution. Static explicit-command check; no hosted run or cache integrity claimed.`);
