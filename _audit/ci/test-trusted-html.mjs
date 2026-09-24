#!/usr/bin/env node
import { sanitizeHtml, isAllowedUrl } from "../../components/_utils/sanitize-html.js";

function assert(c, m) {
  if (!c) throw new Error(m);
}

assert(!sanitizeHtml('<p>Hi<script>alert(1)</script></p>').includes("script"), "strips script");
assert(!sanitizeHtml('<p onclick="alert(1)">x</p>').includes("onclick"), "strips handlers");
assert(!sanitizeHtml('<a href="javascript:alert(1)">x</a>').includes("javascript"), "strips javascript:");
assert(!sanitizeHtml('<img src="data:text/html,x">').toLowerCase().includes("data:"), "strips data:");
assert(sanitizeHtml('<a href="https://cyberskill.world">x</a>').includes("https://cyberskill.world"), "keeps https");
assert(sanitizeHtml('<a href="/docs/trusted-html.md">x</a>').includes("/docs/trusted-html.md"), "keeps relative");
assert(isAllowedUrl("mailto:a@b.c"), "mailto allowed");
assert(!isAllowedUrl("blob:https://x"), "blob denied");

console.log("PASS test-trusted-html");
