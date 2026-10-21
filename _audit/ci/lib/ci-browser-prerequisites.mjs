import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'yaml';

// Minimum engine set for the complete canonical suite. Individual jobs that
// only run Chromium gates require Chromium before executing those commands.
export const requiredBrowsers = ['chromium', 'firefox', 'webkit'];
const chromiumCommandPattern = /\b(?:npm\s+run\s+test:public-site|node\s+_audit\/ci\/(?:pixel-diff|run-gates|run-single-gate)\.mjs)\b/;

export function inspectWorkflow(text, name) {
  const workflow = parse(text), checks = [];
  for (const [jobName, job] of Object.entries(workflow.jobs || {})) {
    const installed = new Set();
    for (const [index, step] of (job.steps || []).entries()) {
      if (typeof step.run !== 'string') continue;
      const lines = step.run.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
      // This check supports explicit, straight-line installers, not arbitrary
      // shell execution. An installer in a conditional block is not a guarantee.
      const straightLine = !lines.some(line => /^(?:if|then|else|elif|fi|for|while|until|case|function)\b|[{}]/.test(line));
      for (const line of lines) {
        if (/\bnpm\s+run\s+test:unit\b/.test(line)) {
          const location = `${name}:${jobName}:step ${index + 1}`;
          assert(!/\bCS_TEST_BROWSER\s*=/.test(step.run), `${location}: canonical suite must not select a single engine`);
          for (const env of [workflow.env, job.env, step.env]) {
            assert(!env || !Object.hasOwn(env, 'CS_TEST_BROWSER'), `${location}: canonical suite must not select a single engine`);
          }
          const missing = requiredBrowsers.filter(browser => !installed.has(browser));
          assert.equal(missing.length, 0, `${location}: install required browsers before canonical checks: ${missing.join(', ')}`);
          checks.push({workflow: name, job: jobName, step: index + 1, browsers: [...installed].sort()});
        } else if (chromiumCommandPattern.test(line)) {
          const location = `${name}:${jobName}:step ${index + 1}`;
          assert(installed.has('chromium'), `${location}: install required browsers before Chromium checks: chromium`);
        }
        if (!Object.hasOwn(step, 'if') && !step['continue-on-error'] && straightLine && /^npx(?: --no-install)? playwright install(?: --with-deps)?(?: (?:chromium|firefox|webkit))+$/.test(line)) {
          for (const browser of line.split(' ').filter(token => requiredBrowsers.includes(token))) installed.add(browser);
        }
      }
    }
  }
  return checks;
}

export function inspectRepository(root) {
  const directory = join(root, '.github/workflows');
  const checks = readdirSync(directory).filter(name => /\.ya?ml$/.test(name)).sort().flatMap(name => inspectWorkflow(readFileSync(join(directory, name), 'utf8'), name));
  // Guard the canonical entrypoint against accidental removal or aliasing.
  for (const [workflow, job] of [['design-system-gates.yml', 'unit-tests']]) {
    assert(checks.some(check => check.workflow === workflow && check.job === job), `${workflow}:${job}: missing recognized canonical entrypoint`);
  }
  return checks;
}
