<div align="center">

# Asmit Bisht

### AI · Robotics · Software Engineering

An interactive portfolio exploring the space between intelligent systems and thoughtful digital experiences.

[**Explore the portfolio ↗**](https://asmitbisht.live) &nbsp;·&nbsp;
[GitHub](https://github.com/Asmitcod) &nbsp;·&nbsp;
[LinkedIn](https://www.linkedin.com/in/asmit-bisht-a09682293)

<br>

![HTML5](https://img.shields.io/badge/HTML5-markup-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-design-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-interactions-F7DF1E?style=flat-square&logo=javascript&logoColor=111111)
![Responsive](https://img.shields.io/badge/Responsive-desktop%20%2B%20mobile-8A63D2?style=flat-square)

</div>

<br>

> **Built with curiosity, engineered with purpose.**

## ✦ About

I'm a final-year B.Tech student at VIT Chennai, specializing in **Artificial Intelligence and Robotics**. I enjoy bringing together software engineering, intelligent systems, automation, and interaction design to build experiences that feel as considered as they are useful.

| Focus | Toolkit | Currently exploring |
|:--|:--|:--|
| AI, robotics, and software engineering | Python, Java, C, and C++ | Agentic AI, AI-powered applications, and robotics |

## ⌘ Inside the portfolio

- **A custom digital environment** — a dark, spatial interface with layered motion, frosted glass, and neon accents.
- **A phone-sized experience** — a dedicated mobile home screen, live widgets, and an animated LIDAR-inspired wallpaper.
- **Small surprises** — a command palette (`Ctrl` / `⌘` + `K`), an interactive terminal (backtick), and a Konami-code easter egg.
- **Projects with context** — selected work alongside a live feed of recent GitHub activity.
- **A little personality** — a flip-to-reveal portrait, desktop music player, and a custom 404 page.

## ◈ Selected projects

| Project | What it does |
|:--|:--|
| **EduMadad** | Student-loan assistance portal helping students discover higher-education financing options. Ranked in the top 65 nationally at the GDG VIT Chennai hackathon. |
| **AquaJeevan** | AI/ML and IoT water-surveillance concept for predicting and preventing water-borne diseases. Ranked in the top 100 of 864 teams at Smart India Hackathon 2025. |
| **AccessMap** | Community-powered accessibility map for finding and sharing information about entrances, lifts, ramps, and restrooms. |
| **Failure Triage Assistant** | GitHub Actions companion that sanitizes workflow evidence, classifies common failures, and offers actionable debugging guidance. |

## ⚙️ Built with

- **Structure:** HTML5
- **Visuals:** CSS3, custom animations, and responsive layouts
- **Interactions:** Vanilla JavaScript
- **Typography:** Self-hosted Space Grotesk, Inter, JetBrains Mono, and Poppins fonts
- **Optional local server:** Python and Flask

## 🚀 Run it locally

Clone the repository:

```bash
git clone https://github.com/Asmitcod/Portfolio.git
cd Portfolio
```

Open `index.html` in a browser, or use the Live Server extension in VS Code. To run the optional Flask server, install its dependencies and start the app:

```bash
python -m pip install Flask Flask-Cors
python app.py
```

Then visit `http://localhost:5000`.

## 🌐 Deploy

The portfolio is a static site and can be published with GitHub Pages from the `main` branch. The `CNAME` file contains the custom-domain configuration. The contact form submits to Formspree; its endpoint is configured in `index.html`.

## 🧭 A few implementation notes

### Desktop

The desktop experience is styled with `styles.css`, `type.css`, `hero.css`, and `spatial.css`, with interactions powered by `script.js` and `spatial.js`. The visual system uses a shared type scale, section-specific tile accents, layered hero artwork, and motion that respects reduced-motion preferences.

### Phone experience

At widths up to 768px, `mobile.css` and `mobile.js` present a dedicated phone-style interface while reusing the page's content. `phone-lidar.js` draws the animated scan wallpaper on canvas; a connected-dots network adds a second layer. The scan reduces its workload when data saver is enabled or the device reports less than 4 GB of memory.

### Tune the details

| Want to change… | Start here |
|:--|:--|
| Phone LIDAR floor plan, scan speed, or density | `phone-lidar.js` |
| Connected-dots spacing and animation | `mobile.js` |
| Desktop type scale and tile colors | `type.css` |
| Desktop neon accent | `spatial.css` (`--neon`) |
| Hero poster and stat-card positions | `hero.css` |
| “On Repeat” tracks and artwork | `music.js` and the `music/` folder |

## 📬 Connect

Interested in AI, robotics, software engineering, or building something together? Find me here:

- **Portfolio:** [asmitbisht.live](https://asmitbisht.live)
- **GitHub:** [@Asmitcod](https://github.com/Asmitcod)
- **LinkedIn:** [Asmit Bisht](https://www.linkedin.com/in/asmit-bisht-a09682293)
- **Contact form:** powered by [Formspree](https://formspree.io/)

<div align="center">

<br>

*Thanks for stopping by — keep building things that make people curious.*

<sub>© Asmit Bisht · Personal Portfolio</sub>

</div>
