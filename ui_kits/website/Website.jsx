const { useState, useRef, useEffect } = React;

function I({ name, size = 20, stroke = 1.9 }) {
  const p = {
    sparkle: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z",
    chat: "M4 5h16v11H8l-4 4z",
    check: "M4 12.5l5 5 11-11",
    "arrow-right": "M5 12h14M13 6l6 6-6 6",
    close: "M6 6l12 12M18 6L6 18",
    sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4",
    moon: "M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z",
  }[name];
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={p} /></svg>;
}

function Chat({ t, seed, onClose }) {
  const [msgs, setMsgs] = useState([{ who: "bot", text: t.genie.greeting }]);
  const [val, setVal] = useState("");
  const bodyRef = useRef(null);
  useEffect(() => { if (seed) send(seed); }, []);
  useEffect(() => { const b = bodyRef.current; if (b) b.scrollTop = b.scrollHeight; }, [msgs]);
  function send(text) {
    const m = (text || "").trim(); if (!m) return;
    setMsgs((cur) => [...cur, { who: "me", text: m }]);
    setVal("");
    setTimeout(() => setMsgs((cur) => [...cur, { who: "bot", text: "A wish worth granting. I’ll hand it to the team — first, what should I call you?" }]), 500);
  }
  return (
    <div className="chat">
      <div className="chat-h">
        <img src="../../assets/lumi-poster.webp" alt="" />
        <b>{t.genie.title}</b>
        <button onClick={onClose} aria-label="Close chat"><I name="close" size={18} /></button>
      </div>
      <div className="chat-b" ref={bodyRef}>
        {msgs.map((m, i) => <div key={i} className={"msg " + m.who}>{m.text}</div>)}
        {msgs.length === 1 && (
          <div className="chips">{t.genie.chips.map((c) => <button key={c} onClick={() => send(c)}>{c}</button>)}</div>
        )}
      </div>
      <div className="chat-f">
        <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(val)} placeholder={t.genie.placeholder} />
        <button onClick={() => send(val)}>{t.genie.send}</button>
      </div>
    </div>
  );
}

function Website() {
  const [loc, setLoc] = useState("en");
  const [dark, setDark] = useState(false);
  const [chat, setChat] = useState(false);
  const [seed, setSeed] = useState("");
  const [wish, setWish] = useState("");
  const [sent, setSent] = useState(false);
  const t = window.SITE_COPY[loc];

  function openChat(s) { setSeed(s || ""); setChat(true); }

  return (
    <div className="site" data-theme={dark ? "dark" : undefined}>
      <header className="hdr cs-surface-light">
        <div className="container hdr-in">
          <a className="brand" href="#top"><img src="../../assets/logo-mark.svg" alt="" />CyberSkill</a>
          <nav className="nav">{t.nav.map((n, i) => <a key={i} href={"#" + ["services","work","process","careers","contact"][i]}>{n}</a>)}</nav>
          <div className="hdr-side">
            <button className="mini" onClick={() => setLoc(loc === "en" ? "vi" : "en")}>{t.langLabel}</button>
            <button className="mini icon" onClick={() => setDark(!dark)} aria-label="Toggle theme"><I name={dark ? "sun" : "moon"} size={18} /></button>
            <button className="mini" style={{ background: "var(--cs-color-brand-umber)", color: "#fff", borderColor: "transparent" }} onClick={() => openChat("")}>{t.talk}</button>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="container hero-in">
          <div>
            <div className="eyebrow">{t.eyebrow}</div>
            <h1>{t.slogan}</h1>
            <div className="vn">{t.sub}</div>
            <p className="lead">{t.lead}</p>
            <div className="wish">
              <input value={wish} onChange={(e) => setWish(e.target.value)} onKeyDown={(e) => e.key === "Enter" && openChat(wish)} placeholder={t.wishPlaceholder} aria-label={t.wishPlaceholder} />
              <button className="btn-gold" onClick={() => openChat(wish)}><I name="sparkle" size={18} />{t.wishCta}</button>
              <button className="btn-ghost-light" onClick={() => openChat("")}>{t.talk}</button>
            </div>
          </div>
          <div className="hero-art"><img src="../../assets/lumi-poster.webp" alt="Lumi, the golden genie" /></div>
        </div>
      </section>
      <div className="marq"><div className="container marq-in">{t.marquee.map((m, i) => <React.Fragment key={i}>{i > 0 && <b>·</b>}<span>{m}</span></React.Fragment>)}</div></div>

      <section className="sec" id="services">
        <div className="container">
          <div className="eyebrow">{t.nav[0]}</div>
          <h2>{t.servicesTitle}</h2>
          <p className="sec-lead">{t.servicesLead}</p>
          <div className="svc-grid">
            {t.services.map((s, i) => (
              <article className="svc cs-surface-standard" key={i}>
                <div className="svc-ic"><I name={s.icon} /></div>
                <h3>{s.t}</h3><p>{s.s}</p>
                <ul>{s.o.map((o) => <li key={o}>{o}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-alt" id="process">
        <div className="container">
          <div className="eyebrow">{t.nav[2]}</div>
          <h2>{t.processTitle}</h2>
          <p className="sec-lead">{t.processLead}</p>
          <div className="steps">
            {t.steps.map((s) => (
              <div className="step" key={s.n}><span className="n">{s.n}</span><h3>{s.t}</h3><p>{s.s}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="careers">
        <div className="container">
          <div className="band">
            <div><h2>{t.careersTitle}</h2><p>{t.careersLead}</p></div>
            <button className="btn-gold" onClick={() => openChat("")}>{t.careersCta}<I name="arrow-right" size={18} /></button>
          </div>
        </div>
      </section>

      <section className="sec sec-alt" id="contact">
        <div className="container contact-grid">
          <div>
            <div className="eyebrow">{t.nav[4]}</div>
            <h2>{t.contactTitle}</h2>
            <p className="sec-lead" style={{ marginBottom: 16 }}>{t.contactLead}</p>
            <p className="trust"><I name="check" size={16} />{t.form.trust}</p>
          </div>
          {sent ? (
            <div className="sent"><I name="check" size={18} /> {loc === "vi" ? "Đã nhận được lời nhắn. Cảm ơn bạn!" : "Message received. Thank you!"}</div>
          ) : (
            <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <label className="cs-field"><span className="cs-field__label">{t.form.name}</span><input className="cs-field__control" required /></label>
              <label className="cs-field"><span className="cs-field__label">{t.form.email}</span><input className="cs-field__control" type="email" required /></label>
              <label className="cs-field"><span className="cs-field__label">{t.form.company} <span className="muted" style={{ fontWeight: 400, color: "var(--cs-color-text-muted)" }}>· {t.form.optional}</span></span><input className="cs-field__control" /></label>
              <label className="cs-field"><span className="cs-field__label">{t.form.message}</span><textarea className="cs-field__control" rows="3" /></label>
              <div><button type="submit" className="btn-gold">{t.form.submit}<I name="arrow-right" size={18} /></button></div>
            </form>
          )}
        </div>
      </section>

      <footer className="ft">
        <div className="container ft-in">
          <a className="brand" href="#top"><img src="../../assets/logo-mark.svg" alt="" />CyberSkill</a>
          <div className="ft-links">{t.footerLinks.map((l) => <a key={l} href="#top">{l}</a>)}</div>
          <small>© 2026 CyberSkill · {t.footerRights} · Saigon</small>
        </div>
      </footer>

      {!chat && <button className="fab" onClick={() => openChat("")}><img src="../../assets/lumi-poster.webp" alt="" />{t.talk}</button>}
      {chat && <Chat t={t} seed={seed} onClose={() => setChat(false)} />}
    </div>
  );
}

window.Website = Website;
