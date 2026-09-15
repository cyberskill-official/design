function mergeRefs(...refs) {
  return (node) => {
    for (const r of refs) {
      if (typeof r === "function") r(node);
      else if (r && typeof r === "object") r.current = node;
    }
  };
}
export {
  mergeRefs
};
