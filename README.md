# Asmit Bisht - Portfolio

Static portfolio site (HTML, CSS, vanilla JS). Open `index.html`, or run `python app.py` for the optional Flask server.

- Add your resume as `resume.pdf` in this folder (the Resume button links to it).
- Contact form posts to Formspree (`https://formspree.io/f/mkgrjqqv`).
- Deploy on GitHub Pages: push the folder and enable Pages on the main branch.

## Features
- Flip the hero photo to reveal the Minecraft avatar (`avatar.png`)
- Ctrl/Cmd + K command palette, backtick terminal, Konami code easter egg
- "Latest from GitHub" repo cards (auto-updated via GitHub API)
- Custom 404 page with a wandering RL agent (home link is `/` because of the custom domain)

## Mobile
Screens up to 768px wide get a separate phone-style home screen (lock screen, app icons, dock) from `mobile.css` + `mobile.js`.
The lock and home screens share one dark-tech 3D wallpaper (`phone-wall.js`, Three.js r128 from cdnjs, loaded on phones only): a neural core, gyro rings, an orbiting 3D microchip and floating shards. It reacts to touch, device tilt and scrolling, and falls back to a CSS grid wallpaper if WebGL is unavailable. The lock screen has a live analog clock.
Desktop keeps the original layout and `script.js`. The phone version reads its content from the hidden desktop markup, so edit text in `index.html` only.
A visitor on a phone can tap "Open desktop version" at the bottom of the home screen to see the classic layout.

## Phone wallpaper
- Connected-dots network (2D canvas, `initNet` block in `mobile.js`): tune `LINK` (line distance) and the node count formula.
- 3D neural core (`phone-wall.js` + Three.js) is skipped on phones with Data Saver on or 4 GB RAM or less.
- `avatar.webp` replaced `avatar.png` (delete the old PNG from the repo if it is still there).

## Phone version (<= 768px wide)

Phones get a separate "phone OS" experience from `mobile.css`, `mobile.js` and `phone-wall.js`. The desktop site is untouched.

- **Lock screen:** black with the blue connected-dots network (same as desktop), one hero (a 3D neural core with an orbiting microchip), a small analog clock with a sweeping second hand, swipe up to unlock.
- **Home screen:** a bento of live widgets over the same wallpaper: rotating projects (read from the page) with Gallery / Experience / Education / Research stacked beside it, a terminal that types real commands, a skills marquee, and Top 100 (animated ring) + newest GitHub repo (push-activity sparkline) side by side. The glass has a light sheen that follows touch or phone tilt. Tiles open full apps. The dock holds Resume, GitHub, LinkedIn and Contact.
- **3D:** Three.js r128 from cdnjs, loaded only on phones. Reacts to touch, device tilt and scrolling. Skipped on data-saver or phones under 4 GB RAM (a CSS orb is shown instead), and when WebGL is unavailable.
- `phone-wall.js` must be deployed next to `index.html`.
