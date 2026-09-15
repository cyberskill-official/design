import noRawColor from "./rules/no-raw-color.js";
import noDeepToken from "./rules/no-deep-token.js";

const plugin = {
  meta: { name: "@cyberskill/eslint-plugin", version: "1.7.2" },
  rules: {
    "no-raw-color": noRawColor,
    "no-deep-token": noDeepToken,
  },
  configs: {
    recommended: {
      plugins: ["@cyberskill"],
      rules: {
        "@cyberskill/no-raw-color": "error",
        "@cyberskill/no-deep-token": "warn",
      },
    },
  },
};

export default plugin;
