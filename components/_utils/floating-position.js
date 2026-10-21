export const floatingPlacements = Object.freeze(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]);
const placements = new Set(floatingPlacements);
const clamp = (value, start, end) => Math.max(start, Math.min(value, Math.max(start, end)));

/** Physical sides stay physical in RTL. start/end align with the inline direction on top/bottom. */
export function floatingPosition(anchor, panel, viewport, placement = "bottom-start", gap = 8, direction = "ltr") {
  if (!placements.has(placement)) throw new TypeError("Unsupported floating placement: " + placement);
  const [preferred, alignment] = placement.split("-");
  const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" };
  const available = { top: anchor.top - viewport.top - gap, bottom: viewport.bottom - anchor.bottom - gap, left: anchor.left - viewport.left - gap, right: viewport.right - anchor.right - gap };
  const dimension = preferred === "top" || preferred === "bottom" ? panel.height : panel.width;
  const side = dimension > available[preferred] && available[opposite[preferred]] > available[preferred] ? opposite[preferred] : preferred;
  const vertical = side === "top" || side === "bottom";
  const align = vertical && direction === "rtl" ? (alignment === "start" ? "end" : alignment === "end" ? "start" : undefined) : alignment;
  let left = vertical ? (align === "start" ? anchor.left : align === "end" ? anchor.right - panel.width : anchor.left + (anchor.width - panel.width) / 2)
    : side === "left" ? anchor.left - gap - panel.width : anchor.right + gap;
  let top = vertical ? (side === "top" ? anchor.top - gap - panel.height : anchor.bottom + gap)
    : (align === "start" ? anchor.top : align === "end" ? anchor.bottom - panel.height : anchor.top + (anchor.height - panel.height) / 2);
  left = clamp(left, viewport.left, viewport.right - panel.width);
  top = clamp(top, viewport.top, viewport.bottom - panel.height);
  return { left, top, placement: side + (alignment ? "-" + alignment : ""), maxWidth: Math.max(0, vertical ? viewport.right - viewport.left : available[side]), maxHeight: Math.max(0, vertical ? available[side] : viewport.bottom - viewport.top) };
}

