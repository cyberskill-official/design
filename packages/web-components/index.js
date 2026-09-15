/**
 * Demand-led custom elements. Promote past experimental after the two
 * non-React pilots in apps/wc-pilot-* stay green.
 */
function upgradeButton(el) {
  const shadow = el.shadowRoot || el.attachShadow({ mode: "open" });
  const type = el.getAttribute("type") || "button";
  const disabled = el.hasAttribute("disabled");
  shadow.innerHTML = `<button type="${type}" class="cs-button" part="button"${disabled ? " disabled" : ""}><slot></slot></button>`;
}

export class CsButton extends HTMLElement {
  static get observedAttributes() {
    return ["disabled", "type"];
  }
  connectedCallback() {
    upgradeButton(this);
  }
  attributeChangedCallback() {
    if (this.isConnected) upgradeButton(this);
  }
}

export class CsTextField extends HTMLElement {
  connectedCallback() {
    const shadow = this.shadowRoot || this.attachShadow({ mode: "open" });
    const label = this.getAttribute("label") || "Value";
    const name = this.getAttribute("name") || "field";
    shadow.innerHTML = `<label class="cs-field"><span class="cs-field__label">${label}</span><input class="cs-field__control" name="${name}" part="input" /></label>`;
  }
  get value() {
    const input = this.shadowRoot && this.shadowRoot.querySelector("input");
    return input ? input.value : "";
  }
}

export function defineCyberSkillElements() {
  if (typeof customElements === "undefined") return false;
  if (!customElements.get("cs-button")) customElements.define("cs-button", CsButton);
  if (!customElements.get("cs-text-field")) customElements.define("cs-text-field", CsTextField);
  return true;
}
