import { createElement } from "react";
import { Button } from "@cyberskill/react";

export function App() {
  return createElement(Button, { variant: "primary" }, "vite-canary");
}
