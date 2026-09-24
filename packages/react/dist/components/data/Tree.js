import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
function collectVisible(nodes, openMap, out = []) {
  for (const n of nodes) {
    out.push(n);
    const kids = n.children || [];
    if (kids.length && openMap[n.key]) collectVisible(kids, openMap, out);
  }
  return out;
}
function parentOf(nodes, key, parent = null) {
  for (const n of nodes) {
    if (n.key === key) return parent;
    const kids = n.children || [];
    if (kids.length) {
      const p = parentOf(kids, key, n);
      if (p !== void 0) return p;
    }
  }
  return void 0;
}
function findNode(nodes, key) {
  for (const n of nodes) {
    if (n.key === key) return n;
    const kids = n.children || [];
    if (kids.length) {
      const hit = findNode(kids, key);
      if (hit) return hit;
    }
  }
  return null;
}
function seedOpen(nodes, defaultOpen, map = {}) {
  for (const n of nodes) {
    const kids = n.children || [];
    if (kids.length) {
      map[n.key] = !!defaultOpen;
      seedOpen(kids, defaultOpen, map);
    }
  }
  return map;
}
const Tree = React.forwardRef(function Tree2({ nodes = [], selected, onSelect, defaultOpen = false, className }, forwardedRef) {
  const [openMap, setOpenMap] = React.useState(() => seedOpen(nodes, defaultOpen));
  const [focusKey, setFocusKey] = React.useState(() => {
    if (selected && findNode(nodes, selected)) return selected;
    return nodes[0] ? nodes[0].key : null;
  });
  const itemRefs = React.useRef({});
  React.useEffect(() => {
    setOpenMap((prev) => {
      const next = seedOpen(nodes, defaultOpen);
      for (const k of Object.keys(next)) if (k in prev) next[k] = prev[k];
      return next;
    });
  }, [nodes, defaultOpen]);
  const visible = React.useMemo(() => collectVisible(nodes, openMap), [nodes, openMap]);
  React.useEffect(() => {
    if (!visible.length) {
      setFocusKey(null);
      return;
    }
    if (!focusKey || !visible.some((n) => n.key === focusKey)) setFocusKey(visible[0].key);
  }, [visible, focusKey]);
  const toggle = (key) => setOpenMap((m) => ({ ...m, [key]: !m[key] }));
  const focusItem = (key) => {
    setFocusKey(key);
    requestAnimationFrame(() => {
      const el = itemRefs.current[key];
      if (el) el.focus();
    });
  };
  const onKeyDown = (e, key) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const idx = visible.findIndex((n) => n.key === key);
    if (idx < 0) return;
    const node = visible[idx];
    const kids = node.children || [];
    const open = !!openMap[key];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (idx < visible.length - 1) focusItem(visible[idx + 1].key);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx > 0) focusItem(visible[idx - 1].key);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(visible[0].key);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(visible[visible.length - 1].key);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (kids.length && !open) toggle(key);
      else if (kids.length && open) focusItem(kids[0].key);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (kids.length && open) toggle(key);
      else {
        const p = parentOf(nodes, key);
        if (p) focusItem(p.key);
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect && onSelect(key, node);
      if (kids.length) toggle(key);
    }
  };
  const renderNodes = (list, depth) => list.map((n) => {
    const kids = n.children || [];
    const open = !!openMap[n.key];
    return /* @__PURE__ */ jsxs("li", { ref: forwardedRef, role: "treeitem", "aria-expanded": kids.length ? open : void 0, "aria-selected": selected === n.key, children: [
      /* @__PURE__ */ jsxs("span", { className: cx("cs-tree__row", selected === n.key && "is-selected"), style: { paddingInlineStart: depth * 18 + 6 }, children: [
        kids.length ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-tree__twist", "aria-hidden": "true", tabIndex: -1, onClick: () => toggle(n.key), children: open ? "\u25BE" : "\u25B8" }) : /* @__PURE__ */ jsx("span", { className: "cs-tree__twist", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "cs-tree__label",
            tabIndex: focusKey === n.key ? 0 : -1,
            ref: (el) => {
              itemRefs.current[n.key] = el;
            },
            onClick: () => {
              onSelect && onSelect(n.key, n);
              if (kids.length) toggle(n.key);
            },
            onKeyDown: (e) => onKeyDown(e, n.key),
            onFocus: () => setFocusKey(n.key),
            children: n.label
          }
        )
      ] }),
      kids.length && open ? /* @__PURE__ */ jsx("ul", { role: "group", children: renderNodes(kids, depth + 1) }) : null
    ] }, n.key);
  });
  return /* @__PURE__ */ jsx("ul", { role: "tree", className: cx("cs-tree", className), children: renderNodes(nodes, 0) });
});
export {
  Tree
};
