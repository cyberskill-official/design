import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const suite = pkg.scripts['test:unit:all'];
if (!suite) {
  console.error('Missing scripts["test:unit:all"] in package.json');
  process.exit(1);
}

const commands = suite
  .split('&&')
  .map((cmd) => cmd.trim())
  .filter(Boolean);

const shardSpec = process.env.CS_UNIT_SHARD || process.argv.find((a) => a.startsWith('--shard='))?.slice(8);
let selected = commands.map((cmd, idx) => ({ cmd, idx }));

if (shardSpec) {
  const m = /^(\d+)\/(\d+)$/.exec(shardSpec.trim());
  if (!m) {
    console.error(`Invalid CS_UNIT_SHARD="${shardSpec}" (expected N/M, e.g. 1/4)`);
    process.exit(1);
  }
  const index = Number(m[1]);
  const total = Number(m[2]);
  if (index < 1 || total < 1 || index > total) {
    console.error(`Invalid shard bounds: ${shardSpec}`);
    process.exit(1);
  }
  selected = selected.filter((item) => item.idx % total === index - 1);
  console.log(`Running unit test shard ${index}/${total} (${selected.length}/${commands.length} commands)`);
}

for (const { cmd, idx } of selected) {
  console.log(`\n[${idx + 1}/${commands.length}] > ${cmd}`);
  const res = spawnSync(cmd, {
    cwd: root,
    shell: true,
    stdio: 'inherit',
    env: process.env,
  });
  if (res.status !== 0 || res.signal) {
    console.error(`FAIL [${idx + 1}/${commands.length}] ${cmd} (exit=${res.status ?? 1}, signal=${res.signal || 'none'})`);
    process.exit(res.status || 1);
  }
}
