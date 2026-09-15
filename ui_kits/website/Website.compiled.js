(() => {
  const { useState, useRef, useEffect } = React;
  function I({ name, size = 20, stroke = 1.9 }) {
    const p = {
      sparkle: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z",
      chat: "M4 5h16v11H8l-4 4z",
      check: "M4 12.5l5 5 11-11",
      "arrow-right": "M5 12h14M13 6l6 6-6 6",
      close: "M6 6l12 12M18 6L6 18",
      sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4",
      moon: "M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z"
    }[name];
    return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: p }));
  }
  function Chat({ t, seed, onClose }) {
    const [msgs, setMsgs] = useState([{ who: "bot", text: t.genie.greeting }]);
    const [val, setVal] = useState("");
    const bodyRef = useRef(null);
    useEffect(() => {
      if (seed) send(seed);
    }, []);
    useEffect(() => {
      const b = bodyRef.current;
      if (b) b.scrollTop = b.scrollHeight;
    }, [msgs]);
    function send(text) {
      const m = (text || "").trim();
      if (!m) return;
      setMsgs((cur) => [...cur, { who: "me", text: m }]);
      setVal("");
      setTimeout(() => setMsgs((cur) => [...cur, { who: "bot", text: "A wish worth granting. I\u2019ll hand it to the team \u2014 first, what should I call you?" }]), 500);
    }
    return /* @__PURE__ */ React.createElement("div", { className: "chat" }, /* @__PURE__ */ React.createElement("div", { className: "chat-h" }, /* @__PURE__ */ React.createElement("img", { src: "../../assets/lumi-poster.webp", alt: "" }), /* @__PURE__ */ React.createElement("b", null, t.genie.title), /* @__PURE__ */ React.createElement("button", { onClick: onClose, "aria-label": "Close chat" }, /* @__PURE__ */ React.createElement(I, { name: "close", size: 18 }))), /* @__PURE__ */ React.createElement("div", { className: "chat-b", ref: bodyRef }, msgs.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "msg " + m.who }, m.text)), msgs.length === 1 && /* @__PURE__ */ React.createElement("div", { className: "chips" }, t.genie.chips.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, onClick: () => send(c) }, c)))), /* @__PURE__ */ React.createElement("div", { className: "chat-f" }, /* @__PURE__ */ React.createElement("input", { value: val, onChange: (e) => setVal(e.target.value), onKeyDown: (e) => e.key === "Enter" && send(val), placeholder: t.genie.placeholder }), /* @__PURE__ */ React.createElement("button", { onClick: () => send(val) }, t.genie.send)));
  }
  function Website() {
    const [loc, setLoc] = useState("en");
    const [dark, setDark] = useState(false);
    const [chat, setChat] = useState(false);
    const [seed, setSeed] = useState("");
    const [wish, setWish] = useState("");
    const [sent, setSent] = useState(false);
    const [fabVisible, setFabVisible] = useState(false);
    const t = window.SITE_COPY[loc];
    function openChat(s) {
      setSeed(s || "");
      setChat(true);
    }
    useEffect(() => {
      const sync = () => setFabVisible(window.scrollY > 140);
      sync();
      window.addEventListener("scroll", sync, { passive: true });
      return () => window.removeEventListener("scroll", sync);
    }, []);
    return /* @__PURE__ */ React.createElement("div", { className: "site", "data-theme": dark ? "dark" : void 0 }, /* @__PURE__ */ React.createElement("a", { className: "cs-skip", href: "#main" }, loc === "vi" ? "B\u1ECF qua \u0111\u1EBFn n\u1ED9i dung" : "Skip to content"), /* @__PURE__ */ React.createElement("header", { className: "hdr cs-surface-light" }, /* @__PURE__ */ React.createElement("div", { className: "container hdr-in" }, /* @__PURE__ */ React.createElement("a", { className: "brand", href: "#top" }, /* @__PURE__ */ React.createElement("img", { src: "../../assets/logo-mark.svg", alt: "" }), "CyberSkill"), /* @__PURE__ */ React.createElement("nav", { className: "nav" }, t.nav.map((n, i) => /* @__PURE__ */ React.createElement("a", { key: i, href: "#" + ["services", "work", "process", "careers", "contact"][i] }, n))), /* @__PURE__ */ React.createElement("div", { className: "hdr-side" }, /* @__PURE__ */ React.createElement("button", { className: "mini", onClick: () => setLoc(loc === "en" ? "vi" : "en") }, t.langLabel), /* @__PURE__ */ React.createElement("button", { className: "mini icon", onClick: () => setDark(!dark), "aria-label": "Toggle theme" }, /* @__PURE__ */ React.createElement(I, { name: dark ? "sun" : "moon", size: 18 })), /* @__PURE__ */ React.createElement("button", { className: "mini", style: { background: "var(--cs-color-brand-umber)", color: "var(--cs-color-text-inverse,#fff)", borderColor: "transparent" }, onClick: () => openChat("") }, t.talk)))), /* @__PURE__ */ React.createElement("main", { id: "main" }, /* @__PURE__ */ React.createElement("section", { className: "hero", id: "top" }, /* @__PURE__ */ React.createElement("div", { className: "container hero-in" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, t.eyebrow), /* @__PURE__ */ React.createElement("h1", null, t.slogan), /* @__PURE__ */ React.createElement("div", { className: "vn" }, t.sub), /* @__PURE__ */ React.createElement("p", { className: "lead" }, t.lead), /* @__PURE__ */ React.createElement("div", { className: "wish" }, /* @__PURE__ */ React.createElement("input", { value: wish, onChange: (e) => setWish(e.target.value), onKeyDown: (e) => e.key === "Enter" && openChat(wish), placeholder: t.wishPlaceholder, "aria-label": t.wishPlaceholder }), /* @__PURE__ */ React.createElement("button", { className: "btn-gold", onClick: () => openChat(wish) }, /* @__PURE__ */ React.createElement(I, { name: "sparkle", size: 18 }), t.wishCta))), /* @__PURE__ */ React.createElement("div", { className: "hero-art" }, /* @__PURE__ */ React.createElement("img", { src: "../../assets/lumi-poster.webp", alt: "Lumi, the golden genie" })))), /* @__PURE__ */ React.createElement("div", { className: "marq" }, /* @__PURE__ */ React.createElement("div", { className: "container marq-in" }, t.marquee.map((m, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, i > 0 && /* @__PURE__ */ React.createElement("b", null, "\xB7"), /* @__PURE__ */ React.createElement("span", null, m))))), /* @__PURE__ */ React.createElement("section", { className: "sec", id: "services" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, t.nav[0]), /* @__PURE__ */ React.createElement("h2", null, t.servicesTitle), /* @__PURE__ */ React.createElement("p", { className: "sec-lead" }, t.servicesLead), /* @__PURE__ */ React.createElement("div", { className: "svc-grid" }, t.services.map((s, i) => /* @__PURE__ */ React.createElement("article", { className: "svc cs-surface-standard", key: i }, /* @__PURE__ */ React.createElement("div", { className: "svc-ic" }, /* @__PURE__ */ React.createElement(I, { name: s.icon })), /* @__PURE__ */ React.createElement("h3", null, s.t), /* @__PURE__ */ React.createElement("p", null, s.s), /* @__PURE__ */ React.createElement("ul", null, s.o.map((o) => /* @__PURE__ */ React.createElement("li", { key: o }, o)))))))), /* @__PURE__ */ React.createElement("section", { className: "sec sec-alt", id: "process" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, t.nav[2]), /* @__PURE__ */ React.createElement("h2", null, t.processTitle), /* @__PURE__ */ React.createElement("p", { className: "sec-lead" }, t.processLead), /* @__PURE__ */ React.createElement("div", { className: "steps" }, t.steps.map((s) => /* @__PURE__ */ React.createElement("div", { className: "step", key: s.n }, /* @__PURE__ */ React.createElement("span", { className: "n" }, s.n), /* @__PURE__ */ React.createElement("h3", null, s.t), /* @__PURE__ */ React.createElement("p", null, s.s)))))), /* @__PURE__ */ React.createElement("section", { className: "sec", id: "careers" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "band" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, t.careersTitle), /* @__PURE__ */ React.createElement("p", null, t.careersLead)), /* @__PURE__ */ React.createElement("button", { className: "btn-gold", onClick: () => openChat("") }, t.careersCta, /* @__PURE__ */ React.createElement(I, { name: "arrow-right", size: 18 }))))), /* @__PURE__ */ React.createElement("section", { className: "sec sec-alt", id: "contact" }, /* @__PURE__ */ React.createElement("div", { className: "container contact-grid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, t.nav[4]), /* @__PURE__ */ React.createElement("h2", null, t.contactTitle), /* @__PURE__ */ React.createElement("p", { className: "sec-lead", style: { marginBottom: 16 } }, t.contactLead), /* @__PURE__ */ React.createElement("p", { className: "trust" }, /* @__PURE__ */ React.createElement(I, { name: "check", size: 16 }), t.form.trust)), sent ? /* @__PURE__ */ React.createElement("div", { className: "sent" }, /* @__PURE__ */ React.createElement(I, { name: "check", size: 18 }), " ", loc === "vi" ? "\u0110\xE3 nh\u1EADn \u0111\u01B0\u1EE3c l\u1EDDi nh\u1EAFn. C\u1EA3m \u01A1n b\u1EA1n!" : "Message received. Thank you!") : /* @__PURE__ */ React.createElement("form", { className: "form", onSubmit: (e) => {
      e.preventDefault();
      setSent(true);
    } }, /* @__PURE__ */ React.createElement("label", { className: "cs-field" }, /* @__PURE__ */ React.createElement("span", { className: "cs-field__label" }, t.form.name), /* @__PURE__ */ React.createElement("input", { className: "cs-field__control", required: true })), /* @__PURE__ */ React.createElement("label", { className: "cs-field" }, /* @__PURE__ */ React.createElement("span", { className: "cs-field__label" }, t.form.email), /* @__PURE__ */ React.createElement("input", { className: "cs-field__control", type: "email", required: true })), /* @__PURE__ */ React.createElement("label", { className: "cs-field" }, /* @__PURE__ */ React.createElement("span", { className: "cs-field__label" }, t.form.company, " ", /* @__PURE__ */ React.createElement("span", { className: "muted", style: { fontWeight: 400, color: "var(--cs-color-text-muted)" } }, "\xB7 ", t.form.optional)), /* @__PURE__ */ React.createElement("input", { className: "cs-field__control" })), /* @__PURE__ */ React.createElement("label", { className: "cs-field" }, /* @__PURE__ */ React.createElement("span", { className: "cs-field__label" }, t.form.message), /* @__PURE__ */ React.createElement("textarea", { className: "cs-field__control", rows: "3" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-gold" }, t.form.submit, /* @__PURE__ */ React.createElement(I, { name: "arrow-right", size: 18 }))))))), /* @__PURE__ */ React.createElement("footer", { className: "ft" }, /* @__PURE__ */ React.createElement("div", { className: "container ft-in" }, /* @__PURE__ */ React.createElement("a", { className: "brand", href: "#top" }, /* @__PURE__ */ React.createElement("img", { src: "../../assets/logo-mark.svg", alt: "" }), "CyberSkill"), /* @__PURE__ */ React.createElement("div", { className: "ft-links" }, t.footerLinks.map((l) => /* @__PURE__ */ React.createElement("a", { key: l, href: "#top" }, l))), /* @__PURE__ */ React.createElement("small", null, "\xA9 2026 CyberSkill \xB7 ", t.footerRights, " \xB7 Saigon"))), !chat && /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "fab",
        type: "button",
        "data-fab-deferred": "1",
        onClick: () => openChat(""),
        style: { opacity: fabVisible ? 1 : 0, pointerEvents: fabVisible ? "auto" : "none", transition: "opacity 160ms ease" },
        "aria-hidden": !fabVisible,
        tabIndex: fabVisible ? 0 : -1
      },
      /* @__PURE__ */ React.createElement("img", { src: "../../assets/lumi-poster.webp", alt: "" }),
      t.talk
    ), chat && /* @__PURE__ */ React.createElement(Chat, { t, seed, onClose: () => setChat(false) }));
  }
  window.Website = Website;
})();
