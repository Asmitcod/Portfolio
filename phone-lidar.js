/* phone-lidar.js - a 2D LIDAR scan wallpaper for the phone lock + home screens. No libraries.

   A small robot patrols a warehouse floor plan. Two spinning beams ray-cast the walls, shelves and
   pillars; every return becomes a point that flashes, settles and fades, so the room is drawn as a
   point cloud, the way a robot sees it. Tap anywhere for a sonar ping.

   const w = PhoneLidar.init(canvas, { layout(mode) -> {x,y,w,h,dim}, events: element, lite: bool });
   w.setMode("lock" | "home"); w.pause(bool); w.kick(n); w.pulse(); w.refresh();                      */
(function () {
  "use strict";
  var TAU = Math.PI * 2, LIFE = 11, PSPEED = 320;

  /* ---------- floor plan (0..1 across x and y; stretched to whatever box the layout gives) ---------- */
  var WALLS = [[0, 0, 1, 0], [1, 0, 1, 1], [0, 0, 0, 0.34], [0, 0.44, 0, 1], [0, 1, 0.65, 1], [0.8, 1, 1, 1]]; /* doors: left wall + bottom wall */
  var RECTS = [
    [0.12, 0.10, 0.28, 0.3375], [0.42, 0.10, 0.58, 0.3375], [0.72, 0.10, 0.88, 0.3375],   /* shelf rows */
    [0.12, 0.4625, 0.28, 0.65], [0.42, 0.4625, 0.58, 0.65], [0.72, 0.4625, 0.88, 0.65],
    [0.12, 0.7625, 0.40, 0.85], [0.60, 0.7625, 0.88, 0.85],
    [0.75, 0.3625, 0.81, 0.40], [0.77, 0.659, 0.83, 0.681]                                 /* crates */
  ];
  var DIAGS = [[0.85, 0.88, 0.96, 0.95]];
  var CIRCLES = [[0.5, 0.4, 0.022], [0.5, 0.9125, 0.022]];                                  /* pillars (radius as a share of the box) */
  var ROUTE = [[0.35, 0.0625], [0.65, 0.0625], [0.65, 0.43125], [0.94, 0.43125], [0.94, 0.70625], [0.65, 0.70625], [0.35, 0.70625], [0.35, 0.43125], [0.06, 0.43125], [0.06, 0.0625]];

  /* round the route's corners (two passes of corner cutting) so the robot glides instead of snapping */
  function smooth(pts, n) {
    for (var k = 0; k < n; k++) {
      var out = [];
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i], q = pts[(i + 1) % pts.length];
        out.push([0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]], [0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]]);
      }
      pts = out;
    }
    return pts;
  }
  var PATH = smooth(ROUTE, 2);

  function init(canvas, opts) {
    var ctx = canvas.getContext("2d");
    var host = canvas.parentNode, events = opts.events || document, lite = !!opts.lite;
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var FRAME = lite ? 41 : 33, DA = lite ? 0.022 : 0.011, OMEGA = 1.7;
    var cw = 0, ch = 0, mode = "lock", box = null, tgt = null;
    var segs = [], rects = [], circs = [], maxR = 300, pathPx = [], pathCum = [], pathLen = 1;
    var T = 0, sFrac = 0.02, boost = 0, pos = { x: 0, y: 0, a: 0 }, trail = [], trailT = 0;
    var N = lite ? 1600 : 3400, pu = new Float32Array(N), pv = new Float32Array(N), pb = new Float32Array(N), pd = new Float32Array(N), pa = new Float32Array(N), pi = 0, vis = [new Uint16Array(N), new Uint16Array(N), new Uint16Array(N)], vn = [0, 0, 0];
    for (var z = 0; z < N; z++) pb[z] = -999;
    var beams = [{ a: 0, last: 0, tr: [] }, { a: Math.PI, last: Math.PI, tr: [] }];
    var pings = [], lastPing = -9, raf = 0, paused = false, lastT = 0;

    function X(u) { return box.x + u * box.w; }
    function Y(v) { return box.y + v * box.h; }

    /* ---------- geometry in pixels, rebuilt whenever the box moves ---------- */
    function build() {
      var i, m = Math.min(box.w, box.h);
      segs = []; rects = [];
      for (i = 0; i < WALLS.length; i++) segs.push([X(WALLS[i][0]), Y(WALLS[i][1]), X(WALLS[i][2]), Y(WALLS[i][3])]);
      for (i = 0; i < RECTS.length; i++) {
        var r = RECTS[i], x1 = X(r[0]), y1 = Y(r[1]), x2 = X(r[2]), y2 = Y(r[3]);
        rects.push([x1, y1, x2, y2]);
        segs.push([x1, y1, x2, y1], [x2, y1, x2, y2], [x2, y2, x1, y2], [x1, y2, x1, y1]);
      }
      for (i = 0; i < DIAGS.length; i++) segs.push([X(DIAGS[i][0]), Y(DIAGS[i][1]), X(DIAGS[i][2]), Y(DIAGS[i][3])]);
      circs = CIRCLES.map(function (c) { return [X(c[0]), Y(c[1]), c[2] * m]; });
      maxR = Math.min(380, (box.w + box.h) / 2);
      pathPx = PATH.map(function (p) { return [X(p[0]), Y(p[1])]; });
      pathCum = [0];
      for (i = 0; i < pathPx.length; i++) {
        var a = pathPx[i], b = pathPx[(i + 1) % pathPx.length];
        pathCum.push(pathCum[i] + Math.hypot(b[0] - a[0], b[1] - a[1]));
      }
      pathLen = pathCum[pathCum.length - 1] || 1;
    }
    function robotAt(f) {
      var d = (f % 1) * pathLen, i = 1;
      while (i < pathCum.length - 1 && pathCum[i] < d) i++;
      var a = pathPx[i - 1], b = pathPx[i % pathPx.length], seg = pathCum[i] - pathCum[i - 1] || 1, t = (d - pathCum[i - 1]) / seg;
      return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, a: Math.atan2(b[1] - a[1], b[0] - a[0]) };
    }

    /* ---------- ray casting ---------- */
    function cast(ox, oy, dx, dy) {
      var best = 1e9, i, s, t, u, den, ex, ey;
      for (i = 0; i < segs.length; i++) {
        s = segs[i]; ex = s[2] - s[0]; ey = s[3] - s[1];
        den = dx * ey - dy * ex; if (den > -1e-9 && den < 1e-9) continue;
        t = ((s[0] - ox) * ey - (s[1] - oy) * ex) / den; u = ((s[0] - ox) * dy - (s[1] - oy) * dx) / den;
        if (t > 0.001 && t < best && u >= 0 && u <= 1) best = t;
      }
      for (i = 0; i < circs.length; i++) {
        var c = circs[i], fx = ox - c[0], fy = oy - c[1], b = fx * dx + fy * dy, q = fx * fx + fy * fy - c[2] * c[2], disc = b * b - q;
        if (disc >= 0) { t = -b - Math.sqrt(disc); if (t > 0.001 && t < best) best = t; }
      }
      return best;
    }
    function ray(ox, oy, ang) {
      var dx = Math.cos(ang), dy = Math.sin(ang), t = cast(ox, oy, dx, dy);
      if (t > maxR) return { hit: false, x: ox + dx * maxR, y: oy + dy * maxR, d: 1 };
      var j = (Math.random() + Math.random() + Math.random() - 1.5) * 0.7;      /* sensor noise */
      return { hit: true, x: ox + dx * t + j, y: oy + dy * t + j, d: t / maxR };
    }
    function addPoint(x, y, birth, shade) {
      pu[pi] = (x - box.x) / box.w; pv[pi] = (y - box.y) / box.h; pb[pi] = birth; pd[pi] = shade; pi = (pi + 1) % N;
    }
    function solid(x, y) {
      var i, r;
      for (i = 0; i < rects.length; i++) { r = rects[i]; if (x > r[0] - 3 && x < r[2] + 3 && y > r[1] - 3 && y < r[3] + 3) return true; }
      for (i = 0; i < circs.length; i++) if (Math.hypot(x - circs[i][0], y - circs[i][1]) < circs[i][2] + 4) return true;
      return false;
    }
    function ping(x, y, n) {
      for (var i = 0; i < n; i++) {
        var r = ray(x, y, (i / n) * TAU);
        if (r.hit) addPoint(r.x, r.y, T + Math.hypot(r.x - x, r.y - y) / PSPEED, r.d);
      }
      pings.push({ u: (x - box.x) / box.w, v: (y - box.y) / box.h, t0: T });
      if (pings.length > 4) pings.shift();
    }

    /* ---------- simulation ---------- */
    function step(dt) {
      var i, moving = false, k = 1 - Math.exp(-dt * 4.5), keys = ["x", "y", "w", "h", "dim"];
      T += dt; boost *= Math.exp(-dt * 1.6);
      for (i = 0; i < keys.length; i++) {
        var d = tgt[keys[i]] - box[keys[i]];
        if (Math.abs(d) > (i === 4 ? 0.003 : 0.15)) { box[keys[i]] += d * k; moving = true; } else box[keys[i]] = tgt[keys[i]];
      }
      if (moving) build();
      sFrac = (sFrac + (lite ? 26 : 32) * dt / pathLen) % 1;
      pos = robotAt(sFrac);
      trailT += dt;
      if (trailT > 0.14) { trailT = 0; trail.push([(pos.x - box.x) / box.w, (pos.y - box.y) / box.h]); if (trail.length > 44) trail.shift(); }
      for (var bi = 0; bi < beams.length; bi++) {
        var b = beams[bi]; b.a += OMEGA * (1 + boost) * dt;
        while (b.last + DA <= b.a) {
          b.last += DA;
          var r = ray(pos.x, pos.y, b.last);
          b.tr.push({ u: (r.x - box.x) / box.w, v: (r.y - box.y) / box.h, hit: r.hit });
          if (b.tr.length > 34) b.tr.shift();
          if (r.hit && Math.random() > 0.07) addPoint(r.x, r.y, T, r.d);
        }
      }
      while (pings.length && (T - pings[0].t0) * PSPEED > maxR) pings.shift();
    }

    /* ---------- drawing ---------- */
    var COLS = ["#7defff", "#12c4ff", "#6f86ff"];
    function draw() {
      var i, k, c, n, dim = box.dim, rd = Math.max(dim, 0.55);
      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.beginPath(); ctx.rect(box.x - 8, box.y - 8, box.w + 16, box.h + 16); ctx.clip();
      ctx.globalCompositeOperation = "lighter";

      /* range rings + tick marks around the robot */
      ctx.lineWidth = 1; ctx.strokeStyle = "rgba(0,229,255," + (0.09 * dim).toFixed(3) + ")";
      for (i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(pos.x, pos.y, maxR * i / 5.2, 0, TAU); ctx.stroke(); }
      ctx.strokeStyle = "rgba(0,229,255," + (0.16 * dim).toFixed(3) + ")"; ctx.beginPath();
      var tr = maxR * 3 / 5.2;
      for (i = 0; i < 48; i++) { var ta = (i / 48) * TAU, l = i % 4 === 0 ? 6 : 3; ctx.moveTo(pos.x + Math.cos(ta) * tr, pos.y + Math.sin(ta) * tr); ctx.lineTo(pos.x + Math.cos(ta) * (tr + l), pos.y + Math.sin(ta) * (tr + l)); }
      ctx.stroke();

      /* the lit sweep behind each beam */
      for (var bi = 0; bi < beams.length && dim > 0.5; bi++) {
        var t = beams[bi].tr; n = t.length;
        for (i = 1; i < n; i++) {
          var f = i / n;
          ctx.fillStyle = "rgba(0,229,255," + (0.3 * f * f * dim).toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineTo(X(t[i - 1].u), Y(t[i - 1].v)); ctx.lineTo(X(t[i].u), Y(t[i].v)); ctx.closePath(); ctx.fill();
        }
      }

      /* the point cloud: flash, settle, fade. Three colour passes (near / mid / far) keep fillStyle changes to a minimum */
      vn[0] = vn[1] = vn[2] = 0;
      for (k = 0; k < N; k++) {
        var age = T - pb[k]; if (age < 0 || age > LIFE) continue;
        var al = Math.min(1, (0.3 + 0.7 * Math.exp(-age * 2.4)) * Math.pow(1 - age / LIFE, 1.3) * dim); if (al < 0.05) continue;
        pa[k] = al; var sh = pd[k], bk = sh < 0.33 ? 0 : sh < 0.66 ? 1 : 2; vis[bk][vn[bk]++] = k;
      }
      for (c = 0; c < 3; c++) {
        ctx.fillStyle = COLS[c];
        for (i = 0; i < vn[c]; i++) {
          k = vis[c][i]; var s = T - pb[k] < 0.3 ? 2.8 : 1.8;
          ctx.globalAlpha = pa[k]; ctx.fillRect(X(pu[k]) - s / 2, Y(pv[k]) - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;

      /* the leading beam and its hit */
      for (bi = 0; bi < beams.length; bi++) {
        var lead = beams[bi].tr[beams[bi].tr.length - 1]; if (!lead) continue;
        var hx = X(lead.u), hy = Y(lead.v);
        ctx.strokeStyle = "rgba(205,248,255," + (0.95 * dim).toFixed(3) + ")"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineTo(hx, hy); ctx.stroke();
        if (lead.hit) {
          ctx.fillStyle = "rgba(0,229,255," + (0.22 * dim).toFixed(3) + ")"; ctx.beginPath(); ctx.arc(hx, hy, 6, 0, TAU); ctx.fill();
          ctx.fillStyle = "rgba(235,252,255," + Math.min(1, dim + 0.2).toFixed(3) + ")"; ctx.beginPath(); ctx.arc(hx, hy, 1.9, 0, TAU); ctx.fill();
        }
      }

      /* sonar pings */
      for (i = 0; i < pings.length; i++) {
        var p = pings[i], pr = (T - p.t0) * PSPEED, pf = 1 - pr / maxR; if (pf <= 0) continue;
        ctx.strokeStyle = "rgba(120,235,255," + (0.5 * pf * pf).toFixed(3) + ")"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(X(p.u), Y(p.v), pr, 0, TAU); ctx.stroke();
      }

      /* the robot's odometry trail, then the robot */
      for (i = 1; i < trail.length; i++) {
        ctx.strokeStyle = "rgba(160,225,255," + ((i / trail.length) * 0.3 * rd).toFixed(3) + ")"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(X(trail[i - 1][0]), Y(trail[i - 1][1])); ctx.lineTo(X(trail[i][0]), Y(trail[i][1])); ctx.stroke();
      }
      ctx.fillStyle = "rgba(0,229,255," + (0.26 * rd).toFixed(3) + ")"; ctx.beginPath(); ctx.arc(pos.x, pos.y, 15, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255," + (0.9 * rd).toFixed(3) + ")"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(pos.x, pos.y, 4.4, 0, TAU); ctx.stroke();
      var ca = Math.cos(pos.a), sa = Math.sin(pos.a);
      ctx.fillStyle = "rgba(255,255,255," + (0.95 * rd).toFixed(3) + ")"; ctx.beginPath();
      ctx.moveTo(pos.x + ca * 10, pos.y + sa * 10); ctx.lineTo(pos.x - ca * 2 - sa * 3.4, pos.y - sa * 2 + ca * 3.4); ctx.lineTo(pos.x - ca * 2 + sa * 3.4, pos.y - sa * 2 - ca * 3.4); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    /* ---------- loop, layout, input ---------- */
    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (t - lastT < (box.dim < 0.5 ? 70 : FRAME)) return;
      var dt = Math.min((t - lastT) / 1000, 0.08); lastT = t;
      step(dt); draw();
    }
    function start() { if (!raf && !paused && !document.hidden && !still) { lastT = performance.now(); raf = requestAnimationFrame(frame); } }
    function stop() { cancelAnimationFrame(raf); raf = 0; }
    function retarget(snap) {
      tgt = opts.layout(mode);
      if (!box || snap) box = { x: tgt.x, y: tgt.y, w: tgt.w, h: tgt.h, dim: tgt.dim };
      build();
    }
    var curDpr = 0;
    function wantDpr() { return mode === "home" ? 1 : Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2); }   /* home is dimmed under the tiles: 1x is plenty and 4x cheaper */
    function resize() {
      var dpr = curDpr = wantDpr();
      cw = host.clientWidth || window.innerWidth; ch = host.clientHeight || window.innerHeight;
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      retarget(true); if (still || paused) draw();
    }
    events.addEventListener("pointerdown", function (e) {
      if (paused || still || T - lastPing < 0.5) return;
      var r = host.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < box.x || x > box.x + box.w || y < box.y || y > box.y + box.h || solid(x, y)) return;
      lastPing = T; ping(x, y, lite ? 120 : 180);
    }, { passive: true });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    window.addEventListener("resize", resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(host);

    resize();
    for (var w = 0; w < 160; w++) step(1 / 30);          /* pre-scan ~5 s so the first frame already shows a room */
    draw(); canvas.classList.add("on"); start();

    return {
      setMode: function (m) { mode = m; if (wantDpr() !== curDpr) resize(); else retarget(false); if (still) { for (var q = 0; q < 40; q++) step(1 / 30); draw(); } },
      pause: function (p) { paused = !!p; paused ? stop() : start(); },
      kick: function (n) { boost = Math.min(1.2, boost + Math.abs(n) * 2); },
      pulse: function () { if (!still) ping(pos.x, pos.y, lite ? 160 : 260); },
      refresh: function () { retarget(false); }
    };
  }
  window.PhoneLidar = { init: init };
})();
