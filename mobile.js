/* Phone-only experience: lock screen, home screen, app sheets.
   Loaded ONLY on screens <= 768px (see the loader at the bottom of index.html).
   Content is read from the (hidden) desktop markup, so text is edited in one place. */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const buzz = (n = 12) => { try { navigator.vibrate && navigator.vibrate(n); } catch (e) {} };
  const ss = { get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  const clean = (node) => {
    const c = node.cloneNode(true);
    [c, ...$$("*", c)].forEach((n) => { n.classList && n.classList.remove("reveal", "tilt", "magnetic", "visible"); n.removeAttribute && n.removeAttribute("style"); });
    return c;
  };

  /* ---------- Links & data (read from the desktop markup) ---------- */
  const hrefOf = (sel, fb) => { const a = $(sel); return a && a.href ? a.href : fb; };
  const RESUME = hrefOf(".hero__cta a.btn--outline", "#");
  const GITHUB = hrefOf('.hero__cta a[aria-label="GitHub"]', "https://github.com/Asmitcod");
  const LINKEDIN = hrefOf('.hero__cta a[aria-label="LinkedIn"]', "https://www.linkedin.com/in/asmit-bisht-a09682293");
  const EMAIL = "bishtasmit15@gmail.com";
  const INSTA = hrefOf('#beyond-code a[href*="instagram"]', "https://www.instagram.com/pixels.in3d_vitc");
  const FORM_ACTION = ($("#contact-form") || {}).action || "https://formspree.io/f/mkgrjqqv";
  const PHOTOS = ["im1.jpg", "im2.jpg", "im3.jpg", "im4.jpg", "im5.jpg"];

  /* ---------- Theme (shares the desktop key) ---------- */
  const body = document.body;
  let theme = "dark";
  try { theme = localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark"; } catch (e) {}
  const applyTheme = (t) => {
    theme = t; body.classList.remove("dark", "light"); body.classList.add(t);
    try { localStorage.setItem("portfolio-theme", t); } catch (e) {}
    const b = $(".ph-theme"); if (b) b.innerHTML = `<i class="fas ${t === "dark" ? "fa-sun" : "fa-moon"}"></i>`;
  };
  body.classList.remove("dark", "light"); body.classList.add(theme);

  /* ---------- Shell ---------- */
  const phone = el("div"); phone.id = "phone";
  const pad = (n) => String(n).padStart(2, "0");
  const clock = () => { const d = new Date(); return `${d.getHours() % 12 || 12}:${pad(d.getMinutes())}`; };

  const APPS = [
    { id: "projects", name: "Projects", icon: "fas fa-diagram-project", g: ["#5c8eff", "#7b5cff"], build: buildProjects },
    { id: "skills", name: "Skills", icon: "fas fa-code", g: ["#00c6ff", "#0072ff"], build: buildSkills },
    { id: "experience", name: "Experience", icon: "fas fa-briefcase", g: ["#f7971e", "#e8a900"], build: (b) => cloneAll(b, "#experience .card") },
    { id: "education", name: "Education", icon: "fas fa-graduation-cap", g: ["#11998e", "#2fc47a"], build: (b) => cloneAll(b, "#education .timeline__item .card") },
    { id: "awards", name: "Awards", icon: "fas fa-trophy", g: ["#f857a6", "#ff5858"], build: (b) => cloneAll(b, "#achievements .ach") },
    { id: "research", name: "Research", icon: "fas fa-microscope", g: ["#8e2de2", "#4a00e0"], build: (b) => cloneAll(b, "#research .card") },
    { id: "gallery", name: "Gallery", icon: "fas fa-image", g: ["#ff9966", "#ff5e62"], build: buildGallery },
    { id: "github", name: "GitHub", icon: "fab fa-github", g: ["#2b2f36", "#4b5058"], build: buildGithub },
    { id: "terminal", name: "Terminal", icon: "fas fa-terminal", g: ["#0f2027", "#2c5364"], build: buildTerminal, cls: "ph-sheet--term" },
    { id: "contact", name: "Contact", icon: "fas fa-envelope", g: ["#43cea2", "#185a9d"], build: buildContact, badge: true, dock: true },
  ];
  const DOCK = [
    { icon: "fas fa-file-lines", href: RESUME, g: ["#5c8eff", "#7b5cff"], label: "Resume" },
    { icon: "fab fa-github", href: GITHUB, g: ["#2b2f36", "#4b5058"], label: "GitHub" },
    { icon: "fab fa-linkedin-in", href: LINKEDIN, g: ["#0a66c2", "#2d8de6"], label: "LinkedIn" },
    { icon: "fas fa-envelope", app: "contact", g: ["#43cea2", "#185a9d"], label: "Contact" },
  ];

  const dateLine = () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }).replace(",", " \u00b7").toUpperCase();

  /* Analog clock face (SVG). Ticks are generated; hands are rotated every frame. */
  const clockSVG = () => {
    let ticks = "";
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 * Math.PI) / 180, top = i === 0, r1 = top ? 118 : 124, r2 = 134;
      ticks += `<line x1="${(150 + Math.sin(a) * r1).toFixed(1)}" y1="${(150 - Math.cos(a) * r1).toFixed(1)}" x2="${(150 + Math.sin(a) * r2).toFixed(1)}" y2="${(150 - Math.cos(a) * r2).toFixed(1)}" stroke="${top ? "#00e5ff" : "#fff"}" stroke-width="${top ? 2.4 : 1.4}" stroke-linecap="round" opacity="${top ? 1 : .45}"/>`;
    }
    return `<svg viewBox="0 0 300 300" aria-hidden="true">
      <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
      <circle id="ac-arc" cx="150" cy="150" r="140" fill="none" stroke="#00e5ff" stroke-width="1.2" stroke-linecap="round" transform="rotate(-90 150 150)"/>
      ${ticks}
      <g id="ac-h"><line y1="10" y2="-62" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/></g>
      <g id="ac-m"><line y1="12" y2="-96" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g>
      <g id="ac-s"><line y1="22" y2="-112" stroke="#00e5ff" stroke-width="1"/><circle cy="-112" r="3" fill="#00e5ff"/></g>
      <circle cx="150" cy="150" r="3.2" fill="#000" stroke="#fff" stroke-width="1.4"/>
    </svg>`;
  };

  phone.innerHTML = `
    <div class="ph-wall" id="ph-wall" aria-hidden="true">
      <div class="ph-wall__base"></div>
      <div class="ph-wall__orb"><i></i><i></i><i></i></div>
      <canvas class="ph-wall__net" id="ph-net"></canvas>
      <canvas class="ph-wall__cv" id="ph-cv"></canvas>
      <div class="ph-wall__vig"></div>
    </div>
    <section class="ph-home ph-hold">
      <div class="ph-status"><b class="ph-clock">${clock()}</b><span class="ph-status__os">ASMIT\u00b7OS</span><span><i class="fas fa-signal"></i><i class="fas fa-wifi"></i><i class="fas fa-battery-full"></i></span></div>
      <div class="ph-scroll">
        <div class="ph-bento" id="ph-bento">
          <div class="ph-tile ph-t-profile">
            <div class="ph-flip" id="ph-flip" role="button" aria-label="Flip photo"><div class="ph-flip__inner"><img src="as.png" alt="Asmit Bisht" /><img src="avatar.webp" alt="Minecraft avatar" loading="lazy" /></div></div>
            <div class="ph-t-profile__txt"><span class="ph-eyebrow">// hello, world</span><h2>Asmit Bisht</h2><p>CS (AI &amp; Robotics) \u00b7 VIT Chennai</p><span class="ph-loc"><i></i><b id="ph-loc"></b></span></div>
            <button class="ph-theme" aria-label="Toggle theme"></button>
          </div>
          <button class="ph-tile ph-t-projects" data-app="projects"><span class="ph-eyebrow"><i class="fas fa-diagram-project"></i> Projects<em class="ph-idx" id="ph-idx"></em></span><div class="ph-rot" id="ph-rot"></div><div class="ph-rot__dots" id="ph-rotdots"></div></button>
          <button class="ph-tile ph-t-sm ph-t-gal" style="--c:#ff9966" data-app="gallery"><span class="ph-sm__ic"><i class="fas fa-image"></i></span><span class="ph-sm__t"><b>Gallery</b><small>5 photos</small></span></button>
          <button class="ph-tile ph-t-sm" style="--c:#ffb454" data-app="experience"><span class="ph-sm__ic"><i class="fas fa-briefcase"></i></span><span class="ph-sm__t"><b>Experience</b><small id="ph-s-exp"></small></span></button>
          <button class="ph-tile ph-t-sm" style="--c:#3ddc97" data-app="education"><span class="ph-sm__ic"><i class="fas fa-graduation-cap"></i></span><span class="ph-sm__t"><b>Education</b><small id="ph-s-edu"></small></span></button>
          <button class="ph-tile ph-t-sm" style="--c:#a78bff" data-app="research"><span class="ph-sm__ic"><i class="fas fa-microscope"></i></span><span class="ph-sm__t"><b>Research</b><small id="ph-s-res"></small></span></button>
          <button class="ph-tile ph-t-term" data-app="terminal"><span class="ph-eyebrow"><i class="fas fa-terminal"></i> Terminal</span><div class="ph-tm__log" id="ph-tm-log"></div><div class="ph-tm"><span class="ph-tm__p">visitor@asmit:~$</span> <span id="ph-typed"></span><i class="ph-caret"></i></div><div class="ph-tm__out" id="ph-typed-out"></div></button>
          <button class="ph-tile ph-t-skills" data-app="skills"><div class="ph-marq"><div class="ph-marq__in" id="ph-marq"></div></div></button>
          <button class="ph-tile ph-t-awards" data-app="awards"><span class="ph-eyebrow"><i class="fas fa-trophy"></i> Awards</span><svg class="ph-ring" viewBox="0 0 64 64" aria-hidden="true"><circle class="t" cx="32" cy="32" r="26"/><circle class="a" id="ph-ring-a" cx="32" cy="32" r="26"/></svg><b class="ph-big">Top <span id="ph-n">100</span></b><span class="ph-sub">864 teams \u00b7 SIH '25</span></button>
          <button class="ph-tile ph-t-gh" data-app="github"><span class="ph-eyebrow"><i class="fab fa-github"></i> GitHub<em class="ph-livedot"></em></span><div class="ph-spark" id="ph-spark"><i></i><i></i><i></i><i></i><i></i><i></i></div><b class="ph-gh__name" id="ph-gh-name">Asmitcod</b><span class="ph-sub" id="ph-gh-sub">latest repos</span></button>
        </div>
        <div class="ph-foot"><button id="ph-desktop">Open desktop version</button></div>
      </div>
      <nav class="ph-dock" id="ph-dock"></nav>
    </section>
    <section class="ph-lock" id="ph-lock">
      <button class="ph-skip">Skip</button>
      <div class="ph-lock__date" id="ph-ldate">${dateLine()}</div>
      <div class="ph-aclock" id="ph-aclock">${clockSVG()}</div>
      <div class="ph-lock__digi" id="ph-digi"></div>
      <div class="ph-lock__stage" id="ph-stage"></div>
      <div class="ph-lock__hint"><span class="ph-chev"><i></i><i></i><i></i></span>Swipe up to see portfolio</div>
    </section>`;
  document.body.appendChild(phone);
  applyTheme(theme);
  setInterval(() => { $$(".ph-clock").forEach((c) => (c.textContent = clock())); const d = $("#ph-ldate"); if (d) d.textContent = dateLine(); }, 20000);

  /* ---------- Wallpaper (one layer shared by lock + home) ---------- */
  let wall = null;
  const wallLayout = (mode) => {
    const W = phone.clientWidth, H = phone.clientHeight;
    if (mode === "lock") {
      const r = $("#ph-stage").getBoundingClientRect(), pr = phone.getBoundingClientRect();
      return { cx: W / 2, cy: r.top - pr.top + r.height / 2, r: Math.max(90, Math.min(r.height * 0.6, W * 0.44)), dim: 1 };
    }
    return { cx: W / 2, cy: H * 0.42, r: W * 0.42, dim: 0.35 };
  };
  const loadScript = (src) => new Promise((ok, no) => { const s = document.createElement("script"); s.src = src; s.async = false; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  const bootWall = () => {
    wall = window.PhoneWall ? window.PhoneWall.init($("#ph-cv"), { layout: wallLayout }) : null;
    if (wall) { wall.setMode(ss.get("ph-unlocked") ? "home" : "lock"); setTimeout(() => wall && wall.refresh(), 700); }
    else $("#ph-wall").classList.add("no3d");
  };
  /* low-power phones (data saver, or under 4 GB RAM) skip the 3D scene and keep the CSS orb */
  const lite = !!((navigator.connection && navigator.connection.saveData) || (navigator.deviceMemory && navigator.deviceMemory < 4));
  (lite ? Promise.reject(new Error("lite")) : window.THREE ? Promise.resolve() : loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"))
    .then(() => loadScript("phone-wall.js")).then(bootWall).catch(() => { $("#ph-wall").classList.add("no3d"); /* no WebGL / offline / low-power: CSS orb */ });

  /* ---------- Connected dots: a light 2D network behind the 3D core ---------- */
  const net = (() => {
    const cv = $("#ph-net"); if (!cv) return null;
    const g = cv.getContext("2d"), still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const LINK = 130, FRAME = lite ? 42 : 33;
    let W = 0, H = 0, nodes = [], pulses = [], raf = 0, paused = false, last = 0, nextPulse = 900, dimV = 1, pt = null;
    const make = () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .26, vy: (Math.random() - .5) * .26, r: .7 + Math.random() * 1.1 });
    function draw(dt) {
      const k = dt / 16.7, links = [];
      g.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        n.x += n.vx * k; n.y += n.vy * k;
        if (pt) { const dx = pt.x - n.x, dy = pt.y - n.y, d = Math.hypot(dx, dy); if (d < 120 && d > 1) { n.x += dx * .004 * k; n.y += dy * .004 * k; } }
        if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
      });
      g.lineWidth = .8;
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) { links.push([a, b]); g.strokeStyle = `rgba(77,141,255,${((1 - d / LINK) * .5 * dimV).toFixed(3)})`; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
      }
      if (pt) nodes.forEach((n) => { const d = Math.hypot(pt.x - n.x, pt.y - n.y); if (d < 150) { g.strokeStyle = `rgba(150,195,255,${((1 - d / 150) * .5 * dimV).toFixed(3)})`; g.beginPath(); g.moveTo(n.x, n.y); g.lineTo(pt.x, pt.y); g.stroke(); } });
      nodes.forEach((n, i) => {
        if (i % 6 === 0) { g.fillStyle = `rgba(77,141,255,${(.1 * dimV).toFixed(3)})`; g.beginPath(); g.arc(n.x, n.y, n.r * 5, 0, 6.283); g.fill(); }
        g.fillStyle = `rgba(140,185,255,${(.8 * dimV).toFixed(3)})`; g.beginPath(); g.arc(n.x, n.y, i % 6 === 0 ? n.r * 1.5 : n.r, 0, 6.283); g.fill();
      });
      if (!still && dt > 0) {
        nextPulse -= dt;
        if (nextPulse <= 0 && links.length && pulses.length < 3) { const l = links[(Math.random() * links.length) | 0]; pulses.push({ a: l[0], b: l[1], t: 0, sp: .0011 + Math.random() * .0008 }); nextPulse = 700 + Math.random() * 1100; }
        pulses = pulses.filter((p) => (p.t += p.sp * dt) < 1 && Math.hypot(p.a.x - p.b.x, p.a.y - p.b.y) < LINK * 1.2);
        pulses.forEach((p) => {
          const at = (t) => [p.a.x + (p.b.x - p.a.x) * t, p.a.y + (p.b.y - p.a.y) * t], h = at(p.t), tl = at(Math.max(0, p.t - .2));
          g.strokeStyle = `rgba(190,220,255,${(.85 * dimV).toFixed(3)})`; g.lineWidth = 1.3; g.beginPath(); g.moveTo(tl[0], tl[1]); g.lineTo(h[0], h[1]); g.stroke();
          g.fillStyle = `rgba(77,141,255,${(.2 * dimV).toFixed(3)})`; g.beginPath(); g.arc(h[0], h[1], 6, 0, 6.283); g.fill();
          g.fillStyle = "#e6f1ff"; g.beginPath(); g.arc(h[0], h[1], 1.8, 0, 6.283); g.fill();
        });
      }
    }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); W = phone.clientWidth; H = phone.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = Array.from({ length: Math.round(Math.min(lite ? 26 : 34, (W * H) / 10500)) }, make); pulses = [];
      draw(0);
    }
    function frame(t) { raf = requestAnimationFrame(frame); if (t - last < FRAME) return; const dt = Math.min(last ? t - last : FRAME, 80); last = t; draw(dt); }
    const start = () => { if (!raf && !paused && !document.hidden && !still) { last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    phone.addEventListener("pointermove", (e) => { pt = { x: e.clientX, y: e.clientY }; }, { passive: true });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => phone.addEventListener(ev, () => { pt = null; }));
    window.addEventListener("resize", resize);
    resize(); start();
    return { pause(p) { paused = p; p ? stop() : start(); }, dim(v) { dimV = v; if (still || paused) draw(0); } };
  })();

  /* ---------- Analog clock (smooth sweeping second hand) ---------- */
  const C136 = 2 * Math.PI * 140;
  const acH = $("#ac-h"), acM = $("#ac-m"), acS = $("#ac-s"), acArc = $("#ac-arc"), digi = $("#ph-digi");
  const rot = (g, a) => g.setAttribute("transform", `translate(150 150) rotate(${a.toFixed(2)})`);
  let lastSec = -1, clockRaf = 0;
  const tickClock = () => {
    const d = new Date(), ms = d.getMilliseconds(), sec = d.getSeconds() + ms / 1000, min = d.getMinutes() + sec / 60, hr = (d.getHours() % 12) + min / 60;
    rot(acS, sec * 6); rot(acM, min * 6); rot(acH, hr * 30);
    const dash = `${((sec / 60) * C136).toFixed(1)} ${C136.toFixed(1)}`;
    acArc.setAttribute("stroke-dasharray", dash);
    const si = d.getSeconds();
    if (si !== lastSec) {
      lastSec = si;
      const h12 = d.getHours() % 12 || 12;
      digi.innerHTML = `${pad(h12)}:${pad(d.getMinutes())}<small>:${pad(si)} ${d.getHours() < 12 ? "AM" : "PM"}</small>`;
    }
    clockRaf = requestAnimationFrame(tickClock);
  };
  tickClock();
  const stopClock = () => { cancelAnimationFrame(clockRaf); clockRaf = 0; };

  /* ---------- Home: bento of live widgets ---------- */
  let current = null; /* open app sheet (declared early: the live tiles check it) */
  const seenBadge = ss.get("ph-badge-seen");
  const byId = (id) => APPS.find((a) => a.id === id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const homeVisible = () => !document.hidden && !current && $("#ph-lock").style.display === "none";
  const ago = (iso) => { const d = Math.floor((Date.now() - new Date(iso)) / 864e5); return d < 1 ? "today" : d < 30 ? d + "d ago" : d < 365 ? Math.floor(d / 30) + "mo ago" : Math.floor(d / 365) + "y ago"; };
  $$("#ph-bento .ph-tile").forEach((t, i) => t.style.setProperty("--i", i));
  $$("#ph-bento [data-app]").forEach((t) => t.addEventListener("click", () => openApp(byId(t.dataset.app), t)));

  /* profile: live Chennai time */
  const ist = () => new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase();
  const setLoc = () => { $("#ph-loc").textContent = `Chennai \u00b7 ${ist()}`; };
  setLoc(); setInterval(setLoc, 20000);

  /* projects: rotating cards read from the desktop markup */
  const ACC = ["#00e5ff", "#a78bff", "#3ddc97", "#ffb454", "#ff7a90"];
  const projs = $$("#projects .project").map((p) => ({ t: ($("h3", p) || {}).textContent || "", d: ($("p", p) || {}).textContent || "" })).filter((p) => p.t);
  const rotEl = $("#ph-rot"), rotDots = $("#ph-rotdots"); let pi = 0;
  const showProj = (i) => {
    const p = projs[i]; rotEl.classList.remove("in");
    $(".ph-t-projects").style.setProperty("--acc", ACC[i % ACC.length]); $("#ph-idx").textContent = `${pad(i + 1)} / ${pad(projs.length)}`; rotEl.innerHTML = `<h3>${esc(p.t)}</h3><p>${esc(p.d)}</p>`; void rotEl.offsetWidth; rotEl.classList.add("in");
    $$("i", rotDots).forEach((d, k) => d.classList.toggle("on", k === i));
  };
  if (projs.length) {
    projs.forEach(() => rotDots.append(el("i"))); showProj(0);
    if (!reduceMotion) setInterval(() => { if (homeVisible()) showProj((pi = (pi + 1) % projs.length)); }, 4200);
  }

  /* github: newest real repo */
  (async () => {
    try {
      const key = "gh-repos-v1"; let repos = null; const c = ss.get(key);
      if (c) repos = JSON.parse(c);
      else {
        const r = await fetch("https://api.github.com/users/Asmitcod/repos?sort=pushed&per_page=12", { headers: { Accept: "application/vnd.github+json" } });
        if (!r.ok) throw new Error("gh"); repos = await r.json(); ss.set(key, JSON.stringify(repos));
      }
      const months = [0, 0, 0, 0, 0, 0];
      repos.forEach((r) => { const m = Math.floor((Date.now() - new Date(r.pushed_at)) / (30 * 864e5)); if (m >= 0 && m < 6) months[5 - m]++; });
      const mx = Math.max(1, ...months);
      $$("#ph-spark i").forEach((b, k) => (b.style.height = `${18 + (months[k] / mx) * 82}%`));
      const top = repos.filter((r) => !r.fork && r.name.toLowerCase() !== "asmitcod")[0]; if (!top) return;
      $("#ph-gh-name").textContent = top.name; $("#ph-gh-sub").textContent = `${top.language || "code"} \u00b7 ${ago(top.pushed_at)}`;
      $(".ph-t-gh").classList.add("is-live");
    } catch (e) { /* keeps the static label */ }
  })();

  /* terminal: types a few real commands */
  const typed = $("#ph-typed"), typedOut = $("#ph-typed-out");
  const SCRIPT = [["whoami", "asmit bisht"], ["ls skills/", "python  java  c++  sql  ros"], ["ls projects/", "traffic-rl  aquajeevan  edumadad  aqi-monitor"]];
  const hist = [];
  (async () => {
    if (reduceMotion) { typed.textContent = SCRIPT[0][0]; typedOut.textContent = SCRIPT[0][1]; return; }
    for (let n = 0; ; n++) {
      const [cmd, res] = SCRIPT[n % SCRIPT.length];
      while (!homeVisible()) await sleep(700);
      typed.textContent = ""; typedOut.textContent = "";
      for (const ch of cmd) { typed.textContent += ch; await sleep(70 + Math.random() * 60); }
      await sleep(350); typedOut.textContent = res; await sleep(2800);
      hist.push([cmd, res]); $("#ph-tm-log").innerHTML = hist.slice(-2).map((h, k, a) => `<div class="h" style="opacity:${k === a.length - 1 ? .6 : .32}"><span class="ph-tm__p">$</span> ${esc(h[0])} <em>\u2192 ${esc(h[1])}</em></div>`).join("");
    }
  })();

  /* awards: ring fills + number counts up when the home screen appears */
  const awardsIn = () => {
    const n = $("#ph-n"); $("#ph-ring-a").classList.add("on");
    if (reduceMotion) return;
    const t0 = performance.now();
    const step = (now) => { const p = Math.min(1, (now - t0) / 1300); n.textContent = Math.round(100 * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    n.textContent = "0"; setTimeout(() => requestAnimationFrame(step), 450);
  };

  /* light sheen on the glass: follows your finger, or the phone's tilt */
  const tiles = $$("#ph-bento .ph-tile"); let sheenRaf = 0, shx = 0, shy = 0, sho = 0, touching = false;
  const paintSheen = () => { sheenRaf = 0; if (!homeVisible()) return; tiles.forEach((t) => { const r = t.getBoundingClientRect(); t.style.setProperty("--sx", `${shx - r.left}px`); t.style.setProperty("--sy", `${shy - r.top}px`); t.style.setProperty("--so", sho); }); };
  const sheenAt = (x, y, o) => { shx = x; shy = y; sho = o; if (!sheenRaf) sheenRaf = requestAnimationFrame(paintSheen); };
  $(".ph-home").addEventListener("pointermove", (e) => { touching = true; sheenAt(e.clientX, e.clientY, 1); }, { passive: true });
  ["pointerup", "pointercancel"].forEach((ev) => $(".ph-home").addEventListener(ev, () => { touching = false; sheenAt(shx, shy, 0); }, { passive: true }));
  if ("DeviceOrientationEvent" in window && typeof window.DeviceOrientationEvent.requestPermission !== "function") {
    window.addEventListener("deviceorientation", (e) => {
      if (touching || e.gamma == null || e.beta == null) return;
      const W = phone.clientWidth, H = phone.clientHeight;
      sheenAt(W * (0.5 + Math.max(-1, Math.min(1, e.gamma / 35)) * 0.5), H * (0.4 + Math.max(-1, Math.min(1, (e.beta - 55) / 40)) * 0.5), 0.7);
    }, { passive: true });
  }

  /* skills: marquee of real tags */
  const chips = $$("#skills .tags li").map((l) => `<span>${esc(l.textContent.trim())}</span>`).join("");
  $("#ph-marq").innerHTML = chips + chips;

  /* small tiles: one line from the real content */
  const sub = (sel, fb) => (($(sel) || {}).textContent || fb).trim();
  $("#ph-s-exp").textContent = sub("#experience h3", "Internship");
  $("#ph-s-edu").textContent = sub("#education .card h3", "VIT Chennai");
  $("#ph-s-res").textContent = sub("#research h3", "Publication");

  DOCK.forEach((d) => {
    const app = d.app && APPS.find((x) => x.id === d.app);
    const a = el("a", "", `<i class="${d.icon}"></i>${app && app.badge && !seenBadge ? '<em class="ph-badge">1</em>' : ""}`);
    a.setAttribute("aria-label", d.label);
    a.style.setProperty("--g1", d.g[0]); a.style.setProperty("--g2", d.g[1]);
    if (app) { a.href = "#"; a.setAttribute("role", "button"); a.addEventListener("click", (e) => { e.preventDefault(); openApp(app, a); }); }
    else { a.href = d.href; a.target = "_blank"; a.rel = "noopener"; a.addEventListener("click", () => buzz(8)); }
    $("#ph-dock").appendChild(a);
  });
  $("#ph-flip").addEventListener("click", (e) => { e.currentTarget.classList.toggle("on"); buzz(14); });
  $(".ph-theme").addEventListener("click", () => { applyTheme(theme === "dark" ? "light" : "dark"); buzz(10); });
  let lastScroll = 0;
  $(".ph-scroll").addEventListener("scroll", (e) => { const y = e.target.scrollTop; if (wall) wall.kick((y - lastScroll) * 0.025); lastScroll = y; }, { passive: true });
  $("#ph-desktop").addEventListener("click", () => { ss.set("view-desktop", "1"); location.reload(); });

  /* ---------- Lock screen ---------- */
  const lock = $("#ph-lock");
  const unlock = () => {
    if (lock.classList.contains("up")) return;
    buzz(18); ss.set("ph-unlocked", "1"); lock.style.transform = ""; lock.classList.add("up");
    $(".ph-home").classList.remove("ph-hold"); $(".ph-home").classList.add("ph-in"); awardsIn();
    if (wall) { wall.setMode("home"); wall.kick(1.6); }
    if (net) net.dim(.55);
    setTimeout(() => { lock.style.display = "none"; stopClock(); }, 550);
  };
  if (ss.get("ph-unlocked")) { if (net) net.dim(.55); lock.style.display = "none"; stopClock(); $(".ph-home").classList.remove("ph-hold"); $(".ph-home").classList.add("ph-in"); awardsIn(); }
  else {
    let sy = null, dy = 0, moved = false;
    lock.addEventListener("pointerdown", (e) => { if (e.target.closest(".ph-skip")) return; sy = e.clientY; dy = 0; moved = false; lock.style.transition = "none"; });
    lock.addEventListener("pointermove", (e) => { if (sy == null) return; dy = Math.min(0, e.clientY - sy); if (dy < -6) moved = true; lock.style.transform = `translateY(${dy}px)`; });
    const end = () => { if (sy == null) return; sy = null; lock.style.transition = ""; (dy < -90 || !moved) ? unlock() : (lock.style.transform = ""); };
    lock.addEventListener("pointerup", end); lock.addEventListener("pointercancel", end);
    $(".ph-skip").addEventListener("click", unlock);
  }

  /* ---------- App sheets (expand from the icon, swipe down to close) ---------- */
  function geom(icon) {
    const r = icon.getBoundingClientRect(), vw = phone.clientWidth, vh = phone.clientHeight;
    return `translate(${r.left}px, ${r.top}px) scale(${r.width / vw}, ${r.height / vh})`;
  }
  function openApp(app, icon) {
    if (current) return;
    buzz(10);
    if (app.badge) { ss.set("ph-badge-seen", "1"); const bd = $(".ph-badge", icon); if (bd) bd.remove(); }
    const sheet = el("div", "ph-sheet" + (app.cls ? " " + app.cls : ""));
    sheet.innerHTML = `<div class="ph-sheet__bar"><button class="ph-back"><i class="fas fa-chevron-left"></i> Home</button><span class="ph-sheet__title">${app.name}</span></div><div class="ph-sheet__body"></div>`;
    const bodyEl = $(".ph-sheet__body", sheet);
    try { app.build(bodyEl, sheet); } catch (err) { bodyEl.textContent = "Couldn't load this app."; }
    phone.appendChild(sheet);
    sheet.style.transition = "none"; sheet.style.transform = geom(icon); sheet.style.opacity = ".3"; sheet.style.borderRadius = "24px";
    sheet.getBoundingClientRect();
    sheet.style.transition = "transform .42s cubic-bezier(.2,.8,.2,1), opacity .3s, border-radius .42s";
    sheet.style.transform = "none"; sheet.style.opacity = "1"; sheet.style.borderRadius = "0";
    current = { sheet, icon };
    setTimeout(() => { if (current) { if (wall) wall.pause(true); if (net) net.pause(true); } }, 480);
    try { history.pushState({ ph: app.id }, ""); } catch (e) {}
    $(".ph-back", sheet).addEventListener("click", () => closeApp());
    swipeDown(sheet, bodyEl);
  }
  function closeApp(viaPop) {
    if (!current) return;
    const { sheet, icon } = current; current = null; buzz(8);
    if (wall) wall.pause(false);
    if (net) net.pause(false);
    sheet.style.transition = "transform .36s cubic-bezier(.4,0,.2,1), opacity .3s, border-radius .36s";
    sheet.style.transform = geom(icon); sheet.style.opacity = "0"; sheet.style.borderRadius = "24px";
    setTimeout(() => sheet.remove(), 380);
    if (!viaPop) { try { if (history.state && history.state.ph) history.back(); } catch (e) {} }
  }
  window.addEventListener("popstate", () => closeApp(true));
  function swipeDown(sheet, scroller) {
    let y0 = null, dy = 0;
    sheet.addEventListener("touchstart", (e) => { y0 = scroller.scrollTop <= 0 ? e.touches[0].clientY : null; dy = 0; }, { passive: true });
    sheet.addEventListener("touchmove", (e) => {
      if (y0 == null) return;
      dy = e.touches[0].clientY - y0;
      if (dy > 0 && scroller.scrollTop <= 0) { sheet.style.transition = "none"; sheet.style.transform = `translateY(${dy * .8}px)`; sheet.style.opacity = String(Math.max(.4, 1 - dy / 500)); }
    }, { passive: true });
    sheet.addEventListener("touchend", () => {
      if (y0 == null) return; y0 = null;
      if (dy > 110) closeApp();
      else { sheet.style.transition = "transform .3s, opacity .3s"; sheet.style.transform = "none"; sheet.style.opacity = "1"; }
      dy = 0;
    });
  }

  /* ---------- App contents ---------- */
  function cloneAll(container, selector) {
    const nodes = $$(selector).map(clean);
    if (!nodes.length) container.append(el("p", "ph-hint", "Nothing here yet."));
    nodes.forEach((n) => container.append(n));
  }
  function buildProjects(container) {
    const cards = $$("#projects .project").map(clean);
    container.append(el("p", "ph-hint", "Swipe to browse"));
    const snap = el("div", "ph-snap"); cards.forEach((c) => snap.append(c)); container.append(snap);
    const dots = el("div", "ph-dots"); cards.forEach((_, i) => dots.append(el("i", i ? "" : "on"))); container.append(dots);
    snap.addEventListener("scroll", () => {
      const w = (cards[0] ? cards[0].offsetWidth : 1) + 12, i = Math.round(snap.scrollLeft / w);
      $$("i", dots).forEach((d, k) => d.classList.toggle("on", k === i));
    }, { passive: true });
  }
  function buildSkills(container) {
    $$("#skills .skill").forEach((s, i) => {
      const h = $("h3", s), tags = $(".tags", s);
      const acc = el("div", "card ph-acc" + (i === 0 ? " open" : ""));
      const btn = el("button", "", `<span>${h ? h.innerHTML : ""}</span><i class="fas fa-chevron-down c"></i>`);
      const wrap = el("div", "ph-acc__body"), inner = el("div"); if (tags) inner.append(clean(tags)); wrap.append(inner);
      btn.addEventListener("click", () => { acc.classList.toggle("open"); buzz(6); });
      acc.append(btn, wrap); container.append(acc);
    });
  }
  function buildGallery(container) {
    const g = el("div", "ph-gal");
    PHOTOS.forEach((src, i) => { const b = el("button", "", `<img src="${src}" alt="Photo ${i + 1}" loading="lazy" />`); b.addEventListener("click", () => viewer(container.closest(".ph-sheet"), i)); g.append(b); });
    container.append(g);
    const a = el("a", "ph-insta", '<i class="fab fa-instagram"></i> Photography on Instagram'); a.href = INSTA; a.target = "_blank"; a.rel = "noopener"; container.append(a);
  }
  function viewer(sheet, start) {
    let i = start;
    const v = el("div", "ph-viewer", '<img alt="" /><button class="x" aria-label="Close"><i class="fas fa-times"></i></button><div class="n"></div>');
    const img = $("img", v), n = $(".n", v);
    const show = (k) => { i = (k + PHOTOS.length) % PHOTOS.length; img.src = PHOTOS[i]; n.textContent = `${i + 1} / ${PHOTOS.length}  -  tap sides to browse`; };
    v.addEventListener("click", (e) => { if (e.target.closest(".x")) return v.remove(); show(e.clientX < innerWidth / 2 ? i - 1 : i + 1); });
    show(i); sheet.append(v);
  }
  async function buildGithub(container) {
    container.append(el("p", "ph-hint", "Loading latest repos..."));
    const hint = container.firstChild, user = "Asmitcod", key = "gh-repos-v1";
    const ago = (iso) => { const d = Math.floor((Date.now() - new Date(iso)) / 864e5); return d < 1 ? "today" : d < 30 ? d + "d ago" : d < 365 ? Math.floor(d / 30) + "mo ago" : Math.floor(d / 365) + "y ago"; };
    try {
      let repos = null; const c = ss.get(key);
      if (c) repos = JSON.parse(c);
      else {
        const r = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=12`, { headers: { Accept: "application/vnd.github+json" } });
        if (!r.ok) throw new Error("gh"); repos = await r.json(); ss.set(key, JSON.stringify(repos));
      }
      repos = repos.filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase()).slice(0, 8);
      hint.remove();
      repos.forEach((r) => {
        const a = el("a", "card repo"); a.href = r.html_url; a.target = "_blank"; a.rel = "noopener";
        a.innerHTML = `<h4>${esc(r.name)}</h4><p>${esc(r.description || "No description yet.")}</p><div class="repo__meta">${r.language ? `<span><i class="lang-dot"></i>${esc(r.language)}</span>` : ""}<span>\u2605 ${r.stargazers_count}</span><span>updated ${ago(r.pushed_at)}</span></div>`;
        container.append(a);
      });
    } catch (e) { hint.textContent = "Couldn't reach GitHub right now."; }
    const all = el("a", "ph-insta", '<i class="fab fa-github"></i> Open GitHub profile'); all.href = GITHUB; all.target = "_blank"; all.rel = "noopener"; container.append(all);
  }
  function buildTerminal(container) {
    container.innerHTML = '<div class="ph-term__out"></div><div class="ph-term__keys"></div><label class="ph-term__row"><span>visitor@asmit:~$</span><input autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send" aria-label="Terminal input" /></label>';
    const out = $(".ph-term__out", container), keys = $(".ph-term__keys", container), input = $("input", container);
    const print = (html, cls = "") => { const d = el("div", cls, html); out.append(d); out.scrollTop = out.scrollHeight; };
    const link = (h, t) => `<a href="${h}" target="_blank" rel="noopener">${t}</a>`;
    const cmds = {
      about: () => print("Asmit Bisht - final-year B.Tech CS (AI & Robotics) at VIT Chennai.\nI build machine learning and data-driven applications."),
      skills: () => print("Languages : Python, Java, C, C++, SQL, Bash\nWeb       : Flask, Socket.IO, REST APIs, HTML5, CSS3\nData      : PostgreSQL, AWS DynamoDB, data analysis\nAI/ML     : ML, Reinforcement Learning, Agentic AI\nRobotics  : ROS, Raspberry Pi, sensors"),
      projects: () => print("1. Smart Traffic Management System (RL)\n2. AquaJeevan - SIH 2025, Top 100 of 864\n3. EduMadad - Devshouse 2025, Top 65\n4. AQI Monitor - Arduino + MQ135"),
      experience: () => print("Software Engineering Intern\nSankalp Sewa Sansthan (Remote)\n25 May 2025 - 20 Jun 2025"),
      education: () => print("B.Tech CS (AI & Robotics) - VIT Chennai, 2023-2027\nSenior Secondary - St. Joseph's Convent School, Kotdwara"),
      contact: () => print(`Email   : ${link("mailto:" + EMAIL, EMAIL)}\nGitHub  : ${link(GITHUB, "github.com/Asmitcod")}\nLinkedIn: ${link(LINKEDIN, "linkedin.com/in/asmit-bisht-a09682293")}`),
      resume: () => print(link(RESUME, "Open resume")),
      theme: () => { applyTheme(theme === "dark" ? "light" : "dark"); print("theme toggled", "ok"); },
      clear: () => { out.innerHTML = ""; },
      help: () => print("Tap a button below, or type: about, skills, projects, experience, education, contact, resume, theme, clear, sudo hire asmit", "dim"),
    };
    const run = (raw) => {
      const line = raw.trim(); if (!line) return; const lc = line.toLowerCase();
      print(`<span style="color:#3ddc97">visitor@asmit:~$</span> ${esc(line)}`, "cmd");
      if (lc === "sudo hire asmit") {
        print("[sudo] password for recruiter: ********", "dim");
        setTimeout(() => print("Access granted.", "ok"), 600);
        setTimeout(() => print("Excellent decision. Let's talk:"), 1100);
        setTimeout(() => cmds.contact(), 1500);
      } else if (lc.startsWith("sudo")) print("Permission denied. Nice try though.", "err");
      else if (cmds[lc]) cmds[lc]();
      else print(`command not found: ${esc(line)}. Try 'help'.`, "err");
    };
    ["about", "skills", "projects", "experience", "education", "contact", "resume", "theme", "clear", "sudo hire asmit"].forEach((c) => {
      const b = el("button", c.startsWith("sudo") ? "hot" : "", c); b.addEventListener("click", () => { buzz(6); run(c); }); keys.append(b);
    });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { run(input.value); input.value = ""; } });
    print("Welcome to Asmit's terminal.", "ok");
    print("Tap a command below. Try 'sudo hire asmit' :)", "dim");
  }
  function buildContact(container) {
    container.innerHTML = `
      <div class="ph-quick"><a href="mailto:${EMAIL}"><i class="fas fa-envelope"></i> Email</a><a href="${LINKEDIN}" target="_blank" rel="noopener"><i class="fab fa-linkedin"></i> LinkedIn</a></div>
      <form class="ph-form" novalidate>
        <label for="ph-n">Name</label><input id="ph-n" name="name" required autocomplete="name" />
        <label for="ph-e">Email</label><input id="ph-e" name="email" type="email" required autocomplete="email" inputmode="email" />
        <label for="ph-m">Message</label><textarea id="ph-m" name="message" rows="5" required></textarea>
        <button class="ph-send" type="submit">Send message</button>
        <div class="ph-status-msg" role="status"></div>
      </form>`;
    const form = $("form", container), msg = $(".ph-status-msg", container);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { msg.className = "ph-status-msg err"; msg.textContent = "Please fill in all fields."; return; }
      msg.className = "ph-status-msg"; msg.textContent = "Sending...";
      try {
        const r = await fetch(FORM_ACTION, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error();
        msg.className = "ph-status-msg ok"; msg.textContent = "Thanks! Your message has been sent."; form.reset(); buzz([10, 40, 10]);
      } catch (err) { msg.className = "ph-status-msg err"; msg.textContent = "Something went wrong. Try the Email button."; }
    });
  }
})();