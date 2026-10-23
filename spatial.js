/* spatial.js - desktop only. Creates the ambient light layer and moves the hero layers with the mouse (depth parallax).
   Everything is skipped on phones, and the parallax is skipped for touch input or reduced motion. */
(() => {
  "use strict";
  const root = document.documentElement;
  if (root.classList.contains("phone-mode")) return;

  const ambient = document.createElement("div");
  ambient.className = "ambient"; ambient.setAttribute("aria-hidden", "true");
  document.body.insertBefore(ambient, document.body.firstChild);

  const fine = window.matchMedia("(pointer: fine)").matches, reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduced) return;

  const hero = document.querySelector(".hero");
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const apply = () => {
    if (hero) { hero.style.setProperty("--px", cx.toFixed(3)); hero.style.setProperty("--py", cy.toFixed(3)); }
    ambient.style.translate = `${(-cx * 26).toFixed(1)}px ${(-cy * 18 - window.scrollY * 0.02).toFixed(1)}px`;
  };
  const tick = () => {
    cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08; apply();
    raf = (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) ? requestAnimationFrame(tick) : 0;
  };
  window.addEventListener("mousemove", (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  window.addEventListener("scroll", () => { if (!raf) apply(); }, { passive: true });
})();
