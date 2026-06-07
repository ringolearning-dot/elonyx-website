/* =====================================================
   Elonyx — Site chrome (Header, Footer, Chat) + Home page
   ===================================================== */

const { useState: useStateS, useEffect: useEffectS, useRef: useRefS, useMemo: useMemoS } = React;

// ---------- HEADER ----------
const NAV = [
  { key: "home",     label: "Home",     href: "#/" },
  { key: "products", label: "Products", href: "#/products" },
  { key: "work",     label: "Work",     href: "#/work" },
  { key: "about",    label: "About",    href: "#/about" },
  { key: "pricing",  label: "Pricing",  href: "#/pricing" },
  { key: "blog",     label: "Blog",     href: "#/blog" },
  { key: "careers",  label: "Careers",  href: "#/careers" },
  { key: "contact",  label: "Contact",  href: "#/contact" },
];

const SiteHeader = ({ route, theme, onTheme }) => {
  const [open, setOpen] = useStateS(false);
  useEffectS(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffectS(() => { setOpen(false); }, [route]);
  return (
    <header className="site-header">
      <div className="container-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="#/" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Wordmark/>
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: 22 }} className="header-nav">
          {NAV.map((n) => (
            <a key={n.key}
              href={n.href}
              className={"nav-link " + (route.startsWith(n.href) && (n.href !== "#/" || route === "#/") ? "active" : "")}
            >{n.label}</a>
          ))}
        </nav>
        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={onTheme} aria-label="Toggle theme" title="Toggle theme">
            <Icon name={theme === "dark" ? "sun" : "moon"} size={15}/>
          </button>
          <a href="#/contact" className="btn btn-primary btn-sm">
            Start a project <Icon name="arrow-right" size={14}/>
          </a>
          <button className="btn btn-ghost btn-sm mobile-menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
            <Icon name={open ? "close" : "menu"} size={18}/>
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-nav">
          <button className="btn btn-ghost btn-sm mobile-nav-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <Icon name="close" size={20}/>
          </button>
          {NAV.map((n) => (
            <a key={n.key} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
          ))}
          <a href="#/contact" className="btn btn-primary btn-lg" style={{ marginTop: 16, justifyContent: "center" }} onClick={() => setOpen(false)}>
            Start a project <Icon name="arrow-right" size={14}/>
          </a>
        </div>
      )}
    </header>
  );
};

// ---------- FOOTER ----------
const SiteFooter = () => (
  <footer style={{
    borderTop: "1px solid var(--border)",
    background: "var(--bg-2)",
    paddingTop: 72,
    paddingBottom: 32,
    marginTop: 120,
  }}>
    <div className="container-wide">
      <div className="footer-grid" style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
        gap: 48,
        marginBottom: 56,
      }}>
        <div>
          <Wordmark size={18}/>
          <p style={{ marginTop: 16, color: "var(--text-dim)", fontSize: 14, maxWidth: 36 + "ch" }}>
            Elonyx Technologies — Software, AI, and mobile development studio based in San Jose, California.
          </p>
          <div className="t-mono" style={{ marginTop: 16, color: "var(--text-muted)" }}>
            <div>San Jose, CA</div>
            <div>elonyxtechnologies@gmail.com</div>
          </div>
        </div>
        <FooterCol title="Company" links={[
          ["About", "#/about"], ["Work", "#/work"], ["Careers", "#/careers"], ["Press kit", "#/about"],
        ]}/>
        <FooterCol title="Build" links={[
          ["Products", "#/products"], ["Pricing", "#/pricing"], ["Docs", "#/docs"], ["Blog", "#/blog"],
        ]}/>
        <FooterCol title="Trust" links={[
          ["Security", "#/docs"], ["Privacy", "#/docs"], ["Terms", "#/docs"], ["Status", "#/docs"],
        ]}/>
      </div>
      <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <div className="t-mono" style={{ color: "var(--text-muted)" }}>
          © 2026 Elonyx Technologies · All rights reserved.
        </div>
        <div className="t-mono" style={{ color: "var(--text-muted)", display: "flex", gap: 16 }}>
          <span className="status live">elonyxtechnologies.com</span>
        </div>
      </div>
    </div>
  </footer>
);

const FooterCol = ({ title, links }) => (
  <div>
    <div className="t-eyebrow" style={{ marginBottom: 14 }}>{title}</div>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {links.map(([l, h]) => (
        <li key={l}><a className="nav-link" style={{ padding: 0, fontSize: 14 }} href={h}>{l}</a></li>
      ))}
    </ul>
  </div>
);

// ---------- CHAT WIDGET ----------
const SYSTEM_PROMPT = `You are Elonyx's assistant — a concise, friendly guide for Elonyx Technologies, a software development studio based in San Jose, CA. We build AI-powered mobile and web apps. Our flagship product is Y-NO, a smart inventory app. Services: Mobile Apps, Web Apps, AI Integration, Product Strategy. Pricing: Starter ($5k), Build ($15k), Scale (custom). Contact: elonyxtechnologies@gmail.com. Keep replies under 80 words, conversational, no markdown headings. End with one question or one specific next step.`;

const ChatWidget = () => {
  const [open, setOpen] = useStateS(false);
  const [input, setInput] = useStateS("");
  const [busy, setBusy] = useStateS(false);
  const [msgs, setMsgs] = useStateS([
    { role: "bot", text: "Hi — I'm Elonyx's assistant. Ask me about our services, projects, or pricing. How can I help?" },
  ]);
  const scrollRef = useRefS(null);
  useEffectS(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, busy, open]);

  const ask = async (q) => {
    if (!q.trim() || busy) return;
    const next = [...msgs, { role: "user", text: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const history = next.filter(m => m.role !== "system");
      const messages = [
        ...history.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
      ];
      const text = await window.claude.complete({
        system: SYSTEM_PROMPT,
        messages,
      });
      setMsgs([...next, { role: "bot", text }]);
    } catch (e) {
      setMsgs([...next, { role: "bot", text: "Hmm, I couldn't reach my brain. Try again in a moment, or email us at elonyxtechnologies@gmail.com." }]);
    } finally { setBusy(false); }
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Open chat">
        {open ? <Icon name="close" size={20}/> : <Icon name="chat" size={20}/>}
      </button>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Elonyx assistant">
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(140deg, var(--accent-bright), var(--accent))",
                display: "grid", placeItems: "center", color: "white",
              }}><Icon name="spark" size={14}/></div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Elonyx Assistant</div>
                <div className="status live" style={{ fontSize: 10 }}>Live · Claude Haiku</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)} aria-label="Close">
              <Icon name="close" size={14}/>
            </button>
          </div>
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "chat-msg-user" : "chat-msg-bot"}>{m.text}</div>
            ))}
            {busy && (
              <div className="chat-msg-bot" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                <Dots/>
              </div>
            )}
          </div>
          <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              className="input"
              placeholder="Ask about our work, pricing, anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") ask(input); }}
            />
            <button className="btn btn-primary" onClick={() => ask(input)} disabled={busy || !input.trim()}>
              <Icon name="send" size={14}/>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Dots = () => (
  <span style={{ display: "inline-flex", gap: 3 }}>
    <Dot d={0}/><Dot d={150}/><Dot d={300}/>
  </span>
);
const Dot = ({ d }) => (
  <span style={{
    width: 6, height: 6, borderRadius: "50%", background: "var(--text-dim)",
    animation: `blink 1.2s ${d}ms infinite`,
    display: "inline-block",
  }}/>
);

// ---------- HOME PAGE ----------
const HomePage = () => (
  <main data-screen-label="01 Home">
    <Hero/>
    <LogoStrip/>
    <ServicesSection/>
    <FeaturedWork/>
    <AgentDemo/>
    <ProcessTimeline/>
    <Stats/>
    <Testimonial/>
    <CTASection/>
  </main>
);

// ----- HERO -----
const Hero = () => {
  const ref = useRefS(null);
  const [mouse, setMouse] = useStateS({ x: 0.5, y: 0.5 });
  useEffectS(() => {
    const onMove = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden", paddingTop: 80, paddingBottom: 120 }}>
      <div className="bg-grid bg-grid-fade" style={{ position: "absolute", inset: 0 }}/>
      <div className="hero-orb" style={{
        top: `calc(${mouse.y * 30 - 15}% - 200px)`,
        left: `calc(${mouse.x * 30 + 35}% - 360px)`,
        transition: "all 0.4s var(--ease)",
      }}/>
      <div className="container" style={{ position: "relative" }}>
        <div className="t-eyebrow" style={{ marginBottom: 28 }}>
          <span className="dot"/>San Jose, CA · Elonyx Technologies
        </div>
        <h1 className="t-display" style={{
          fontSize: "clamp(56px, 9.5vw, 156px)",
          margin: 0,
          maxWidth: "14ch",
        }}>
          We turn <br/>
          <span style={{ position: "relative", display: "inline-block" }}>
            <span className="chrome-text">ideas</span>
          </span><br/>
          into <span className="accent" style={{ fontStyle: "italic", fontWeight: 400 }}>products</span> <br/>
          that ship.
        </h1>
        <div className="hero-cta" style={{ display: "flex", gap: 60, marginTop: 56, flexWrap: "wrap", alignItems: "flex-end" }}>
          <p style={{ maxWidth: "46ch", fontSize: 18, color: "var(--text-dim)", margin: 0 }}>
            Elonyx Technologies builds AI-powered mobile and web apps — from concept to launch. We move fast, ship clean, and solve <span style={{ color: "var(--text)" }}>real problems</span>.
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: 10 }}>
            <a href="#/contact" className="btn btn-primary btn-lg">Start a project<Icon name="arrow-right" size={15}/></a>
            <a href="#/work" className="btn btn-ghost btn-lg">See the work<Icon name="arrow-up-right" size={15}/></a>
          </div>
        </div>
      </div>

      <div className="container hero-stats" style={{ marginTop: 80, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
        {[
          { l: "Projects shipped", v: "3+", s: "And counting" },
          { l: "Platforms", v: "iOS · Android · Web", s: "Cross-platform" },
          { l: "AI-powered", v: "Yes", s: "Vision · Voice · LLM" },
          { l: "Based in", v: "San Jose", s: "California, USA" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--surface)", padding: "24px 28px" }}>
            <div className="t-eyebrow" style={{ marginBottom: 14 }}>{s.l}</div>
            <div className="t-display" style={{ fontSize: 44 }}>{s.v}</div>
            <div className="t-mono" style={{ color: "var(--text-muted)", marginTop: 6 }}>{s.s}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Stamp = ({ text, style }) => (
  <span className="hero-stamp chrome-bar" style={{
    fontSize: 12,
    padding: "4px 10px",
    transform: "rotate(-3deg)",
    display: "inline-block",
    position: "absolute",
    top: "-14px",
    left: "calc(100% + 14px)",
    whiteSpace: "nowrap",
    ...style,
  }}>{text}</span>
);

// ----- LOGO STRIP -----
const LogoStrip = () => (
  <section style={{ padding: "32px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
    <div className="container" style={{ display: "flex", alignItems: "center", gap: 32 }}>
      <div className="t-eyebrow" style={{ minWidth: 140 }}><span className="dot"/>Built with</div>
      <div style={{ overflow: "hidden", flex: 1, position: "relative" }}>
        <div className="marquee-track" style={{ alignItems: "center", color: "var(--text-muted)" }}>
          {[..."REACT · TYPESCRIPT · NODE.JS · POSTGRES · CAPACITOR · GEMINI · STRIPE · EXPRESS · TAILWIND · GOOGLE CLOUD · AI VISION · VOICE AI".split(" · "),
            ..."REACT · TYPESCRIPT · NODE.JS · POSTGRES · CAPACITOR · GEMINI · STRIPE · EXPRESS · TAILWIND · GOOGLE CLOUD · AI VISION · VOICE AI".split(" · ")].map((b, i) => (
            <span key={i} className="t-display" style={{ fontSize: 22, opacity: 0.6, whiteSpace: "nowrap" }}>{b}</span>
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, var(--bg) 0%, transparent 8%, transparent 92%, var(--bg) 100%)", pointerEvents: "none" }}/>
      </div>
    </div>
  </section>
);

// ----- SERVICES -----
const ServicesSection = () => (
  <section style={{ padding: "120px 0" }}>
    <div className="container">
      <SectionHead
        eyebrow="What we do"
        title={<>Full-stack development.<br/>From idea to app store.</>}
        sub="We handle everything — design, frontend, backend, AI, and deployment. One team, no hand-offs, no surprises."
      />
      <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
        {SERVICES.map((s, i) => (
          <Reveal key={s.code} delay={i * 80}>
            <div className="card card-pad" style={{ position: "relative", height: "100%", padding: 32, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, padding: "16px 18px" }}>
                <Icon name={["cpu","phone","globe","layers"][i]} size={20} style={{ color: "var(--accent-bright)" }}/>
              </div>
              <div className="t-mono" style={{ color: "var(--accent-bright)", marginBottom: 12 }}>— {s.code}</div>
              <h3 className="t-display" style={{ fontSize: 32, margin: 0 }}>{s.name}</h3>
              <p style={{ color: "var(--text-dim)", marginTop: 12, marginBottom: 20 }}>{s.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {s.bullets.map((b) => (
                  <li key={b} style={{ fontSize: 13, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 4, height: 4, background: "var(--accent)", borderRadius: 50 }}/> {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ----- FEATURED WORK -----
const FeaturedWork = () => {
  const featured = CASE_STUDIES.slice(0, 4);
  return (
    <section style={{ padding: "120px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, gap: 24 }}>
          <SectionHead
            eyebrow="Selected work"
            title={<>Things we shipped.<br/>Products in production.</>}
          />
          <a href="#/work" className="btn btn-ghost">All projects<Icon name="arrow-right" size={14}/></a>
        </div>
        <div className="work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {featured.map((c, i) => <WorkCard key={c.id} c={c} large={i === 0}/>)}
        </div>
      </div>
    </section>
  );
};

const WorkCard = ({ c, large = false }) => (
  <Reveal>
    <a href={`#/work/${c.id}`} className="card" style={{
      display: "block",
      padding: 0,
      overflow: "hidden",
      gridColumn: large ? "span 2" : "auto",
      position: "relative",
    }}>
      <div style={{
        height: large ? 320 : 220,
        background: `
          radial-gradient(circle at 80% 20%, color-mix(in oklab, ${c.color} 35%, transparent), transparent 60%),
          linear-gradient(180deg, var(--surface-2), var(--surface))
        `,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 80% 20%, black 30%, transparent 75%)",
        }}/>
        <div style={{ position: "absolute", top: 20, left: 20, display: "flex", gap: 8 }}>
          <span className="pill"><span className="dot" style={{ background: c.color }}/>{c.type}</span>
          <span className="pill">{c.year}</span>
        </div>
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h3 className="t-display" style={{ fontSize: large ? 56 : 36, margin: 0 }}>{c.name}</h3>
          <Icon name="arrow-up-right" size={22} style={{ color: "var(--text-dim)" }}/>
        </div>
      </div>
      <div style={{ padding: 24, borderTop: "1px solid var(--border)" }}>
        <div className="t-mono" style={{ color: "var(--text-muted)", marginBottom: 8 }}>{c.industry}</div>
        <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 15 }}>{c.summary}</p>
        <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
          {c.metrics.slice(0, large ? 3 : 2).map((m) => (
            <div key={m.k}>
              <div className="t-display" style={{ fontSize: 22 }}>{m.v}</div>
              <div className="t-mono" style={{ color: "var(--text-muted)", marginTop: 2 }}>{m.k}</div>
            </div>
          ))}
        </div>
      </div>
    </a>
  </Reveal>
);

// ----- AGENT DEMO -----
const AgentDemo = () => {
  const [step, setStep] = useStateS(0);
  const steps = [
    { t: "Capture image", c: "Camera frame · item detection" },
    { t: "AI Vision analysis", c: "Identifying objects, labels, categories…" },
    { t: "Voice transcription", c: "Processing speech-to-text input" },
    { t: "Database sync", c: "Saving to inventory · cross-device sync" },
    { t: "Notify user", c: "Push notification · item cataloged" },
  ];
  useEffectS(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % (steps.length + 1)), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ padding: "120px 0", borderTop: "1px solid var(--border)", position: "relative" }}>
      <div className="container">
        <div className="agent-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "center" }}>
          <div>
            <SectionHead
              eyebrow="AI that works"
              title="Smart features built into real products."
              sub="We integrate AI where it matters — camera-based scanning, voice commands, natural language search, and intelligent recommendations. Not gimmicks, real utility."
            />
            <div style={{ display: "flex", gap: 10 }}>
              <a href="#/products" className="btn btn-primary">See our services<Icon name="arrow-right" size={14}/></a>
              <a href="#/contact" className="btn btn-ghost">Get in touch<Icon name="external" size={14}/></a>
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="t-mono" style={{ color: "var(--text-dim)" }}>yno_scan · AI pipeline</div>
              <span className="status live">Processing</span>
            </div>
            <div style={{ padding: 20, fontFamily: "var(--font-mono)", fontSize: 13 }}>
              {steps.map((s, i) => (
                <AgentStep key={i} idx={i} t={s.t} c={s.c} state={step > i ? "done" : step === i ? "active" : "pending"}/>
              ))}
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", display: "flex", gap: 16 }}>
              <span>model · Gemini</span>
              <span>latency · 1.2s</span>
              <span>accuracy · high</span>
              <span style={{ marginLeft: "auto", color: "var(--accent-bright)" }}>● real-time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AgentStep = ({ idx, t, c, state }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: 14,
    padding: "10px 0",
    borderBottom: "1px dashed var(--border)",
    opacity: state === "pending" ? 0.4 : 1,
    transition: "opacity 0.3s",
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22,
      borderRadius: 50,
      background: state === "done" ? "var(--accent)" : state === "active" ? "transparent" : "var(--surface-2)",
      border: state === "active" ? "1px solid var(--accent)" : "1px solid var(--border)",
      color: "white",
    }}>
      {state === "done"
        ? <Icon name="check" size={12}/>
        : state === "active"
          ? <span className="blink" style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: 50 }}/>
          : <span style={{ color: "var(--text-muted)", fontSize: 10 }}>{idx + 1}</span>}
    </div>
    <div>
      <div style={{ color: "var(--text)" }}>{t}</div>
      <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>{c}</div>
    </div>
    <div className="t-mono" style={{ color: "var(--text-muted)", fontSize: 11 }}>
      {state === "active" ? "running…" : state === "done" ? `${(0.2 + idx * 0.4).toFixed(1)}s` : "—"}
    </div>
  </div>
);

// ----- PROCESS -----
const ProcessTimeline = () => {
  const phases = [
    { w: "Week 1",      t: "Discovery",  d: "We define the scope, architecture, and goals. You get a clear plan." },
    { w: "Weeks 2–3",   t: "Design",     d: "UI/UX wireframes and prototypes. You see it before we build it." },
    { w: "Weeks 4–8",   t: "Build",      d: "Full-stack development with weekly demos. Real progress, every week." },
    { w: "Weeks 9–10",  t: "Polish",     d: "Testing, performance, edge cases. We ship quality, not excuses." },
    { w: "Week 11+",    t: "Launch",     d: "App store submission, deployment, and ongoing support." },
  ];
  return (
    <section style={{ padding: "120px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <SectionHead eyebrow="How we work" title="A clear process. No guesswork."/>
        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
          {phases.map((p, i) => (
            <div key={i} style={{ background: "var(--surface)", padding: 28, minHeight: 240, position: "relative" }}>
              <div className="t-mono" style={{ color: "var(--accent-bright)", marginBottom: 28 }}>0{i + 1} / 05</div>
              <div className="t-mono" style={{ color: "var(--text-muted)" }}>{p.w}</div>
              <h4 className="t-display" style={{ fontSize: 24, marginTop: 6, marginBottom: 8 }}>{p.t}</h4>
              <p style={{ color: "var(--text-dim)", fontSize: 13, margin: 0 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ----- STATS -----
const Stats = () => (
  <section style={{ padding: "120px 0", borderTop: "1px solid var(--border)" }}>
    <div className="container stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
      <div>
        <div className="t-eyebrow" style={{ marginBottom: 16 }}><span className="dot"/>By the numbers</div>
        <h2 className="t-display" style={{ fontSize: 56, margin: 0, lineHeight: 1 }}>
          3+ <span style={{ color: "var(--text-dim)", fontSize: 32 }}>products shipped</span>
        </h2>
        <p style={{ color: "var(--text-dim)", marginTop: 16, maxWidth: "48ch" }}>
          Every product we build goes to production with real users. We measure success by what ships, not what gets pitched.
        </p>
        <div style={{ display: "flex", gap: 36, marginTop: 32 }}>
          <Mini v="3" l="platforms"/>
          <Mini v="AI" l="powered"/>
          <Mini v="24/7" l="uptime"/>
        </div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <Sparkline data={RUNS_SERIES} width={560} height={200}/>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span className="t-mono" style={{ color: "var(--text-muted)" }}>14 days ago</span>
          <span className="t-mono" style={{ color: "var(--text-muted)" }}>today</span>
        </div>
      </div>
    </div>
  </section>
);

const Mini = ({ v, l }) => (
  <div>
    <div className="t-display" style={{ fontSize: 30 }}>{v}</div>
    <div className="t-mono" style={{ color: "var(--text-muted)", marginTop: 4 }}>{l}</div>
  </div>
);

// ----- TESTIMONIAL -----
const Testimonial = () => (
  <section style={{ padding: "120px 0", borderTop: "1px solid var(--border)" }}>
    <div className="container" style={{ maxWidth: 1000 }}>
      <Reveal>
        <div className="t-eyebrow" style={{ marginBottom: 32 }}><span className="dot"/>Our philosophy</div>
        <p className="t-display" style={{ fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 1.15, margin: 0 }}>
          &ldquo;We don&apos;t just write code — we build products that <span className="accent">people actually use</span>.
          Every feature we ship solves a real problem. Every line of code
          earns its place.&rdquo;
        </p>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 32 }}>
          <Avatar initials="AT" accent/>
          <div>
            <div style={{ fontWeight: 600 }}>Anthony Tannoury</div>
            <div className="t-mono" style={{ color: "var(--text-muted)" }}>Co-Founder, Elonyx Technologies</div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ----- CTA -----
const CTASection = () => (
  <section style={{ padding: "120px 0" }}>
    <div className="container">
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--r-xl)",
        border: "1px solid var(--accent)",
        background: `
          radial-gradient(ellipse at 80% 20%, var(--accent-glow), transparent 60%),
          linear-gradient(180deg, var(--surface), var(--bg-2))
        `,
        padding: "80px 56px",
      }} className="cta-inner">
        <div className="bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.3 }}/>
        <div className="cta-flex" style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 32 }}>
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 18 }}><span className="dot"/>Free consultation · No obligations</div>
            <h2 className="t-display" style={{ fontSize: "clamp(40px, 6vw, 84px)", margin: 0, maxWidth: "14ch" }}>
              Have an <span className="chrome-text">idea</span>?<br/>
              Let's build it.
            </h2>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="#/contact" className="btn btn-primary btn-lg">Get in touch<Icon name="arrow-right" size={15}/></a>
            <a href="#/pricing" className="btn btn-ghost btn-lg">See pricing</a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

Object.assign(window, { SiteHeader, SiteFooter, ChatWidget, HomePage });
