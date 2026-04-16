# Automican001

This repository contains a React + Vite single-page app.

## Build & Run Locally

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run a production build**
   ```bash
   npm run build
   ```
3. **Preview the built app locally**
   ```bash
   npm run preview
   ```

Optional (development server with hot reload):
```bash
npm run dev
```

## Hosting Configuration (Vercel)

Use the following Vercel project settings:

- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

A `vercel.json` file is included to enforce SPA fallback rewrites so client-side routes resolve to `index.html`.

## SPA Route Fallback (Production)

This project is configured as an SPA. The Vercel rewrite rule sends unmatched routes to `/index.html`, so if client-side routes are added later (for example, `/dashboard`), direct navigation and page refreshes continue to work in production.
