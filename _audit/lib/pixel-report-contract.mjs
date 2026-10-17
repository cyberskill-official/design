// Shared Node/browser receipt contract. Identity is separate from execution and acceptance.
export const PIXEL_FRAME = Object.freeze({ w: 909, h: 540 });
export const PIXEL_CHANNEL_TOLERANCE = 16;
export const PIXEL_DRIFT_PCT = 1;
export const PIXEL_TARGETS = Object.freeze(
  [
    { slug: "kitchen-sink", path: "/templates/kitchen-sink.html" },
    { slug: "auth", path: "/templates/auth/Auth.dc.html" },
    { slug: "app-shell", path: "/templates/app-shell/AppShell.dc.html" },
    { slug: "settings", path: "/templates/settings/Settings.dc.html" },
    { slug: "dashboard", path: "/templates/dashboard/Dashboard.dc.html" },
    {
      slug: "dashboard-dark",
      path: "/templates/dashboard/Dashboard.dc.html",
      theme: "dark",
    },
    {
      slug: "delivery-kickoff",
      path: "/templates/delivery-kickoff/DeliveryKickoff.dc.html",
    },
    { slug: "bod-report", path: "/templates/bod-report/BodReport.dc.html" },
    { slug: "slide-deck", path: "/templates/slide-deck/SlideDeck.dc.html" },
    {
      slug: "marketing-page",
      path: "/templates/marketing-page/MarketingPage.dc.html",
    },
    { slug: "email", path: "/templates/email/Email.dc.html" },
    {
      slug: "vn-labor-contract",
      path: "/templates/vn-labor-contract/VnLaborContract.dc.html",
    },
    {
      slug: "tech-incident-report",
      path: "/templates/tech-incident-report/TechIncidentReport.dc.html",
    },
    { slug: "status-hub", path: "/ui_kits/status-hub/" },
    { slug: "website", path: "/ui_kits/website/" },
  ].map((target) => Object.freeze(target))
);

export const PIXEL_POLICY_PATH = "scripts/public-site-policy.json";
export const PIXEL_INPUT_SCOPE = "public-runtime-authoring-and-pixel-tools-v1";
// image-slot.js treats this sidecar's 404 as its shipped empty placeholder.
// Compare that state explicitly; present private media must never go unhashed.
export const PIXEL_ABSENT_INPUTS = Object.freeze([
  "templates/marketing-page/.image-slots.state.json",
]);
const fixedInputs = [
  PIXEL_POLICY_PATH,
  "package.json",
  "package-lock.json",
  "_audit/ci/pixel-diff.mjs",
  "_audit/ci/lib/pixel-theme.mjs",
  "_audit/lib/pixel-report-contract.mjs",
  "_audit/pixel-ci.html",
  ...PIXEL_TARGETS.map((target) => "_audit/baselines/" + target.slug + ".png"),
];
const SHA = /^[a-f0-9]{64}$/;
const object = (value) =>
  !!value && typeof value === "object" && !Array.isArray(value);
const integer = (value) => Number.isSafeInteger(value) && value >= 0;
function requireValue(condition, message) {
  if (!condition) throw Error("Pixel report: " + message);
}
function safePath(path) {
  return (
    typeof path === "string" &&
    path &&
    !path.startsWith("/") &&
    !path.includes("\\") &&
    path
      .split("/")
      .every(
        (part) => part && part !== "." && part !== ".." && !part.startsWith(".")
      )
  );
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const dimensions = (value) =>
  object(value) &&
  integer(value.w) &&
  value.w > 0 &&
  integer(value.h) &&
  value.h > 0;
const rounded = (value) => Number(value.toFixed(4));

/** Complete canonical input membership; a report cannot choose a smaller file set. */
export function pixelInputPaths(policy) {
  requireValue(
    object(policy) && policy.schemaVersion === 1 && object(policy.audiences),
    "missing source inventory"
  );
  const files = new Set(fixedInputs);
  const declared = new Set();
  for (const audience of ["runtime", "authoring"]) {
    const paths = policy.audiences[audience]?.files;
    requireValue(
      Array.isArray(paths) && paths.length > 0,
      "empty " + audience + " inventory"
    );
    requireValue(
      new Set(paths).size === paths.length,
      "duplicate " + audience + " input"
    );
    for (const path of paths) {
      requireValue(safePath(path), "unsafe input path");
      requireValue(!declared.has(path), "duplicate input: " + path);
      declared.add(path);
      files.add(path);
    }
  }
  return [...files].sort();
}

export function pixelInputText(files) {
  return (
    Object.keys(files)
      .sort()
      .map((path) => files[path] + "  " + path + "\n")
      .join("") +
    PIXEL_ABSENT_INPUTS.map((path) => "ABSENT  " + path + "\n").join("")
  );
}

/** Throws for malformed/incomplete receipts. Valid failure receipts remain failures. */
export function validatePixelReport(report) {
  requireValue(
    object(report) && report.schemaVersion === 1,
    "legacy, empty or invalid schema"
  );
  requireValue(
    report.kind === "compare" && report.updated === false,
    "update-only or non-compare receipt"
  );
  requireValue(
    report.hard === true && report.advisory === false,
    "missing hard-gate classification"
  );
  requireValue(
    dimensions(report.frame) &&
      report.frame.w === PIXEL_FRAME.w &&
      report.frame.h === PIXEL_FRAME.h,
    "frame differs from the capture contract"
  );
  requireValue(
    report.channelTolerance === PIXEL_CHANNEL_TOLERANCE &&
      report.driftPctThreshold === PIXEL_DRIFT_PCT,
    "comparison settings changed"
  );
  requireValue(
    typeof report.generatedAt === "string" &&
      Number.isFinite(Date.parse(report.generatedAt)),
    "missing capture date"
  );
  let base;
  try {
    base = new URL(report.base);
  } catch {
    throw Error("Pixel report: invalid capture origin");
  }
  requireValue(
    ["http:", "https:"].includes(base.protocol) &&
      !base.username &&
      !base.password,
    "invalid capture origin"
  );
  requireValue(
    object(report.renderer) &&
      report.renderer.name === "chromium" &&
      typeof report.renderer.version === "string" &&
      report.renderer.version.trim() &&
      ["linux", "darwin", "win32"].includes(report.renderer.platform) &&
      typeof report.renderer.arch === "string" &&
      report.renderer.arch.trim(),
    "missing renderer identity"
  );
  requireValue(
    same(
      report.targets,
      PIXEL_TARGETS.map((target) => target.slug)
    ),
    "incomplete or changed target inventory"
  );
  requireValue(
    Array.isArray(report.results) &&
      report.results.length === PIXEL_TARGETS.length,
    "incomplete capture results"
  );
  requireValue(integer(report.captureFails), "invalid capture failure count");
  requireValue(
    Array.isArray(report.inputFailures) &&
      report.inputFailures.every((error) => typeof error === "string" && error),
    "missing input-verification outcome"
  );
  const inputs = report.sourceInputs;
  requireValue(
    same(inputs?.absentPaths, PIXEL_ABSENT_INPUTS),
    "missing declared empty image state"
  );
  requireValue(
    object(inputs) &&
      inputs.schemaVersion === 1 &&
      inputs.scope === PIXEL_INPUT_SCOPE &&
      object(inputs.files) &&
      SHA.test(inputs.hash),
    "missing source identity"
  );
  const paths = Object.keys(inputs.files);
  requireValue(
    paths.length > 0 &&
      paths.every((path) => safePath(path) && SHA.test(inputs.files[path])),
    "invalid source digests"
  );
  requireValue(
    fixedInputs.every((path) => Object.hasOwn(inputs.files, path)),
    "missing comparator, lockfile or baseline input"
  );
  for (const target of PIXEL_TARGETS) {
    const path = target.path.endsWith("/")
      ? target.path.slice(1) + "index.html"
      : target.path.slice(1);
    requireValue(
      Object.hasOwn(inputs.files, path),
      "missing target document: " + target.slug
    );
  }
  const drifted = [],
    errors = [];
  let captureFails = 0;
  for (let i = 0; i < PIXEL_TARGETS.length; i++) {
    const target = PIXEL_TARGETS[i],
      result = report.results[i];
    requireValue(
      object(result) &&
        result.slug === target.slug &&
        result.path === target.path &&
        result.requestedTheme === (target.theme || "default"),
      "missing, duplicate or changed result scope"
    );
    requireValue(
      Number.isFinite(result.pct) &&
        result.pct >= 0 &&
        result.pct <= 100 &&
        typeof result.drifted === "boolean",
      "invalid comparison outcome: " + target.slug
    );
    if (result.result === "capture_failed") {
      requireValue(
        typeof result.error === "string" &&
          result.error &&
          result.drifted &&
          result.pct === 100,
        "invalid failed capture: " + target.slug
      );
      captureFails++;
      errors.push("capture failed: " + target.slug);
    } else {
      requireValue(
        result.result === "captured" &&
          !Object.hasOwn(result, "error") &&
          !result.updated,
        "uncompared target: " + target.slug
      );
      requireValue(
        integer(result.total) &&
          result.total === PIXEL_FRAME.w * PIXEL_FRAME.h &&
          integer(result.differing) &&
          result.differing <= result.total,
        "invalid pixel counts: " + target.slug
      );
      requireValue(
        dimensions(result.captureSize) &&
          result.captureSize.w === PIXEL_FRAME.w &&
          result.captureSize.h === PIXEL_FRAME.h &&
          dimensions(result.baselineSize),
        "invalid image dimensions: " + target.slug
      );
      const mismatch =
        result.captureSize.w !== result.baselineSize.w ||
        result.captureSize.h !== result.baselineSize.h;
      requireValue(
        result.sizeMismatch === mismatch,
        "inconsistent size mismatch: " + target.slug
      );
      requireValue(
        !mismatch || result.differing === result.total,
        "size mismatch must fail every pixel: " + target.slug
      );
      const percent = (result.differing / result.total) * 100;
      requireValue(
        result.pct === rounded(percent),
        "inconsistent percentage: " + target.slug
      );
      requireValue(
        result.drifted === (percent > PIXEL_DRIFT_PCT || mismatch),
        "inconsistent drift verdict: " + target.slug
      );
    }
    if (result.drifted) drifted.push(target.slug);
  }
  requireValue(
    report.captureFails === captureFails,
    "failure count does not match rows"
  );
  requireValue(same(report.drifted, drifted), "drift list does not match rows");
  requireValue(
    Number.isFinite(report.maxDiff) &&
      report.maxDiff ===
        rounded(Math.max(...report.results.map((result) => result.pct))),
    "maximum difference does not match rows"
  );
  errors.push(
    ...drifted.map((slug) => "drift: " + slug),
    ...report.inputFailures.map((error) => "input verification: " + error)
  );
  return {
    pass: errors.length === 0,
    failures: errors,
    compared: PIXEL_TARGETS.length - captureFails,
    captureFails,
    drifted,
  };
}

async function mapInputs(paths, readBytes, sha256) {
  const pairs = new Array(paths.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(16, paths.length) }, async () => {
      while (cursor < paths.length) {
        const i = cursor++,
          path = paths[i];
        const digest = await sha256(await readBytes(path));
        requireValue(SHA.test(digest), "invalid hash implementation");
        pairs[i] = [path, digest];
      }
    })
  );
  return Object.fromEntries(pairs);
}

/** Reads every input. Call again after capture to reject a changing working tree. */
export async function createPixelInputs({ readBytes, sha256 }) {
  const policy = JSON.parse(
    new TextDecoder().decode(await readBytes(PIXEL_POLICY_PATH))
  );
  const files = await mapInputs(pixelInputPaths(policy), readBytes, sha256);
  for (const path of PIXEL_ABSENT_INPUTS) {
    let missing = false;
    try {
      await readBytes(path);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      missing = true;
    }
    requireValue(missing, "unexpected image sidecar present: " + path);
  }
  return {
    schemaVersion: 1,
    scope: PIXEL_INPUT_SCOPE,
    files,
    absentPaths: [...PIXEL_ABSENT_INPUTS],
    hash: await sha256(new TextEncoder().encode(pixelInputText(files))),
  };
}

/** Independently derives membership from current policy, then compares current bytes. */
export async function verifyPixelInputs(inputs, { readBytes, sha256 }) {
  requireValue(
    same(inputs?.absentPaths, PIXEL_ABSENT_INPUTS),
    "empty image state membership changed"
  );
  requireValue(
    object(inputs) && object(inputs.files) && SHA.test(inputs.hash),
    "invalid input manifest"
  );
  const actual = await createPixelInputs({ readBytes, sha256 });
  requireValue(
    same(Object.keys(inputs.files).sort(), Object.keys(actual.files).sort()),
    "source inventory membership changed"
  );
  for (const [path, digest] of Object.entries(actual.files))
    requireValue(
      inputs.files[path] === digest,
      "source input changed: " + path
    );
  requireValue(inputs.hash === actual.hash, "source inventory digest changed");
  return {
    state: "matches",
    files: Object.keys(actual.files).length,
    hash: actual.hash,
  };
}

/** Resolve ordinary serve HTML redirects and directory indexes, never arbitrary paths. */
export function pixelResourcePath(files, pathname) {
  let path;
  try {
    path = decodeURIComponent(pathname).replace(/^\//, "");
  } catch {
    return null;
  }
  if (Object.hasOwn(files, path)) return path;
  if (path.endsWith("/") && Object.hasOwn(files, path + "index.html"))
    return path + "index.html";
  if (Object.hasOwn(files, path + ".html")) return path + ".html";
  return null;
}
