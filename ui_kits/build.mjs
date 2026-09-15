#!/usr/bin/env node
/**
 * Compile UI-kit JSX so product pages do not load Babel or raw JSX at runtime.
 * Status Hub / Website stay Thổ recreations (token CSS + compiled kit JS).
 * Lumi chat is a real @cyberskill/react consumer.
 */
import * as esbuild from "esbuild";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const outRoot = check ? join(tmpdir(), `cs-ui-kits-${process.pid}`) : root;

const kitIife = [
  {
    entry: join(root, "ui_kits/status-hub/StatusHub.jsx"),
    outfile: join(outRoot, "ui_kits/status-hub/StatusHub.compiled.js"),
  },
  {
    entry: join(root, "ui_kits/website/Website.jsx"),
    outfile: join(outRoot, "ui_kits/website/Website.compiled.js"),
  },
];

if (check) {
  mkdirSync(join(outRoot, "ui_kits/status-hub"), { recursive: true });
  mkdirSync(join(outRoot, "ui_kits/website"), { recursive: true });
}

for (const spec of kitIife) {
  await esbuild.build({
    absWorkingDir: root,
    entryPoints: [spec.entry],
    outfile: spec.outfile,
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    format: "iife",
    platform: "browser",
    logLevel: "silent",
  });
}

const reactGlobals = {
  name: "react-globals",
  setup(build) {
    const shims = {
      react: `const R = window.React;
export default R;
export const Children = R.Children;
export const Component = R.Component;
export const Fragment = R.Fragment;
export const StrictMode = R.StrictMode;
export const Suspense = R.Suspense;
export const cloneElement = R.cloneElement;
export const createContext = R.createContext;
export const createElement = R.createElement;
export const createRef = R.createRef;
export const forwardRef = R.forwardRef;
export const isValidElement = R.isValidElement;
export const lazy = R.lazy;
export const memo = R.memo;
export const startTransition = R.startTransition;
export const useCallback = R.useCallback;
export const useContext = R.useContext;
export const useDebugValue = R.useDebugValue;
export const useDeferredValue = R.useDeferredValue;
export const useEffect = R.useEffect;
export const useId = R.useId;
export const useImperativeHandle = R.useImperativeHandle;
export const useInsertionEffect = R.useInsertionEffect;
export const useLayoutEffect = R.useLayoutEffect;
export const useMemo = R.useMemo;
export const useReducer = R.useReducer;
export const useRef = R.useRef;
export const useState = R.useState;
export const useSyncExternalStore = R.useSyncExternalStore;
export const useTransition = R.useTransition;
`,
      "react/jsx-runtime": `function jsx(type, props, key) {
  const next = key === undefined ? { ...props } : { ...props, key };
  const { children, ...rest } = next;
  if (Array.isArray(children)) return window.React.createElement(type, rest, ...children);
  if (children !== undefined) return window.React.createElement(type, rest, children);
  return window.React.createElement(type, rest);
}
export const jsxs = jsx;
export { jsx };
export const Fragment = window.React.Fragment;
`,
      "react-dom": `export default window.ReactDOM;
export const createRoot = (...a) => window.ReactDOM.createRoot(...a);
export const hydrateRoot = (...a) => window.ReactDOM.hydrateRoot(...a);
export const flushSync = (...a) => window.ReactDOM.flushSync(...a);
`,
      "react-dom/client": `export const createRoot = (...a) => window.ReactDOM.createRoot(...a);
export const hydrateRoot = (...a) => window.ReactDOM.hydrateRoot(...a);
`,
    };
    build.onResolve({ filter: /^(react|react-dom|react\/jsx-runtime|react-dom\/client)$/ }, (args) => ({
      path: args.path,
      namespace: "react-globals",
    }));
    build.onLoad({ filter: /.*/, namespace: "react-globals" }, (args) => ({
      contents: shims[args.path],
      loader: "js",
    }));
  },
};

await esbuild.build({
  absWorkingDir: root,
  entryPoints: [join(root, "ui_kits/website/LumiChat.jsx")],
  outfile: join(outRoot, "ui_kits/website/LumiChat.compiled.js"),
  bundle: true,
  format: "iife",
  platform: "browser",
  jsx: "automatic",
  plugins: [reactGlobals],
  logLevel: "silent",
});

const compiled = [
  "ui_kits/status-hub/StatusHub.compiled.js",
  "ui_kits/website/Website.compiled.js",
  "ui_kits/website/LumiChat.compiled.js",
];

if (check) {
  for (const rel of compiled) {
    const expected = readFileSync(join(outRoot, rel));
    const committed = readFileSync(join(root, rel));
    if (Buffer.compare(expected, committed) !== 0) {
      rmSync(outRoot, { recursive: true, force: true });
      throw new Error(rel + " is stale — run node ui_kits/build.mjs");
    }
  }
  rmSync(outRoot, { recursive: true, force: true });
  console.log("PASS ui-kits-build --check");
} else {
  for (const rel of compiled) {
    writeFileSync(join(root, rel), readFileSync(join(outRoot, rel)));
  }
  console.log("PASS ui-kits-build");
}
