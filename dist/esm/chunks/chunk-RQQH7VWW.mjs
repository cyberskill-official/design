"use client";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/Tree.jsx
import React from "react";
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
function seedOpen(nodes, defaultOpen, map = /* @__PURE__ */ Object.create(null)) {
  for (const n of nodes) {
    const kids = n.children || [];
    if (kids.length) {
      map[n.key] = !!defaultOpen;
      seedOpen(kids, defaultOpen, map);
    }
  }
  return map;
}
var Tree = React.forwardRef(function Tree2({ nodes = [], selected, onSelect, defaultOpen = false, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const [openMap, setOpenMap] = React.useState(() => seedOpen(nodes, defaultOpen));
  const [focusKey, setFocusKey] = React.useState(() => {
    if (selected != null && findNode(nodes, selected)) return selected;
    return nodes[0] ? nodes[0].key : null;
  });
  const itemRefs = React.useRef(/* @__PURE__ */ new Map());
  const treeId = React.useId();
  const search = React.useRef({ text: "", time: 0 });
  React.useEffect(() => {
    setOpenMap((prev) => {
      const next = seedOpen(nodes, defaultOpen);
      for (const k of Object.keys(next)) if (Object.hasOwn(prev, k)) next[k] = prev[k];
      return next;
    });
  }, [nodes, defaultOpen]);
  const visible = React.useMemo(() => collectVisible(nodes, openMap), [nodes, openMap]);
  React.useEffect(() => {
    if (!visible.length) {
      setFocusKey(null);
      return;
    }
    if (focusKey == null || !visible.some((n) => n.key === focusKey)) setFocusKey(visible[0].key);
  }, [visible, focusKey]);
  const toggle = (key) => setOpenMap((m) => Object.assign(/* @__PURE__ */ Object.create(null), m, { [key]: !m[key] }));
  const focusItem = (key) => {
    setFocusKey(key);
    requestAnimationFrame(() => {
      const el = itemRefs.current.get(key);
      if (el) el.focus();
    });
  };
  const onKeyDown = (e, key) => {
    if (e.target !== e.currentTarget) return;
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End", "Enter", " "].includes(e.key)) e.stopPropagation();
    const idx = visible.findIndex((n) => n.key === key);
    if (idx < 0) return;
    const node = visible[idx];
    const kids = node.children || [];
    const open = !!openMap[key];
    if (e.key === "*") {
      e.preventDefault();
      const parent = parentOf(nodes, key);
      const siblings = parent ? parent.children : nodes;
      setOpenMap((current) => {
        const next = Object.assign(/* @__PURE__ */ Object.create(null), current);
        for (const sibling of siblings) if (sibling.children?.length) next[sibling.key] = true;
        return next;
      });
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== " ") {
      const now = Date.now();
      const char = e.key.toLocaleLowerCase();
      const text = now - search.current.time < 500 ? search.current.text + char : char;
      search.current = { text, time: now };
      const needle = [...text].every((letter) => letter === char) ? char : text;
      const ordered = [...visible.slice(idx + 1), ...visible.slice(0, idx + 1)];
      const found = ordered.find((n) => itemRefs.current.get(n.key)?.querySelector(".cs-tree__label")?.textContent?.trim().toLocaleLowerCase().startsWith(needle));
      if (found) {
        e.preventDefault();
        focusItem(found.key);
      }
    } else if (e.key === "ArrowDown") {
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
    const selectNode = (e) => {
      e.stopPropagation();
      focusItem(n.key);
      onSelect && onSelect(n.key, n);
      if (kids.length) toggle(n.key);
    };
    return /* @__PURE__ */ React.createElement(
      "li",
      {
        key: n.key,
        role: "treeitem",
        "aria-expanded": kids.length ? open : void 0,
        "aria-selected": selected === n.key,
        "aria-labelledby": treeId + "-" + encodeURIComponent(n.key),
        tabIndex: focusKey === n.key ? 0 : -1,
        ref: (el) => {
          if (el) itemRefs.current.set(n.key, el);
          else itemRefs.current.delete(n.key);
        },
        onKeyDown: (e) => onKeyDown(e, n.key),
        onFocus: (e) => {
          if (e.target === e.currentTarget) setFocusKey(n.key);
        }
      },
      /* @__PURE__ */ React.createElement(
        "span",
        {
          className: cx("cs-tree__row", selected === n.key && "is-selected"),
          style: { paddingInlineStart: depth * 18 + 6 },
          onClick: selectNode
        },
        kids.length ? /* @__PURE__ */ React.createElement("span", { className: "cs-tree__twist", "aria-hidden": "true", onClick: (e) => {
          e.stopPropagation();
          focusItem(n.key);
          toggle(n.key);
        } }, open ? "▾" : "▸") : /* @__PURE__ */ React.createElement("span", { className: "cs-tree__twist", "aria-hidden": "true" }),
        /* @__PURE__ */ React.createElement("span", { id: treeId + "-" + encodeURIComponent(n.key), className: "cs-tree__label", onClick: selectNode }, n.label)
      ),
      kids.length && open ? /* @__PURE__ */ React.createElement("ul", { role: "group" }, renderNodes(kids, depth + 1)) : null
    );
  });
  return /* @__PURE__ */ React.createElement("ul", { role: "tree", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...mergeTargetProps({ "className": cx("cs-tree", className) }, rootProps, ["role", "aria-label", "aria-labelledby"]), ref: mergedNativeRef }, renderNodes(nodes, 0));
});
Tree.displayName = "Tree";

export {
  Tree
};
//# sourceMappingURL=chunk-RQQH7VWW.mjs.map
