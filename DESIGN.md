---
version: alpha
name: Automican
description: A premium sci-fi studio for AI employees and human ambition.
colors:
  background: "#090e1a"
  surface: "#101a2b"
  elevated: "#19273e"
  border: "#33435a"
  primary: "#e5c79b"
  text: "#f4f3ed"
  muted: "#b4becd"
  danger: "#ffb2b8"
  cyan: "#9adce8"
  lilac: "#bcb5f2"
  rose: "#e8b8c4"
  on-primary: "#201b16"
typography:
  display:
    fontFamily: '"Manrope", "Segoe UI", sans-serif'
  sans:
    fontFamily: '"DM Sans", "Segoe UI", sans-serif'
  mono:
    fontFamily: '"IBM Plex Mono", ui-monospace, monospace'
rounded:
  DEFAULT: "0.75rem"
  lg: "1.125rem"
spacing:
  section: "2rem"
  page: "2.5rem"
components:
  button:
    rounded: "0.75rem"
  panel:
    rounded: "1.125rem"
  dialog:
    rounded: "1.25rem"
---

# Automican design system

## Overview

Automican is a public AI employee and custom-agent studio for Bangladesh-facing Companies, Organizations, Institutions, or Personal needs. The owner's 2026-10-15 request explicitly replaces the prior 30-role software-department taxonomy, removes Offices from the audience line, adds Personal, requests larger typography, classy sci-fi colors, illustrated employees with waving introductions, Hire/Build actions, and a researched framework/interoperability section. This is an authorized durable identity change; the prior design is preserved in before screenshots and Git history.

North star: a refined sci-fi character studio, where luminous metal AI colleagues have personality while the website behaves like a credible professional service. The signature is a large typographic hero in pearl and champagne, with character introductions reserved for the employee catalog. The current request explicitly removes avatars and role captions from the hero and footer. The latest user revision explicitly removes constellation diagrams, promotional eyebrows, role codes, skill-chip rows, large illustrations, and repeated sections. Layer ink-blue surfaces, pearl typography, champagne actions, and restrained glacial-cyan/lilac highlights. Avoid neon terminal cosplay, dashboard telemetry, invented statistics, generic purple gradients, or universal compatibility claims.

The register is public marketing plus a bounded role explorer and inquiry form. English is the current UI language; Bangla and English are offered as workflow-scoping requirements, with workflow language selected during scoping. A Bangla-localized website is not implied. Bangladesh scope is explicit in the user brief. Role research is directional evidence, not a labor-market ranking; sources are in `.design/research.md`. No Japan-market gate is triggered.

The owner-provided inquiry address remains automicanhq@gmail.com. Hire and Build prepare inquiries; no automatic payment, deployment, email transmission, or live agent execution is claimed.

Runtime CSS in `src/index.css` is canonical (Model B). `colors.{key}` maps to `--color-{key}`; `typography.display/sans/mono` maps to `--font-display/sans/mono`; `rounded.DEFAULT/lg` maps to `--radius-control/panel`; `spacing.section/page` maps to `--space-section/page`. Shared consumers use these CSS variables. `scripts/verify-design.mjs` verifies documented values; there is no independent semantic Tailwind adapter.

## Colors

Ink background and navy surfaces create a coherent night palette. Gradients are quiet tonal lighting on surfaces and a champagne-to-pearl display treatment, not loud full-spectrum decoration. Champagne is the action role; cyan is connection/focus; lilac and rose distinguish employee accents. Color always has a role name or icon equivalent. Pale text and muted text retain contrast on layered surfaces. Danger accompanies inline error text. Only dark mode is supported; forced colors preserve system-operable controls and native scrollbar contrast. Avatar illustration retains its own contrast in forced colors because it is decorative and named by adjacent text.

## Typography

Locally bundled Manrope expresses character through restrained geometric headings; DM Sans supplies readable prose and controls; IBM Plex Mono labels technical metadata. Main body and employee summaries are 16px, hero copy 18–19px, framework descriptions 15px, labels and secondary controls 14–15px, and action buttons 15px with a 24px line height. Visible text never drops below 14px. Buttons share a 44px minimum height, centered labels, an 8px icon gap, and consistent 18px action icons. Form controls stay 16px on every viewport. Headings wrap naturally, letter spacing relaxes on phones, and important descriptions never truncate. The English UI uses the platform's Bangla-capable fallback when a Bangla example is present.

## Layout

Content max width is 1200px. The desktop hero uses a full-width two-line headline, with supporting copy and two actions beneath it. It has no avatar, role name, orbit diagram, badges, or decorative captions. Employee gallery is three columns above 1100px, two to 680px, then one column; it renders six roles initially with explicit Load more to the complete twelve-role collection. Phone layouts recompose rather than shrink. Framework library is two columns to 680px, then a single column. Cards use a local framework/company logo on the left, content on the right, and Docs/Build actions below the content. Grid auto-rows share one natural content-driven height across all visible cards, including after filtering and expansion; no fixed height or truncation is used. Section gaps are 64px on desktop and 46px on phones. The bespoke-build section stays compact. A restored A2A/MCP connection panel uses official protocol marks, explanations and documentation links. The lower page restores the human-questions FAQ treatment. A structured footer includes a project invitation, company description, language support, useful navigation, real inquiry email, scope/pricing explanation, copyright and back-to-top link. No invented address, partnership, policy page or social account is added. Filters wrap, and native selects accept the platform popup.

Document owns vertical scrolling; dialogs have bounded internal scrolling. No table-specific shell or forced viewport clipping exists. Search and filters persist in URL state; registry sorting/pagination from the old implementation is intentionally retired with the old table. Hover popups overlay without changing layout and remain usable on keyboard and touch. Avatar and illustration geometry is reserved before interaction; no external image or font fetch is required. Framework logos are bundled under public/logos; provenance and license notes live in .design/logo-sources.md.

## Elevation & Depth

Subtle radial illumination, thin cool borders, inset highlights and restrained shadows create depth. Employee faces and materials use local SVG gradients; glows are restrained on hero and footer surfaces. Speech bubbles and modal dialogs carry functional elevation. Avoid ambient continuous motion or decorative live-status indicators.

## Shapes

12px action controls, 18px employee panels (16px compact phone variants), 14px framework rows, and 20px dialogs (16px on phones). Filter controls share the control-radius family. There are no visible avatar-introduction badges. Metallic avatars share a head/body construction, role-specific accessories and badges, and four accent families. A raised arm communicates greeting; essential role and Hire/Build actions remain visible below the avatar.

## Components

Shared `Button`, `Dialog`, `Field`, `RoleIcon`, `Inquiry`, and `Status` in `src/components.jsx` own repeated behavior. `Avatar` and `AvatarGreeting` in `src/Avatar.jsx` own all character materials, hand motion and introduction behavior. No screen-local dialog or greeting implementation exists. `EmployeeCard` uses the same Hire/Build intent as role details and framework inquiries.

Default, hover, focus-visible, pressed, disabled and busy controls remain distinguishable. Primary buttons are champagne; outline actions stay cool neutral. Success/status uses one polite live region; critical errors remain inline. Busy controls preserve identity and geometry. Native selects intentionally accept browser/OS-owned popup geometry.

Avatar introduction opens on mouse hover, keyboard focus or tap. Escape, a second tap, an outside tap, or pointer/focus departure dismiss it. It contains only a decorative star and the role-specific greeting: no heading, close button, or Meet me/Say hello label. The speech bubble is positioned within the horizontal viewport and switches below its anchor when space above is insufficient. It is hoverable and does not replace persistent role copy or actions. The hand raises with a 550ms transform and a bounded three-cycle wrist wave. Reduced motion keeps the static raised pose while suppressing all interpolation and animation. No automatic audio or pretend live chat is introduced.

Framework cards link to official sources and preserve the chosen framework in Build inquiries. A2A is described as agent-to-agent; MCP is described as agent-to-tool/data. ChatGPT dots, OpenClaw and Hermes Agent are distinguished as platforms. Neither listing nor a protocol implies tested compatibility with every other option.

Lucide icons use consistent stroke weights. Decorative icons/SVGs are hidden from assistive technology; semantic text names every employee, action and protocol. Inquiry review and mailto/download recovery remain from the earlier implementation, extended with intent, role, audience and framework context.

## Do's and Don'ts

- Do keep the character delightful and the business workflow predictable.
- Do use 16px body copy and at least 14px supporting text; recompose instead of shrinking.
- Do preserve every Hire/Build selection through review, email draft and downloaded brief.
- Don't reintroduce retired departments, employee codes, decorative section eyebrows, blank card-height spacers, or Offices in the audience line.
- Keep the audience strip to Companies, Organizations, Institutions, Personal—without an eyebrow or connecting “or”.
- Don't promise automatic payments, tax filing, recruiting decisions, academic decisions, publishing or messaging; scope human approval and actual integrations.
- Don't present a researched catalog as an exhaustive framework inventory or imply an official partnership.
