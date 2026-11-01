"use client";

// components/_utils/open-change.js
function hasDismiss(onOpenChange, onClose, onDismiss) {
  return typeof onOpenChange === "function" || typeof onClose === "function" || typeof onDismiss === "function";
}
function notifyClosed(onOpenChange, onClose) {
  onOpenChange?.(false);
  onClose?.();
}
function notifyDismiss(event, onOpenChange, onClose, onDismiss) {
  onOpenChange?.(false);
  onClose?.();
  onDismiss?.(event);
}

export {
  hasDismiss,
  notifyClosed,
  notifyDismiss
};
//# sourceMappingURL=chunk-65SIJBJX.mjs.map
