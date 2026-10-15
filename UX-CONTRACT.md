# Public site interaction contract

## Product context and business evidence

This public site helps offices, companies, organizations, and institutions explore AI agent teams and inquire about hiring or custom builds. User brief and supplied contact email (2026-10-15) are authoritative for this scope. Existing src/data.js provides 30 roles, including the coordinating role. No business evidence supports checkout, fixed prices, deployment, live execution, guaranteed integrations, authentication, billing, or destructive operations; none is introduced.

English / en-US; no locale-specific dates or currency. Accessibility target: WCAG 2.2 AA. Visual system and runtime token ownership are in DESIGN.md. Only a dark theme is supported; system forced colors remain usable.

## Canonical UI Map

| Capability     | Canonical owner                         | Source of truth | Allowed variants                | Verification      |
| -------------- | --------------------------------------- | --------------- | ------------------------------- | ----------------- |
| Form           | Field and Inquiry in src/components.jsx | This contract   | Local inquiry review            | tests/browser.cjs |
| Select/Listbox | Native select in Registry and Inquiry   | This contract   | native; platform popup accepted | tests/browser.cjs |
| Scrollbar      | Global src/index.css                    | DESIGN.md       | Stable document gutter          | tests/browser.cjs |
| Toast          | Status in src/components.jsx            | This contract   | Polite status                   | tests/browser.cjs |

One shared Button and Dialog serve all flows. Table selection, date, and remote CRUD are not applicable. Native select is intentional: OS popup geometry is acceptable and no authored option popup is claimed.

## Discovery and navigation

Real anchor links navigate to the swarm, teams, process, custom-build guidance, and FAQs. Mobile navigation is a non-modal disclosure with visible expanded state, closing on link navigation and Escape, restoring menu-button focus on Escape. Native details/summary owns each FAQ.

The complete bundled 30-role dataset has honest local pagination: five roles per page, explicit range and disabled boundary controls. Search, department, sort, and page are in URL parameters. Browser Back/Forward restores committed state. Local search is immediate and IME-safe; Clear is a named button that restores input focus. Filtering resets paging and invalid page numbers clamp. Role details preserve the registry context and full text. No-results offers Clear filters. The registry has a stable five-row footprint and scrolls horizontally on phones; it never constrains page/form height.

## Dialogs and inquiry flow

HTMLDialogElement.showModal owns modality, inert background, native focus containment and top-layer stacking. Shared Dialog owns naming, Escape, close, scroll lock, and trigger restoration. All detail surfaces use the same vocabulary and controls. Inquiry handoffs close the old detail before opening the inquiry and restore a surviving page trigger on dismissal.

Inquiry sequence: choose interest → enter details → review brief → open an email draft or download a text copy. Recipient is exactly automicanhq@gmail.com, supplied by the user. A mailto link opens a prefilled draft; the visitor sends in their email client. Persistent copy says this explicitly; there is no success claim that an email was sent. A visible recipient and downloadable brief provide recovery if no mail client is installed. Details are never sent automatically or stored in browser storage. They remain in tab memory until refresh or explicit Clear draft. Clear draft uses an app-owned inline confirmation; closing does not discard the draft.

## Validation and feedback

Forms use noValidate. Name: 2–100 characters; organization: nonempty, up to 160; email: basic address shape, up to 254; objective: 20–2000 characters. Labels and aria-describedby associate helper/error text; aria-invalid marks errors. Submit focuses first invalid field; edited fields clear their stale error. Textarea auto-grows up to 240px, then scrolls; resize is none. Review heading gets focus. Content uses text nodes, never injected HTML.

Download is synchronous, reentry-guarded and exposes busy semantics with stable controls. Failure preserves details and offers inline retry. One shared, deduplicated, six-second polite status region acknowledges downloads and directs users to finish sending in their email app. Critical information also stays inline. Drafts survive dialog closure. beforeunload guards actual page unload while details exist; same-page navigation keeps the draft mounted. No remote loading, retry, session or synchronization claims exist. All assets are bundled, so loaded-site functionality works offline.

## Verification

npm run build; npm run format:check; npm run verify:design; npm run test:browser. Strict skill audit: python3 scripts/audit_project.py . --mode strict, retained in premium-audit.json. Browser evidence covers desktop and phone, reduced motion, native select opening, searching, paging, URL restoration, no-results, detail-to-inquiry focus, form errors, draft retention, mailto recipient/body, download/retry, offline behavior and automated accessibility. Team and role dialogs are compared as sibling flows. No payment or actual email transmission is exercised.
