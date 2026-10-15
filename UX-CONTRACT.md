# Public site interaction contract

## Product context and business evidence

The user-approved 2026-10-15 redesign serves Bangladeshi Companies, Organizations, Institutions, or Personal needs. The previous thirty roles and four departments are retired. `src/data.js` owns twelve everyday employee roles and sixteen researched framework/platform options; evidence and classification are in `.design/research.md`. No money, privacy policy, regulated decision authority, remote execution, universal compatibility or partnership is inferred. Human approvals are scoped before any real implementation.

English / en-US is the current UI; Bangla examples do not imply a fully localized product. Accessibility target: WCAG 2.2 AA. Dark-theme visual system and runtime token ownership are in DESIGN.md. Forced colors and reduced motion remain usable.

## Canonical UI Map

| Capability     | Canonical owner                         | Source of truth | Allowed variants          | Verification      |
| -------------- | --------------------------------------- | --------------- | ------------------------- | ----------------- |
| Form           | Field and Inquiry in src/components.jsx | This contract   | Hire / Build inquiry      | tests/browser.cjs |
| Select/Listbox | Native selects in Inquiry               | This contract   | native; OS popup accepted | tests/browser.cjs |
| Scrollbar      | Global src/index.css                    | DESIGN.md       | Stable document gutter    | tests/browser.cjs |
| Toast          | Status in src/components.jsx            | This contract   | Polite status             | tests/browser.cjs |

Shared Button, Dialog and AvatarGreeting own repeated behavior; role detail, catalog and frameworks reuse them. Table selection, date and remote CRUD are not applicable. Native select popup geometry and interaction are intentionally platform-owned.

## Discovery and navigation

Real anchor links navigate to Employees, Custom builds, Frameworks, questions. The mobile navigation is a non-modal disclosure, with Escape closing it and restoring its button. FAQs use native details/summary.

The complete twelve-role collection is bundled locally. Compact cards show an avatar, role, one short summary, and persistent Hire/Build actions. Codes, categories and tool chips are removed from cards; categories remain in filters and capabilities remain in details. Six employees render initially; explicit Meet all loads the remainder. The result count, clear control and no-results recovery are available. Committed query, category and shown count use URL parameters; filtering resets shown to six and browser history restores state. Local search is immediate and composition-safe. Invalid categories fall back to All and shown counts clamp to 6–12. No invented server loading or pagination is introduced. Roles have the same label, details and Hire/Build intent everywhere.

Framework library renders eight of sixteen options, with an explicit expand/collapse; type filters show current pressed state. Cards link to official documents in a new tab, named accordingly. Build preserves the framework into Inquiry. A2A/MCP links are explanatory sources, not live connection controls.

## Avatar introductions

One shared AvatarGreeting renders a semantic button with expanded state and a referenced speech panel. Mouse hover, keyboard focus, and touch activation open the same role-specific message. The hand raises and the wrist waves for a bounded three-cycle animation. Reduced motion shows the raised pose without interpolation or repetition. The illustrated role badge, color and accessories are decorative; persistent role text and Hire/Build actions remain outside the popup. The popup contains only a decorative star and greeting. No popup heading, visible Meet me label, or close button is rendered. It remains hoverable and dismisses on Escape, a second tap, an outside tap, pointer departure, or focus leaving its owner. The trigger retains an accessible name, expanded state, and linked description. A shared positioning routine clamps it to the viewport and chooses above/below placement. Dismissal does not erase role context or navigate. It is non-modal and does not trap focus. Speech panels overlay without changing layout; check their bounds on phones.

## Dialogs and inquiry flow

Native HTMLDialogElement.showModal supplies inert background and top-layer modality. Shared Dialog adds naming, close/Escape, explicit Tab boundary containment, body scroll lock and trigger restoration. Detail-to-inquiry handoff restores a surviving page trigger on dismissal. All flows reuse this owner.

Inquiry fields: Hire/Build intent, audience, employee role, framework/platform, name, organization, email and objective. Personal defaults for the personal role and permits an empty organization. Other audiences require an organization. All entry points retain selected role and intent. Framework-specific entry points retain the framework. User-entered contact details survive dialog closure; changed entry context updates role/intent without erasing the draft.

Inquiry sequence: select context → enter details → review → open email draft or download text brief. Recipient remains exactly automicanhq@gmail.com, provided by the owner. The visitor sends from their email app. A visible recipient and downloadable copy recover when no email client opens. No automatic sending, payments, account creation or browser-storage collection occurs. Both email and download include intent, role, audience, framework and supplied details. Clear draft uses an inline app-owned confirmation. beforeunload guards actual unload while contact/objective fields exist.

## Validation and feedback

Forms use noValidate. Name 2–100 characters; organization required except Personal, up to 160; basic valid email up to 254; objective 20–2000 characters. Labels, aria-invalid and aria-describedby associate correction text. Empty helper rows are not rendered; aria-describedby points only to helper/error content that exists. Validation messages expand the field naturally and focus the first correction. Submit focuses the first invalid field; edits clear stale field errors. Textarea is non-resizable, auto-growing to 240px, then scrollable. Review heading receives focus. Inputs render plain text, not HTML.

Download is reentry-guarded; failure preserves the brief and exposes a persistent inline retry message. Shared six-second polite Status acknowledges downloads or directs users to finish sending. Critical information remains inline. No network/session/conflict/retry claims exist for local operations. All fonts and avatars are local; loaded-site interaction is usable offline.

## Verification

Run npm run lint, npm run format:check, npm run verify:design, npm run build, npm run test:browser, and python3 scripts/audit_project.py . --mode strict. Retain screenshots and JSON evidence in artifacts. Compare catalog, detail and inquiry labels/intent as sibling flows. Test hover/focus/tap/Escape, actual arm transform and reduced motion, speech popup bounds, all employee filters/load-more/history, framework filters/docs/prefill, Personal validation, email and download contents, failure/retry, draft retention, focus and narrow reflow. Test 320px, phone, tablet, desktop and 200% desktop zoom-equivalent width. Automated accessibility and keyboard checks supplement, not replace, screen-reader testing; no screen reader is available in this environment.

## Minimal revision and delivery constraint

The latest user revision adds AI to the hero headline, removes the audience eyebrow and connecting “or”, uses one hero avatar, compacts cards and framework rows, standardizes action labels/icons, and reduces repeated public copy. Main actions use 15px labels, 18px icons, a consistent gap and at least 44px height; supporting text is at least 14px. The user has authorized pushing this revision to GitHub. Another Git pull or new pull request requires explicit authorization.
