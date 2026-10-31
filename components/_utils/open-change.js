/** Shared open-state notification. `onOpenChange` is the common contract.
 * `onClose` remains a supported zero-argument alias for closing.
 * `onDismiss` remains the click-handler alias used by Alert. */

export function hasDismiss(onOpenChange, onClose, onDismiss) {
  return typeof onOpenChange === "function" || typeof onClose === "function" || typeof onDismiss === "function";
}

export function notifyClosed(onOpenChange, onClose) {
  onOpenChange?.(false);
  onClose?.();
}

export function notifyDismiss(event, onOpenChange, onClose, onDismiss) {
  onOpenChange?.(false);
  onClose?.();
  onDismiss?.(event);
}
