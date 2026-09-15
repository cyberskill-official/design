import { createRoot } from "react-dom/client";
import { catalog } from "../../product-fixtures/catalog.mjs";

const host = document.querySelector("[data-stable-host]");
if (!host) throw new Error("product host missing data-stable-host");
const id = host.getAttribute("data-stable-host");
const product = catalog.find((p) => p.id === id);
if (!product) throw new Error("unknown product host " + id);
const root = document.getElementById("root") || host;
createRoot(root).render(product.render());
window.__productHost = { id, package: product.package, marker: product.marker };
