/* =========================================================
   Recruiter Mode v2 — HUD sci-fi rewrite
   ========================================================= */
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================================================================
     SLIDE DATA
     ================================================================ */
  const SLIDES = [

    /* 0 — IDENTITY */
    {
      accent: "#00e5ff",
      labelText: "AB-2027 // IDENTITY",
      build: () => `
        <div class="rec-corner rec-corner--tl"></div>
        <div class="rec-corner rec-corner--tr"></div>
        <div class="rec-corner rec-corner--bl"></div>
        <div class="rec-corner rec-corner--br"></div>
        <div class="rec-card__label"><i class="fas fa-id-badge"></i> 01 · IDENT</div>
        <h2 class="rec-card__title" data-text="Asmit Bisht"><span>Asmit Bisht</span></h2>
        <p class="rec-card__sub">› Final-year B.Tech &nbsp;/&nbsp; CS (AI &amp; Robotics) &nbsp;/&nbsp; VIT Chennai</p>
        <div class="rec-divider"></div>
        <p class="rec-card__body">
          CS engineer specialised in <strong style="color:#00e5ff">AI &amp; Robotics</strong>.
          I turn messy real-world data into deployed systems — accessibility maps,
          IoT health monitors, loan-access portals and developer tools. Clean Python, solid SQL,
          obsessed with the gap between a model and a <em style="color:#b46cff">shipped product</em>.
        </p>
        <div class="rec-card__tags" style="margin-top:.5rem">
          <span class="rec-card__tag">Python</span>
          <span class="rec-card__tag">Java</span>
          <span class="rec-card__tag">SQL</span>
          <span class="rec-card__tag">C / C++</span>
          <span class="rec-card__tag accent">Machine Learning</span>
          <span class="rec-card__tag accent">Agentic AI</span>
          <span class="rec-card__tag green">Open to Hire · 2027</span>
        </div>`,
    },

    /* 1 — STATS */
    {
      accent: "#00e5ff",
      labelText: "AB-2027 // METRICS",
      build: () => `
        <div class="rec-corner rec-corner--tl"></div>
        <div class="rec-corner rec-corner--tr"></div>
        <div class="rec-corner rec-corner--bl"></div>
        <div class="rec-corner rec-corner--br"></div>
        <div class="rec-card__label"><i class="fas fa-chart-line"></i> 02 · METRICS</div>
        <h2 class="rec-card__title" data-text="Impact at a glance">Impact <span>at a glance</span></h2>
        <div class="rec-stats-grid">
          <div class="rec-stat">
            <div class="rec-stat__num">TOP&nbsp;<span>100</span></div>
            <div class="rec-stat__label">of 864 teams · SIH '25</div>
          </div>
          <div class="rec-stat">
            <div class="rec-stat__num">TOP&nbsp;<span>65</span></div>
            <div class="rec-stat__label">nationally · Devshouse '25</div>
          </div>
          <div class="rec-stat">
            <div class="rec-stat__num"><span>4</span>+</div>
            <div class="rec-stat__label">projects shipped</div>
          </div>
          <div class="rec-stat">
            <div class="rec-stat__num"><span>88</span>%</div>
            <div class="rec-stat__label">senior secondary score</div>
          </div>
        </div>`,
    },

    /* 2 — EXPERIENCE */
    {
      accent: "#b46cff",
      labelText: "AB-2027 // EXPERIENCE",
      build: () => `
        <div class="rec-corner rec-corner--tl"></div>
        <div class="rec-corner rec-corner--tr"></div>
        <div class="rec-corner rec-corner--bl"></div>
        <div class="rec-corner rec-corner--br"></div>
        <div class="rec-card__label"><i class="fas fa-briefcase"></i> 03 · EXPERIENCE</div>
        <h2 class="rec-card__title" data-text="Where I've worked">Where I've <span>worked</span></h2>
        <div class="rec-project" style="margin-top:.3rem">
          <div class="rec-project__icon"><i class="fas fa-code"></i></div>
          <div style="flex:1">
            <div class="rec-project__title">Software Engineering Intern</div>
            <div class="rec-project__desc">Sankalp Sewa Sansthan &nbsp;·&nbsp; Remote</div>
            <div class="rec-project__desc" style="color:#00e5ff;margin-top:.25rem">
              May 2025 &ndash; Jun 2025
            </div>
            <p style="margin-top:.5rem;font-size:.8rem;color:rgba(180,200,240,.75)">
              Contributed to the organisation's web presence and software development during a remote internship.
            </p>
          </div>
        </div>
        <div class="rec-divider"></div>
        <div class="rec-project">
          <div class="rec-project__icon"><i class="fas fa-graduation-cap"></i></div>
          <div style="flex:1">
            <div class="rec-project__title">B.Tech — Computer Science (AI &amp; Robotics)</div>
            <div class="rec-project__desc">VIT University, Chennai Campus</div>
            <div class="rec-project__desc" style="color:#00e5ff;margin-top:.25rem">Aug 2023 &ndash; Jul 2027</div>
            <div class="rec-project__desc" style="margin-top:.3rem">DSA · DBMS · Computer Networks · OS · Computer Architecture</div>
          </div>
        </div>`,
    },

    /* 3 — PROJECTS */
    {
      accent: "#00e5ff",
      labelText: "AB-2027 // PROJECTS",
      build: () => `
        <div class="rec-corner rec-corner--tl"></div>
        <div class="rec-corner rec-corner--tr"></div>
        <div class="rec-corner rec-corner--bl"></div>
        <div class="rec-corner rec-corner--br"></div>
        <div class="rec-card__label"><i class="fas fa-diagram-project"></i> 04 · PROJECTS</div>
        <h2 class="rec-card__title" data-text="Things I've built">Things I've <span>built</span></h2>
        <div class="rec-projects">
          <div class="rec-project">
            <div class="rec-project__icon"><i class="fas fa-graduation-cap"></i></div>
            <div style="flex:1">
              <div class="rec-project__title">EduMadad — Student Loan Portal</div>
              <div class="rec-project__desc">PostgreSQL · Gemini AI · education financing access</div>
            </div>
            <span class="rec-project__pill">Top 65</span>
          </div>
          <div class="rec-project">
            <div class="rec-project__icon"><i class="fas fa-droplet"></i></div>
            <div style="flex:1">
              <div class="rec-project__title">AquaJeevan — Smart Water Surveillance</div>
              <div class="rec-project__desc">AI/ML + IoT · water-borne disease prediction · rural India</div>
            </div>
            <span class="rec-project__pill">SIH '25</span>
          </div>
          <div class="rec-project">
            <div class="rec-project__icon"><i class="fas fa-universal-access"></i></div>
            <div style="flex:1">
              <div class="rec-project__title">AccessMap — Accessibility Map</div>
              <div class="rec-project__desc">React / TypeScript · Spring Boot · community accessibility reports</div>
            </div>
            <span class="rec-project__pill">Full-stack</span>
          </div>
          <div class="rec-project">
            <div class="rec-project__icon"><i class="fas fa-triangle-exclamation"></i></div>
            <div style="flex:1">
              <div class="rec-project__title">Failure Triage Assistant</div>
              <div class="rec-project__desc">Next.js / TypeScript · GitHub Actions · deterministic failure classification</div>
            </div>
            <span class="rec-project__pill">Dev tooling</span>
          </div>
        </div>`,
    },

    /* 4 — SKILLS */
    {
      accent: "#b46cff",
      labelText: "AB-2027 // TECH STACK",
      build: () => `
        <div class="rec-corner rec-corner--tl"></div>
        <div class="rec-corner rec-corner--tr"></div>
        <div class="rec-corner rec-corner--bl"></div>
        <div class="rec-corner rec-corner--br"></div>
        <div class="rec-card__label"><i class="fas fa-microchip"></i> 05 · TECH STACK</div>
        <h2 class="rec-card__title" data-text="What I work with">What I <span>work with</span></h2>
        <div class="rec-skill-cloud">
          <span class="rec-skill-chip rec-skill-chip--lang">Python</span>
          <span class="rec-skill-chip rec-skill-chip--lang">Java</span>
          <span class="rec-skill-chip rec-skill-chip--lang">C / C++</span>
          <span class="rec-skill-chip rec-skill-chip--lang">SQL</span>
          <span class="rec-skill-chip rec-skill-chip--lang">Bash</span>
          <span class="rec-skill-chip rec-skill-chip--ai">Machine Learning</span>
          <span class="rec-skill-chip rec-skill-chip--ai">Agentic AI</span>
          <span class="rec-skill-chip rec-skill-chip--ai">ML Inference</span>
          <span class="rec-skill-chip rec-skill-chip--web">React</span>
          <span class="rec-skill-chip rec-skill-chip--web">TypeScript</span>
          <span class="rec-skill-chip rec-skill-chip--web">Spring Boot</span>
          <span class="rec-skill-chip rec-skill-chip--web">Next.js</span>
          <span class="rec-skill-chip rec-skill-chip--web">REST APIs</span>
          <span class="rec-skill-chip rec-skill-chip--web">HTML5 / CSS3</span>
          <span class="rec-skill-chip rec-skill-chip--data">PostgreSQL</span>
          <span class="rec-skill-chip rec-skill-chip--data">AWS DynamoDB</span>
          <span class="rec-skill-chip rec-skill-chip--data">Data Analysis</span>
          <span class="rec-skill-chip rec-skill-chip--data">Schema Design</span>
          <span class="rec-skill-chip rec-skill-chip--data">Git / GitHub</span>
          <span class="rec-skill-chip rec-skill-chip--data">AWS</span>
          <span class="rec-skill-chip rec-skill-chip--iot">ROS</span>
          <span class="rec-skill-chip rec-skill-chip--iot">Raspberry Pi</span>
          <span class="rec-skill-chip rec-skill-chip--iot">Sensor Integration</span>
        </div>`,
    },

    /* 5 — ACHIEVEMENTS */
    {
      accent: "#ffd166",
      labelText: "AB-2027 // ACHIEVEMENTS",
      build: () => `
        <div class="rec-corner rec-corner--tl"></div>
        <div class="rec-corner rec-corner--tr"></div>
        <div class="rec-corner rec-corner--bl"></div>
        <div class="rec-corner rec-corner--br"></div>
        <div class="rec-card__label"><i class="fas fa-trophy"></i> 06 · ACHIEVEMENTS</div>
        <h2 class="rec-card__title" data-text="Awards &amp; certs">Awards &amp; <span>certs</span></h2>
        <div class="rec-badges">
          <div class="rec-badge rec-badge--gold">
            <div class="rec-badge__icon"><i class="fas fa-trophy"></i></div>
            <div>
              <div class="rec-badge__title">Smart India Hackathon 2025</div>
              <div class="rec-badge__sub">Top 100 of 864 teams &nbsp;·&nbsp; AquaJeevan project</div>
            </div>
          </div>
          <div class="rec-badge rec-badge--blue">
            <div class="rec-badge__icon"><i class="fas fa-medal"></i></div>
            <div>
              <div class="rec-badge__title">Devshouse 2025 — GDG VIT Chennai</div>
              <div class="rec-badge__sub">Top 65 nationally &nbsp;·&nbsp; EduMadad project</div>
            </div>
          </div>
          <div class="rec-badge rec-badge--green">
            <div class="rec-badge__icon"><i class="fas fa-certificate"></i></div>
            <div>
              <div class="rec-badge__title">IBM — Building AI Agents with Agentic AI</div>
              <div class="rec-badge__sub">Cognitive Class certification</div>
            </div>
          </div>
        </div>
        <div class="rec-divider"></div>
        <div class="rec-card__label" style="margin-top:.1rem"><i class="fas fa-microscope"></i> Research</div>
        <p class="rec-card__body" style="font-size:.8rem">
          <em style="color:#b46cff">Gamification of Fintech</em> — how loss aversion, social validation
          &amp; reward mechanics drive impulsive financial decisions in modern fintech apps. (March 2024)
        </p>`,
    },

    /* 6 — CONTACT CTA */
    {
      accent: "#3ddc97",
      labelText: "AB-2027 // CONTACT",
      build: () => `
        <div class="rec-corner rec-corner--tl"></div>
        <div class="rec-corner rec-corner--tr"></div>
        <div class="rec-corner rec-corner--bl"></div>
        <div class="rec-corner rec-corner--br"></div>
        <div class="rec-card__label"><i class="fas fa-satellite-dish"></i> 07 · CONTACT</div>
        <h2 class="rec-card__title" data-text="Hire me.">Ready to <span>hire?</span></h2>
        <p class="rec-card__sub">› Actively seeking internships &amp; full-time roles in AI/ML &amp; Software Engineering.</p>
        <div class="rec-divider"></div>
        <p class="rec-card__body">
          If something in these seven slides clicked —
          let's build something together. I move fast, learn faster, and I like
          <em style="color:#00e5ff">hard problems</em>.
        </p>
        <div class="rec-links" style="margin-top:.6rem">
          <a href="https://drive.google.com/file/d/1a-dny1H9XHqNxDMo3nl0PZ57saBiGXLK/view"
             target="_blank" rel="noopener" class="rec-link rec-link--primary">
            <i class="fas fa-file-arrow-down"></i> Resume
          </a>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=bishtasmit15@gmail.com"
             target="_blank" rel="noopener" class="rec-link">
            <i class="fas fa-envelope"></i> Email
          </a>
          <a href="https://www.linkedin.com/in/asmit-bisht-a09682293"
             target="_blank" rel="noopener" class="rec-link">
            <i class="fab fa-linkedin"></i> LinkedIn
          </a>
          <a href="https://github.com/Asmitcod"
             target="_blank" rel="noopener" class="rec-link">
            <i class="fab fa-github"></i> GitHub
          </a>
        </div>`,
    },
  ];

  /* ================================================================
     CANVAS — animated grid + scanline + floating data nodes
     ================================================================ */
  function spawnCanvas(container) {
    if (reduced) return null;
    const c = document.createElement("canvas");
    c.id = "rec-canvas";
    container.appendChild(c);

    const ctx = c.getContext("2d");
    let W, H, nodes = [], raf;

    function resize() {
      W = c.width  = container.offsetWidth;
      H = c.height = container.offsetHeight;
      spawnNodes();
    }

    function spawnNodes() {
      nodes = Array.from({ length: 28 }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - .5) * .28,
        vy: (Math.random() - .5) * .28,
        r:  Math.random() * 1.2 + .4,
      }));
    }

    function drawGrid() {
      const step = 44;
      ctx.strokeStyle = "rgba(0,229,255,.045)";
      ctx.lineWidth = .8;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
    }

    function drawNodes() {
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,229,255,.5)";
        ctx.fill();
        for (let j = i + 1; j < nodes.length; j++) {
          const q = nodes[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,229,255,${(1 - d / 100) * .14})`;
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      }
    }

    /* slow horizontal scan beam */
    let scanY = 0;
    function drawScan() {
      scanY = (scanY + .35) % H;
      const g = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 20);
      g.addColorStop(0, "transparent");
      g.addColorStop(1, "rgba(0,229,255,.04)");
      ctx.fillStyle = g;
      ctx.fillRect(0, scanY - 60, W, 80);
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      drawScan();
      drawNodes();
      raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      c.remove();
    };
  }

  /* ================================================================
     GLITCH TITLE — brief glitch on card enter
     ================================================================ */
  function glitchTitle(card) {
    if (reduced) return;
    const h = card.querySelector(".rec-card__title");
    if (!h) return;
    h.classList.add("rec-glitch-title");
    setTimeout(() => h.classList.remove("rec-glitch-title"), 380);
  }

  /* ================================================================
     BUILD OVERLAY
     ================================================================ */
  function buildOverlay() {
    const ov = document.createElement("div");
    ov.id = "rec-overlay";
    ov.className = "rec-overlay";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "Recruiter Mode — Asmit Bisht");
    ov.setAttribute("aria-hidden", "true");

    const segs = SLIDES.map((_, i) =>
      `<div class="rec-progress-bar__seg" id="rec-seg-${i}">
         <div class="rec-progress-bar__fill" id="rec-fill-${i}"></div>
       </div>`
    ).join("");

    const cardHTML = SLIDES.map((s, i) =>
      `<article class="rec-card" id="rec-card-${i}"
               style="--card-accent:${s.accent}"
               aria-label="Slide ${i+1} of ${SLIDES.length}: ${s.labelText}">
         ${s.build()}
       </article>`
    ).join("");

    ov.innerHTML = `
      <span class="rec-watermark">ASMIT BISHT // PORTFOLIO 2027</span>

      <div class="rec-stage" id="rec-stage">

        <!-- HUD top bar -->
        <div class="rec-hud-top">
          <span class="rec-hud-top__id" id="rec-hud-id">
            SYS://PORTFOLIO &nbsp; MODULE: RECRUITER_MODE
          </span>
          <span class="rec-hud-top__status">
            <span class="rec-hud-top__dot"></span>
            LIVE FEED
          </span>
        </div>

        <!-- progress -->
        <div class="rec-progress-bar" role="progressbar"
             aria-valuemin="1" aria-valuemax="${SLIDES.length}" aria-valuenow="1">
          ${segs}
        </div>

        <!-- card deck -->
        <div class="rec-deck" id="rec-deck">
          ${cardHTML}
        </div>

        <!-- controls -->
        <div class="rec-controls">
          <div class="rec-controls__left">
            <button class="rec-btn rec-btn--close" id="rec-close"
                    aria-label="Close recruiter mode" title="Close (Esc)">
              <i class="fas fa-xmark"></i>
            </button>
            <button class="rec-btn rec-btn--play" id="rec-play"
                    aria-label="Pause" title="Play / Pause (Space)">
              <i class="fas fa-pause"></i>
            </button>
          </div>

          <span class="rec-counter" id="rec-counter" aria-live="polite">
            <em>01</em> / 07
          </span>

          <div class="rec-controls__right">
            <button class="rec-btn" id="rec-prev"
                    aria-label="Previous slide" title="Previous (←)" disabled>
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="rec-btn" id="rec-next"
                    aria-label="Next slide" title="Next (→)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <p class="rec-hint" aria-hidden="true">
          <kbd>←</kbd><kbd>→</kbd> navigate &nbsp;·&nbsp;
          <kbd>SPC</kbd> pause &nbsp;·&nbsp;
          <kbd>ESC</kbd> exit
        </p>
      </div>
    `;

    document.body.appendChild(ov);
    return ov;
  }

  /* ================================================================
     STATE
     ================================================================ */
  let current = 0, playing = true, fillTimer = null;
  const DURATION = 5500;
  let ov, cards, fills, counter, prevBtn, nextBtn, playBtn;
  let destroyCanvas = null;

  function initRefs() {
    ov      = document.getElementById("rec-overlay");
    cards   = SLIDES.map((_, i) => document.getElementById(`rec-card-${i}`));
    fills   = SLIDES.map((_, i) => document.getElementById(`rec-fill-${i}`));
    counter = document.getElementById("rec-counter");
    prevBtn = document.getElementById("rec-prev");
    nextBtn = document.getElementById("rec-next");
    playBtn = document.getElementById("rec-play");
  }

  /* ================================================================
     TRANSITIONS
     ================================================================ */
  function goTo(idx, dir = "next") {
    const prev = current;
    current = Math.max(0, Math.min(SLIDES.length - 1, idx));
    if (prev === current) return;

    cards[prev].classList.remove("active");
    cards[prev].classList.add(dir === "next" ? "exit-left" : "exit-right");

    cards[current].classList.add(dir === "next" ? "enter-right" : "enter-left");
    void cards[current].offsetWidth;
    cards[current].classList.remove("enter-right", "enter-left");
    cards[current].classList.add("active");

    glitchTitle(cards[current]);

    const leaving = cards[prev];
    const leavingCls = dir === "next" ? "exit-left" : "exit-right";
    setTimeout(() => leaving.classList.remove(leavingCls), 420);

    updateUI();
    if (playing) restartFill();
  }

  /* ================================================================
     PROGRESS FILL
     ================================================================ */
  function startFill(idx, dur) {
    for (let i = idx + 1; i < fills.length; i++) {
      fills[i].style.transition = "none"; fills[i].style.width = "0%";
    }
    for (let i = 0; i < idx; i++) {
      fills[i].style.transition = "none"; fills[i].style.width = "100%";
    }
    fills[idx].style.transition = "none"; fills[idx].style.width = "0%";
    void fills[idx].offsetWidth;
    fills[idx].style.transition = `width ${dur}ms linear`;
    fills[idx].style.width = "100%";
  }

  function restartFill() {
    clearTimeout(fillTimer);
    startFill(current, DURATION);
    fillTimer = setTimeout(() => {
      if (!playing) return;
      if (current < SLIDES.length - 1) goTo(current + 1, "next");
      else { playing = false; updatePlayBtn(); }
    }, DURATION);
  }

  function pauseFill() {
    clearTimeout(fillTimer);
    const w = getComputedStyle(fills[current]).width;
    fills[current].style.transition = "none";
    fills[current].style.width = w;
  }

  /* ================================================================
     UI HELPERS
     ================================================================ */
  function pad(n) { return String(n).padStart(2, "0"); }

  function updateUI() {
    counter.innerHTML = `<em>${pad(current + 1)}</em> / ${pad(SLIDES.length)}`;
    counter.setAttribute("aria-valuenow", current + 1);
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === SLIDES.length - 1;

    /* update accent on the overlay's canvas glow via CSS var */
    const accent = SLIDES[current].accent;
    ov.style.setProperty("--rec-current-accent", accent);

    /* update HUD ID line */
    const hud = document.getElementById("rec-hud-id");
    if (hud) hud.innerHTML = `SYS://PORTFOLIO &nbsp; ${SLIDES[current].labelText}`;
  }

  function updatePlayBtn() {
    playBtn.innerHTML = playing
      ? '<i class="fas fa-pause"></i>'
      : '<i class="fas fa-play"></i>';
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Resume");
  }

  /* ================================================================
     OPEN / CLOSE
     ================================================================ */
  function openRec() {
    if (!ov) { buildOverlay(); initRefs(); bindEvents(); }

    current = 0; playing = true;
    cards.forEach((c, i) => {
      c.className = "rec-card";
      c.style.removeProperty("--card-accent");
      c.style.setProperty("--card-accent", SLIDES[i].accent);
      if (i === 0) c.classList.add("active");
    });
    fills.forEach(f => { f.style.transition = "none"; f.style.width = "0%"; });
    updateUI(); updatePlayBtn();

    ov.classList.add("open");
    ov.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    /* spawn canvas into the overlay */
    if (destroyCanvas) destroyCanvas();
    destroyCanvas = spawnCanvas(ov);

    glitchTitle(cards[0]);
    restartFill();
    setTimeout(() => nextBtn.focus({ preventScroll: true }), 220);
  }

  function closeRec() {
    if (!ov) return;
    clearTimeout(fillTimer);
    if (destroyCanvas) { destroyCanvas(); destroyCanvas = null; }
    ov.classList.remove("open");
    ov.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    const t = document.getElementById("rec-trigger-btn");
    if (t) t.focus({ preventScroll: true });
  }

  /* ================================================================
     EVENTS
     ================================================================ */
  function bindEvents() {
    document.getElementById("rec-close").addEventListener("click", closeRec);
    ov.addEventListener("click", e => { if (e.target === ov) closeRec(); });

    prevBtn.addEventListener("click", () => {
      playing = false; updatePlayBtn(); pauseFill();
      goTo(current - 1, "prev");
    });
    nextBtn.addEventListener("click", () => goTo(current + 1, "next"));

    playBtn.addEventListener("click", () => {
      playing = !playing; updatePlayBtn();
      playing ? restartFill() : pauseFill();
    });

    document.addEventListener("keydown", recKey);
  }

  function recKey(e) {
    if (!ov || !ov.classList.contains("open")) return;
    const tag = document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "Escape")                          { e.preventDefault(); closeRec(); }
    else if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goTo(current + 1, "next"); }
    else if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); playing = false; updatePlayBtn(); pauseFill(); goTo(current - 1, "prev"); }
    else if (e.key === " ")                          { e.preventDefault(); playing = !playing; updatePlayBtn(); playing ? restartFill() : pauseFill(); }
  }

  /* ================================================================
     INJECT TRIGGER BUTTON
     ================================================================ */
  function injectTrigger() {
    const actions = document.querySelector(".header__actions");
    if (!actions) return;
    const btn = document.createElement("button");
    btn.id = "rec-trigger-btn";
    btn.className = "recruiter-btn";
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-controls", "rec-overlay");
    btn.setAttribute("title", "Recruiter Mode — HUD snapshot");
    btn.innerHTML = `
      <span class="recruiter-btn__dot"></span>
      <i class="fas fa-play" style="font-size:.55rem;opacity:.75"></i>
      Recruiter Mode
    `;
    btn.addEventListener("click", openRec);
    actions.insertBefore(btn, actions.firstChild);
  }

  /* ================================================================
     INIT
     ================================================================ */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectTrigger);
  } else {
    injectTrigger();
  }
})();
