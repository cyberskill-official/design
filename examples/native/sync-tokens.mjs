#!/usr/bin/env node
/**
 * Copy generated tokens/native/* into each multi-screen sample app.
 * Run after node _audit/ci/generate-native-tokens.mjs
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const native = join(root, 'tokens/native');

const swiftDest = join(root, 'examples/native/swiftui/Sources/CyberSkillSample/CSTokens.swift');
const ktDest = join(root, 'examples/native/compose/app/src/main/java/world/cyberskill/sample/tokens/CSTokens.kt');
const dartDest = join(root, 'examples/native/flutter/lib/tokens/cs_tokens.dart');

mkdirSync(dirname(swiftDest), { recursive: true });
mkdirSync(dirname(ktDest), { recursive: true });
mkdirSync(dirname(dartDest), { recursive: true });
mkdirSync(join(root, 'examples/native/swiftui/Sources/CyberSkillDesign'), { recursive: true });
mkdirSync(join(root, 'examples/native/flutter_design/lib'), { recursive: true });
mkdirSync(join(root, 'examples/native/compose/design/src/main/java/world/cyberskill/design'), { recursive: true });

copyFileSync(join(native, 'CSTokens.swift'), swiftDest);
copyFileSync(join(native, 'cs_tokens.dart'), dartDest);
copyFileSync(join(native, 'CSModes.swift'), join(root, 'examples/native/swiftui/Sources/CyberSkillDesign/CSModes.swift'));
copyFileSync(join(native, 'cs_modes.dart'), join(root, 'examples/native/flutter_design/lib/cs_modes.dart'));

let kt = readFileSync(join(native, 'CSTokens.kt'), 'utf8');
kt = kt.replace(
  /package world\.cyberskill\.tokens/,
  'package world.cyberskill.sample.tokens',
);
writeFileSync(ktDest, kt);

let modes = readFileSync(join(native, 'CSModes.kt'), 'utf8');
modes = modes.replace(
  /package world\.cyberskill\.tokens/,
  'package world.cyberskill.design',
);
writeFileSync(join(root, 'examples/native/compose/design/src/main/java/world/cyberskill/design/CSModes.kt'), modes);

console.log('Synced native tokens and mode packs into the sample apps and component libraries');
