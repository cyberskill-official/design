import React from "react";

/**
 * CyberSkill line-icon set (in-repo, no external icon library). Each icon is
 * data — a viewBox plus primitive elements — rendered through this one <Icon>.
 * Line icons use currentColor stroke so they follow the surrounding text token.
 * Sizes come from --cs-icon-* tokens (sm/md/lg). Decorative by default; pass
 * `label` to expose a meaningful icon to assistive tech.
 */
export const CS_ICONS = {
  close: { viewBox: "0 0 24 24", els: [["path", { d: "M6 6l12 12M18 6L6 18" }]] },
  sun: { viewBox: "0 0 24 24", els: [
    ["circle", { cx: 12, cy: 12, r: 4 }],
    ["path", { d: "M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" }],
  ] },
  moon: { viewBox: "0 0 24 24", els: [["path", { d: "M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z" }]] },
  "arrow-right": { viewBox: "0 0 24 24", els: [["path", { d: "M5 12h14M13 6l6 6-6 6" }]] },
  check: { viewBox: "0 0 24 24", els: [["path", { d: "M4 12.5l5 5 11-11" }]] },
  sparkle: { viewBox: "0 0 24 24", els: [["path", { d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" }]] },
  chat: { viewBox: "0 0 24 24", els: [["path", { d: "M4 5h16v11H8l-4 4z" }]] },
  "sound-on": { viewBox: "0 0 24 24", els: [
    ["path", { d: "M5 9v6h3l4 4V5L8 9z" }],
    ["path", { d: "M15 9.5a4 4 0 0 1 0 5M17.6 7a8 8 0 0 1 0 10" }],
  ] },
  "sound-off": { viewBox: "0 0 24 24", els: [
    ["path", { d: "M5 9v6h3l4 4V5L8 9z" }],
    ["path", { d: "M16 9.5l4.5 5M20.5 9.5l-4.5 5" }],
  ] },
  // v2.0 extension — same grammar: line, currentColor, 1.75, round, 24×24
  search: { viewBox: "0 0 24 24", els: [["circle", { cx: 11, cy: 11, r: 6 }], ["path", { d: "M20 20l-4.2-4.2" }]] },
  sliders: { viewBox: "0 0 24 24", els: [
    ["path", { d: "M4 6h16M4 12h16M4 18h16" }],
    ["circle", { cx: 9, cy: 6, r: 2 }], ["circle", { cx: 15, cy: 12, r: 2 }], ["circle", { cx: 7, cy: 18, r: 2 }],
  ] },
  upload: { viewBox: "0 0 24 24", els: [["path", { d: "M12 15V4M7 8.5L12 4l5 4.5" }], ["path", { d: "M4 19h16" }]] },
  download: { viewBox: "0 0 24 24", els: [["path", { d: "M12 4v11M7 10.5L12 15l5-4.5" }], ["path", { d: "M4 19h16" }]] },
  calendar: { viewBox: "0 0 24 24", els: [["rect", { x: 4, y: 6, width: 16, height: 14, rx: 2 }], ["path", { d: "M4 10.5h16M8 3.5v4M16 3.5v4" }]] },
  user: { viewBox: "0 0 24 24", els: [["circle", { cx: 12, cy: 8.5, r: 3.5 }], ["path", { d: "M5 19.5c1.6-3.4 4-5 7-5s5.4 1.6 7 5" }]] },
  plus: { viewBox: "0 0 24 24", els: [["path", { d: "M12 5v14M5 12h14" }]] },
  trash: { viewBox: "0 0 24 24", els: [["path", { d: "M5 7h14M9.5 7V4.5h5V7" }], ["path", { d: "M7 7l.8 12.5h8.4L17 7M10 11v5M14 11v5" }]] },
  external: { viewBox: "0 0 24 24", els: [["path", { d: "M14 4h6v6M20 4l-8 8" }], ["path", { d: "M18 13v6H5V6h6" }]] },
  menu: { viewBox: "0 0 24 24", els: [["path", { d: "M4 7h16M4 12h16M4 17h16" }]] },
  // v2.13 extension — common chevrons + edit/copy/info/warning (same grammar)
  "chevron-down": { viewBox: "0 0 24 24", els: [["path", { d: "M6 9l6 6 6-6" }]] },
  "chevron-up": { viewBox: "0 0 24 24", els: [["path", { d: "M6 15l6-6 6 6" }]] },
  "chevron-left": { viewBox: "0 0 24 24", els: [["path", { d: "M15 6l-6 6 6 6" }]] },
  "chevron-right": { viewBox: "0 0 24 24", els: [["path", { d: "M9 6l6 6-6 6" }]] },
  edit: { viewBox: "0 0 24 24", els: [["path", { d: "M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17z" }], ["path", { d: "M13.5 6.5l3 3" }]] },
  copy: { viewBox: "0 0 24 24", els: [["rect", { x: 8, y: 8, width: 12, height: 12, rx: 2 }], ["path", { d: "M4 16V6a2 2 0 0 1 2-2h10" }]] },
  info: { viewBox: "0 0 24 24", els: [["circle", { cx: 12, cy: 12, r: 9 }], ["path", { d: "M12 11v5M12 7.75v.01" }]] },
  "alert-triangle": { viewBox: "0 0 24 24", els: [["path", { d: "M12 3.5l9 16H3z" }], ["path", { d: "M12 10v4M12 17.5v.01" }]] },
  pin: { viewBox: "0 0 24 24", els: [["path", { d: "M12 21v-7" }], ["path", { d: "M8.5 3.5h7l-1.2 6.5h2.7L12 14.5 6.999 10h2.7z" }]] },
};

export function Icon({ name, size = "md", label, className, strokeWidth = 1.75, ...props }) {
  const def = CS_ICONS[name] || CS_ICONS.sparkle;
  const dim = `var(--cs-icon-${size}, 20px)`;
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: false };
  return (
    <svg
      {...props}
      className={className}
      viewBox={def.viewBox}
      style={{ width: dim, height: dim, display: "inline-block", flex: "none", ...(props.style || {}) }}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
    >
      {def.els.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}
