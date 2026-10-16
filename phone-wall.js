/* phone-wall.js - the shared 3D wallpaper behind the phone lock screen AND home screen.
   Loaded lazily by mobile.js (phones only), after Three.js r128. Desktop never touches this file.

   Scene: a holographic "neural core" (wireframe icosahedron + glowing nodes + data pulses),
   gyroscope rings with a bead, a real lit 3D microchip orbiting the core, floating wire shards
   and drifting data motes. It reacts to touch, device tilt and scrolling.

   API:  const wall = PhoneWall.init(canvas, { layout(mode) -> {cx, cy, r, dim} });
         wall.setMode("lock" | "home"); wall.pause(true/false); wall.kick(n); wall.refresh(); */
(function () {
  "use strict";

  var CAM_Z = 7, FOV = 45, CORE_EXTENT = 2.15; /* orbit radius (core units) that "r" in layout() refers to */

  function init(canvas, opts) {
    var T = window.THREE;
    if (!T) return null;
    opts = opts || {};

    var renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch (e) { return null; }
    renderer.setClearColor(0x000000, 0);

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var motion = reduce ? 0.25 : 1;

    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(FOV, 1, 0.1, 60);
    camera.position.set(0, 0, CAM_Z);

    /* ---------- helpers ---------- */
    var fade = [];            /* materials that follow the "dim" level (so the home screen stays readable) */
    var pts = [];             /* point materials whose size must follow the core scale */
    function reg(m, base) { m.transparent = true; m.userData.base = base; m.opacity = base; fade.push(m); return m; }
    var ADD = T.AdditiveBlending;

    function glowTexture() {
      var c = document.createElement("canvas"); c.width = c.height = 64;
      var g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      return new T.CanvasTexture(c);
    }
    var glow = glowTexture();

    /* ---------- lights (for the chip) ---------- */
    scene.add(new T.AmbientLight(0x7080b0, 0.85));
    var l1 = new T.PointLight(0x00e5ff, 1.5, 14); l1.position.set(3, 3, 5); scene.add(l1);
    var l2 = new T.PointLight(0x8a5cff, 1.3, 14); l2.position.set(-3.5, -2, 4); scene.add(l2);

    /* ---------- neural core ---------- */
    var core = new T.Group(); scene.add(core);
    var spinG = new T.Group(); core.add(spinG);

    var ico = new T.IcosahedronGeometry(1, 1);
    var edges = new T.EdgesGeometry(ico, 1);
    spinG.add(new T.LineSegments(edges, reg(new T.LineBasicMaterial({ color: 0x00e5ff, blending: ADD, depthWrite: false }), 0.6)));

    var vp = ico.attributes.position, seen = {}, verts = [], i;
    for (i = 0; i < vp.count; i++) {
      var x = vp.getX(i), y = vp.getY(i), z = vp.getZ(i), key = x.toFixed(3) + "," + y.toFixed(3) + "," + z.toFixed(3);
      if (!seen[key]) { seen[key] = 1; verts.push(x, y, z); }
    }
    var nodeGeo = new T.BufferGeometry(); nodeGeo.setAttribute("position", new T.Float32BufferAttribute(verts, 3));
    var nodeMat = reg(new T.PointsMaterial({ color: 0xbff6ff, size: 0.1, map: glow, blending: ADD, depthWrite: false }), 0.95);
    pts.push({ m: nodeMat, base: 0.1 });
    spinG.add(new T.Points(nodeGeo, nodeMat));

    var shell = new T.Mesh(new T.IcosahedronGeometry(1, 1), reg(new T.MeshBasicMaterial({ color: 0x2a4bff, side: T.DoubleSide, depthWrite: false }), 0.07));
    spinG.add(shell);

    var heartW = new T.Mesh(new T.IcosahedronGeometry(0.52, 1), reg(new T.MeshBasicMaterial({ color: 0xb46cff, wireframe: true, blending: ADD, depthWrite: false }), 0.8));
    spinG.add(heartW);
    var heartS = new T.Mesh(new T.IcosahedronGeometry(0.25, 2), reg(new T.MeshBasicMaterial({ color: 0x6fefff, blending: ADD, depthWrite: false }), 0.95));
    core.add(heartS);
    var halo = new T.Sprite(reg(new T.SpriteMaterial({ map: glow, color: 0x3a6bff, blending: ADD, depthWrite: false }), 0.7));
    halo.scale.set(3.8, 3.8, 1); core.add(halo);

    /* data pulses racing along the core's edges */
    var ep = edges.attributes.position, segCount = Math.floor(ep.count / 2), N = 22;
    var pulseGeo = new T.BufferGeometry(), pulsePos = new Float32Array(N * 3);
    pulseGeo.setAttribute("position", new T.BufferAttribute(pulsePos, 3));
    var pulseMat = reg(new T.PointsMaterial({ color: 0x9dfff0, size: 0.14, map: glow, blending: ADD, depthWrite: false }), 1);
    pts.push({ m: pulseMat, base: 0.14 });
    spinG.add(new T.Points(pulseGeo, pulseMat));
    var pulses = [];
    for (i = 0; i < N; i++) pulses.push({ s: (Math.random() * segCount) | 0, t: Math.random(), v: 0.35 + Math.random() * 0.6 });

    /* gyroscope rings */
    var rings = new T.Group(); core.add(rings);
    function torus(r, tube, color, op) { return new T.Mesh(new T.TorusGeometry(r, tube, 6, 200), reg(new T.MeshBasicMaterial({ color: color, blending: ADD, depthWrite: false }), op)); }

    var ringA = new T.Group(); ringA.rotation.set(1.15, 0, 0.35); rings.add(ringA);
    ringA.add(torus(1.45, 0.008, 0x00e5ff, 0.8));
    var bead = new T.Group(); ringA.add(bead);
    var beadSp = new T.Sprite(reg(new T.SpriteMaterial({ map: glow, color: 0x7dffee, blending: ADD, depthWrite: false }), 1));
    beadSp.scale.set(0.34, 0.34, 1); beadSp.position.set(1.45, 0, 0); bead.add(beadSp);

    var ringB = new T.Group(); ringB.rotation.set(0.5, 0, -0.6); rings.add(ringB);
    var cp = [];
    for (i = 0; i <= 160; i++) { var a = (i / 160) * Math.PI * 2; cp.push(Math.cos(a) * 1.76, Math.sin(a) * 1.76, 0); }
    var dg = new T.BufferGeometry(); dg.setAttribute("position", new T.Float32BufferAttribute(cp, 3));
    var dashed = new T.Line(dg, reg(new T.LineDashedMaterial({ color: 0x8aa8ff, dashSize: 0.07, gapSize: 0.07 }), 0.7));
    dashed.computeLineDistances(); ringB.add(dashed);

    var ringC = new T.Group(); ringC.rotation.set(1.9, 0.2, 0.1); rings.add(ringC);
    ringC.add(torus(1.95, 0.006, 0xa078ff, 0.7));
    var orbit = new T.Group(); ringC.add(orbit);

    /* ---------- the 3D microchip ---------- */
    function chipTexture() {
      var c = document.createElement("canvas"); c.width = c.height = 256;
      var g = c.getContext("2d");
      var bg = g.createLinearGradient(0, 0, 256, 256); bg.addColorStop(0, "#14204f"); bg.addColorStop(1, "#080d26");
      g.fillStyle = bg; g.fillRect(0, 0, 256, 256);
      g.strokeStyle = "rgba(0,229,255,.28)"; g.lineWidth = 2;
      for (var k = 0; k < 26; k++) {
        var px = 12 + ((k * 37) % 232), py = 12 + ((k * 71) % 232);
        g.beginPath(); g.moveTo(px, py);
        g.lineTo(px + (k % 2 ? 34 : -34), py); g.lineTo(px + (k % 2 ? 34 : -34), py + (k % 3 ? 28 : -28)); g.stroke();
        g.fillStyle = "rgba(0,229,255,.5)"; g.fillRect(px - 2, py - 2, 4, 4);
      }
      g.fillStyle = "#0a1030"; g.fillRect(58, 58, 140, 140);
      g.strokeStyle = "#00e5ff"; g.lineWidth = 3; g.strokeRect(58, 58, 140, 140);
      g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 1; g.strokeRect(70, 70, 116, 116);
      g.fillStyle = "#ffffff"; g.font = "700 62px 'JetBrains Mono', monospace"; g.textAlign = "center"; g.textBaseline = "middle";
      g.shadowColor = "#00e5ff"; g.shadowBlur = 16; g.fillText("AB", 128, 120);
      g.shadowBlur = 0; g.fillStyle = "#7fe9ff"; g.font = "500 13px 'JetBrains Mono', monospace"; g.fillText("AI.ROBOTICS", 128, 166);
      g.fillStyle = "#ff5c8a"; g.beginPath(); g.arc(70, 70, 5, 0, 7); g.fill();
      var tex = new T.CanvasTexture(c); tex.anisotropy = 4; return tex;
    }
    var chip = new T.Group(); chip.scale.setScalar(1.35); orbit.add(chip); orbit.position.set(0, 0, 0);
    var edgeMat = new T.MeshPhongMaterial({ color: 0x0b1230, shininess: 70, specular: 0x88aaff });
    var topMat = new T.MeshPhongMaterial({ map: chipTexture(), shininess: 90, specular: 0x99bbff });
    var body = new T.Mesh(new T.BoxGeometry(0.56, 0.56, 0.09), [edgeMat, edgeMat, edgeMat, edgeMat, topMat, edgeMat]);
    chip.add(body);
    var bodyEdges = new T.LineSegments(new T.EdgesGeometry(body.geometry), reg(new T.LineBasicMaterial({ color: 0x00e5ff, blending: ADD, depthWrite: false }), 0.9));
    chip.add(bodyEdges);
    var pinMat = new T.MeshPhongMaterial({ color: 0xe3c36e, shininess: 100, specular: 0xffffff, emissive: 0x2a1c00 });
    var pinsLR = new T.InstancedMesh(new T.BoxGeometry(0.08, 0.024, 0.03), pinMat, 16);
    var pinsTB = new T.InstancedMesh(new T.BoxGeometry(0.024, 0.08, 0.03), pinMat, 16);
    var dummy = new T.Object3D(), p;
    for (p = 0; p < 8; p++) {
      var off = -0.23 + p * 0.0657;
      dummy.position.set(-0.32, off, 0); dummy.updateMatrix(); pinsLR.setMatrixAt(p, dummy.matrix);
      dummy.position.set(0.32, off, 0); dummy.updateMatrix(); pinsLR.setMatrixAt(p + 8, dummy.matrix);
      dummy.position.set(off, -0.32, 0); dummy.updateMatrix(); pinsTB.setMatrixAt(p, dummy.matrix);
      dummy.position.set(off, 0.32, 0); dummy.updateMatrix(); pinsTB.setMatrixAt(p + 8, dummy.matrix);
    }
    chip.add(pinsLR); chip.add(pinsTB);
    var chipGlow = new T.Sprite(reg(new T.SpriteMaterial({ map: glow, color: 0x00e5ff, blending: ADD, depthWrite: false }), 0.4));
    chipGlow.scale.set(1.6, 1.6, 1); chip.add(chipGlow);
    chip.position.set(1.95, 0, 0);

    /* ---------- floating wire shards ---------- */
    var shards = [], geos = [new T.OctahedronGeometry(1, 0), new T.TetrahedronGeometry(1, 0), new T.BoxGeometry(1, 1, 1)];
    for (i = 0; i < 11; i++) {
      var sm = new T.Mesh(geos[i % 3], reg(new T.MeshBasicMaterial({ color: i % 2 ? 0x00e5ff : 0xb46cff, wireframe: true, blending: ADD, depthWrite: false }), 0.5));
      var sc = 0.07 + Math.random() * 0.13; sm.scale.setScalar(sc);
      sm.position.set((Math.random() - 0.5) * 3.4, (Math.random() - 0.5) * 6.2, -2.5 + Math.random() * 3.5);
      sm.userData = { by: sm.position.y, ph: Math.random() * 6.28, sp: 0.3 + Math.random() * 0.6, rx: 0.2 + Math.random() * 0.6, ry: 0.2 + Math.random() * 0.6 };
      scene.add(sm); shards.push(sm);
    }

    /* ---------- data motes ---------- */
    var M = 150, motePos = new Float32Array(M * 3), moteV = new Float32Array(M);
    for (i = 0; i < M; i++) {
      motePos[i * 3] = (Math.random() - 0.5) * 7; motePos[i * 3 + 1] = (Math.random() - 0.5) * 8; motePos[i * 3 + 2] = -4 + Math.random() * 7;
      moteV[i] = 0.05 + Math.random() * 0.22;
    }
    var moteGeo = new T.BufferGeometry(); moteGeo.setAttribute("position", new T.BufferAttribute(motePos, 3));
    var moteMat = reg(new T.PointsMaterial({ color: 0x9fd4ff, size: 0.07, map: glow, blending: ADD, depthWrite: false }), 0.75);
    scene.add(new T.Points(moteGeo, moteMat));

    /* ---------- layout / state ---------- */
    var W = 1, H = 1, U = 0.01;
    var mode = "lock";
    var cur = { x: 0, y: 0, r: 80, dim: 1 }, tgt = { x: 0, y: 0, r: 80, dim: 1 }, first = true;
    var look = { x: 0, y: 0 }, lookT = { x: 0, y: 0 }, gyro = false, spinKick = 0;

    function retarget() {
      var L = (opts.layout && opts.layout(mode)) || { cx: W / 2, cy: H / 2, r: W * 0.4, dim: 1 };
      tgt.x = L.cx - W / 2; tgt.y = L.cy - H / 2; tgt.r = L.r; tgt.dim = L.dim;
      if (first) { cur.x = tgt.x; cur.y = tgt.y; cur.r = tgt.r; cur.dim = tgt.dim; first = false; }
    }
    function resize() {
      var par = canvas.parentNode;
      W = (par && par.clientWidth) || window.innerWidth; H = (par && par.clientHeight) || window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.updateProjectionMatrix();
      U = (2 * CAM_Z * Math.tan((FOV / 2) * Math.PI / 180)) / H;
      retarget();
    }

    /* ---------- input: touch parallax, tilt, scroll ---------- */
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    var host = canvas.closest ? (canvas.closest("#phone") || document) : document;
    host.addEventListener("pointermove", function (e) {
      if (gyro) return;
      lookT.x = clamp((e.clientX / W - 0.5) * 2, -1, 1); lookT.y = clamp((e.clientY / H - 0.5) * 2, -1, 1);
    }, { passive: true });
    function relax() { if (!gyro) { lookT.x = 0; lookT.y = 0; } }
    host.addEventListener("pointerup", relax, { passive: true });
    host.addEventListener("pointercancel", relax, { passive: true });
    function onTilt(e) {
      if (e.gamma == null || e.beta == null) return;
      gyro = true; lookT.x = clamp(e.gamma / 28, -1, 1); lookT.y = clamp((e.beta - 55) / 30, -1, 1);
    }
    var canGyro = "DeviceOrientationEvent" in window && typeof window.DeviceOrientationEvent.requestPermission !== "function";
    if (canGyro) window.addEventListener("deviceorientation", onTilt, { passive: true });

    /* ---------- render loop ---------- */
    var raf = 0, paused = false, last = 0, t = 0, started = false;
    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000); last = now; if (dt <= 0) return;
      t += dt * motion;
      var k = 1 - Math.exp(-dt * 3.4), kl = 1 - Math.exp(-dt * 5);
      cur.x += (tgt.x - cur.x) * k; cur.y += (tgt.y - cur.y) * k; cur.r += (tgt.r - cur.r) * k; cur.dim += (tgt.dim - cur.dim) * k;
      look.x += (lookT.x - look.x) * kl; look.y += (lookT.y - look.y) * kl;
      spinKick *= Math.exp(-dt * 2.2);

      var s = Math.max(0.05, (cur.r * U) / CORE_EXTENT);
      core.position.set(cur.x * U, -cur.y * U, 0); core.scale.setScalar(s);
      core.rotation.x = 0.28 + look.y * 0.4; core.rotation.y = look.x * 0.55;
      camera.position.x = look.x * 0.16; camera.position.y = -look.y * 0.16; camera.lookAt(0, 0, 0);

      for (var f = 0; f < fade.length; f++) fade[f].opacity = fade[f].userData.base * cur.dim;
      for (f = 0; f < pts.length; f++) pts[f].m.size = pts[f].base * s * 1.0 + 0.012;
      moteMat.size = 0.07;

      spinG.rotation.y += dt * motion * (0.3 + spinKick); spinG.rotation.x = Math.sin(t * 0.3) * 0.18;
      heartW.rotation.y -= dt * motion * 0.9; heartW.rotation.z += dt * motion * 0.4;
      var beat = 1 + 0.12 * Math.sin(t * 2.4);
      heartS.scale.setScalar(beat); halo.scale.set(3.8 * beat, 3.8 * beat, 1);

      ringA.rotation.z += dt * motion * 0.22; bead.rotation.z += dt * motion * 1.5;
      ringB.rotation.z -= dt * motion * 0.3; ringB.rotation.y = Math.sin(t * 0.4) * 0.25;
      ringC.rotation.z += dt * motion * 0.1;
      orbit.rotation.z += dt * motion * (0.55 + spinKick * 0.5);
      chip.rotation.y = Math.sin(t * 0.8) * 0.9; chip.rotation.x = Math.cos(t * 0.6) * 0.5; chip.rotation.z = -orbit.rotation.z;
      chipGlow.material.opacity = chipGlow.material.userData.base * cur.dim * (0.7 + 0.3 * Math.sin(t * 3));

      for (var q = 0; q < N; q++) {
        var pu = pulses[q]; pu.t += dt * motion * pu.v;
        if (pu.t >= 1) { pu.t = 0; pu.s = (Math.random() * segCount) | 0; }
        var a0 = pu.s * 2, a1 = a0 + 1;
        pulsePos[q * 3] = ep.getX(a0) + (ep.getX(a1) - ep.getX(a0)) * pu.t;
        pulsePos[q * 3 + 1] = ep.getY(a0) + (ep.getY(a1) - ep.getY(a0)) * pu.t;
        pulsePos[q * 3 + 2] = ep.getZ(a0) + (ep.getZ(a1) - ep.getZ(a0)) * pu.t;
      }
      pulseGeo.attributes.position.needsUpdate = true;

      for (var h = 0; h < shards.length; h++) {
        var sh = shards[h], d = sh.userData;
        sh.rotation.x += dt * motion * d.rx; sh.rotation.y += dt * motion * d.ry;
        sh.position.y = d.by + Math.sin(t * d.sp + d.ph) * 0.14;
      }
      for (var m = 0; m < M; m++) {
        var yi = m * 3 + 1; motePos[yi] += dt * motion * moteV[m]; if (motePos[yi] > 4.2) motePos[yi] = -4.2;
      }
      moteGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      if (!started) { started = true; canvas.classList.add("on"); }
    }
    function start() { if (!raf && !paused && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); stop(); canvas.classList.remove("on"); });

    window.addEventListener("resize", resize);
    if (window.ResizeObserver && canvas.parentNode) new ResizeObserver(resize).observe(canvas.parentNode);
    resize(); start();

    return {
      setMode: function (m) { mode = m; retarget(); },
      refresh: retarget,
      pause: function (p) { paused = !!p; paused ? stop() : start(); },
      kick: function (n) { spinKick = clamp(spinKick + n, -3, 3); }
    };
  }

  window.PhoneWall = { init: init };
})();
