/**
 * Experimental custom-element wrapper. P3 — do not treat as a Stable API.
 * Two non-React consumer pilots must pass before this package is promoted.
 */
export class CsButton extends HTMLElement {
  connectedCallback() {
    const shadow = this.shadowRoot || this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<button type="button" class="cs-button" part="button"><slot></slot></button>`;
  }
}

export function defineCyberSkillElements() {
  if (typeof customElements === "undefined") return false;
  if (!customElements.get("cs-button")) customElements.define("cs-button", CsButton);
  return true;
}
