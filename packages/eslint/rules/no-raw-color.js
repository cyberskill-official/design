const HEX = /#(?:[0-9a-fA-F]{3,8})\b/;
const RGB = /\b(?:rgb|hsl)a?\(/i;

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Prefer semantic CyberSkill tokens over raw color literals.",
    },
    schema: [],
    messages: {
      raw: "Use a semantic `--cs-*` token instead of a raw color literal.",
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        if (HEX.test(node.value) || RGB.test(node.value)) {
          context.report({ node, messageId: "raw" });
        }
      },
      TemplateElement(node) {
        const raw = node.value && node.value.raw;
        if (typeof raw === "string" && (HEX.test(raw) || RGB.test(raw))) {
          context.report({ node, messageId: "raw" });
        }
      },
    };
  },
};
