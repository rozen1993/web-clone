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

@docs/research/INSPECTION_GUIDE.md
