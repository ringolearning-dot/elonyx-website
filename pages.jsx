/* =====================================================
   Elonyx — Public pages
   ===================================================== */

const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP, useRef: useRefP } = React;

// =====================================================
// PAGE: PRODUCTS
// =====================================================
const ProductsPage = () => (
  <main data-screen-label="02 Products">
    <PageHeader
      eyebrow="Services · 04"
      title={<>What we build for you.</>}
      sub="Four core services that we combine based on what your project needs. No unnecessary complexity."
    />

    <section style={{ padding: "60px 0 120px" }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
        {SERVICES.map((s, i) => (
          <ProductRow key={s.code} s={s} idx={i}/>
        ))}
      </div>
    </section>

    <section style={{ padding: "100px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <SectionHead eyebrow="The stack" title="What we use, and why."/>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { c: "Languages",  items: ["TypeScript", "JavaScript", "HTML/CSS", "SQL", "Python"] },
            { c: "Frameworks", items: ["React", "Node.js", "Express", "Capacitor", "Tailwind CSS"] },
            { c: "AI",         items: ["Google Gemini", "OpenAI", "Vision AI", "Speech-to-Text", "Whisper"] },
            { c: "Infra",      items: ["PostgreSQL", "Google Cloud", "Stripe", "Firebase", "Vercel"] },
          ].map((g) => (
            <div key={g.c} className="card card-pad">
              <div className="t-eyebrow" style={{ marginBottom: 14 }}>{g.c}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {g.items.map((it) => (
                  <li key={it} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, padding: "8px 0", borderBottom: "1px dashed var(--border)" }}>
                    <span>{it}</span>
                    <span style={{ width: 4, height: 4, background: "var(--accent)", borderRadius: 50 }}/>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    <CTASection/>
  </main>
);

const ProductRow = ({ s, idx }) => (
  <div style={{
    background: "var(--surface)",
    padding: "48px 36px",
    display: "grid",
    gridTemplateColumns: "120px 1fr 1.3fr 1fr",
    alignItems: "center",
    gap: 32,
  }}>
    <div className="t-mono" style={{ color: "var(--accent-bright)", fontSize: 14 }}>— {s.code}</div>
    <h3 className="t-display" style={{ fontSize: 40, margin: 0 }}>{s.name}</h3>
    <p style={{ color: "var(--text-dim)", margin: 0, fontSize: 15 }}>{s.desc}</p>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
      {s.bullets.map((b) => (
        <li key={b} style={{ fontSize: 13, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 4, height: 4, background: "var(--accent)", borderRadius: 50 }}/>{b}
        </li>
      ))}
    </ul>
  </div>
);

// =====================================================
// PAGE: WORK (filterable)
// =====================================================
const WorkPage = ({ route }) => {
  // Detail route: #/work/:id
  const id = route.startsWith("#/work/") ? route.replace("#/work/", "") : null;
  if (id) {
    const c = CASE_STUDIES.find((x) => x.id === id);
    if (!c) return <Missing back="#/work" label="Back to work"/>;
    return <CaseStudyDetail c={c}/>;
  }
  return <WorkIndex/>;
};

const WorkIndex = () => {
  const [filter, setFilter] = useStateP("All");
  const [view, setView] = useStateP("grid"); // grid | list
  const filtered = useMemoP(
    () => filter === "All" ? CASE_STUDIES : CASE_STUDIES.filter((c) => c.type === filter),
    [filter]
  );
  return (
    <main data-screen-label="03 Work">
      <PageHeader
        eyebrow="Work · Our projects"
        title="Built to ship. Built to last."
        sub="Every project below is in production with real users. We build things that work."
      />

      <section style={{ padding: "20px 0 80px" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Icon name="filter" size={14} style={{ color: "var(--text-muted)", marginRight: 6 }}/>
            {WORK_FILTERS.map((f) => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={"btn btn-sm " + (filter === f ? "btn-primary" : "btn-ghost")}
              >{f}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4, padding: 3, border: "1px solid var(--border)", borderRadius: "var(--r-sm)" }}>
            <button
              onClick={() => setView("grid")}
              className={"btn btn-sm " + (view === "grid" ? "btn-primary" : "btn-ghost")}
              style={{ border: "none", height: 28 }}>Grid</button>
            <button
              onClick={() => setView("list")}
              className={"btn btn-sm " + (view === "list" ? "btn-primary" : "btn-ghost")}
              style={{ border: "none", height: 28 }}>List</button>
          </div>
        </div>

        <div className="container">
          {view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
              {filtered.map((c) => <WorkCard key={c.id} c={c}/>)}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
              {filtered.map((c, i) => <WorkRow key={c.id} c={c} i={i}/>)}
            </div>
          )}
          {filtered.length === 0 && (
            <div className="card card-pad" style={{ textAlign: "center", padding: 80 }}>
              <p style={{ color: "var(--text-muted)" }}>No projects in this category — yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const WorkRow = ({ c, i }) => (
  <a href={`#/work/${c.id}`} style={{
    background: "var(--surface)",
    padding: "28px 32px",
    display: "grid",
    gridTemplateColumns: "60px 1.3fr 1fr 1fr 1fr 32px",
    gap: 24,
    alignItems: "center",
    transition: "background 0.12s",
  }}>
    <div className="t-mono" style={{ color: "var(--text-muted)" }}>{String(i + 1).padStart(2, "0")}</div>
    <div>
      <h3 className="t-display" style={{ fontSize: 26, margin: 0 }}>{c.name}</h3>
      <div className="t-mono" style={{ color: "var(--text-muted)", marginTop: 4 }}>{c.industry}</div>
    </div>
    <div><span className="pill"><span className="dot" style={{ background: c.color }}/>{c.type}</span></div>
    <div className="t-mono" style={{ color: "var(--text-dim)" }}>{c.year}</div>
    <div style={{ color: "var(--text-dim)", fontSize: 13 }}>{c.metrics[0].v} · {c.metrics[0].k}</div>
    <Icon name="arrow-up-right" size={18} style={{ color: "var(--text-muted)" }}/>
  </a>
);

const CaseStudyDetail = ({ c }) => {
  return (
    <main data-screen-label="03 Work · Detail">
      <section style={{ paddingTop: 60, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 80% 0%, color-mix(in oklab, ${c.color} 30%, transparent), transparent 60%)`,
        }}/>
        <div className="container" style={{ position: "relative" }}>
          <a href="#/work" className="btn btn-ghost btn-sm" style={{ marginBottom: 32 }}>← Back to work</a>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <span className="pill"><span className="dot" style={{ background: c.color }}/>{c.type}</span>
            <span className="pill">{c.industry}</span>
            <span className="pill">{c.year}</span>
          </div>
          <h1 className="t-display" style={{ fontSize: "clamp(60px, 10vw, 144px)", margin: 0, lineHeight: 0.95 }}>{c.name}</h1>
          <p style={{ marginTop: 24, fontSize: 20, color: "var(--text-dim)", maxWidth: "62ch" }}>{c.summary}</p>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="container">
          <Placeholder label={`${c.name} · Hero shot · 16:9`} ratio="16/9" style={{ borderRadius: "var(--r-xl)" }}/>
        </div>
      </section>

      <section style={{ paddingBottom: 100 }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {c.metrics.map((m) => (
            <div key={m.k} className="card card-pad" style={{ padding: 32 }}>
              <div className="t-display" style={{ fontSize: 56 }}>{m.v}</div>
              <div className="t-eyebrow" style={{ marginTop: 12 }}>{m.k}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ paddingBottom: 120 }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80 }}>
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 12 }}>Stack</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c.stack.map((s) => <span key={s} className="pill">{s}</span>)}
            </div>
            <div className="t-eyebrow" style={{ marginTop: 32, marginBottom: 12 }}>Timeline</div>
            <div className="t-mono" style={{ color: "var(--text-dim)", fontSize: 13 }}>
              Kickoff → Launch · 14 weeks<br/>
              Pod size · 4 builders<br/>
              Phase · Operating
            </div>
          </div>
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 12 }}>The problem</div>
            <p style={{ color: "var(--text-dim)", fontSize: 17, lineHeight: 1.7 }}>
              {c.summary} The team had hit a wall: legacy data, a fragmented vendor stack, and a hard regulatory deadline.
              They needed a partner who could ship in weeks, not quarters — and who could speak both engineering and ops.
            </p>
            <div className="t-eyebrow" style={{ marginTop: 32, marginBottom: 12 }}>What we did</div>
            <p style={{ color: "var(--text-dim)", fontSize: 17, lineHeight: 1.7 }}>
              An embedded pod of four built the system end-to-end. We ran a one-week spike to de-risk the worst part first,
              then shipped weekly demos for ten weeks. We hardened against load, wrote evals for every agent in the system,
              and stayed on-call for the first 90 days of production traffic.
            </p>
          </div>
        </div>
      </section>

      <CTASection/>
    </main>
  );
};

// =====================================================
// PAGE: ABOUT
// =====================================================
const AboutPage = () => (
  <main data-screen-label="04 About">
    <PageHeader
      eyebrow="The studio · est. 2024"
      title={<>A studio built to <span className="accent">ship</span>.</>}
      sub="Elonyx Technologies is a software development studio based in San Jose, California. We specialize in building AI-powered mobile and web applications from the ground up."
    />

    <section style={{ paddingBottom: 100 }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "center" }}>
        <Placeholder label="Studio · group photo · 16:10" ratio="16/10"/>
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}><span className="dot"/>Operating principles</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              ["Solve real problems.", "Every feature we build exists because a user needs it, not because it looks good on a slide."],
              ["Ship weekly.", "Demos, not status updates. You see real progress every week."],
              ["Quality over quantity.", "Clean code, tested features, and production-ready from day one."],
              ["Own the full stack.", "Design, frontend, backend, AI, deployment — one team handles it all."],
            ].map(([t, d], i) => (
              <li key={i} style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <span className="t-mono" style={{ color: "var(--text-muted)" }}>0{i + 1}</span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 17 }}>{t}</div>
                    <div style={{ color: "var(--text-dim)", fontSize: 14, marginTop: 4 }}>{d}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <section style={{ padding: "100px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <SectionHead eyebrow="The team" title="Who's behind Elonyx."/>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {TEAM.map((t) => (
            <div key={t.name} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <Placeholder label={t.initials} ratio="1/1" style={{ borderRadius: "var(--r-md)" }}/>
              <div>
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div className="t-mono" style={{ color: "var(--text-muted)", marginTop: 4 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{ padding: "100px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <SectionHead eyebrow="Milestones" title="The story so far."/>
        <div style={{ position: "relative", paddingLeft: 28 }}>
          <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 1, background: "var(--border)" }}/>
          {[
            ["2024", "Founded", "Elonyx Technologies established in San Jose, California."],
            ["Early 2025", "Y-NO development begins", "Started building our flagship AI-powered inventory app."],
            ["Mid 2025", "Y-NO launches", "Shipped to iOS, Android, and web with AI vision, voice, and chat features."],
            ["2026", "Growing", "Expanding our services and taking on new client projects."],
          ].map(([d, t, x], i) => (
            <div key={i} style={{ position: "relative", paddingBottom: 24 }}>
              <div style={{ position: "absolute", left: -28, top: 4, width: 11, height: 11, borderRadius: 50, background: "var(--accent)", boxShadow: "0 0 0 4px var(--bg)" }}/>
              <div className="t-mono" style={{ color: "var(--text-muted)" }}>{d}</div>
              <div style={{ fontWeight: 500, fontSize: 18, marginTop: 4 }}>{t}</div>
              <div style={{ color: "var(--text-dim)", fontSize: 14, marginTop: 2 }}>{x}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <CTASection/>
  </main>
);

// =====================================================
// PAGE: PRICING
// =====================================================
const PricingPage = () => {
  const [annual, setAnnual] = useStateP(false);
  return (
    <main data-screen-label="05 Pricing">
      <PageHeader
        eyebrow="Pricing"
        title={<>Simple, honest pricing.</>}
        sub="Pick the tier that fits your project. No hidden fees, no surprises."
      />
      <section style={{ paddingBottom: 30, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 4, padding: 4, border: "1px solid var(--border)", borderRadius: 999 }}>
          <button onClick={() => setAnnual(false)} className={"btn btn-sm " + (annual ? "btn-ghost" : "btn-primary")} style={{ border: "none" }}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={"btn btn-sm " + (annual ? "btn-primary" : "btn-ghost")} style={{ border: "none" }}>Annual · −15%</button>
        </div>
      </section>
      <section style={{ paddingBottom: 100 }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {PRICING.map((p) => <PricingCard key={p.tier} p={p} annual={annual}/>)}
        </div>
      </section>

      <section style={{ padding: "60px 0 120px", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <SectionHead eyebrow="FAQ" title="Things people ask first."/>
          <div style={{ maxWidth: 820, marginInline: "auto" }}>
            {[
              ["How long does a project take?",  "It depends on scope. A simple landing page can be done in 1–2 weeks. A full-stack app with AI features typically takes 8–12 weeks."],
              ["Do you work with startups?",    "Absolutely. Most of our clients are startups and small businesses looking to build their first product or MVP."],
              ["Can you add AI to my existing app?", "Yes. We can integrate AI features like vision, voice, or chat into your existing product."],
              ["Do you handle app store submissions?", "Yes. We handle the full process — building, testing, and submitting to both the App Store and Google Play."],
              ["What if I need changes after launch?", "All our tiers include a support period. After that, we offer ongoing maintenance plans."],
            ].map(([q, a]) => <Faq key={q} q={q} a={a}/>)}
          </div>
        </div>
      </section>
    </main>
  );
};

const Faq = ({ q, a }) => {
  const [open, setOpen] = useStateP(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%",
        padding: "22px 0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "none", border: "none", color: "var(--text)", textAlign: "left",
        fontSize: 18, fontWeight: 500, fontFamily: "var(--font-body)",
      }}>
        {q}
        <Icon name="chevron-down" size={18} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}/>
      </button>
      {open && <div style={{ paddingBottom: 22, color: "var(--text-dim)", fontSize: 15, maxWidth: "70ch" }}>{a}</div>}
    </div>
  );
};

const PricingCard = ({ p, annual }) => {
  const numeric = p.price.startsWith("$") ? parseInt(p.price.replace(/[$,k]/g, "")) : null;
  const display = numeric && annual ? `$${Math.round(numeric * 0.85)}k` : p.price;
  return (
    <div className="card" style={{
      padding: 32,
      position: "relative",
      borderColor: p.featured ? "var(--accent)" : "var(--border)",
      boxShadow: p.featured ? "0 0 0 1px var(--accent), 0 30px 60px var(--accent-glow)" : "var(--shadow-1)",
    }}>
      {p.featured && (
        <span className="pill pill-accent" style={{ position: "absolute", top: 16, right: 16 }}>
          <span className="dot" style={{ background: "var(--accent-bright)" }}/>Most popular
        </span>
      )}
      <div className="t-eyebrow" style={{ marginBottom: 14 }}>{p.tier}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span className="t-display" style={{ fontSize: 56 }}>{display}</span>
        {p.per && <span className="t-mono" style={{ color: "var(--text-muted)" }}>{p.per}</span>}
      </div>
      <p style={{ color: "var(--text-dim)", marginTop: 12, marginBottom: 28, minHeight: 64 }}>{p.note}</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {p.features.map((f) => (
          <li key={f} style={{ fontSize: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name="check" size={14} style={{ color: "var(--accent-bright)", flexShrink: 0 }}/>
            {f}
          </li>
        ))}
      </ul>
      <a href="#/contact" className={"btn " + (p.featured ? "btn-primary" : "btn-ghost") + " btn-lg"} style={{ width: "100%", justifyContent: "center", marginTop: 28 }}>
        {p.tier === "Enterprise" ? "Talk to us" : "Get started"}<Icon name="arrow-right" size={14}/>
      </a>
    </div>
  );
};

// =====================================================
// PAGE: BLOG
// =====================================================
const BlogPage = ({ route }) => {
  const id = route.startsWith("#/blog/") ? route.replace("#/blog/", "") : null;
  if (id) {
    const post = BLOG.find((b) => b.id === id);
    if (!post) return <Missing back="#/blog" label="Back to blog"/>;
    return <BlogPost post={post}/>;
  }
  return <BlogIndex/>;
};

const BlogIndex = () => {
  const [tag, setTag] = useStateP("All");
  const tags = useMemoP(() => ["All", ...new Set(BLOG.map(b => b.tag))], []);
  const filtered = tag === "All" ? BLOG : BLOG.filter(b => b.tag === tag);
  return (
    <main data-screen-label="06 Blog">
      <PageHeader
        eyebrow="Blog"
        title="Notes from the build."
        sub="What we're building, what we're learning, and the decisions behind our work."
      />
      <section style={{ paddingBottom: 60 }}>
        <div className="container" style={{ display: "flex", gap: 6 }}>
          {tags.map((t) => (
            <button key={t}
              onClick={() => setTag(t)}
              className={"btn btn-sm " + (tag === t ? "btn-primary" : "btn-ghost")}
            >{t}</button>
          ))}
        </div>
      </section>
      <section style={{ paddingBottom: 100 }}>
        <div className="container">
          <a href={`#/blog/${filtered[0].id}`} className="card" style={{
            display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 0,
            overflow: "hidden", marginBottom: 48, padding: 0,
          }}>
            <Placeholder label={filtered[0].title} ratio="16/10" style={{ borderRadius: 0, border: "none", borderRight: "1px solid var(--border)" }}/>
            <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="pill" style={{ marginBottom: 14, alignSelf: "flex-start" }}>{filtered[0].tag}</span>
              <h2 className="t-display" style={{ fontSize: 36, margin: 0 }}>{filtered[0].title}</h2>
              <p style={{ color: "var(--text-dim)", marginTop: 12, fontSize: 16 }}>{filtered[0].excerpt}</p>
              <div className="t-mono" style={{ color: "var(--text-muted)", marginTop: 20 }}>
                {filtered[0].author} · {filtered[0].date} · {filtered[0].read}
              </div>
            </div>
          </a>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {filtered.slice(1).map((b) => (
              <a key={b.id} href={`#/blog/${b.id}`} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <Placeholder label={b.tag} ratio="3/2" style={{ borderRadius: 0, border: "none", borderBottom: "1px solid var(--border)" }}/>
                <div style={{ padding: 24 }}>
                  <div className="t-mono" style={{ color: "var(--accent-bright)", fontSize: 11 }}>{b.tag.toUpperCase()}</div>
                  <h3 className="t-display" style={{ fontSize: 22, margin: "8px 0" }}>{b.title}</h3>
                  <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 16 }}>{b.excerpt}</p>
                  <div className="t-mono" style={{ color: "var(--text-muted)" }}>{b.author} · {b.date}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

const BlogPost = ({ post }) => (
  <main data-screen-label="06 Blog · Post">
    <section style={{ padding: "60px 0 40px" }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <a href="#/blog" className="btn btn-ghost btn-sm" style={{ marginBottom: 32 }}>← Back to blog</a>
        <span className="pill" style={{ marginBottom: 18 }}>{post.tag}</span>
        <h1 className="t-display" style={{ fontSize: "clamp(40px, 6vw, 72px)", margin: 0 }}>{post.title}</h1>
        <p style={{ marginTop: 20, fontSize: 19, color: "var(--text-dim)" }}>{post.excerpt}</p>
        <div className="t-mono" style={{ color: "var(--text-muted)", marginTop: 24, display: "flex", gap: 16 }}>
          <span>{post.author}</span><span>·</span><span>{post.date}</span><span>·</span><span>{post.read}</span>
        </div>
      </div>
    </section>
    <section style={{ paddingBottom: 40 }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <Placeholder label={`${post.title} · hero · 16:9`} ratio="16/9" style={{ borderRadius: "var(--r-xl)" }}/>
      </div>
    </section>
    <section style={{ paddingBottom: 120 }}>
      <div className="container" style={{ maxWidth: 720, color: "var(--text-dim)", fontSize: 17, lineHeight: 1.7 }}>
        <p>This is a placeholder for the full article body — Elonyx's editorial template uses a 720px column, a generous line-height, and inline call-outs in monospace.</p>
        <p>The real essay would go here. We'd walk through the original problem, the spike, the dead ends, the second spike, and the production system we landed on. We'd show traces. We'd publish the eval set.</p>
        <h3 className="t-display" style={{ color: "var(--text)", fontSize: 28, marginTop: 48 }}>What we'd do differently</h3>
        <p>A short retrospective lives here, with three concrete bullets and a closing thought.</p>
        <div className="card card-pad" style={{ marginTop: 32, borderColor: "var(--accent)" }}>
          <div className="t-eyebrow" style={{ color: "var(--accent-bright)" }}><span className="dot"/>Take</div>
          <p style={{ color: "var(--text)", marginTop: 8 }}>An agent without evals is a rumor. Always ship the evals first, then the feature.</p>
        </div>
      </div>
    </section>
  </main>
);

// =====================================================
// PAGE: CAREERS
// =====================================================
const CareersPage = () => (
  <main data-screen-label="07 Careers">
    <PageHeader
      eyebrow="Careers"
      title={<>Join the team.</>}
      sub="We're always looking for talented people who love building great software. No open roles right now, but reach out if you think you'd be a good fit."
    />
    <section style={{ paddingBottom: 80 }}>
      <div className="container">
        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          {JOBS.map((j, i) => (
            <a key={j.title} href="#/contact" style={{
              background: "var(--surface)",
              padding: "28px 32px",
              display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 32px", gap: 16, alignItems: "center",
            }}>
              <div className="t-mono" style={{ color: "var(--text-muted)" }}>{String(i + 1).padStart(2, "0")}</div>
              <h3 className="t-display" style={{ fontSize: 24, margin: 0 }}>{j.title}</h3>
              <div className="t-mono" style={{ color: "var(--text-dim)" }}>{j.loc}</div>
              <span className="pill" style={{ justifySelf: "start" }}>{j.type}</span>
              <Icon name="arrow-up-right" size={18} style={{ color: "var(--text-muted)" }}/>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section style={{ padding: "80px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <SectionHead eyebrow="Benefits" title="What you get."/>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            ["Top-of-market base", "We benchmark every offer to top-quartile US + EU."],
            ["Real equity", "Standard 4y/1y. We talk numbers openly."],
            ["Async-first", "Two anchored hours of overlap. The rest is your call."],
            ["Hardware budget", "$3,500 to set up your workspace, refreshed every 3 years."],
            ["Learning budget", "$2,000/yr for books, courses, conferences."],
            ["Time off", "30 days, mandatory minimum 15."],
            ["Health", "Top-tier coverage in 14 countries."],
            ["Parental leave", "16 weeks fully paid, all parents."],
          ].map(([t, d]) => (
            <div key={t} className="card card-pad" style={{ padding: 24 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{t}</div>
              <div style={{ color: "var(--text-dim)", fontSize: 13 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

// =====================================================
// PAGE: CONTACT
// =====================================================
const ContactPage = () => {
  const [form, setForm] = useStateP({ name: "", email: "", company: "", service: "Mobile App", budget: "$5–15k", msg: "" });
  const [errors, setErrors] = useStateP({});
  const [submitted, setSubmitted] = useStateP(false);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please tell us your name";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "That doesn't look like an email";
    if (!form.company.trim()) e.company = "Company / project name helps a lot";
    if (form.msg.trim().length < 20) e.msg = `A bit more detail please — ${20 - form.msg.trim().length} more characters`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = (ev) => {
    ev.preventDefault();
    if (validate()) setSubmitted(true);
  };

  return (
    <main data-screen-label="09 Contact">
      <PageHeader
        eyebrow="Contact"
        title={<>Tell us what you're <span className="accent">building</span>.</>}
        sub="We read every message and respond within 24 hours. Let's talk about your project."
      />

      <section style={{ paddingBottom: 120 }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64 }}>
          {submitted ? (
            <div className="card" style={{ padding: 48, borderColor: "var(--accent)", background: "var(--accent-soft)" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 50, background: "var(--accent)", color: "white", display: "grid", placeItems: "center" }}>
                  <Icon name="check" size={20}/>
                </div>
                <div>
                  <h3 className="t-display" style={{ fontSize: 28, margin: 0 }}>Got it, {form.name.split(" ")[0]}.</h3>
                  <p style={{ color: "var(--text-dim)", margin: "6px 0 0" }}>We'll be in touch at <strong style={{ color: "var(--text)" }}>{form.email}</strong> within 24 hours.</p>
                </div>
              </div>
              <div style={{ marginTop: 32, padding: 24, background: "var(--surface)", borderRadius: "var(--r-md)" }}>
                <div className="t-eyebrow" style={{ marginBottom: 10 }}>Submission summary</div>
                <div className="t-mono" style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.8 }}>
                  <div>NAME · {form.name}</div>
                  <div>COMPANY · {form.company}</div>
                  <div>SERVICE · {form.service}</div>
                  <div>BUDGET · {form.budget}</div>
                </div>
              </div>
              <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", service: "Mobile App", budget: "$5–15k", msg: "" }); }} className="btn btn-ghost" style={{ marginTop: 24 }}>
                Send another →
              </button>
            </div>
          ) : (
            <form className="card" style={{ padding: 40 }} onSubmit={submit} noValidate>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Your name" error={errors.name}>
                  <input className="input" value={form.name} onChange={update("name")} placeholder="Jane Cole"/>
                </Field>
                <Field label="Email" error={errors.email}>
                  <input className="input" type="email" value={form.email} onChange={update("email")} placeholder="jane@company.com"/>
                </Field>
              </div>
              <Field label="Company or project" error={errors.company}>
                <input className="input" value={form.company} onChange={update("company")} placeholder="Acme Holdings"/>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="What kind of work">
                  <select className="select" value={form.service} onChange={update("service")}>
                    {["Mobile App", "Web App", "AI Integration", "Full Product", "Not sure yet"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Budget range">
                  <select className="select" value={form.budget} onChange={update("budget")}>
                    {["< $5k", "$5–15k", "$15–50k", "$50k+", "Not sure yet"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="What are you trying to build?" error={errors.msg}>
                <textarea className="textarea" value={form.msg} onChange={update("msg")} placeholder="A few sentences on the problem, the deadline, and what success looks like."/>
              </Field>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div className="t-mono" style={{ color: "var(--text-muted)" }}>We reply within 24 hours.</div>
                <button type="submit" className="btn btn-primary btn-lg">Send message<Icon name="send" size={14}/></button>
              </div>
            </form>
          )}

          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="card card-pad" style={{ padding: 28 }}>
              <div className="t-eyebrow" style={{ marginBottom: 14 }}>Direct lines</div>
              <ContactLine label="elonyxtechnologies@gmail.com" sub="General inquiries · projects · partnerships"/>
            </div>
            <div className="card card-pad" style={{ padding: 28 }}>
              <div className="t-eyebrow" style={{ marginBottom: 14 }}>Location</div>
              <div className="t-mono" style={{ color: "var(--text-dim)", fontSize: 13, lineHeight: 1.8 }}>
                <div style={{ color: "var(--text)" }}>San Jose, California</div>
                <div>United States</div>
              </div>
            </div>
            <div className="card card-pad" style={{ padding: 28 }}>
              <div className="t-eyebrow" style={{ marginBottom: 14 }}>What happens next</div>
              <ol style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {["You hit send.", "We read it (a human).", "We reply within 24h.", "30-min intro call.", "If it fits, we send a 1-pager."].map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, fontSize: 14 }}>
                    <span className="t-mono" style={{ color: "var(--accent-bright)" }}>0{i + 1}</span>
                    <span style={{ color: "var(--text-dim)" }}>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

const ContactLine = ({ label, sub }) => (
  <div style={{ padding: "10px 0", borderBottom: "1px dashed var(--border)" }}>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>{label}</div>
    <div className="t-mono" style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>{sub}</div>
  </div>
);

// =====================================================
// PAGE: DOCS
// =====================================================
const DocsPage = () => {
  const [active, setActive] = useStateP("introduction");
  const all = DOCS.flatMap((s) => s.items);
  const cur = all.find((i) => i.id === active) || all[0];

  return (
    <main data-screen-label="08 Docs">
      <section style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "260px 1fr 240px", gap: 56 }}>
          <aside style={{ position: "sticky", top: 80, alignSelf: "flex-start", maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
            <div className="input" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <Icon name="search" size={14} style={{ color: "var(--text-muted)" }}/>
              <input style={{ background: "transparent", border: "none", outline: "none", color: "var(--text)", flex: 1, fontSize: 13 }} placeholder="Search docs"/>
              <span className="kbd">⌘ K</span>
            </div>
            {DOCS.map((s) => (
              <div key={s.section} style={{ marginBottom: 18 }}>
                <div className="admin-section-label" style={{ padding: "8px 8px 6px" }}>{s.section}</div>
                {s.items.map((it) => (
                  <button key={it.id}
                    onClick={() => setActive(it.id)}
                    className={"admin-nav-item " + (active === it.id ? "active" : "")}
                    style={{ width: "100%", justifyContent: "flex-start" }}
                  >
                    <span className="dot"/>{it.title}
                  </button>
                ))}
              </div>
            ))}
          </aside>

          <article>
            <div className="t-mono" style={{ color: "var(--text-muted)", marginBottom: 12 }}>{DOCS.find(s => s.items.some(i => i.id === cur.id)).section} / {cur.title}</div>
            <h1 className="t-display" style={{ fontSize: 56, margin: 0 }}>{cur.title}</h1>
            <p style={{ marginTop: 18, fontSize: 18, color: "var(--text-dim)", maxWidth: "62ch" }}>
              Documentation for working with Elonyx Technologies. Learn about our services, process, and tech stack.
            </p>

            <h3 className="t-display" style={{ fontSize: 24, marginTop: 48 }}>Quick example</h3>
            <CodeBlock code={SAMPLE_CODE(cur.id)}/>

            <h3 className="t-display" style={{ fontSize: 24, marginTop: 48 }}>Parameters</h3>
            <table className="table" style={{ marginTop: 16 }}>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                {[
                  ["agent_id", "string", "yes", "The agent to invoke."],
                  ["input",    "object", "yes", "Structured input matching the agent's schema."],
                  ["stream",   "boolean","no",  "If true, returns SSE stream of events."],
                  ["tools",    "string[]","no", "Override the agent's tool allow-list."],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="t-mono">{row[0]}</td>
                    <td className="t-mono" style={{ color: "var(--text-dim)" }}>{row[1]}</td>
                    <td>{row[2] === "yes"
                      ? <span className="pill pill-accent">required</span>
                      : <span className="pill">optional</span>}</td>
                    <td style={{ color: "var(--text-dim)" }}>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="card card-pad" style={{ marginTop: 48, borderColor: "var(--accent)" }}>
              <div className="t-eyebrow" style={{ color: "var(--accent-bright)" }}><span className="dot"/>On this page</div>
              <p style={{ color: "var(--text-dim)", margin: "8px 0 0" }}>
                These docs are AI-aware: hit <span className="kbd">⌘ K</span> to ask a question, get an answer cited to the source.
              </p>
            </div>
          </article>

          <aside style={{ position: "sticky", top: 80, alignSelf: "flex-start" }}>
            <div className="t-eyebrow" style={{ marginBottom: 14 }}>On this page</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {["Overview", "Quick example", "Parameters", "Errors", "Changelog"].map((t) => (
                <li key={t} style={{ fontSize: 13, color: "var(--text-dim)" }}>{t}</li>
              ))}
            </ul>
            <div className="divider" style={{ margin: "24px 0" }}/>
            <div className="t-eyebrow" style={{ marginBottom: 14 }}>Resources</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><a className="nav-link" style={{ padding: 0, fontSize: 13 }} href="#/docs">Status page</a></li>
              <li><a className="nav-link" style={{ padding: 0, fontSize: 13 }} href="#/docs">Changelog</a></li>
              <li><a className="nav-link" style={{ padding: 0, fontSize: 13 }} href="#/docs">GitHub SDK</a></li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
};

const CodeBlock = ({ code }) => (
  <div style={{
    background: "var(--bg-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    overflow: "hidden",
    marginTop: 16,
  }}>
    <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span className="t-mono" style={{ color: "var(--text-muted)" }}>node · request.ts</span>
      <button className="btn btn-ghost btn-sm">Copy</button>
    </div>
    <pre style={{ margin: 0, padding: 18, fontSize: 12.5, fontFamily: "var(--font-mono)", color: "var(--text-dim)", overflowX: "auto", lineHeight: 1.7 }}>
      <code>{code}</code>
    </pre>
  </div>
);

const SAMPLE_CODE = (id) => `// Example: AI-powered image analysis
import { analyzeImage } from "./ai/vision";

const result = await analyzeImage({
  imageUrl: "https://example.com/photo.jpg",
  prompt: "Identify all items in this image",
  model: "gemini-pro-vision",
});

console.log(result.items);
// [{ name: "laptop", confidence: 0.97 }, ...]`;

// =====================================================
// SHARED bits
// =====================================================
const PageHeader = ({ eyebrow, title, sub }) => (
  <section style={{ paddingTop: 72, paddingBottom: 32, position: "relative", overflow: "hidden" }}>
    <div className="bg-grid bg-grid-fade" style={{ position: "absolute", inset: 0, opacity: 0.4 }}/>
    <div className="container" style={{ position: "relative" }}>
      <div className="t-eyebrow" style={{ marginBottom: 24 }}><span className="dot"/>{eyebrow}</div>
      <h1 className="t-display" style={{ fontSize: "clamp(56px, 8vw, 124px)", margin: 0, lineHeight: 0.98, maxWidth: "16ch" }}>{title}</h1>
      {sub && <p style={{ marginTop: 24, fontSize: 19, color: "var(--text-dim)", maxWidth: "62ch" }}>{sub}</p>}
    </div>
  </section>
);

const Missing = ({ back, label }) => (
  <main style={{ paddingTop: 120, paddingBottom: 200, textAlign: "center" }}>
    <h1 className="t-display" style={{ fontSize: 80 }}>404</h1>
    <p style={{ color: "var(--text-dim)" }}>That page took a wrong turn.</p>
    <a href={back} className="btn btn-primary" style={{ marginTop: 24 }}>{label}</a>
  </main>
);

Object.assign(window, {
  ProductsPage, WorkPage, AboutPage, PricingPage, BlogPage, CareersPage, ContactPage, DocsPage, PageHeader,
});
