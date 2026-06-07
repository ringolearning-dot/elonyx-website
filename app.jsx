/* =====================================================
   Elonyx — Root app: hash router, theme, tweaks
   ===================================================== */

const { useState: useStateApp, useEffect: useEffectApp, useCallback: useCallbackApp } = React;

// ---------- HASH ROUTER ----------
const useHashRoute = () => {
  const [route, setRoute] = useStateApp(window.location.hash || "#/");
  useEffectApp(() => {
    const onHash = () => {
      setRoute(window.location.hash || "#/");
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = useCallbackApp((h) => { window.location.hash = h; }, []);
  return { route, navigate };
};

// ---------- ACCENT MAP ----------
// keyed by the hex value stored in tweaks (so TweakColor's curated picker just works)
const ACCENT_HEX = {
  "#3a6df0": { base: "oklch(0.58 0.22 263)", bright: "oklch(0.70 0.20 252)", soft: "oklch(0.58 0.22 263 / 0.12)", glow: "oklch(0.62 0.24 263 / 0.45)" },
  "#38c5ff": { base: "oklch(0.65 0.16 210)", bright: "oklch(0.78 0.14 200)", soft: "oklch(0.65 0.16 210 / 0.12)", glow: "oklch(0.72 0.18 200 / 0.45)" },
  "#2bb673": { base: "oklch(0.62 0.18 150)", bright: "oklch(0.75 0.16 145)", soft: "oklch(0.62 0.18 150 / 0.12)", glow: "oklch(0.72 0.20 145 / 0.45)" },
  "#f08a3a": { base: "oklch(0.66 0.18 50)",  bright: "oklch(0.78 0.16 60)",  soft: "oklch(0.66 0.18 50 / 0.12)",  glow: "oklch(0.74 0.20 55 / 0.45)" },
  "#a855f7": { base: "oklch(0.58 0.22 295)", bright: "oklch(0.72 0.18 290)", soft: "oklch(0.58 0.22 295 / 0.12)", glow: "oklch(0.68 0.22 295 / 0.45)" },
};

const applyAccent = (hex) => {
  const a = ACCENT_HEX[hex] || ACCENT_HEX["#3a6df0"];
  document.documentElement.style.setProperty("--accent", a.base);
  document.documentElement.style.setProperty("--accent-bright", a.bright);
  document.documentElement.style.setProperty("--accent-soft", a.soft);
  document.documentElement.style.setProperty("--accent-glow", a.glow);
};

// ---------- APP ----------
const App = () => {
  const { route, navigate } = useHashRoute();
  const auth = useAdminAuth();
  const [t, setTweak] = useTweaks(window.__TWEAKS__ || { accent: "#3a6df0", theme: "dark", compactNav: false });

  // sync theme to <html data-theme>
  useEffectApp(() => {
    document.documentElement.setAttribute("data-theme", t.theme || "dark");
  }, [t.theme]);

  // apply accent
  useEffectApp(() => { applyAccent(t.accent); }, [t.accent]);

  const toggleTheme = () => setTweak("theme", t.theme === "dark" ? "light" : "dark");

  // ---------- ROUTING ----------
  const isAdmin = route.startsWith("#/admin");

  useEffectApp(() => {
    if (route === "#/admin/login" && auth.user) navigate("#/admin/dashboard");
  }, [route, auth.user]);

  let body = null;
  if (isAdmin) {
    if (!auth.user) {
      body = (
        <AdminLogin onLogin={(email) => { auth.login(email); navigate("#/admin/dashboard"); }}/>
      );
    } else {
      body = (
        <AdminShell route={route} user={auth.user} onLogout={() => { auth.logout(); navigate("#/admin/login"); }} navigate={navigate}/>
      );
    }
  } else {
    let page = null;
    if (route === "#/" || route === "#/home")        page = <HomePage/>;
    else if (route.startsWith("#/products"))         page = <ProductsPage/>;
    else if (route.startsWith("#/work"))             page = <WorkPage route={route}/>;
    else if (route.startsWith("#/about"))            page = <AboutPage/>;
    else if (route.startsWith("#/pricing"))          page = <PricingPage/>;
    else if (route.startsWith("#/blog"))             page = <BlogPage route={route}/>;
    else if (route.startsWith("#/careers"))          page = <CareersPage/>;
    else if (route.startsWith("#/contact"))          page = <ContactPage/>;
    else if (route.startsWith("#/docs"))             page = <DocsPage/>;
    else                                              page = <HomePage/>;

    body = (
      <>
        <SiteHeader route={route} theme={t.theme} onTheme={toggleTheme}/>
        {page}
        <SiteFooter/>
        <ChatWidget/>
      </>
    );
  }

  return (
    <>
      {body}
      <TweaksPanel title="Elonyx · Tweaks">
        <TweakSection label="Accent color"/>
        <TweakColor
          label="Brand accent"
          value={t.accent}
          onChange={(v) => setTweak("accent", v)}
          options={["#3a6df0", "#38c5ff", "#2bb673", "#f08a3a", "#a855f7"]}
        />
        <TweakSection label="Theme"/>
        <TweakRadio
          label="Mode"
          value={t.theme}
          onChange={(v) => setTweak("theme", v)}
          options={["dark", "light"]}
        />
        <TweakSection label="Navigate"/>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4,
        }}>
          <a href="#/" className="btn btn-ghost btn-sm" style={{ height: 28, fontSize: 11 }}>Home</a>
          <a href="#/work" className="btn btn-ghost btn-sm" style={{ height: 28, fontSize: 11 }}>Work</a>
          <a href="#/pricing" className="btn btn-ghost btn-sm" style={{ height: 28, fontSize: 11 }}>Pricing</a>
          <a href="#/contact" className="btn btn-ghost btn-sm" style={{ height: 28, fontSize: 11 }}>Contact</a>
          <a href="#/docs" className="btn btn-ghost btn-sm" style={{ height: 28, fontSize: 11 }}>Docs</a>
          <a href="#/admin/login" className="btn btn-primary btn-sm" style={{ height: 28, fontSize: 11 }}>Admin</a>
        </div>
      </TweaksPanel>
    </>
  );
};

// ---------- BOOT ----------
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
