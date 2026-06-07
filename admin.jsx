/* =====================================================
   Elonyx — Admin panel
   Login flow + dashboard with 10 sections
   ===================================================== */

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA, useRef: useRefA } = React;

// ---------- AUTH ----------
const useAdminAuth = () => {
  const [user, setUser] = useStateA(() => {
    try { return JSON.parse(localStorage.getItem("elonyx-admin") || "null"); } catch { return null; }
  });
  const login = (email, name) => {
    const u = { email, name: name || email.split("@")[0].replace(/\./g, " "), initials: (email[0] + (email.split(".")[1]?.[0] || email[1] || "x")).toUpperCase() };
    localStorage.setItem("elonyx-admin", JSON.stringify(u));
    setUser(u);
  };
  const logout = () => { localStorage.removeItem("elonyx-admin"); setUser(null); };
  return { user, login, logout };
};

// ---------- LOGIN PAGE ----------
const AdminLogin = ({ onLogin }) => {
  const [step, setStep] = useStateA(0); // 0: email/password, 1: 2FA
  const [email, setEmail] = useStateA("admin@elonyx.tech");
  const [pwd, setPwd] = useStateA("");
  const [code, setCode] = useStateA(["", "", "", "", "", ""]);
  const [err, setErr] = useStateA("");
  const [busy, setBusy] = useStateA(false);

  const submitCreds = (e) => {
    e.preventDefault();
    if (!email.includes("@")) { setErr("Enter a valid email."); return; }
    if (pwd.length < 4)        { setErr("Password is required."); return; }
    setErr(""); setBusy(true);
    setTimeout(() => { setBusy(false); setStep(1); }, 700);
  };
  const submitCode = (e) => {
    e.preventDefault();
    if (code.join("").length !== 6) { setErr("Enter the 6-digit code."); return; }
    setErr(""); setBusy(true);
    setTimeout(() => { setBusy(false); onLogin(email); }, 700);
  };
  const setDigit = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const c = [...code]; c[i] = v; setCode(c);
    if (v && i < 5) document.getElementById(`d-${i + 1}`)?.focus();
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--bg)" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 80px" }}>
        <a href="#/" style={{ marginBottom: 60, display: "inline-block" }}><Wordmark/></a>
        <div className="t-eyebrow" style={{ marginBottom: 16 }}><span className="dot"/>Admin · v3.0</div>
        <h1 className="t-display" style={{ fontSize: 56, margin: 0 }}>
          {step === 0 ? "Sign in." : "Verify it's you."}
        </h1>
        <p style={{ color: "var(--text-dim)", marginTop: 12, maxWidth: "44ch" }}>
          {step === 0
            ? "Internal access for Elonyx staff and approved clients."
            : `We sent a 6-digit code to ${email}. Demo tip: type any 6 digits.`}
        </p>

        <div style={{ marginTop: 36, maxWidth: 420 }}>
          {step === 0 ? (
            <form onSubmit={submitCreds}>
              <Field label="Email">
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@elonyx.tech"/>
              </Field>
              <Field label="Password">
                <input className="input" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••"/>
              </Field>
              {err && <div className="err" style={{ marginBottom: 12 }}>{err}</div>}
              <button type="submit" className="btn btn-primary btn-lg" disabled={busy} style={{ width: "100%", justifyContent: "center" }}>
                {busy ? "Authenticating…" : "Continue"}<Icon name="arrow-right" size={14}/>
              </button>
              <div className="t-mono" style={{ marginTop: 24, color: "var(--text-muted)", textAlign: "center" }}>
                Demo · any email + 4+ char password works
              </div>
            </form>
          ) : (
            <form onSubmit={submitCode}>
              <Field label="6-digit code">
                <div style={{ display: "flex", gap: 8 }}>
                  {code.map((d, i) => (
                    <input key={i} id={`d-${i}`} className="input"
                      style={{ textAlign: "center", fontSize: 24, fontFamily: "var(--font-mono)", padding: 0, height: 56 }}
                      value={d} maxLength={1}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) document.getElementById(`d-${i - 1}`)?.focus(); }}
                    />
                  ))}
                </div>
              </Field>
              {err && <div className="err" style={{ marginBottom: 12 }}>{err}</div>}
              <button type="submit" className="btn btn-primary btn-lg" disabled={busy} style={{ width: "100%", justifyContent: "center" }}>
                {busy ? "Verifying…" : "Verify & sign in"}
              </button>
              <button type="button" onClick={() => setStep(0)} className="btn btn-ghost btn-sm" style={{ marginTop: 12, width: "100%", justifyContent: "center" }}>
                ← Back
              </button>
            </form>
          )}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 40, display: "flex", gap: 16 }}>
          <span className="status live">All systems operational</span>
          <a href="#/" className="nav-link" style={{ fontSize: 13 }}>← Back to public site</a>
        </div>
      </div>

      <div style={{ position: "relative", overflow: "hidden", background: "var(--bg-2)", borderLeft: "1px solid var(--border)" }}>
        <div className="bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.5 }}/>
        <div style={{ position: "absolute", top: "20%", left: "20%", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, var(--accent-glow), transparent 60%)", filter: "blur(40px)" }}/>
        <div style={{ position: "relative", padding: 56, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 14 }}><span className="dot"/>Live · Admin v3.0.4</div>
            <h2 className="t-display" style={{ fontSize: 36, margin: 0, maxWidth: "16ch" }}>
              One place to run the studio.
            </h2>
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden", transform: "rotate(-1deg)" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
              <span className="t-mono" style={{ color: "var(--text-muted)" }}>elonyx.admin / dashboard</span>
              <span className="status live">live</span>
            </div>
            <div style={{ padding: 20 }}>
              <Sparkline data={RUNS_SERIES} width={420} height={120}/>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 }}>
                {ADMIN_METRICS.slice(0, 3).map((m) => (
                  <div key={m.k}>
                    <div className="t-display" style={{ fontSize: 22 }}>{m.v}</div>
                    <div className="t-mono" style={{ color: "var(--text-muted)" }}>{m.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="t-mono" style={{ color: "var(--text-muted)", fontSize: 11 }}>
            Encrypted in transit (TLS 1.3) · SOC 2 Type II · Single-tenant on request
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-shell { grid-template-columns: 1fr; }
        }
        @media (max-width: 1024px) {
          [data-screen-label="ADMIN LOGIN"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

// ---------- ADMIN SHELL ----------
const ADMIN_NAV = [
  { group: "Overview", items: [
    { id: "dashboard", label: "Dashboard",     icon: "graph" },
    { id: "agents",    label: "AI Agents",     icon: "cpu" },
  ]},
  { group: "Content", items: [
    { id: "work",      label: "Case studies",  icon: "briefcase" },
    { id: "blog",      label: "Blog posts",    icon: "doc" },
  ]},
  { group: "Pipeline", items: [
    { id: "leads",     label: "Leads",         icon: "users" },
    { id: "clients",   label: "Clients",       icon: "globe" },
    { id: "billing",   label: "Billing",       icon: "money" },
  ]},
  { group: "Org", items: [
    { id: "team",      label: "Team & roles",  icon: "user" },
    { id: "settings",  label: "Settings",      icon: "settings" },
  ]},
];

const AdminShell = ({ route, user, onLogout, navigate }) => {
  const section = route.replace(/^#\/admin\/?/, "").split("/")[0] || "dashboard";
  return (
    <div className="admin-shell" data-screen-label={`ADMIN · ${section.toUpperCase()}`}>
      <aside className="admin-sidebar">
        <a href="#/" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 16 }}>
          <Wordmark size={14}/>
        </a>
        <div className="admin-nav-item" style={{ marginBottom: 14, background: "var(--surface-2)" }}>
          <Avatar initials={user.initials} size={22} accent/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
            <div className="t-mono" style={{ fontSize: 10, color: "var(--text-muted)" }}>Owner · 2FA on</div>
          </div>
        </div>
        {ADMIN_NAV.map((g) => (
          <React.Fragment key={g.group}>
            <div className="admin-section-label">{g.group}</div>
            {g.items.map((it) => (
              <button key={it.id}
                onClick={() => navigate(`#/admin/${it.id}`)}
                className={"admin-nav-item " + (section === it.id ? "active" : "")}
              >
                <Icon name={it.icon} size={14}/>
                <span style={{ flex: 1, textAlign: "left" }}>{it.label}</span>
                {section === it.id && <span style={{ width: 4, height: 4, background: "var(--accent)", borderRadius: 50 }}/>}
              </button>
            ))}
          </React.Fragment>
        ))}
        <div style={{ marginTop: "auto", paddingTop: 20, display: "flex", flexDirection: "column", gap: 4 }}>
          <button className="admin-nav-item" onClick={() => navigate("#/")}>
            <Icon name="external" size={14}/>View public site
          </button>
          <button className="admin-nav-item" onClick={onLogout}>
            <Icon name="logout" size={14}/>Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <AdminTopbar section={section} user={user}/>
        {section === "dashboard" && <DashboardView/>}
        {section === "agents"    && <AgentsView/>}
        {section === "work"      && <WorkAdminView/>}
        {section === "blog"      && <BlogAdminView/>}
        {section === "leads"     && <LeadsView/>}
        {section === "clients"   && <ClientsView/>}
        {section === "billing"   && <BillingView/>}
        {section === "team"      && <TeamAdminView/>}
        {section === "settings"  && <SettingsView/>}
      </main>
    </div>
  );
};

const AdminTopbar = ({ section, user }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
    <div>
      <div className="t-mono" style={{ color: "var(--text-muted)" }}>Admin / {section}</div>
      <h1 className="t-display" style={{ fontSize: 36, margin: 0, marginTop: 4, textTransform: "capitalize" }}>
        {section === "work" ? "Case studies" : section.replace(/^[a-z]/, c => c.toUpperCase())}
      </h1>
    </div>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div className="input" style={{ display: "flex", alignItems: "center", gap: 8, width: 280 }}>
        <Icon name="search" size={14} style={{ color: "var(--text-muted)" }}/>
        <input style={{ background: "transparent", border: "none", outline: "none", color: "var(--text)", flex: 1, fontSize: 13 }} placeholder="Search…"/>
        <span className="kbd">⌘ K</span>
      </div>
      <button className="btn btn-ghost btn-sm"><Icon name="bell" size={14}/></button>
      <button className="btn btn-primary btn-sm">
        <Icon name="plus" size={14}/>New
      </button>
    </div>
  </div>
);

// ---------- DASHBOARD ----------
const DashboardView = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {ADMIN_METRICS.map((m) => <MetricCard key={m.k} m={m}/>)}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div className="t-eyebrow">Agent runs · 14 days</div>
            <div className="t-display" style={{ fontSize: 28, marginTop: 4 }}>{RUNS_SERIES.reduce((a, b) => a + b, 0).toLocaleString()}</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="btn btn-ghost btn-sm">24h</button>
            <button className="btn btn-primary btn-sm">14d</button>
            <button className="btn btn-ghost btn-sm">90d</button>
          </div>
        </div>
        <Sparkline data={RUNS_SERIES} width={720} height={220}/>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div className="t-eyebrow" style={{ marginBottom: 12 }}>MRR · 12 months</div>
        <div className="t-display" style={{ fontSize: 28, marginBottom: 16 }}>$184k <span style={{ color: "#34d399", fontSize: 14 }}>+8%</span></div>
        <BarChart data={MRR_SERIES} height={180}/>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: 11 }}>
          <span>Jun '25</span><span>May '26</span>
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
          <div className="t-eyebrow">Recent leads</div>
          <a href="#/admin/leads" className="t-mono" style={{ color: "var(--accent-bright)", fontSize: 12 }}>View all →</a>
        </div>
        <table className="table">
          <thead><tr><th>Name</th><th>Company</th><th>Service</th><th>Status</th><th>When</th></tr></thead>
          <tbody>
            {ADMIN_LEADS.slice(0, 5).map((l) => (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td style={{ color: "var(--text-dim)" }}>{l.co}</td>
                <td><span className="pill">{l.service}</span></td>
                <td><StatusPill status={l.status}/></td>
                <td className="t-mono" style={{ color: "var(--text-muted)" }}>{l.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div className="t-eyebrow" style={{ marginBottom: 12 }}>Activity</div>
        {[
          ["✓", "Argos customs run #12,486 completed", "1m ago"],
          ["⟳", "Yno safety agent flagged for review", "12m ago"],
          ["+", "New lead from Norton Logistics", "27m ago"],
          ["✓", "Invoice INV-2026-038 paid by Yno", "3h ago"],
          ["+", "Sophie L. invited as Editor", "Yesterday"],
          ["✕", "Halo Ops invoice flagged overdue", "Yesterday"],
        ].map(([i, t, w], k) => (
          <div key={k} style={{ display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 10, alignItems: "start", padding: "10px 0", borderBottom: "1px dashed var(--border)" }}>
            <span className="t-mono" style={{ color: "var(--accent-bright)" }}>{i}</span>
            <span style={{ fontSize: 13 }}>{t}</span>
            <span className="t-mono" style={{ color: "var(--text-muted)", fontSize: 11 }}>{w}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MetricCard = ({ m }) => (
  <div className="card" style={{ padding: 22 }}>
    <div className="t-eyebrow" style={{ marginBottom: 12 }}>{m.k}</div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      <div className="t-display" style={{ fontSize: 32 }}>{m.v}</div>
      <div className="t-mono" style={{ color: m.trend === "up" ? "#34d399" : "#f87171", fontSize: 12 }}>
        {m.trend === "up" ? "▲" : "▼"} {m.delta}
      </div>
    </div>
    <div style={{ marginTop: 10 }}>
      <Sparkline data={Array.from({ length: 14 }, (_, i) => 50 + Math.sin(i) * 20 + Math.random() * 30)} height={36} width={300} grid={false}/>
    </div>
  </div>
);

const StatusPill = ({ status }) => {
  const map = {
    New:        { color: "var(--accent-bright)", bg: "var(--accent-soft)" },
    Qualified:  { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
    Contacted:  { color: "#f59e0b", bg: "rgba(245,158,11,0.14)" },
    Won:        { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
    Lost:       { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
    Paid:       { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
    Open:       { color: "#f59e0b", bg: "rgba(245,158,11,0.14)" },
    Overdue:    { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
    Healthy:    { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
    Watch:      { color: "#f59e0b", bg: "rgba(245,158,11,0.14)" },
    "At risk":  { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
    Active:     { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
    Invited:    { color: "var(--text-dim)", bg: "var(--surface-2)" },
    live:       { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
    warn:       { color: "#f59e0b", bg: "rgba(245,158,11,0.14)" },
    off:        { color: "var(--text-muted)", bg: "var(--surface-2)" },
  };
  const c = map[status] || map.Open;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "2px 8px", borderRadius: 4,
      background: c.bg, color: c.color,
      fontFamily: "var(--font-mono)", fontSize: 11,
      textTransform: "uppercase", letterSpacing: "0.05em",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 50, background: c.color }}/>{status}
    </span>
  );
};

// ---------- generic editable table ----------
const useCrud = (initial) => {
  const [rows, setRows] = useStateA(initial);
  const [editing, setEditing] = useStateA(null); // row object or "new"
  const save = (row) => {
    if (row.id && rows.some((r) => r.id === row.id)) {
      setRows((rs) => rs.map((r) => r.id === row.id ? row : r));
    } else {
      const id = row.id || `NEW-${Date.now().toString(36).slice(-4)}`;
      setRows((rs) => [{ ...row, id }, ...rs]);
    }
    setEditing(null);
  };
  const remove = (id) => setRows((rs) => rs.filter((r) => r.id !== id));
  return { rows, editing, setEditing, save, remove };
};

const RowActions = ({ onEdit, onDelete }) => (
  <div className="row-actions" style={{ display: "inline-flex", gap: 6 }}>
    <button className="btn btn-ghost btn-sm" onClick={onEdit} title="Edit"><Icon name="edit" size={12}/></button>
    <button className="btn btn-ghost btn-sm" onClick={onDelete} title="Delete"><Icon name="trash" size={12}/></button>
  </div>
);

// Modal-ish drawer for editing
const EditDrawer = ({ title, onClose, onSave, fields, value }) => {
  const [v, setV] = useStateA(value || {});
  useEffectA(() => setV(value || {}), [value]);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "var(--scrim)", zIndex: 100,
      display: "flex", justifyContent: "flex-end",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 460, maxWidth: "100vw", height: "100%",
        background: "var(--surface)", borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        animation: "slideIn 0.25s var(--ease)",
      }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="t-display" style={{ fontSize: 20, margin: 0 }}>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="close" size={14}/></button>
        </div>
        <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.type === "select" ? (
                <select className="select" value={v[f.key] || ""} onChange={(e) => setV({ ...v, [f.key]: e.target.value })}>
                  {f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === "textarea" ? (
                <textarea className="textarea" value={v[f.key] || ""} onChange={(e) => setV({ ...v, [f.key]: e.target.value })}/>
              ) : (
                <input className="input" value={v[f.key] || ""} onChange={(e) => setV({ ...v, [f.key]: e.target.value })}/>
              )}
            </Field>
          ))}
        </div>
        <div style={{ padding: "18px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(v)}>Save</button>
        </div>
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
};

// ---------- AGENTS ----------
const AgentsView = () => {
  const [filter, setFilter] = useStateA("all");
  const filtered = ADMIN_AGENTS.filter((a) => filter === "all" ? true : a.status === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          ["Live agents", ADMIN_AGENTS.filter(a => a.status === "live").length, "up"],
          ["Errored",     ADMIN_AGENTS.filter(a => a.status === "warn").length, "down"],
          ["Total runs / 24h", "12,486", "up"],
          ["Avg p95 latency",  "1.7s",   "up"],
        ].map(([k, v]) => (
          <div key={k} className="card" style={{ padding: 22 }}>
            <div className="t-eyebrow" style={{ marginBottom: 8 }}>{k}</div>
            <div className="t-display" style={{ fontSize: 28 }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "live", "warn", "off"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={"btn btn-sm " + (filter === f ? "btn-primary" : "btn-ghost")}>
                {f === "all" ? "All" : f.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={12}/>Deploy agent</button>
        </div>
        <table className="table">
          <thead><tr>
            <th>Agent ID</th><th>Project</th><th>Status</th><th>Runs · 24h</th><th>p95</th><th>Errors</th><th style={{ width: 100 }}></th>
          </tr></thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td className="t-mono">{a.id}</td>
                <td>{a.project}</td>
                <td><StatusPill status={a.status}/></td>
                <td>{a.runs24.toLocaleString()}</td>
                <td className="t-mono">{a.p95}</td>
                <td className="t-mono">{a.errors}</td>
                <td>
                  <div className="row-actions" style={{ display: "inline-flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-sm">Logs</button>
                    <button className="btn btn-ghost btn-sm">Pause</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div className="t-eyebrow" style={{ marginBottom: 14 }}>Live trace · agt_argos_customs</div>
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: 18, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.9 }}>
          <div><span style={{ color: "var(--text-muted)" }}>14:22:01.42</span> <span style={{ color: "var(--accent-bright)" }}>RUN_START</span> agent=argos_customs id=run_12486</div>
          <div><span style={{ color: "var(--text-muted)" }}>14:22:01.58</span> TOOL_CALL  read_pdf url=INV-89241.pdf</div>
          <div><span style={{ color: "var(--text-muted)" }}>14:22:02.34</span> TOOL_RES   ok · 14 line items</div>
          <div><span style={{ color: "var(--text-muted)" }}>14:22:02.40</span> THINK      classifying HS codes against historic patterns…</div>
          <div><span style={{ color: "var(--text-muted)" }}>14:22:03.12</span> TOOL_CALL  classify_hs items=14</div>
          <div><span style={{ color: "var(--text-muted)" }}>14:22:03.62</span> TOOL_RES   confidence=0.987</div>
          <div><span style={{ color: "var(--text-muted)" }}>14:22:03.66</span> <span style={{ color: "#34d399" }}>RUN_COMPLETE</span> filed=true human_review=false</div>
          <div className="blink">▌</div>
        </div>
      </div>
    </div>
  );
};

// ---------- CASE STUDIES (CRUD) ----------
const WorkAdminView = () => {
  const c = useCrud(CASE_STUDIES.map((cs) => ({ id: cs.id, name: cs.name, type: cs.type, industry: cs.industry, year: cs.year, summary: cs.summary, status: "Published" })));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="t-mono" style={{ color: "var(--text-muted)" }}>{c.rows.length} entries</div>
          <button className="btn btn-primary btn-sm" onClick={() => c.setEditing({})}>
            <Icon name="plus" size={12}/>New case study
          </button>
        </div>
        <table className="table">
          <thead><tr><th></th><th>Name</th><th>Type</th><th>Industry</th><th>Year</th><th>Status</th><th style={{ width: 100 }}></th></tr></thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.id}>
                <td style={{ width: 56 }}><div style={{ width: 36, height: 36, borderRadius: 6, background: "linear-gradient(140deg, var(--accent), var(--accent-bright))" }}/></td>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td><span className="pill">{r.type}</span></td>
                <td style={{ color: "var(--text-dim)" }}>{r.industry}</td>
                <td className="t-mono">{r.year}</td>
                <td><StatusPill status={r.status || "Published"}/></td>
                <td><RowActions onEdit={() => c.setEditing(r)} onDelete={() => c.remove(r.id)}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {c.editing !== null && (
        <EditDrawer
          title={c.editing.id ? `Edit · ${c.editing.name}` : "New case study"}
          onClose={() => c.setEditing(null)}
          onSave={c.save}
          value={c.editing}
          fields={[
            { key: "name",     label: "Project name" },
            { key: "type",     label: "Type", type: "select", options: ["AI Agent", "Mobile App", "Web Platform", "SaaS", "Internal Tool"] },
            { key: "industry", label: "Industry" },
            { key: "year",     label: "Year" },
            { key: "summary",  label: "Summary", type: "textarea" },
            { key: "status",   label: "Status", type: "select", options: ["Draft", "Published", "Archived"] },
          ]}
        />
      )}
    </div>
  );
};

// ---------- BLOG (CRUD) ----------
const BlogAdminView = () => {
  const c = useCrud(BLOG.map((b) => ({ ...b, status: "Published" })));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="t-mono" style={{ color: "var(--text-muted)" }}>{c.rows.length} posts</div>
          <button className="btn btn-primary btn-sm" onClick={() => c.setEditing({ tag: "Engineering", date: "Today", read: "5 min" })}>
            <Icon name="plus" size={12}/>New post
          </button>
        </div>
        <table className="table">
          <thead><tr><th>Title</th><th>Tag</th><th>Author</th><th>Date</th><th>Status</th><th style={{ width: 100 }}></th></tr></thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 500, maxWidth: 380 }}>{r.title}</td>
                <td><span className="pill">{r.tag}</span></td>
                <td style={{ color: "var(--text-dim)" }}>{r.author}</td>
                <td className="t-mono">{r.date}</td>
                <td><StatusPill status={r.status}/></td>
                <td><RowActions onEdit={() => c.setEditing(r)} onDelete={() => c.remove(r.id)}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {c.editing !== null && (
        <EditDrawer
          title={c.editing.id ? `Edit · ${c.editing.title}` : "New post"}
          onClose={() => c.setEditing(null)} onSave={c.save} value={c.editing}
          fields={[
            { key: "title",   label: "Title" },
            { key: "tag",     label: "Tag", type: "select", options: ["Engineering", "Mobile", "Design", "Business", "Research"] },
            { key: "author",  label: "Author" },
            { key: "date",    label: "Date" },
            { key: "excerpt", label: "Excerpt", type: "textarea" },
            { key: "status",  label: "Status", type: "select", options: ["Draft", "Scheduled", "Published"] },
          ]}
        />
      )}
    </div>
  );
};

// ---------- LEADS ----------
const LeadsView = () => {
  const c = useCrud(ADMIN_LEADS);
  const [filter, setFilter] = useStateA("All");
  const visible = c.rows.filter((l) => filter === "All" ? true : l.status === filter);
  const counts = useMemoA(() => {
    const acc = {};
    c.rows.forEach((r) => acc[r.status] = (acc[r.status] || 0) + 1);
    return acc;
  }, [c.rows]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {["All", "New", "Qualified", "Contacted", "Won"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className="card" style={{
            padding: 16, textAlign: "left",
            borderColor: filter === s ? "var(--accent)" : "var(--border)",
            background: filter === s ? "var(--accent-soft)" : "var(--surface)",
            cursor: "pointer",
          }}>
            <div className="t-eyebrow" style={{ marginBottom: 6 }}>{s}</div>
            <div className="t-display" style={{ fontSize: 26 }}>{s === "All" ? c.rows.length : counts[s] || 0}</div>
          </button>
        ))}
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="t-mono" style={{ color: "var(--text-muted)" }}>{visible.length} of {c.rows.length} leads</div>
          <button className="btn btn-primary btn-sm" onClick={() => c.setEditing({ status: "New" })}><Icon name="plus" size={12}/>Add lead</button>
        </div>
        <table className="table">
          <thead><tr><th>ID</th><th>Contact</th><th>Company</th><th>Service</th><th>Status</th><th>When</th><th style={{ width: 100 }}></th></tr></thead>
          <tbody>
            {visible.map((l) => (
              <tr key={l.id}>
                <td className="t-mono">{l.id}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={l.name.split(" ").map(n => n[0]).slice(0, 2).join("")} size={28}/>
                    <div>
                      <div style={{ fontWeight: 500 }}>{l.name}</div>
                      <div className="t-mono" style={{ color: "var(--text-muted)", fontSize: 11 }}>{l.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--text-dim)" }}>{l.co}</td>
                <td><span className="pill">{l.service}</span></td>
                <td><StatusPill status={l.status}/></td>
                <td className="t-mono" style={{ color: "var(--text-muted)" }}>{l.when}</td>
                <td><RowActions onEdit={() => c.setEditing(l)} onDelete={() => c.remove(l.id)}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {c.editing !== null && (
        <EditDrawer
          title={c.editing.id ? `Lead · ${c.editing.name}` : "New lead"}
          onClose={() => c.setEditing(null)} onSave={c.save} value={c.editing}
          fields={[
            { key: "name",    label: "Contact name" },
            { key: "co",      label: "Company" },
            { key: "email",   label: "Email" },
            { key: "service", label: "Service", type: "select", options: ["AI Agent", "Mobile App", "Web Platform", "AI Infra"] },
            { key: "status",  label: "Status", type: "select", options: ["New", "Qualified", "Contacted", "Won", "Lost"] },
            { key: "when",    label: "When" },
          ]}
        />
      )}
    </div>
  );
};

// ---------- CLIENTS ----------
const ClientsView = () => {
  const c = useCrud(ADMIN_CLIENTS);
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
        <div className="t-mono" style={{ color: "var(--text-muted)" }}>{c.rows.length} clients</div>
        <button className="btn btn-primary btn-sm" onClick={() => c.setEditing({ tier: "Sprint", health: "Healthy" })}><Icon name="plus" size={12}/>Add client</button>
      </div>
      <table className="table">
        <thead><tr><th>ID</th><th>Client</th><th>Contact</th><th>Tier</th><th>MRR</th><th>Since</th><th>Health</th><th style={{ width: 100 }}></th></tr></thead>
        <tbody>
          {c.rows.map((r) => (
            <tr key={r.id}>
              <td className="t-mono">{r.id}</td>
              <td style={{ fontWeight: 500 }}>{r.name}</td>
              <td style={{ color: "var(--text-dim)" }}>{r.contact}</td>
              <td><span className="pill">{r.tier}</span></td>
              <td className="t-display" style={{ fontSize: 14 }}>{r.mrr}</td>
              <td className="t-mono" style={{ color: "var(--text-muted)" }}>{r.since}</td>
              <td><StatusPill status={r.health}/></td>
              <td><RowActions onEdit={() => c.setEditing(r)} onDelete={() => c.remove(r.id)}/></td>
            </tr>
          ))}
        </tbody>
      </table>
      {c.editing !== null && (
        <EditDrawer
          title={c.editing.id ? `Client · ${c.editing.name}` : "New client"}
          onClose={() => c.setEditing(null)} onSave={c.save} value={c.editing}
          fields={[
            { key: "name",    label: "Client name" },
            { key: "contact", label: "Primary contact" },
            { key: "tier",    label: "Tier", type: "select", options: ["Sprint", "Build", "Enterprise"] },
            { key: "mrr",     label: "MRR" },
            { key: "since",   label: "Since" },
            { key: "health",  label: "Health", type: "select", options: ["Healthy", "Watch", "At risk"] },
          ]}
        />
      )}
    </div>
  );
};

// ---------- BILLING ----------
const BillingView = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {[
        ["MRR",      "$184k", "+8%"],
        ["ARR",      "$2.2M", "+14%"],
        ["Outstanding", "$50k", "−2"],
        ["Avg payment", "12d", "−4d"],
      ].map(([k, v, d]) => (
        <div key={k} className="card" style={{ padding: 22 }}>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>{k}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div className="t-display" style={{ fontSize: 28 }}>{v}</div>
            <div className="t-mono" style={{ color: "#34d399", fontSize: 12 }}>▲ {d}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="card" style={{ padding: 24 }}>
      <div className="t-eyebrow" style={{ marginBottom: 14 }}>MRR · 12 months</div>
      <BarChart data={MRR_SERIES} height={180}/>
    </div>

    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
        <div className="t-mono" style={{ color: "var(--text-muted)" }}>Recent invoices</div>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={12}/>Create invoice</button>
      </div>
      <table className="table">
        <thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Date</th><th>Status</th><th style={{ width: 120 }}></th></tr></thead>
        <tbody>
          {ADMIN_INVOICES.map((i) => (
            <tr key={i.id}>
              <td className="t-mono">{i.id}</td>
              <td style={{ fontWeight: 500 }}>{i.client}</td>
              <td className="t-display" style={{ fontSize: 14 }}>{i.amount}</td>
              <td className="t-mono" style={{ color: "var(--text-muted)" }}>{i.date}</td>
              <td><StatusPill status={i.status}/></td>
              <td><div className="row-actions"><button className="btn btn-ghost btn-sm">View</button><button className="btn btn-ghost btn-sm">Send</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ---------- TEAM ----------
const TeamAdminView = () => {
  const c = useCrud(ADMIN_TEAM_FULL);
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
        <div className="t-mono" style={{ color: "var(--text-muted)" }}>{c.rows.length} members</div>
        <button className="btn btn-primary btn-sm" onClick={() => c.setEditing({ status: "Invited", perms: "Editor" })}><Icon name="plus" size={12}/>Invite</button>
      </div>
      <table className="table">
        <thead><tr><th>Member</th><th>Role</th><th>Email</th><th>Permissions</th><th>Status</th><th style={{ width: 100 }}></th></tr></thead>
        <tbody>
          {c.rows.map((u) => (
            <tr key={u.id}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar initials={u.name.split(" ").map(n => n[0]).slice(0, 2).join("")} size={28} accent={u.perms === "Owner"}/>
                  <span style={{ fontWeight: 500 }}>{u.name}</span>
                </div>
              </td>
              <td style={{ color: "var(--text-dim)" }}>{u.role}</td>
              <td className="t-mono" style={{ fontSize: 12 }}>{u.email}</td>
              <td><span className="pill">{u.perms}</span></td>
              <td><StatusPill status={u.status}/></td>
              <td><RowActions onEdit={() => c.setEditing(u)} onDelete={() => c.remove(u.id)}/></td>
            </tr>
          ))}
        </tbody>
      </table>
      {c.editing !== null && (
        <EditDrawer
          title={c.editing.id ? `Member · ${c.editing.name}` : "Invite member"}
          onClose={() => c.setEditing(null)} onSave={c.save} value={c.editing}
          fields={[
            { key: "name",  label: "Name" },
            { key: "role",  label: "Role" },
            { key: "email", label: "Email" },
            { key: "perms", label: "Permissions", type: "select", options: ["Owner", "Admin", "Editor", "Viewer"] },
            { key: "status",label: "Status", type: "select", options: ["Active", "Invited", "Suspended"] },
          ]}
        />
      )}
    </div>
  );
};

// ---------- SETTINGS ----------
const SettingsView = () => {
  const [tab, setTab] = useStateA("workspace");
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="tabs" style={{ padding: "0 24px", background: "var(--surface-2)" }}>
        {["workspace", "branding", "security", "notifications", "integrations", "danger"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"tab " + (tab === t ? "active" : "")}>
            {t.replace(/^[a-z]/, c => c.toUpperCase())}
          </button>
        ))}
      </div>
      <div style={{ padding: 32 }}>
        {tab === "workspace" && (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48 }}>
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 8 }}>Workspace</div>
              <p style={{ color: "var(--text-dim)", fontSize: 13 }}>The big-picture details about your studio.</p>
            </div>
            <div>
              <Field label="Workspace name"><input className="input" defaultValue="Elonyx Technologies"/></Field>
              <Field label="Legal entity"><input className="input" defaultValue="Elonyx Technologies, Inc. (Delaware)"/></Field>
              <Field label="Primary domain"><input className="input" defaultValue="elonyx.tech"/></Field>
              <Field label="Time zone"><select className="select" defaultValue="GMT+3"><option>GMT+3</option><option>GMT+0</option><option>GMT-5</option></select></Field>
              <div style={{ marginTop: 16 }}><button className="btn btn-primary">Save changes</button></div>
            </div>
          </div>
        )}
        {tab === "branding" && (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48 }}>
            <div><div className="t-eyebrow" style={{ marginBottom: 8 }}>Brand</div><p style={{ color: "var(--text-dim)", fontSize: 13 }}>Logo, colors and dark/light defaults.</p></div>
            <div>
              <Field label="Logo">
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 72, height: 72, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, display: "grid", placeItems: "center" }}><Logo size={36}/></div>
                  <button className="btn btn-ghost btn-sm">Replace</button>
                </div>
              </Field>
              <Field label="Primary accent">
                <div style={{ display: "flex", gap: 8 }}>
                  {["#1d4ed8", "#34d399", "#f59e0b", "#a855f7"].map((c, i) => (
                    <div key={c} style={{ width: 36, height: 36, borderRadius: 8, background: c, border: i === 0 ? "2px solid var(--text)" : "1px solid var(--border)" }}/>
                  ))}
                </div>
              </Field>
              <Field label="Default theme">
                <select className="select" defaultValue="Dark"><option>Dark</option><option>Light</option><option>System</option></select>
              </Field>
            </div>
          </div>
        )}
        {tab === "security" && (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48 }}>
            <div><div className="t-eyebrow" style={{ marginBottom: 8 }}>Security</div><p style={{ color: "var(--text-dim)", fontSize: 13 }}>2FA, SSO, session policy.</p></div>
            <div>
              <ToggleRow label="Require 2FA for all members" desc="Authenticator-app TOTP. SMS not supported." on/>
              <ToggleRow label="SSO via Google Workspace" desc="Restricts login to elonyx.tech accounts." on/>
              <ToggleRow label="Session expiry · 14 days" desc="Force re-auth after this window." on/>
              <ToggleRow label="IP allow-list" desc="Restrict admin access to known IP ranges." off/>
            </div>
          </div>
        )}
        {tab === "notifications" && (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48 }}>
            <div><div className="t-eyebrow" style={{ marginBottom: 8 }}>Notifications</div><p style={{ color: "var(--text-dim)", fontSize: 13 }}>What gets sent where.</p></div>
            <div>
              <ToggleRow label="New lead → Slack #sales"            on/>
              <ToggleRow label="Agent error rate > 1% → PagerDuty"   on/>
              <ToggleRow label="Invoice overdue 7 days → Email"      on/>
              <ToggleRow label="Weekly studio digest"                on/>
              <ToggleRow label="Marketing announcements"             off/>
            </div>
          </div>
        )}
        {tab === "integrations" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              ["Slack",    "Connected"], ["GitHub",  "Connected"], ["Linear",   "Connected"],
              ["Stripe",   "Connected"], ["Vercel",  "Connected"], ["Sentry",   "Connected"],
              ["HubSpot",  "Not set"],   ["Notion",  "Not set"],   ["PagerDuty","Connected"],
            ].map(([n, s]) => (
              <div key={n} className="card card-pad" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{n}</div>
                  <div className="t-mono" style={{ color: s === "Connected" ? "#34d399" : "var(--text-muted)", marginTop: 4 }}>● {s}</div>
                </div>
                <button className="btn btn-ghost btn-sm">{s === "Connected" ? "Manage" : "Connect"}</button>
              </div>
            ))}
          </div>
        )}
        {tab === "danger" && (
          <div className="card card-pad" style={{ borderColor: "#f87171", background: "rgba(248,113,113,0.06)" }}>
            <div className="t-eyebrow" style={{ color: "#f87171", marginBottom: 8 }}>Danger zone</div>
            <p style={{ color: "var(--text-dim)", marginTop: 0 }}>These actions can't be undone. Be sure.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" style={{ borderColor: "#f87171", color: "#f87171" }}>Transfer ownership</button>
              <button className="btn btn-ghost" style={{ borderColor: "#f87171", color: "#f87171" }}>Delete workspace</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToggleRow = ({ label, desc, on }) => {
  const [v, setV] = useStateA(!!on);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontWeight: 500 }}>{label}</div>
        {desc && <div className="t-mono" style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 11 }}>{desc}</div>}
      </div>
      <button onClick={() => setV(!v)} style={{
        width: 42, height: 24, borderRadius: 999,
        background: v ? "var(--accent)" : "var(--surface-3)",
        border: "1px solid " + (v ? "var(--accent)" : "var(--border)"),
        position: "relative", transition: "background 0.15s",
        cursor: "pointer",
      }}>
        <span style={{
          position: "absolute", top: 2, left: v ? 20 : 2,
          width: 18, height: 18, borderRadius: 50,
          background: "white", transition: "left 0.15s",
        }}/>
      </button>
    </div>
  );
};

Object.assign(window, { AdminLogin, AdminShell, useAdminAuth });
