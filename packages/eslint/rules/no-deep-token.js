const DEEP = /--cs-(?:color|space|radius|shadow|font|motion)-[a-z0-9-]+/i;
const SEMANTIC = /--cs-(?:fg|bg|border|accent|danger|success|warning|info|surface|text|focus)/i;

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer semantic token roles over deep primitive `--cs-*` names.",
    },
    schema: [],
    messages: {
      deep: "Prefer a semantic token role over a deep primitive token.",
    },
  },
  create(context) {
    function check(node, value) {
      if (typeof value !== "string") return;
      if (DEEP.test(value) && !SEMANTIC.test(value)) {
        context.report({ node, messageId: "deep" });
      }
    }
    return {
      Literal(node) {
        check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value && node.value.raw);
      },
    };
  },
};
