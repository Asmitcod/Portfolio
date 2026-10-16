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
