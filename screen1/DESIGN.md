---
name: GhostWriter
colors:
  surface: '#0f141b'
  surface-dim: '#0f141b'
  surface-bright: '#343941'
  surface-container-lowest: '#090f15'
  surface-container-low: '#171c23'
  surface-container: '#1b2027'
  surface-container-high: '#252a32'
  surface-container-highest: '#30353d'
  on-surface: '#dee2ec'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dee2ec'
  inverse-on-surface: '#2c3138'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#7bd0ff'
  on-tertiary: '#00354a'
  tertiary-container: '#009bd1'
  on-tertiary-container: '#002d40'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#0f141b'
  on-background: '#dee2ec'
  surface-variant: '#30353d'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system embodies an ultra-focused, minimalist engineering instrument crafted for high-velocity software engineers, infrastructure architects, and technical writers. The brand visual language balances terminal precision with modern ergonomic luxury—stripping away visual noise in favor of data density, surgical clarity, and calculated chromatic accents.

The design movement mixes **Minimalism** with a refined **Modern Developer Workspace** aesthetic. It prioritizes dark, non-distracting surfaces, high-legibility monospace rendering, structural pixel alignment, and functional syntax illumination. Visual hierarchy is achieved through meticulous type sizing, tonal contrast between surface planes, and hairline structural borders rather than heavy decorative elements.

## Colors

The palette is engineered specifically for deep focus during prolonged night and low-light sessions.

- **Primary (`#8b5cf6` - Electric Violet):** Reserved for key interaction points, active focus rings, command palette highlights, and AI-assisted agent actions.
- **Secondary (`#10b981` - Neon Emerald):** Drives success confirmations, live connection indicators, merged status, and diff additions.
- **Tertiary (`#38bdf8` - Cyan):** Applied to telemetry metrics, informational badges, function signatures, and branch indicators.
- **Neutral (`#161b22` - Slate Layer):** Anchors the tonal hierarchy across three core surface tiers:
  - Base Canvas: `#0d1117`
  - Elevated Container / Sidebar: `#161b22`
  - Floating Overlays & Active Lines: `#21262d`
  - Subtle Borders & Separators: `#30363d`
  - Text Neutral Primary: `#f0f6fc`
  - Text Neutral Muted: `#8b949e`
- **Diff / Diagnostic Accents:**
  - Removal / Error: `#f85149` (diff background: `rgba(248, 81, 73, 0.15)`)
  - Addition / Verified: `#10b981` (diff background: `rgba(16, 185, 129, 0.15)`)

## Typography

The system applies a disciplined dual-type hierarchy: **Inter** handles high-level navigational chrome, modal structures, and descriptive copy, providing geometric neutral legibility. **JetBrains Mono** governs the core code editor, terminal logs, interactive chips, badges, keybindings, metrics, and line gutters.

All monospace text features enabled tabular figures and code ligatures where appropriate. Line heights in code viewports are locked to strict proportional increments (`20px` and `22px`) to guarantee synchronized diff gutters, inline blame annotations, and folding guides without jitter.

## Layout & Spacing

The layout is built around a structured, fluid workspace grid optimized for IDE-style multi-pane splitting (editor, gutter, file tree, terminal drawer, and inspect panel).

- **Desktop (>=1024px):** Modular pane system with `1.5rem` outer margins. Horizontal dividers utilize a 1px border grid without wasted negative space. Content areas expand fluidly with min-width constraints (file tree: 220px, editor: 480px, terminal: 320px).
- **Tablet (768px - 1023px):** Sidebars collapse into an icon rail (48px wide); secondary panels convert to slide-over drawers with `1rem` gutters.
- **Mobile (<768px):** Single-column stacked mode with full-width execution. Code viewports use `1rem` margins with horizontal edge-to-edge scrolling for overlong lines. Bottom sheets handle terminal inspection and command entry.

## Elevation & Depth

Depth is established strictly through **tonal surface layering** combined with **crisp low-contrast outlines**, deliberately avoiding heavy drop shadows that cause visual blur in dense code environments.

- **Level 0 (Canvas Base - `#0d1117`):** The master underlying canvas, used for active editing panes and terminal streams.
- **Level 1 (Side Panels & Rails - `#161b22`):** Structural navigation, file explorer, status bars. Demarcated by a persistent `1px solid #30363d` border.
- **Level 2 (Dropdowns, Command Palette, Modals - `#21262d`):** Raised floating components. These utilize a razor-sharp border (`1px solid #30363d`) and an ultra-subtle directional ambient shadow: `0 8px 24px rgba(0, 0, 0, 0.45)`.
- **Focus & Interaction Cues:** Elements under keyboard navigation acquire a crisp, non-blurred `1px solid #8b5cf6` border and a secondary `0 0 0 1px #8b5cf6` outer glow.

## Shapes

The design uses a **Soft (Level 1)** geometric language. Standard interactive elements (buttons, inputs, command palette entries) feature a concise `0.25rem` (4px) border radius, matching the technical, rectangular nature of code blocks and terminal windows.

Larger dialog containers, contextual popovers, and code cards expand to `0.5rem` (8px). Rounding never exceeds `0.75rem` (12px), preventing consumer-app "pill" softness and sustaining a professional workstation feel.

## Components

### Buttons
- **Primary:** Background `#8b5cf6`, text `#ffffff`, border `1px solid transparent`. Hover: `#7c3aed`. Active: `#6d28d9`.
- **Secondary / Ghost:** Background `transparent`, text `#f0f6fc`, border `1px solid #30363d`. Hover: background `#21262d`, border `#8b949e`.
- **Destructive:** Background `rgba(248, 81, 73, 0.1)`, text `#f85149`, border `1px solid rgba(248, 81, 73, 0.4)`. Hover: background `#f85149`, text `#ffffff`.
- **Size & Padding:** Compact developer proportions: 28px height for toolbars (`space-xs` vertical, `space-sm` horizontal); 36px height for primary forms.

### Chips & Badges
- Displayed exclusively in `label-sm` JetBrains Mono.
- Status badges feature a subtle `0.5px` solid border, an alpha-blended tint background (`rgba(x, y, z, 0.12)`), and a solid 6px status dot (e.g., green for passing tests, purple for AI generation, cyan for staging branches).

### Input Fields & Command Palette
- **Inputs:** Background `#0d1117`, border `1px solid #30363d`, text `#f0f6fc`, placeholder `#8b949e`. Font family JetBrains Mono for code/query fields, Inter for settings. Focused state shifts border to `#8b5cf6` with zero layout shift.
- **Command Palette:** Centered floating container (`#21262d`), width `640px` max, integrated search input with `>_` terminal prefix, shortcut hints styled with nested `#161b22` key badges (`Kbd`).

### Checkboxes & Radio Buttons
- Crisp 14x14px squares (checkbox) and circles (radio) with `#30363d` outline and `#161b22` background. Checked states display solid `#8b5cf6` fill with sharp white icons.

### Cards & Diff Viewers
- **Cards:** Background `#161b22`, border `1px solid #30363d`, `space-md` internal padding. Headers separated with horizontal 1px hairline rules.
- **Diff Containers:** Full-width code rows. Deletions highlighted with background `rgba(248, 81, 73, 0.15)` and prefix `-` in `#f85149`. Additions highlighted with background `rgba(16, 185, 129, 0.15)` and prefix `+` in `#10b981`. Gutter numbers rendered in `code-sm` using `#8b949e`.

### Mobile Developer Ergonomics
- Includes an accessory toolbar anchored above the virtual mobile keyboard containing indentation controls (`Tab`, `Shift+Tab`), bracket shortcuts (`{`, `}`, `[`, `]`, `=>`), and cursor directional arrows formatted in compact 32px touch targets.