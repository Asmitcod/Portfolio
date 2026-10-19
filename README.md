# Asmit Bisht - Portfolio
✦ About Me

I'm a final-year B.Tech student at VIT Chennai, specializing in Artificial Intelligence and Robotics.

I enjoy exploring the intersection of software engineering, intelligent systems, automation, and interactive experiences. My goal is to build technology that is not only functional but also intuitive, engaging, and impactful.

Focus: Artificial Intelligence, Robotics, and Software Engineering

Core Languages: Python, Java, C, and C++

Interests: Intelligent systems, automation, and immersive web experiences

Currently Exploring: Agentic AI, AI-powered applications, and robotics

✦ Portfolio Experience

The portfolio is designed as a digital environment rather than a conventional static webpage.

Immersive Visual Design — A dark, modern interface with a distinctive visual identity.

Interactive Experiences — Thoughtful interactions and animations designed to make navigation engaging.

3D-Inspired Aesthetics — Visual elements inspired by robotics, spatial computing, and digital environments.

Project Showcase — A dedicated space for exploring my technical projects and experiments.

Responsive Layout — Designed to provide a usable experience across desktop and mobile screens.

Personal Branding — A unified presentation of my skills, projects, and engineering interests.

✦ Tech Stack

The technologies used in this project include:

HTML5 — Page structure and semantic markup

CSS3 — Styling, layouts, animations, and responsive design

JavaScript — Interactive behavior and dynamic experiences

Git & GitHub — Version control and project hosting

Additional libraries and tools may be used for specific visual effects or interactions.

✦ Featured Projects

My portfolio serves as a central hub for projects across AI, software development, and robotics.

Some of the projects I have explored include:

Project

Description

EduMadad

An AI-powered student loan assistance platform designed to help students access educational financing resources.

Aqua Report Buddy

A water-quality reporting project combining a web application with IoT-based sensor data ingestion.

Predictive Legal Analytics

An exploration of NLP and LegalBERT for predicting legal case outcomes.

Smart Hostel Management System

A software engineering project focused on hostel administration and management workflows.

✦ Run Locally

Want to explore the project on your own machine?

1. Clone the repository

git clone https://github.com/Asmitcod/Portfolio.git

2. Navigate into the project

cd Portfolio

3. Launch the portfolio

If the project uses plain HTML, CSS, and JavaScript, open index.html in your browser or use the Live Server extension in VS Code.

If the project uses a build tool or additional dependencies, follow the setup instructions in its package.json.

✦ Project Goals

This project is an ongoing experiment in combining engineering and design.

My goals are to:

Create a distinctive and memorable portfolio experience.

Present technical projects with clarity and personality.

Experiment with advanced web interactions and immersive visual design.

Continuously improve accessibility, responsiveness, and performance.

✦ Connect With Me

I'm always interested in connecting with people working on AI, robotics, software engineering, and innovative technology.

GitHub: @Asmitcod

LinkedIn: Connect with me

Portfolio: Add your live portfolio URL here.



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

## Phone version (<= 768px wide)

Phones get a separate "phone OS" experience from `mobile.css`, `mobile.js` and `phone-wall.js`. The desktop site is untouched.

- **Lock screen:** black with the blue connected-dots network (same as desktop), one hero (a 3D neural core with an orbiting microchip), a small analog clock with a sweeping second hand, swipe up to unlock.
- **Home screen:** a bento of live widgets over the same wallpaper: rotating projects (read from the page) with Gallery / Experience / Education / Research stacked beside it, a terminal that types real commands, a skills marquee, and Top 100 (animated ring) + newest GitHub repo (push-activity sparkline) side by side. The glass has a light sheen that follows touch or phone tilt. Tiles open full apps. The dock holds Resume, GitHub, LinkedIn and Contact.
- **3D:** Three.js r128 from cdnjs, loaded only on phones. Reacts to touch, device tilt and scrolling. Skipped on data-saver or phones under 4 GB RAM (a CSS orb is shown instead), and when WebGL is unavailable.
- `phone-wall.js` must be deployed next to `index.html`.

## Phone wallpaper: LIDAR scan (`phone-lidar.js`)
A 2D canvas scene, no libraries (replaces the old Three.js core, so ~600 KB less to download on phones).
A robot patrols a warehouse floor plan; two spinning beams ray-cast the walls and every return becomes a point that flashes, settles and fades.
- Floor plan: `WALLS`, `RECTS`, `CIRCLES`, `ROUTE` at the top of the file (coordinates are 0..1, stretched to fit).
- Speed / density: `OMEGA` (beam speed), `DA` (angle between rays), `LIFE` (seconds a point stays), `N` (max points).
- Low-power phones (Data Saver, or under 4 GB RAM) get fewer rays/points and a lower frame rate.
- Tap anywhere in the scan area for a sonar ping; unlocking sends a pulse from the robot.

## Typography (desktop)
- Three voices: **Space Grotesk** (headings), **Inter** (text), **JetBrains Mono** (labels, tags, pills, dates). One size scale in `type.css` (`--t-xs` ... `--t-hero`).
- Fonts are self-hosted in `fonts/` (latin subset, variable woff2) and declared in `fonts.css`; there is no Google Fonts request any more. Inter + Space Grotesk are preloaded on desktop only.
- `type.css` is scoped to `html:not(.phone-mode)`, so the phone UI (Poppins + JetBrains Mono) is untouched. Retune sizes/fonts by editing the `:root` tokens.
- Tile gradients: each card sets `--acc` (r, g, b); the tint and the pill/tag/icon colours follow it. See the "tile gradients" block in `type.css`.
<p align="center">
  <b>Built with curiosity, engineered with purpose.</b>
  <br/>
  <sub>© Asmit Bisht · Personal Portfolio</sub>
</p>
