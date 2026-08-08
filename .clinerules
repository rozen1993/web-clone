<!-- AUTO-GENERATED from AGENTS.md — do not edit directly.
     Run `bash scripts/sync-agent-rules.sh` to regenerate. -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Website Reverse-Engineer Template

## What This Is
A reusable template for reverse-engineering any website into a clean, modern Next.js codebase using AI coding agents. The Next.js + shadcn/ui + Tailwind v4 base is pre-scaffolded — just run `/clone-website <url1> [<url2> ...]`.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **UI:** shadcn/ui (Radix primitives, Tailwind CSS v4, `cn()` utility)
- **Icons:** Lucide React (default — will be replaced/supplemented by extracted SVGs)
- **Styling:** Tailwind CSS v4 with oklch design tokens
- **Deployment:** Vercel

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript check
- `npm run check` — Run lint + typecheck + build

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind utility classes, no inline styles
- 2-space indentation
- Responsive: mobile-first

## Design Principles
- **Pixel-perfect emulation** — match the target's spacing, colors, typography exactly
- **No personal aesthetic changes during emulation phase** — match 1:1 first, customize later
- **Real content** — use actual text and assets from the target site, not placeholders
- **Beauty-first** — every pixel matters

## Project Structure
```
src/
  app/              # Next.js routes
  components/       # React components
    ui/             # shadcn/ui primitives
    icons.tsx       # Extracted SVG icons as React components
  lib/
    utils.ts        # cn() utility (shadcn)
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks
public/
  images/           # Downloaded images from target site
  videos/           # Downloaded videos from target site
  seo/              # Favicons, OG images, webmanifest
docs/
  research/         # Inspection output (design tokens, components, layout)
  design-references/ # Screenshots and visual references
scripts/            # Asset download scripts
```

## MOST IMPORTANT NOTES
- When launching Claude Code agent teams, ALWAYS have each teammate work in their own worktree branch and merge everyone's work at the end, resolving any merge conflicts smartly since you are basically serving the orchestrator role and have full context to our goals, work given, work achieved, and desired outcomes.
- After editing `AGENTS.md`, run `bash scripts/sync-agent-rules.sh` to regenerate platform-specific instruction files.
- After editing `.claude/skills/clone-website/SKILL.md`, run `node scripts/sync-skills.mjs` to regenerate the skill for all platforms.

<!-- BEGIN:claude-codex-protocol -->
# Protocolo Claude ↔ Codex

Rige **todo el trabajo de este proyecto**, y solo de este proyecto. Sustituye a cualquier reparto de tareas por defecto.

**Claude → arquitecto:** piensa, decide, delega y revisa solo lo crítico. Su contexto es el recurso caro, se protege siempre.
**Codex → ejecutor:** explora, implementa, investiga, prueba. Carga el trabajo pesado.

## REGLA DE ORO
Codex nunca entrega narrativa larga: solo qué cambió, resultado de verificación (pass/fail), y máx. 3-5 líneas de resumen. Nada más salvo pedido explícito.

## RUTEO
- Rutinario / bajo riesgo / verificable automáticamente → Codex ejecuta directo. Claude solo confirma pass/fail, no revisa el detalle.
- Crítico (irreversible, seguridad, arquitectura, o juicio que ningún test resuelve) → Codex explora y propone approach (ya carga el contexto) → Claude da veredicto en una sola pasada (aprueba / ajusta un punto / rechaza con motivo) → Codex ejecuta.

## VERIFICACIÓN SIEMPRE PRIMERO
1. Automática (tests/build/lint/lo que aplique) — filtro gratis, no gasta contexto de Claude.
2. Ojo de Claude — solo si (a) falló lo automático, (b) toca zona marcada como crítica, o (c) es un juicio que ningún test puede resolver.

## FALLOS
Codex reintenta 1 vez con el motivo del fallo. Si persiste, escala con el error puntual, no con el intento completo.

## PROHIBIDO
- Diálogos largos Claude↔Codex.
- Doble opinión en tareas rutinarias (el test ya es el segundo parecer, gratis).
- Claude releyendo/reconstruyendo lo que Codex ya verificó.
- Codex devolviendo output crudo (logs/código/HTML completo) en vez de resumen.

## FLUJO
Objetivo y qué cuenta como crítico se definen al inicio de la tarea → Codex explora/propone (si aplica) y ejecuta → verificación automática → Claude revisa solo lo crítico o lo que falló → resultado.

## Qué cuenta como crítico en este proyecto
- **El modelo de interacción de una sección** (scroll-driven vs click-driven vs hover vs time). Equivocarse obliga a reescribir el componente entero y ningún test lo detecta.
- **Los tokens de diseño globales** — `src/app/globals.css` y las fuentes de `src/app/layout.tsx`. Todo el clon hereda de ahí.
- **El ensamblado de `src/app/page.tsx`** — capas z-index, sticky, scroll containers.
- **Merges de worktrees con conflictos no triviales.**
- **Cualquier cambio irreversible:** borrados, force push, reescritura de historial, o config fuera del repo.

Todo lo demás es rutinario: Codex ejecuta y verifica sin pedir veredicto.

## Aplicación a `/clone-website`
Esta sección **sobrescribe el despacho de builders** descrito en el skill. Los builders son invocaciones de Codex, no subagentes de Claude.

**Claude conserva** (requiere navegador o vista, no delegable — Codex no tiene MCP de navegador):
- Fase 1 completa: screenshots y barridos de scroll/click/hover/responsive
- La decisión del modelo de interacción de cada sección
- `docs/research/PAGE_TOPOLOGY.md` y `BEHAVIORS.md`
- Fase 2: el mapeo de colores y fuentes del target a tokens shadcn
- Fase 5: el QA visual diff contra el original

**Codex ejecuta:**
- Los builders: spec `.md` → `.tsx`, uno por worktree
- La conversión de dump crudo → spec `.md`
- `scripts/download-assets.mjs` (escribirlo y ejecutarlo)
- `src/components/icons.tsx` a partir de los SVG volcados a disco
- Las interfaces TS de `src/types/`
- El ensamblado mecánico de `page.tsx` a partir de `PAGE_TOPOLOGY.md`
- El arreglo de errores de lint / typecheck / build
- Los merges de worktrees sin conflicto o con conflicto trivial

**Desviación deliberada del skill:** el skill exige pasar la spec *inline* al builder porque un subagente no debe depender de leer archivos. Codex sí lee el repo de forma fiable, así que se le pasa **la ruta** de la spec. La spec sigue siendo obligatoria y exhaustiva — lo que cambia es cómo llega, no que exista.

## Regla de contexto
Claude nunca re-emite dumps crudos ni pega archivos completos en un prompt. Los vuelca a `docs/research/raw/<seccion>.json` y pasa la ruta. Claude lee spec files solo de las secciones marcadas como críticas.

## Invocación de Codex
```bash
codex exec -C <dir> -s <read-only|workspace-write> --skip-git-repo-check \
  --output-schema docs/codex-report.schema.json \
  -o <salida>.md - <<'EOF'
<prompt autocontenido>
EOF
```
- `--output-schema` hace estructural la REGLA DE ORO: la respuesta sale acotada por esquema, no por petición.
- `-C` apunta al worktree cuando el trabajo es de un builder.
- `read-only` para explorar y proponer; `workspace-write` solo cuando deba escribir.
- **Acotar siempre:** foreground con timeout de 600000 ms, o background con `-o` si el trabajo puede pasar de 10 min. `codex exec` no tiene timeout propio.
- Codex arranca en blanco en cada invocación: el prompt debe ser autocontenido salvo por rutas del repo, que sí puede leer.
<!-- END:claude-codex-protocol -->

# Website Inspection Guide

## How to Reverse-Engineer Any Website

This guide outlines what to capture when inspecting a target website via Chrome MCP or browser DevTools.

## Phase 1: Visual Audit

### Screenshots to Capture
- [ ] Every distinct page — desktop, tablet, mobile
- [ ] Dark mode variants (if applicable)
- [ ] Light mode variants (if applicable)
- [ ] Key interaction states (hover, active, open menus, modals)
- [ ] Loading/skeleton states
- [ ] Empty states
- [ ] Error states

### Design Tokens to Extract
- [ ] **Colors** — background, text (primary/secondary/muted), accent, border, hover, error, success, warning
- [ ] **Typography** — font family, sizes (h1-h6, body, caption, label), weights, line heights, letter spacing
- [ ] **Spacing** — padding/margin patterns (look for a scale: 4px, 8px, 12px, 16px, 24px, 32px, etc.)
- [ ] **Border radius** — buttons, cards, avatars, inputs
- [ ] **Shadows/elevation** — card shadows, dropdown shadows, modal overlay
- [ ] **Breakpoints** — when does the layout shift? (inspect with DevTools responsive mode)
- [ ] **Icons** — which icon library? custom SVGs? sizes?
- [ ] **Avatars** — sizes, shapes, fallback behavior
- [ ] **Buttons** — all variants (primary, secondary, ghost, icon-only, danger)
- [ ] **Inputs** — text fields, textareas, selects, checkboxes, toggles

## Phase 2: Component Inventory

For each distinct UI component, document:
1. **Name** — what would you call this component?
2. **Structure** — what HTML elements / child components does it contain?
3. **Variants** — does it have different sizes, colors, or states?
4. **States** — default, hover, active, disabled, loading, error, empty
5. **Responsive behavior** — how does it change at different breakpoints?
6. **Interactions** — click, hover, focus, keyboard navigation
7. **Animations** — transitions, entrance/exit animations, micro-interactions

### Common Components to Look For
- Navigation (top bar, sidebar, bottom bar)
- Cards / list items
- Buttons and links
- Forms and inputs
- Modals and dialogs
- Dropdowns and menus
- Tabs and segmented controls
- Avatars and user badges
- Loading skeletons
- Toast notifications
- Tooltips and popovers

## Phase 3: Layout Architecture

- [ ] **Grid system** — CSS Grid? Flexbox? Fixed widths?
- [ ] **Column layout** — how many columns at each breakpoint?
- [ ] **Max-width** — main content area max-width
- [ ] **Sticky elements** — header, sidebar, floating buttons
- [ ] **Z-index layers** — navigation, modals, tooltips, overlays
- [ ] **Scroll behavior** — infinite scroll, pagination, virtual scrolling

## Phase 4: Technical Stack Analysis

- [ ] **Framework** — React? Vue? Angular? Check `__NEXT_DATA__`, `__NUXT__`, `ng-version`
- [ ] **CSS approach** — Tailwind (utility classes), CSS Modules, Styled Components, Emotion, vanilla CSS
- [ ] **State management** — Redux (check DevTools), React Query, Zustand, Pinia
- [ ] **API patterns** — REST, GraphQL (check network tab for `/graphql` requests)
- [ ] **Font loading** — Google Fonts, self-hosted, system fonts
- [ ] **Image strategy** — CDN, lazy loading, srcset, WebP/AVIF
- [ ] **Animation library** — Framer Motion, GSAP, CSS transitions only

## Phase 5: Documentation Output

After inspection, create these files in `docs/research/`:
1. `DESIGN_TOKENS.md` — All extracted colors, typography, spacing
2. `COMPONENT_INVENTORY.md` — Every component with structure notes
3. `LAYOUT_ARCHITECTURE.md` — Page layouts, grid system, responsive behavior
4. `INTERACTION_PATTERNS.md` — Animations, transitions, hover states
5. `TECH_STACK_ANALYSIS.md` — What the site uses and our chosen equivalents
