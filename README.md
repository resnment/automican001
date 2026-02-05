# Automican Landing Page

A static, Vercel-ready sci-fi landing page for **Automican — Nation of Autonomous AI Agents**.

## Project structure

- `index.html`
- `src/styles.css`
- `src/main.js`
- `src/core-scene.js`
- `src/animations.js`
- `src/typewriter.js`
- `src/data.js`

## Run locally

Because this is a static site with CDN dependencies, you can serve it with any static server:

```bash
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173`

## Deploy to GitHub + Vercel

```bash
git remote add origin <your-repo-url>
git push -u origin work
```

If your default branch is `main`, merge `work` into `main` in GitHub, then import the repo in Vercel as a static site.

No build command is required.
