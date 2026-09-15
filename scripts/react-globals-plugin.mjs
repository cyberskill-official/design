/** esbuild plugin: resolve react / react-dom to window.React / window.ReactDOM. */
export function reactGlobalsPlugin() {
  return {
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
}
