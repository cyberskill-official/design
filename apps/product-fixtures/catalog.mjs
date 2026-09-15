/**
 * Per-product trees on compiled @cyberskill/react + @cyberskill/themes.
 * createElement only — no JSX — so Node and the browser host share one source.
 */
import { createElement } from "react";
import {
  Alert,
  Button,
  Card,
  ChatMessage,
  DataGrid,
  LumiAvatar,
  PromptInput,
  Stat,
  Tabs,
  TextField,
} from "@cyberskill/react";
import { ThemeProvider } from "@cyberskill/themes";

export function wrap(product, children) {
  return createElement(
    ThemeProvider,
    { theme: "light", contrast: "standard" },
    createElement(
      "div",
      {
        "data-product": product.id,
        "data-cs-element": product.element,
        "data-cs-variant": product.variant || undefined,
      },
      children,
    ),
  );
}

export const catalog = [
  {
    id: "lumi",
    name: "Lumi",
    element: "hoa",
    variant: "plasma",
    package: "@cyberskill/react",
    surfaces: ["components/brand/LumiAvatar.jsx", "components/ai/ChatMessage.jsx"],
    marker: "cs-lumi",
    render: () =>
      wrap(
        { id: "lumi", element: "hoa", variant: "plasma" },
        createElement(
          "div",
          null,
          createElement(LumiAvatar, { alt: "Lumi" }),
          createElement(ChatMessage, { role: "lumi" }, "A wish worth granting."),
          createElement(PromptInput, { onSubmit: () => {} }),
        ),
      ),
  },
  {
    id: "status-hub",
    name: "Status Hub",
    element: "thuy",
    package: "@cyberskill/react",
    surfaces: ["ui_kits/status-hub/index.html", "ui_kits/status-hub/StatusHub.jsx"],
    marker: "cs-datagrid",
    render: () =>
      wrap(
        { id: "status-hub", element: "thuy" },
        createElement(
          "div",
          null,
          createElement(Tabs, {
            "aria-label": "Lenses",
            value: "board",
            tabs: [
              { value: "board", label: "Board" },
              { value: "table", label: "Table" },
            ],
          }),
          createElement(DataGrid, {
            columns: [{ key: "n", header: "Project", sortable: true }],
            rows: [{ k: "1", n: "Alpha" }, { k: "2", n: "Beta" }],
            rowKey: "k",
          }),
        ),
      ),
  },
  {
    id: "cyberos",
    name: "CyberOS Agent Spine",
    element: "kim",
    variant: "steel",
    package: "@cyberskill/react",
    surfaces: ["AGENTS.md", "docs/tasks/BACKLOG.md"],
    marker: "cs-field",
    render: () =>
      wrap(
        { id: "cyberos", element: "kim", variant: "steel" },
        createElement(
          ThemeProvider,
          { theme: "dark", contrast: "high" },
          createElement(TextField, { label: "Task id", defaultValue: "TASK-IMP-030" }),
          createElement(Button, { variant: "primary" }, "Run gates"),
        ),
      ),
  },
  {
    id: "design-system",
    name: "CyberSkill Design System",
    element: "moc",
    package: "@cyberskill/react",
    surfaces: ["packages/react/package.json", "packages/tokens/package.json"],
    marker: "cs-button",
    render: () =>
      wrap(
        { id: "design-system", element: "moc" },
        createElement(Button, { variant: "primary" }, "Design System"),
      ),
  },
  {
    id: "cyberskill-world",
    name: "cyberskill.world",
    element: "tho",
    package: "@cyberskill/tokens",
    surfaces: ["ui_kits/website/index.html", "ui_kits/website/Website.jsx"],
    marker: "cs-lumi",
    render: () =>
      wrap(
        { id: "cyberskill-world", element: "tho" },
        createElement(
          "div",
          null,
          createElement(LumiAvatar, { alt: "Lumi" }),
          createElement(Button, { variant: "primary" }, "Start a project"),
        ),
      ),
  },
  {
    id: "client-delivery",
    name: "Client delivery suite",
    element: "tho",
    variant: "clay",
    package: "@cyberskill/react",
    surfaces: ["templates/delivery-kickoff/DeliveryKickoff.dc.html", "templates/delivery-kickoff/ds-base.js"],
    marker: "cs-card",
    render: () =>
      wrap(
        { id: "client-delivery", element: "tho", variant: "clay" },
        createElement(Card, null, createElement(Button, null, "Kickoff")),
      ),
  },
  {
    id: "board",
    name: "Board / investor collateral",
    element: "kim",
    package: "@cyberskill/react",
    surfaces: ["templates/bod-memo/BodMemo.dc.html", "templates/bod-investor-update/BodInvestorUpdate.dc.html"],
    marker: "cs-stat",
    render: () =>
      wrap(
        { id: "board", element: "kim" },
        createElement(Stat, { label: "Runway", value: "18 mo", trend: "flat" }),
      ),
  },
  {
    id: "hr",
    name: "HR / employment instruments",
    element: "moc",
    variant: "bamboo",
    package: "@cyberskill/react",
    surfaces: ["templates/hr-announcement/HrAnnouncement.dc.html", "templates/hr-pip/HrPip.dc.html"],
    marker: "cs-alert",
    render: () =>
      wrap(
        { id: "hr", element: "moc", variant: "bamboo" },
        createElement(Alert, { variant: "info", title: "Policy" }, "Employment instrument"),
      ),
  },
];
