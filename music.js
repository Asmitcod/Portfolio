/* On Repeat: music tile for the Beyond Code section (desktop only).
   EDIT THE TRACKS BELOW. For each song set ONE of:
     youtube: a YouTube link or the 11-character video ID   (plays through a hidden player)
     audio:   a path to your own file, e.g. 'music/tere-bina.mp3'
   cover: put a square image at that path (about 600x600). 
   With neither youtube nor audio set, the tile runs in demo mode and says so. */
(() => {
  const root = document.getElementById('beyond-music');
  if (!root || document.documentElement.classList.contains('phone-mode')) return;
  const T = [
    { title: 'Tere Bina', artist: 'Chinmayi', meta: 'Guru · A.R. Rahman · 2007', cover: 'music/tere-bina.jpg', youtube: '', audio: 'music/tere-bina.mp3', dur: 310 },
    { title: 'Let Down', artist: 'Radiohead', meta: 'OK Computer · 1997', cover: 'music/let-down.jpg', youtube: '', audio: 'music/let-down.mp3', dur: 299 },
    { title: 'Hum Tere Pyar Mein', artist: 'Lata Mangeshkar', meta: 'Dil Ek Mandir', cover: 'music/hum-tere-pyar-mein.jpg', youtube: '', audio: 'music/hum-tere-pyar-mein.mp3', dur: 287 },
    { title: "I'm Done", artist: 'Maan Panu', meta: 'Single', cover: 'music/im-done.jpg', youtube: '', audio: 'music/im-done.mp3', dur: 34 },
    { title: 'Without a Hook', artist: 'Ricky Montgomery', meta: 'Montgomery Ricky · 2016', cover: 'music/without-a-hook.jpg', youtube: '', audio: 'music/without-a-hook.mp3', dur: 248 }
  ];
  const ytId = s => { const m = String(s || '').match(/(?:v=|youtu\.be\/|embed\/|^)([\w-]{11})(?:[?&#]|$)/); return m ? m[1] : ''; };
  const I = { play: '<i class="fas fa-play"></i>', pause: '<i class="fas fa-pause"></i>', prev: '<i class="fas fa-backward-step"></i>', next: '<i class="fas fa-forward-step"></i>' };
  const N = 40, W = 56;
  root.innerHTML = `<div class="mp" tabindex="-1"><div class="mp__amb"></div>
    <div class="mp__stage"><div class="mp__disc"><div class="mp__vinyl"><div class="mp__label"></div></div><div class="mp__sheen"></div></div><div class="mp__sleeve"></div>
      <div class="mp__arm"><div class="mp__pivot"></div></div></div>
    <div class="mp__info"><span class="mp__eyebrow"><i></i><span class="mp__state">ON REPEAT</span></span><h3 class="mp__title"></h3><p class="mp__artist"></p><p class="mp__meta"></p>
      <div class="mp__eq">${'<i></i>'.repeat(N)}</div>
      <div class="mp__wave" role="slider" aria-label="Seek" tabindex="0">${Array.from({ length: W }, (_, i) => `<span style="height:${(28 + 72 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * .53))).toFixed(0)}%"></span>`).join('')}</div>
      <div class="mp__time"><span>0:00</span><span>0:00</span></div>
      <div class="mp__ctl"><button class="mp__prev" aria-label="Previous track">${I.prev}</button><button class="mp__play" aria-label="Play">${I.play}</button><button class="mp__next" aria-label="Next track">${I.next}</button><span class="mp__status"></span></div></div>
    <ul class="mp__list">${T.map((t, k) => `<li tabindex="0" data-k="${k}"><div class="mp__thumb"></div><div style="min-width:0"><b>${t.title}</b><span>${t.artist}</span></div></li>`).join('')}</ul></div>`;
  const $ = s => root.querySelector(s), mp = $('.mp'), eq = [...root.querySelectorAll('.mp__eq i')], wv = [...root.querySelectorAll('.mp__wave span')],
    lis = [...root.querySelectorAll('.mp__list li')], tm = root.querySelectorAll('.mp__time span'), pb = $('.mp__play'), st = $('.mp__status'), lab = $('.mp__state');
  let i = 0, playing = false, yt = null, ytReady = false, simT = 0, last = 0, lit = -1;
  try { i = Math.min(T.length - 1, Math.max(0, +localStorage.getItem('mp-track') || 0)); } catch (e) {}
  const au = new Audio(); au.preload = 'none';
  const bg = t => t.img || '';
  const tint = t => t.dom || 'var(--neon)';
  function paint() {
    const t = T[i];
    $('.mp__title').textContent = t.title; $('.mp__artist').textContent = t.artist; $('.mp__meta').textContent = t.meta;
    $('.mp__sleeve').style.backgroundImage = bg(t); $('.mp__label').style.backgroundImage = bg(t); $('.mp__amb').style.backgroundImage = bg(t);
    root.style.setProperty('--mp', tint(t));
    lis.forEach((l, k) => { l.classList.toggle('on', k === i); l.querySelector('.mp__thumb').style.backgroundImage = bg(T[k]); });
  }
  T.forEach((t, k) => { const im = new Image(); im.onload = () => {
    t.img = `url("${t.cover}")`;
    try { const c = document.createElement('canvas'); c.width = c.height = 12; const x = c.getContext('2d'); x.drawImage(im, 0, 0, 12, 12); const d = x.getImageData(0, 0, 12, 12).data; let r = 0, g = 0, b = 0, w = 0;
      for (let p = 0; p < d.length; p += 4) { const mx = Math.max(d[p], d[p + 1], d[p + 2]), mn = Math.min(d[p], d[p + 1], d[p + 2]), s = (mx - mn) + 8; r += d[p] * s; g += d[p + 1] * s; b += d[p + 2] * s; w += s; }
      const f = Math.min(1.5, 190 / Math.max(r / w, g / w, b / w, 1)); t.dom = [r, g, b].map(v => Math.min(255, Math.round(v / w * f))).join(','); } catch (e) {}
    paint(); }; im.src = t.cover; });
  const src = () => T[i].audio ? 'audio' : ytId(T[i].youtube) ? 'yt' : 'demo';
  const dur = () => src() === 'audio' && au.duration ? au.duration : src() === 'yt' && ytReady && yt.getDuration && yt.getDuration() ? yt.getDuration() : T[i].dur;
  const pos = () => src() === 'audio' ? au.currentTime : src() === 'yt' && ytReady && yt.getCurrentTime ? yt.getCurrentTime() : simT;
  const f = s => (Math.max(0, s) / 60 | 0) + ':' + String(Math.max(0, s) % 60 | 0).padStart(2, '0');
  function note() {
    const t = T[i], q = encodeURIComponent(t.title + ' ' + t.artist);
    st.innerHTML = src() === 'demo' ? `demo mode, no audio linked<br><a href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">listen on YouTube</a>` : '';
  }
  function setPlaying(v) { playing = v; mp.classList.toggle('is-playing', v); pb.innerHTML = v ? I.pause : I.play; pb.setAttribute('aria-label', v ? 'Pause' : 'Play'); lab.textContent = v ? 'NOW SPINNING' : 'ON REPEAT'; }
  function ytMake(cb) {
    if (yt) return cb();
    const h = document.createElement('div'); h.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none'; root.appendChild(h);
    const go = () => { yt = new YT.Player(h, { height: '1', width: '1', playerVars: { playsinline: 1 }, events: {
      onReady: () => { ytReady = true; cb(); }, onStateChange: e => { if (e.data === 0) step(1); },
      onError: () => { setPlaying(false); st.innerHTML = `this video can’t be embedded<br><a href="https://www.youtube.com/watch?v=${ytId(T[i].youtube)}" target="_blank" rel="noopener">open on YouTube</a>`; } } }); };
    if (window.YT && YT.Player) return go();
    window.onYouTubeIframeAPIReady = go; const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s);
  }
  function start() {
    const t = T[i], m = src(); note();
    if (m === 'audio') { if (!au.src.endsWith(t.audio)) au.src = t.audio; au.play().catch(() => { setPlaying(false); st.textContent = 'audio file not found'; }); }
    else if (m === 'yt') ytMake(() => yt.loadVideoById(ytId(t.youtube)));
    setPlaying(true);
  }
  function stop() { if (src() === 'audio') au.pause(); else if (src() === 'yt' && ytReady) yt.pauseVideo(); setPlaying(false); }
  function pick(k, go) { const was = playing; if (playing) stop(); if (ytReady) yt.stopVideo(); au.pause(); i = (k + T.length) % T.length; simT = 0; lit = -1;
    try { localStorage.setItem('mp-track', i); } catch (e) {} paint(); note(); if (was || go) start(); }
  const step = d => pick(i + d, true);
  pb.onclick = () => playing ? stop() : start();
  $('.mp__next').onclick = () => step(1); $('.mp__prev').onclick = () => step(-1);
  lis.forEach((l, k) => { l.onclick = () => pick(k, true); l.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k, true); } }; });
  const seek = fr => { const t = fr * dur(); src() === 'audio' ? au.currentTime = t : src() === 'yt' && ytReady ? yt.seekTo(t, true) : simT = t; };
  const wave = $('.mp__wave');
  wave.onclick = e => { const r = wave.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); };
  wave.onkeydown = e => { if (e.key === 'ArrowRight') seek(Math.min(1, pos() / dur() + .05)); if (e.key === 'ArrowLeft') seek(Math.max(0, pos() / dur() - .05)); };
  mp.onkeydown = e => { if (e.target.closest('button,li,.mp__wave')) return; if (e.key === ' ') { e.preventDefault(); pb.click(); } };
  au.onended = () => step(1);
  const ph = eq.map(() => Math.random() * 6.28), sp = eq.map(() => 1.4 + Math.random() * 3), lv = eq.map(() => .06);
  (function loop(ts) {
    const dt = Math.min((ts - last) / 1000 || 0, .1); last = ts;
    if (playing && src() === 'demo') { simT += dt; if (simT >= dur()) step(1); }
    const env = .6 + .4 * Math.sin(ts / 800);
    eq.forEach((b, k) => { const c = 1 - Math.abs(k - N / 2 + .5) / (N / 2) * .45; const tg = playing ? (.12 + .88 * Math.abs(Math.sin(ts / 1000 * sp[k] + ph[k])) * (.6 + .4 * Math.sin(ts / 430 + k * .5)) * env) * c : .05;
      lv[k] += (tg - lv[k]) * (playing ? .3 : .1); b.style.transform = `scaleY(${lv[k].toFixed(3)})`; });
    const d = dur() || 1, p = pos(), n = Math.min(W, Math.floor(p / d * W));
    if (n !== lit) { wv.forEach((s, k) => s.classList.toggle('on', k < n)); lit = n; }
    tm[0].textContent = f(p); tm[1].textContent = f(d); requestAnimationFrame(loop);
  })(0);
  paint(); note();
})();
