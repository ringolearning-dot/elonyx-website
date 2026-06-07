/* =====================================================
   Elonyx — Shared UI primitives
   ===================================================== */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// --- Tiny inline icon set (stroked, currentColor) ---
const Icon = ({ name, size = 16, ...p }) => {
  const s = { width: size, height: size, ...(p.style || {}) };
  const common = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: 1.6,
    strokeLinecap: "round", strokeLinejoin: "round", style: s, ...p,
  };
  switch (name) {
    case "arrow-right":  return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrow-up-right": return <svg {...common}><path d="M7 17 17 7M9 7h8v8"/></svg>;
    case "chevron-right":return <svg {...common}><path d="M9 6l6 6-6 6"/></svg>;
    case "chevron-down": return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>;
    case "search":       return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "plus":         return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "close":        return <svg {...common}><path d="M6 6l12 12M6 18 18 6"/></svg>;
    case "check":        return <svg {...common}><path d="m5 12 5 5L20 7"/></svg>;
    case "menu":         return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case "moon":         return <svg {...common}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>;
    case "sun":          return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg>;
    case "send":         return <svg {...common}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/></svg>;
    case "spark":        return <svg {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case "chat":         return <svg {...common}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z"/></svg>;
    case "user":         return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case "users":        return <svg {...common}><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="3"/><path d="M22 19a6 6 0 0 0-5-5.9"/></svg>;
    case "briefcase":    return <svg {...common}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>;
    case "layers":       return <svg {...common}><path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/></svg>;
    case "cpu":          return <svg {...common}><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>;
    case "code":         return <svg {...common}><path d="m7 8-5 4 5 4M17 8l5 4-5 4M14 4l-4 16"/></svg>;
    case "phone":        return <svg {...common}><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>;
    case "globe":        return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "graph":        return <svg {...common}><path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-7"/></svg>;
    case "money":        return <svg {...common}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 10v4M18 10v4"/></svg>;
    case "shield":       return <svg {...common}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"/></svg>;
    case "settings":     return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.6-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"/></svg>;
    case "doc":          return <svg {...common}><path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v6h6"/></svg>;
    case "trash":        return <svg {...common}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>;
    case "edit":         return <svg {...common}><path d="M4 20h4l11-11-4-4L4 16v4Z"/></svg>;
    case "filter":       return <svg {...common}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5Z"/></svg>;
    case "external":     return <svg {...common}><path d="M14 4h6v6M20 4 10 14M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>;
    case "lock":         return <svg {...common}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/></svg>;
    case "bell":         return <svg {...common}><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2ZM10 20a2 2 0 0 0 4 0"/></svg>;
    case "logout":       return <svg {...common}><path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9"/></svg>;
    default: return null;
  }
};

// --- Logo mark (stylised "E" + electric "X") ---
const Logo = ({ size = 28 }) => (
  <svg width={size} height={size * 0.66} viewBox="0 0 60 40" fill="none" aria-hidden>
    <defs>
      <linearGradient id="chromeG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f4f6fa"/>
        <stop offset="0.5" stopColor="#aab1bf"/>
        <stop offset="1" stopColor="#5b6271"/>
      </linearGradient>
      <linearGradient id="blueG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="oklch(0.72 0.20 252)"/>
        <stop offset="1" stopColor="oklch(0.48 0.22 263)"/>
      </linearGradient>
    </defs>
    {/* three bars of the E */}
    <path d="M4 4 H28 L24 9 H4 Z"  fill="url(#chromeG)"/>
    <path d="M4 17 H22 L20 21 H4 Z"  fill="url(#chromeG)"/>
    <path d="M4 30 H28 L24 35 H4 Z"  fill="url(#chromeG)"/>
    {/* the X */}
    <path d="M32 4 L40 4 L46 13 L52 4 L60 4 L51 19 L60 36 L52 36 L46 26 L40 36 L32 36 L41 19 Z" fill="url(#blueG)"/>
  </svg>
);

const Wordmark = ({ size = 17 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
    <Logo size={28}/>
    <span style={{
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      letterSpacing: "0.08em",
      fontSize: size,
      color: "var(--text)",
      fontFeatureSettings: "normal",
      paddingRight: "0.1em",
    }}>
      ELONYX
    </span>
  </span>
);

// --- Reveal-on-scroll wrapper ---
const Reveal = ({ children, delay = 0, as = "div", className = "", style = {} }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("in"), delay);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  const Tag = as;
  return <Tag ref={ref} className={`reveal ${className}`} style={style}>{children}</Tag>;
};

// --- Mini sparkline / area chart ---
const Sparkline = ({ data, width = 600, height = 160, stroke = "var(--accent-bright)", fill = "var(--accent-soft)", grid = true }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 8;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = pad + i * step;
    const y = pad + h - ((v - min) / range) * h;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(" ");
  const area = `${path} L ${pad + w} ${pad + h} L ${pad} ${pad + h} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {grid && (
        <g stroke="var(--border)" strokeWidth="0.5">
          {[0.25, 0.5, 0.75].map((t,i)=>(
            <line key={i} x1={pad} x2={width - pad} y1={pad + h * t} y2={pad + h * t}/>
          ))}
        </g>
      )}
      <path d={area} fill={fill}/>
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map((p,i)=>(
        i === pts.length - 1
          ? <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={stroke}/>
          : null
      ))}
    </svg>
  );
};

// Bar chart
const BarChart = ({ data, height = 160, color = "var(--accent)" }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height }}>
      {data.map((v,i)=>(
        <div key={i} style={{
          flex: 1,
          height: `${(v / max) * 100}%`,
          background: `linear-gradient(180deg, ${color}, color-mix(in oklab, ${color} 40%, transparent))`,
          borderRadius: "3px 3px 0 0",
          minWidth: 4,
        }}/>
      ))}
    </div>
  );
};

// Placeholder image (subtle stripes + label)
const Placeholder = ({ label, ratio = "4/3", style = {}, ...p }) => (
  <div
    {...p}
    style={{
      aspectRatio: ratio,
      background: `
        repeating-linear-gradient(135deg,
          color-mix(in oklab, var(--border) 50%, transparent) 0 1px,
          transparent 1px 14px),
        linear-gradient(180deg, var(--surface-2), var(--surface))
      `,
      border: "1px solid var(--border)",
      borderRadius: "var(--r-md)",
      color: "var(--text-muted)",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      padding: 16,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  >
    <span>{label}</span>
  </div>
);

// Avatar circle
const Avatar = ({ initials, size = 32, accent = false }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: accent
      ? "linear-gradient(140deg, var(--accent-bright), var(--accent))"
      : "linear-gradient(140deg, var(--chrome-1), var(--chrome-3))",
    color: accent ? "white" : "#1b2030",
    display: "grid", placeItems: "center",
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: size * 0.38,
    letterSpacing: "0.02em",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
  }}>
    {initials}
  </div>
);

// Section header
const SectionHead = ({ eyebrow, title, sub, children, align = "left" }) => (
  <div style={{ textAlign: align, marginBottom: 48 }}>
    {eyebrow && <div className="t-eyebrow" style={{ marginBottom: 14 }}>
      <span className="dot"/>{eyebrow}
    </div>}
    <h2 className="t-display" style={{
      fontSize: "clamp(32px, 4vw, 56px)",
      margin: 0,
      maxWidth: align === "center" ? "20ch" : "16ch",
      marginInline: align === "center" ? "auto" : 0,
    }}>{title}</h2>
    {sub && <p style={{
      marginTop: 16,
      fontSize: 17,
      color: "var(--text-dim)",
      maxWidth: "56ch",
      marginInline: align === "center" ? "auto" : 0,
    }}>{sub}</p>}
    {children}
  </div>
);

// Tiny field with validation
const Field = ({ label, error, children }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label className="label">{label}</label>}
    {children}
    {error && <div className="err">{error}</div>}
  </div>
);

Object.assign(window, {
  Icon, Logo, Wordmark, Reveal, Sparkline, BarChart, Placeholder, Avatar, SectionHead, Field,
});
