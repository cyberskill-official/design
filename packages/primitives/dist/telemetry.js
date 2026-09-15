// packages/primitives/src/telemetry.js
function reportAdoption(event) {
  const sink = typeof globalThis !== "undefined" ? globalThis.CS_TELEMETRY : void 0;
  if (typeof sink !== "function") return false;
  sink({
    type: "adoption",
    at: Date.now(),
    ...event
  });
  return true;
}
function reportDeprecation(name, replacement) {
  return reportAdoption({
    type: "deprecation",
    name,
    replacement: replacement || null
  });
}
export {
  reportAdoption,
  reportDeprecation
};
