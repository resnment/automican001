# Automican

Public website for specialist AI agent teams and custom swarms, built with React 19, Vite, and locally bundled fonts.

## Run

- `npm ci`
- `npm run dev -- --host 0.0.0.0`
- `npm run build` creates the static production site in `dist/`.
- `npm run preview` serves the production build locally.

## Inquiry delivery

The owner-provided recipient is **automicanhq@gmail.com**. Visitors can review an inquiry, open a prefilled email draft in their email client, or download a text brief. Opening a draft does not send an email. No backend, account, payment, or browser-storage collection is configured. Form details remain in React memory until page reload or explicit clearing; drafts survive closing and reopening the inquiry dialog.

To introduce direct server submission, configure a real form service or API with a maintained data-handling contract; do not show a sent state without server confirmation.

## Design and verification

`DESIGN.md` records visual direction and semantic token mappings. `UX-CONTRACT.md` records inquiry and role-explorer behavior. `src/index.css` owns runtime tokens; shared components live in `src/components.jsx`.

- `npm run lint`
- `npm run format:check`
- `npm run verify:design`
- `npm run test:browser` (uses installed Chromium at `/usr/bin/chromium`, `CHROMIUM_PATH`, or Playwright's browser installation)
- `python3 scripts/audit_project.py . --mode strict`

Browser tests start and stop their own local server on port 4175. They retain screenshots, accessibility results and a workflow report in `artifacts/`. Tests prepare and inspect email drafts without sending email. Automated accessibility checks are supplemented by keyboard, focus, reflow, native-select, reduced-motion and offline checks.

This change prepares the existing repository for deployment; it does not change the production domain or publish to automican.com.
