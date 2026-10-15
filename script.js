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
  const chars = "!<>-_\\/[]{}=+*^?#01";
  nameEl.addEventListener("mouseenter", () => {
    if (reduced) return;
    const final = nameEl.dataset.glitch; let frame = 0;
    const id = setInterval(() => {
      nameEl.textContent = final.split("").map((ch, i) => ch === " " ? " " : i < frame / 2 ? ch : chars[Math.floor(Math.random() * chars.length)]).join("");
      if (++frame > final.length * 2) { clearInterval(id); nameEl.textContent = final; }
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

  $("#year").textContent = new Date().getFullYear();
})();
