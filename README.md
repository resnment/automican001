# Automican

A public AI employee and custom-agent studio for Bangladeshi Companies, Organizations, Institutions, or Personal needs. Built with React 19, Vite, locally bundled fonts, and custom SVG employee avatars.

## Run

- `npm ci`
- `npm run dev -- --host 0.0.0.0`
- `npm run build` creates the static production site in `dist/`.
- `npm run preview` serves the production build locally.

## Employee experience

Twelve everyday roles replace the previous software-department taxonomy: social media, accounting, customer care, digital marketing, sales, HR/admin, e-commerce, inventory, admissions, academic coordination, content creation, and personal assistance. The gallery offers local search, category filtering, URL history and explicit load more.

Avatars share a local SVG construction with role badges, accessories, and four accent families. Hover, keyboard focus or tap opens a role-specific introduction and raises the character's hand. Escape and the close control dismiss it. Reduced motion preserves the static raised pose. Hire and Build actions stay visible outside popups and carry context into the inquiry.

## Frameworks and interoperability

Sixteen researched SDKs, frameworks and agent platforms link to official documentation. The catalog distinguishes OpenAI Agents SDK from ChatGPT dots, and includes Claude Agent SDK, Google ADK, LangGraph, LangChain, n8n, OpenClaw, Hermes Agent, CrewAI, Microsoft Agent Framework, Pydantic AI, Mastra, Agno, LlamaIndex and smolagents.

A2A is explained as agent-to-agent communication; MCP as tool/data connectivity. Catalog inclusion is a build/scoping option, not an implemented connector, official endorsement, or universal compatibility guarantee. Research and classification evidence: [.design/research.md](.design/research.md).

## Inquiry delivery

The owner-provided recipient is **automicanhq@gmail.com**. Visitors review an inquiry, open a prefilled email draft in their own email client, or download a text brief. The email/brief preserves Hire or Build intent, employee role, audience and preferred framework. An organization name is optional for Personal inquiries.

Opening a draft does not send email. No backend, account, payment, or browser-storage collection is configured. Contact details remain in React memory until reload or explicit confirmed clearing; they survive closing and reopening the inquiry dialog. To introduce direct submission, configure a real form service/API and maintained data-handling contract; show sent feedback only after server confirmation.

## Design and verification

`DESIGN.md` records the user-authorized sci-fi identity and semantic token mapping. `UX-CONTRACT.md` records shared behavior. `src/index.css` owns runtime tokens, `src/components.jsx` owns controls and inquiry behavior, and `src/Avatar.jsx` owns character drawing and greeting interaction. [.design/brief.md](.design/brief.md) records the original audit findings and direction.

- `npm run lint`
- `npm run format:check`
- `npm run verify:design`
- `npm run test:browser` (uses Chromium at `/usr/bin/chromium`, `CHROMIUM_PATH`, or Playwright's browser installation)
- `python3 scripts/audit_project.py . --mode strict`

Browser tests start and stop a local server on port 4175 and retain screenshots, accessibility results and a workflow report in `artifacts/`. Ten workflow groups cover the catalog, greetings, focus, filters/history, role handoffs, framework context, Personal/company validation, draft preservation, email/download and retry, reflow, reduced motion, offline and forced colors. Widths include 320, 390, 520, 720 (200% desktop zoom-equivalent reflow), 768, 950, 1024 and 1440 CSS pixels. Automated accessibility and keyboard checks are not a screen-reader certification; no screen-reader tool is available in this environment.

This repository prepares a static production build; pushing a branch or opening a pull request does not itself merge the changes or alter the live domain.
