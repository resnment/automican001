---
version: alpha
name: Automican
description: A calm operations workspace for a coordinated AI workforce.
colors:
  background: "#101213"
  sidebar: "#0c0e0f"
  surface: "#171a1c"
  elevated: "#1d2123"
  border: "#2b3033"
  primary: "#77e0c7"
  text: "#f1f3f3"
  muted: "#a0a8ad"
  danger: "#ff9d9d"
  origin: "#b6a0ed"
  development: "#8bb9f6"
  growth: "#e9bd83"
  revenue: "#77e0c7"
typography:
  display:
    fontFamily: '"Manrope", "Segoe UI", sans-serif'
  sans:
    fontFamily: '"DM Sans", "Segoe UI", sans-serif'
  mono:
    fontFamily: '"IBM Plex Mono", ui-monospace, monospace'
rounded:
  DEFAULT: "0.5rem"
  lg: "0.875rem"
spacing:
  section: "1.75rem"
  page: "2.5rem"
components:
  button:
    rounded: "0.5rem"
  panel:
    rounded: "0.875rem"
  dialog:
    rounded: "0.875rem"
---

# Automican design system

## Overview

Automican is a public website for organizations looking to hire specialist AI agents or commission a custom swarm. Source: user’s stated hiring/custom-build brief, 2026-10-15; supplied business email automicanhq@gmail.com; existing 30-role dataset in src/data.js. No backend, pricing, customer results, or integration guarantees are supplied. The live reference at https://www.automican.com/ is client rendered and exposed no additional crawlable content. The redesign preserves the dark/cyan brand from the existing source while making the hiring journey concrete.

North star: the visible structure of collective intelligence, presented like a specialist technology studio. The signature is a precise topology connecting four departments through a central orchestrator. The diagram is illustrative, not live telemetry. Expressiveness belongs there; team details and inquiry forms remain familiar. Avoid animated gradient text, fake execution feeds, invented customer logos or metrics, and dense dashboard chrome on the public site.

English is the product language; no specific geographic market is established. The audience is offices, companies, organizations, and institutions. Register: marketing with a bounded team explorer and inquiry form. No Japan-market evidence. Desktop and mobile retain every conversion path. No account, payments, destructive operation, deployment, or external send is introduced. The email draft uses the exact recipient supplied by the owner.

Runtime CSS in `src/index.css` is canonical (Model B); this file mirrors its semantic tokens. Mapping: each colors key maps to `--color-{key}`; typography display/sans/mono map to `--font-display`, `--font-sans`, `--font-mono`; rounded DEFAULT/lg map to `--radius-control`/`--radius-panel`; spacing section/page map to `--space-section`/`--space-page`. Components consume these variables directly. `scripts/verify-design.mjs` checks drift. Tailwind has no independent semantic theme adapter.

## Colors

Charcoal tonal surfaces and subtle borders establish hierarchy. Mint is the safe primary action and coordination accent. Department colors distinguish groups, always with text labels. Errors use danger plus explanatory text. Muted text stays readable on surfaces. Only a dark theme is supported; forced colors use platform colors.

## Typography

Manrope provides restrained geometric display headings; DM Sans handles controls and prose; IBM Plex Mono labels technical metadata. Fonts are bundled locally with fixed fallback stacks. Prose uses sentence case and comfortable line height. Data uses tabular figures. No oversized marketing typography inside tables or dialogs.

## Layout

Content width up to 1280px with generous horizontal gutters; desktop hero is a 1.05:1 split. Four team cards become two below 950px and one below 480px; hero stacks below 760px. Mobile navigation is an in-flow-height-neutral disclosure under the header, with no claim to modal semantics. Large section spacing supports a clear marketing narrative; the role registry expands only on demand. Document owns vertical scrolling. The registry owns horizontal scrolling only. Dialogs have bounded internal scrolling. No global fixed-height clipping.

## Elevation & Depth

Panels are flat, with tonal separation and 1px borders. Only dialogs have a shadow and backdrop. Dot-grid texture belongs exclusively to the network map. No glass cards or gratuitous gradients.

## Shapes

8px controls and 14px panels; pills are reserved for status and counts. Icons have 1.7px strokes. Thin topology connections visually contrast with substantial node anchors.

## Components

Shared Button supports solid, outline, ghost emphasis and primary, neutral, danger intent. Controls show hover, pressed, focus-visible, disabled, and busy treatments; busy content reserves geometry. Lucide icons use 16–20px sizes and decorative icons are hidden from assistive technology.

Team cards, topology nodes and role details share department colors, icons and vocabulary. Native table semantics, bounded pagination and explicit detail actions preserve utility. Native selects intentionally accept platform popup geometry. Search has an authored clear control. Shared Field owns labels, help and invalid feedback. Shared native-dialog wrapper owns modality, Escape, focus restoration and scrolling. A shared status region announces local operations; persistent errors stay inline.

Motion is limited to subtle 150ms control feedback and a busy spinner. The network is still; control feedback is the only routine motion. Reduced motion removes transitions and spinner animation. Product copy names actual behavior: explore a team, review an inquiry, open an email draft, download a brief. Opening a draft never claims an inquiry was sent.

## Do's and Don'ts

- Do preserve text labels alongside department and status colors.
- Do use the shared controls and semantic tokens across every view.
- Don't imply that a team has been hired or an email sent before a real engagement or send occurs.
- Don't add billing, permissions or destructive operations without maintained business contracts.
