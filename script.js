(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Theme ---------- */
  const body = document.body;
  const themeBtn = $("#theme-toggle");
  const applyTheme = (t) => {
    body.classList.remove("dark", "light");
    body.classList.add(t);
    themeBtn.innerHTML = `<i class="fas ${t === "dark" ? "fa-sun" : "fa-moon"}"></i>`;
    try { localStorage.setItem("portfolio-theme", t); } catch (e) {}
    initParticleColors();
  };
  let saved = "dark";
  try { saved = localStorage.getItem("portfolio-theme") || "dark"; } catch (e) {}
  if (saved !== "dark" && saved !== "light") saved = "dark";
  themeBtn.addEventListener("click", () => applyTheme(body.classList.contains("dark") ? "light" : "dark"));

  /* ---------- Preloader ---------- */
  const loader = $("#loader"), fill = $("#loader-fill"), ltext = $("#loader-text");
  let pct = 0;
  const msgs = ["compiling skills", "loading projects", "warming up neural nets", "almost there"];
  const loadTimer = setInterval(() => {
    pct = Math.min(100, pct + 6 + Math.random() * 14);
    fill.style.width = pct + "%";
    ltext.textContent = `${msgs[Math.min(3, Math.floor(pct / 26))]}... ${Math.floor(pct)}%`;
    if (pct >= 100) {
      clearInterval(loadTimer);
      setTimeout(() => { loader.classList.add("hide"); startHero(); }, 250);
    }
  }, reduced ? 10 : 110);

  /* ---------- Particle network background ---------- */
  const canvas = $("#bg-canvas"), ctx = canvas.getContext("2d");
  let W, H, particles = [], mouse = { x: -9999, y: -9999 }, dotColor = "92,142,255";
  function initParticleColors() { dotColor = body.classList.contains("dark") ? "92,142,255" : "47,107,255"; }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * dpr; H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.floor((innerWidth * innerHeight) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 1.6 + .6
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, md = Math.hypot(dx, dy);
      if (md < 120) { p.x += dx / md * 1.2; p.y += dy / md * 1.2; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(${dotColor},.8)`; ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(${dotColor},${(1 - d / 130) * .22})`;
          ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  applyTheme(saved);
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  if (!reduced) draw();

  /* ---------- Cursor glow ---------- */
  const glow = $("#cursor-glow");
  if (finePointer && !reduced) {
    window.addEventListener("mousemove", (e) => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; });
  } else glow.style.display = "none";

  /* ---------- Typing effect ---------- */
  const typedEl = $("#typed");
  const words = ["machine learning systems.", "data-driven applications.", "full-stack web apps.", "IoT + AI solutions.", "smart traffic agents."];
  function startHero() {
    if (reduced) { typedEl.textContent = words[0]; return; }
    let w = 0, c = 0, del = false;
    (function tick() {
      const word = words[w];
      typedEl.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 75);
    })();
  }

  /* ---------- Scroll reveal (staggered) ---------- */
  $$(".grid, .timeline, .hero__text, .stats").forEach((group) => {
    $$(":scope > .reveal", group).forEach((el, i) => el.style.setProperty("--d", i * 0.1 + "s"));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        if (e.target.classList.contains("stats")) runCounters();
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Animated counters ---------- */
  let counted = false;
  function runCounters() {
    if (counted) return; counted = true;
    $$(".stat__num").forEach((el) => {
      const target = +el.dataset.count, dur = 1600, t0 = performance.now();
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  /* ---------- 3D tilt + spotlight on cards ---------- */
  $$(".tilt").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty("--mx", x + "px"); el.style.setProperty("--my", y + "px");
      if (!finePointer || reduced) return;
      const rx = ((y / r.height) - .5) * -8, ry = ((x / r.width) - .5) * 8;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Name glitch on hover ---------- */
  const nameEl = $(".grad");
  const symbols = "!<>-_\\/[]{}=+*^?#01".split("");
  let glitchTimer = 0, symW = null;
  nameEl.addEventListener("mouseenter", () => {
    if (reduced) return;
    const final = nameEl.dataset.glitch, words = final.split(" ");
    clearInterval(glitchTimer);

    /* Only the characters may change, never the layout. Random glyphs are wider than the real letters, which used
       to re-wrap the title; the hero is vertically centred, so the whole text block (hello, title, role) jumped up.
       Fix: every letter sits in a fixed-width cell (its own real width) and only draws symbols that fit that cell. */
    if (!symW) {
      const probe = document.createElement("span"); probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre;left:0;top:0";
      nameEl.parentNode.appendChild(probe);
      symW = symbols.map((c) => { probe.textContent = c; return probe.getBoundingClientRect().width; });
      probe.remove();
    }
    nameEl.innerHTML = words.map((w) => `<span>${[...w].map((c) => `<span>${c}</span>`).join("")}</span>`).join(" ");
    const wordEls = [...nameEl.children], cells = wordEls.map((w) => [...w.children]);
    const wW = wordEls.map((w) => w.getBoundingClientRect().width), cW = cells.map((row) => row.map((c) => c.getBoundingClientRect().width));
    wordEls.forEach((w, i) => {
      w.style.cssText = `display:inline-block;white-space:nowrap;width:${wW[i]}px`;
      cells[i].forEach((c, k) => { c.style.cssText = `display:inline-block;text-align:center;width:${cW[i][k]}px`; });
    });
    let frame = 0;
    glitchTimer = setInterval(() => {
      let idx = 0;
      cells.forEach((row, wi) => {
        row.forEach((c, k) => {
          if (idx++ < frame / 2) { c.textContent = words[wi][k]; return; }
          const fit = symbols.filter((_, n) => symW[n] <= cW[wi][k] * 1.15 + 3);
          c.textContent = (fit.length ? fit : ["!"])[Math.floor(Math.random() * (fit.length || 1))];
        });
        idx++; /* the space between words */
      });
      if (++frame > final.length * 2) { clearInterval(glitchTimer); nameEl.textContent = final; }
    }, 30);
  });

  /* ---------- Scroll: progress, header, active link, timeline, to-top ---------- */
  const header = $("#header"), prog = $("#progress"), toTop = $("#to-top"), tlFill = $("#timeline-fill");
  const timeline = $(".timeline");
  const sections = $$("main section[id]"), links = $$(".nav__link");
  function onScroll() {
    const st = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (st / max * 100) + "%";
    header.classList.toggle("scrolled", st > 30);
    toTop.classList.toggle("show", st > 600);
    let current = "";
    sections.forEach((s) => { if (st + 140 >= s.offsetTop) current = s.id; });
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * .65 - r.top) / r.height));
      tlFill.style.height = p * 100 + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menu-btn"), nav = $("#nav");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.innerHTML = `<i class="fas ${open ? "fa-times" : "fa-bars"}"></i>`;
  });
  links.forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open"); menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  }));

  /* ---------- Contact form (Formspree via fetch) ---------- */
  const form = $("#contact-form"), status = $("#form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = ""; status.textContent = "Sending...";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (res.ok) { status.className = "ok"; status.textContent = "Thanks! Your message has been sent."; form.reset(); }
      else throw new Error();
    } catch (err) {
      status.className = "err"; status.textContent = "Something went wrong. Please try again or use the Email button.";
    }
  });
/* Easter egg: Konami code -> matrix rain */
const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","c","a"];
let kpos = 0;
window.addEventListener("keydown", (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  kpos = k === konami[kpos] ? kpos + 1 : (k === konami[0] ? 1 : 0);
  if (kpos === konami.length) { kpos = 0; matrixRain(); }
});

function matrixRain(duration = 6000) {
  if (reduced || $("#matrix")) return;
  const c = document.createElement("canvas");
  c.id = "matrix";
  c.style.cssText = "position:fixed;inset:0;z-index:99999;pointer-events:none;width:100%;height:100%";
  document.body.appendChild(c);
  c.width = innerWidth; c.height = innerHeight;
  const g = c.getContext("2d"), size = 16;
  const drops = Array(Math.floor(c.width / size)).fill(1);
  const chars = "01アイウエオカキクケコ<>{}[]=+*";
  const id = setInterval(() => {
    g.fillStyle = "rgba(0,0,0,0.08)"; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = "#00ff9c"; g.font = size + "px monospace";
    drops.forEach((y, i) => {
      g.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size);
      drops[i] = y * size > c.height && Math.random() > 0.975 ? 0 : y + 1;
    });
  }, 40);
  setTimeout(() => {
    clearInterval(id); c.style.transition = "opacity .8s"; c.style.opacity = 0;
    setTimeout(() => c.remove(), 800);
  }, duration);
}
console.log("%cHey, fellow developer 👋", "font:700 20px Poppins,sans-serif;color:#00e5ff");
console.log("%cCurious how this is built? github.com/Asmitcod/Portfolio\nTry the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A",
  "color:#7f8db8;font-size:12px;line-height:1.6");
  /* ---------- Hidden terminal ---------- */
{
  const term = $("#term"), tbody = $("#term-body"), tinput = $("#term-input");
  const hist = []; let hi = 0, booted = false;
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const print = (html, cls = "") => {
    const d = document.createElement("div");
    d.className = "term-line " + cls; d.innerHTML = html;
    tbody.appendChild(d); tbody.scrollTop = tbody.scrollHeight;
  };
  const a = (href, label) => `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
  const EMAIL = "bishtasmit15@gmail.com";

  const cmds = {
    help: () => print("Available commands:\n  about       who I am\n  skills      what I work with\n  projects    things I've built\n  experience  internship\n  education   where I study\n  achievements\n  contact     how to reach me\n  resume      open my resume\n  theme       toggle dark/light\n  matrix      surprise\n  clear       clear screen\n  exit        close terminal"),
    about: () => print("Asmit Bisht - final-year B.Tech CS (AI & Robotics) at VIT Chennai.\nI build machine learning and data-driven applications with Python, SQL and Flask."),
    skills: () => print("Languages : Python, Java, C, C++, SQL, Bash\nWeb       : Flask, Socket.IO, REST APIs, HTML5, CSS3\nData      : PostgreSQL, AWS DynamoDB, data analysis\nAI/ML     : Machine Learning, Reinforcement Learning, Agentic AI\nRobotics  : ROS, Raspberry Pi, sensor integration"),
    projects: () => print("1. Smart Traffic Management System - RL traffic signal controller + live dashboard\n2. AquaJeevan - AI/ML + IoT water-borne disease prediction (SIH 2025, Top 100 of 864)\n3. EduMadad - student loan assistance portal (Devshouse 2025, Top 65)\n4. AQI Monitor - Arduino + MQ135 air quality visualizer"),
    experience: () => print("Software Engineering Intern - Sankalp Sewa Sansthan (Remote)\n25 May 2025 - 20 Jun 2025"),
    education: () => print("B.Tech Computer Science (AI & Robotics) - VIT Chennai, 2023-2027\nSenior Secondary - St. Joseph's Convent School, Kotdwara"),
    achievements: () => print("- Smart India Hackathon 2025: Top 100 of 864 teams\n- Devshouse 2025: Top 65 nationally\n- IBM (Cognitive Class): Building AI Agents with Agentic AI"),
    contact: () => print(`Email   : ${a("mailto:" + EMAIL, EMAIL)}\nGitHub  : ${a("https://github.com/Asmitcod", "github.com/Asmitcod")}\nLinkedIn: ${a("https://www.linkedin.com/in/asmit-bisht-a09682293", "linkedin.com/in/asmit-bisht-a09682293")}`),
    resume: () => print(a("https://drive.google.com/file/d/1a-dny1H9XHqNxDMo3nl0PZ57saBiGXLK/view", "Open resume")),
    ls: () => print("about  skills  projects  experience  education  achievements  contact", "dim"),
    whoami: () => print("visitor (but a very welcome one)"),
    date: () => print(new Date().toString(), "dim"),
    theme: () => { $("#theme-toggle").click(); print("theme toggled", "ok"); },
    matrix: () => { if (typeof matrixRain === "function") { matrixRain(); print("wake up, visitor...", "ok"); } else print("matrix module not installed", "err"); },
    clear: () => { tbody.innerHTML = ""; },
    exit: () => closeTerm(),
  };

  function run(raw) {
    const line = raw.trim(); if (!line) return;
    print(`<span style="color:#3ddc97">visitor@asmit:~$</span> ${esc(line)}`, "cmd");
    const lc = line.toLowerCase();
    if (lc === "sudo hire asmit") {
      print("[sudo] password for recruiter: ********", "dim");
      setTimeout(() => print("Access granted.", "ok"), 600);
      setTimeout(() => print("Excellent decision. Let's talk:"), 1100);
      setTimeout(() => cmds.contact(), 1500);
    } else if (lc.startsWith("sudo")) {
      print("Permission denied. Nice try though.", "err");
    } else if (cmds[lc]) {
      cmds[lc]();
    } else {
      print(`command not found: ${esc(line)}. Type 'help' for commands.`, "err");
    }
  }

  function openTerm() {
    term.classList.add("open"); term.setAttribute("aria-hidden", "false");
    if (!booted) {
      booted = true;
      print("Welcome to Asmit's terminal.", "ok");
      print("Type 'help' to see commands. Try 'sudo hire asmit' :)", "dim");
    }
    focusSoon(tinput);
  }
  function closeTerm() { term.classList.remove("open"); term.setAttribute("aria-hidden", "true"); tinput.blur(); }
  const toggleTerm = () => (term.classList.contains("open") ? closeTerm() : openTerm());

  $("#term-fab").addEventListener("click", toggleTerm);
  $("#term-close").addEventListener("click", closeTerm);
  term.addEventListener("click", () => tinput.focus());

  window.addEventListener("keydown", (e) => {
    const t = e.target.tagName, typing = t === "INPUT" || t === "TEXTAREA" || e.target.isContentEditable;
    if (e.key === "`" && !typing) { e.preventDefault(); toggleTerm(); }
    if (e.key === "Escape" && term.classList.contains("open")) closeTerm();
  });

  tinput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { hist.push(tinput.value); hi = hist.length; run(tinput.value); tinput.value = ""; }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (hi > 0) tinput.value = hist[--hi]; }
    else if (e.key === "ArrowDown") { e.preventDefault(); tinput.value = hi < hist.length - 1 ? hist[++hi] : ((hi = hist.length), ""); }
    else if (e.key === "Tab") {
      e.preventDefault();
      const m = Object.keys(cmds).filter((c) => c.startsWith(tinput.value.toLowerCase()));
      if (m.length === 1) tinput.value = m[0];
    }
  });
}

  /* focus helper: retries briefly, because freshly shown overlays can refuse focus for a frame */
  function focusSoon(el) {
    [0, 60, 200, 450].forEach((ms) => setTimeout(() => { if (document.activeElement !== el) el.focus({ preventScroll: true }); }, ms));
  }

  /* ---------- Flip photo <-> Minecraft avatar ---------- */
  {
    const flip = $("#flip"), hint = $("#flip-hint");
    if (flip) {
      flip.addEventListener("click", () => {
        const on = flip.classList.toggle("flipped");
        flip.setAttribute("aria-pressed", String(on));
        if (hint) hint.textContent = on ? "flip back" : "click me";
      });
    }
  }

  /* ---------- Command palette (Ctrl/Cmd + K) ---------- */
  {
    const root = $("#cmdk"), input = $("#cmdk-input"), list = $("#cmdk-list");
    const go = (id) => () => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
    const link = (url) => () => window.open(url, "_blank", "noopener");
    const project = (name) => () => {
      const h = $$("#projects .project h3").find((x) => x.textContent.includes(name));
      const card = h && h.closest(".project");
      if (!card) return go("projects")();
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.remove("flash"); void card.offsetWidth; card.classList.add("flash");
    };
    const ghTarget = () => { const g = $("#gh"); (g && !g.hidden ? go("gh") : go("projects"))(); };
    const items = [
      { g: "Go to", icon: "fas fa-user", label: "About", run: go("about"), k: "home top hero intro" },
      { g: "Go to", icon: "fas fa-briefcase", label: "Experience", run: go("experience"), k: "internship work" },
      { g: "Go to", icon: "fas fa-diagram-project", label: "Projects", run: go("projects"), k: "work portfolio" },
      { g: "Go to", icon: "fab fa-github", label: "GitHub activity", run: ghTarget, k: "repos latest code" },
      { g: "Go to", icon: "fas fa-code", label: "Skills", run: go("skills"), k: "tech stack languages" },
      { g: "Go to", icon: "fas fa-graduation-cap", label: "Education", run: go("education"), k: "college school vit" },
      { g: "Go to", icon: "fas fa-trophy", label: "Achievements", run: go("achievements"), k: "awards certificate hackathon" },
      { g: "Go to", icon: "fas fa-microscope", label: "Research", run: go("research"), k: "paper fintech" },
      { g: "Go to", icon: "fas fa-envelope", label: "Contact", run: go("contact"), k: "message hire form" },
      { g: "Projects", icon: "fas fa-traffic-light", label: "Smart Traffic Management System", run: project("Smart Traffic"), k: "reinforcement learning rl flask" },
      { g: "Projects", icon: "fas fa-droplet", label: "AquaJeevan", run: project("AquaJeevan"), k: "sih iot water health" },
      { g: "Projects", icon: "fas fa-graduation-cap", label: "EduMadad", run: project("EduMadad"), k: "loan devshouse portal" },
      { g: "Projects", icon: "fas fa-wind", label: "AQI Monitor", run: project("AQI"), k: "arduino air quality" },
      { g: "Links", icon: "fab fa-github", label: "Open GitHub profile", run: link("https://github.com/Asmitcod"), k: "code repos" },
      { g: "Links", icon: "fab fa-linkedin", label: "Open LinkedIn", run: link("https://www.linkedin.com/in/asmit-bisht-a09682293"), k: "profile connect" },
      { g: "Links", icon: "fas fa-file-lines", label: "Open resume", run: link("https://drive.google.com/file/d/1a-dny1H9XHqNxDMo3nl0PZ57saBiGXLK/view"), k: "cv download" },
      { g: "Links", icon: "fas fa-certificate", label: "View IBM Agentic AI certificate", run: link("https://courses.ibmcep.cognitiveclass.ai/certificates/309f0a4d4d7642dc80aebb8b332074c9"), k: "ibm cognitive class" },
      { g: "Links", icon: "fab fa-instagram", label: "Open Instagram (photography)", run: link("https://www.instagram.com/pixels.in3d_vitc"), k: "photos" },
      { g: "Links", icon: "fas fa-image", label: "Photo gallery", run: () => { location.href = "gallery.html"; }, k: "pictures" },
      { g: "Links", icon: "fas fa-paper-plane", label: "Email me", run: link("https://mail.google.com/mail/?view=cm&fs=1&to=bishtasmit15@gmail.com"), k: "mail gmail" },
      { g: "Actions", icon: "fas fa-circle-half-stroke", label: "Toggle dark / light theme", run: () => $("#theme-toggle").click(), k: "mode color" },
      { g: "Actions", icon: "fas fa-terminal", label: "Open terminal", run: () => { const f = $("#term-fab"); if (f) f.click(); }, k: "console shell cli" },
      { g: "Actions", icon: "fas fa-user-astronaut", label: "Flip my photo to avatar", run: () => { go("about")(); setTimeout(() => { const f = $("#flip"); if (f) f.click(); }, 500); }, k: "minecraft picture" },
      { g: "Actions", icon: "fas fa-wand-magic-sparkles", label: "Matrix rain", run: () => { if (typeof matrixRain === "function") matrixRain(); }, k: "easter egg surprise" },
      { g: "Actions", icon: "fas fa-arrow-up", label: "Back to top", run: () => window.scrollTo({ top: 0, behavior: "smooth" }), k: "scroll" },
    ];

    let shown = [], sel = 0, lastFocus = null;
    const score = (it, q) => {
      const hay = (it.label + " " + it.g + " " + it.k).toLowerCase();
      const parts = q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!parts.every((p) => hay.includes(p))) return -1;
      return it.label.toLowerCase().startsWith(q.toLowerCase()) ? 2 : it.label.toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
    };
    function render() {
      const q = input.value.trim();
      shown = (q ? items.map((it) => [it, score(it, q)]).filter((x) => x[1] >= 0).sort((a, b) => b[1] - a[1]).map((x) => x[0]) : items);
      if (sel >= shown.length) sel = 0;
      list.innerHTML = "";
      if (!shown.length) { list.innerHTML = '<li class="cmdk__empty">No results. Try "projects" or "theme".</li>'; return; }
      let group = "";
      shown.forEach((it, i) => {
        if (!q && it.g !== group) { group = it.g; const h = document.createElement("li"); h.className = "cmdk__group"; h.textContent = group; list.appendChild(h); }
        const li = document.createElement("li");
        li.className = "cmdk__item" + (i === sel ? " active" : "");
        li.setAttribute("role", "option");
        li.innerHTML = `<i class="${it.icon}"></i><span></span>${q ? "<small></small>" : ""}`;
        li.children[1].textContent = it.label;
        if (q) li.children[2].textContent = it.g;
        li.addEventListener("mousemove", () => { if (sel !== i) { sel = i; mark(); } });
        li.addEventListener("click", () => exec(i));
        list.appendChild(li);
      });
    }
    function mark() {
      $$(".cmdk__item", list).forEach((el, i) => el.classList.toggle("active", i === sel));
      const a = $(".cmdk__item.active", list); if (a) a.scrollIntoView({ block: "nearest" });
    }
    function open() {
      lastFocus = document.activeElement; sel = 0; input.value = ""; render();
      root.classList.add("open"); root.setAttribute("aria-hidden", "false");
      focusSoon(input);
    }
    function close() {
      root.classList.remove("open"); root.setAttribute("aria-hidden", "true");
      if (lastFocus && lastFocus.focus) lastFocus.blur();
    }
    function exec(i) { const it = shown[i]; if (!it) return; close(); setTimeout(it.run, 120); }

    input.addEventListener("input", () => { sel = 0; render(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(shown.length, 1); mark(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(shown.length, 1); mark(); }
      else if (e.key === "Enter") { e.preventDefault(); exec(sel); }
    });
    root.addEventListener("click", (e) => { if (e.target === root) close(); });
    $("#cmdk-btn").addEventListener("click", open);
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); root.classList.contains("open") ? close() : open(); }
      else if (e.key === "Escape" && root.classList.contains("open")) close();
    });
  }

  /* ---------- Latest repos from GitHub ---------- */
  (async () => {
    const box = $("#gh"), grid = $("#gh-grid");
    if (!box || !grid) return;
    const user = "Asmitcod", cacheKey = "gh-repos-v1";
    const colors = { Python: "#3572A5", JavaScript: "#f1e05a", HTML: "#e34c26", CSS: "#563d7c", Java: "#b07219", C: "#555555", "C++": "#f34b7d", Shell: "#89e051", Jupyter: "#DA5B0B", "Jupyter Notebook": "#DA5B0B", TypeScript: "#3178c6" };
    const ago = (iso) => {
      const d = Math.floor((Date.now() - new Date(iso)) / 864e5);
      return d < 1 ? "today" : d < 30 ? d + "d ago" : d < 365 ? Math.floor(d / 30) + "mo ago" : Math.floor(d / 365) + "y ago";
    };
    try {
      let repos; const cached = sessionStorage.getItem(cacheKey);
      if (cached) repos = JSON.parse(cached);
      else {
        const r = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=12`, { headers: { Accept: "application/vnd.github+json" } });
        if (!r.ok) throw new Error("github " + r.status);
        repos = await r.json();
        try { sessionStorage.setItem(cacheKey, JSON.stringify(repos)); } catch (e) {}
      }
      repos = repos.filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase()).slice(0, 6);
      if (!repos.length) return;
      repos.forEach((r) => {
        const a = document.createElement("a");
        a.className = "card repo"; a.href = r.html_url; a.target = "_blank"; a.rel = "noopener";
        const h = document.createElement("h4"); h.textContent = r.name;
        const p = document.createElement("p"); p.textContent = r.description || "No description yet.";
        const m = document.createElement("div"); m.className = "repo__meta";
        if (r.language) { const l = document.createElement("span"); const dot = document.createElement("i"); dot.className = "lang-dot"; dot.style.background = colors[r.language] || "var(--primary)"; l.append(dot, r.language); m.append(l); }
        const st = document.createElement("span"); st.textContent = "\u2605 " + r.stargazers_count; m.append(st);
        const up = document.createElement("span"); up.textContent = "updated " + ago(r.pushed_at); m.append(up);
        a.append(h, p, m); grid.append(a);
      });
      box.hidden = false;
    } catch (err) { /* stay hidden if GitHub is unreachable */ }
  })();

  $("#year").textContent = new Date().getFullYear();
})();
