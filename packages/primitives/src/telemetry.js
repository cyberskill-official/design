/**
 * Opt-in adoption / deprecation telemetry. No network I/O unless the host
 * assigns globalThis.CS_TELEMETRY. P3 — products wire their own sink.
 */
export function reportAdoption(event) {
  const sink = typeof globalThis !== "undefined" ? globalThis.CS_TELEMETRY : undefined;
  if (typeof sink !== "function") return false;
  sink({
    type: "adoption",
    at: Date.now(),
    ...event,
  });
  return true;
}

export function reportDeprecation(name, replacement) {
  return reportAdoption({
    type: "deprecation",
    name,
    replacement: replacement || null,
  });
}
