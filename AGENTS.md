<!-- BEGIN:astro-agent-rules -->
# This is NOT the Astro you know

Astro 7 has breaking changes — APIs, conventions, and file structure may all differ from your training data. The official guides are vendored in `docs/astro/`. Read the relevant one before writing any code; never write `.astro` from memory.

Two v7 changes bite this project in particular:

- **The compiler is strict.** Every non-void element must be closed, and semantically invalid HTML is no longer auto-corrected. Markup copied from a live site is invalid surprisingly often — restructure it into valid markup that renders identically rather than copying the invalidity.
- **`compressHTML` now defaults to `'jsx'`**, which collapses multi-line text and strips line breaks around elements. This project pins it to `true` in `astro.config.mjs`, the lossless mode that preserves visual rendering. Don't change it without understanding what it does to inline spacing.
<!-- END:astro-agent-rules -->

# Website Reverse-Engineer Template

## What This Is
A reusable template for reverse-engineering any website into a clean, modern Astro codebase using AI coding agents. The Astro 7 + React islands + Tailwind v4 base is pre-scaffolded — just run `/clone-website <url1> [<url2> ...]`.

## Tech Stack
- **Framework:** Astro 7, static output, TypeScript strict
- **Interactivity:** React 19 islands via `@astrojs/react`, hydrated with `client:*` directives — zero JS by default
- **Styling:** Tailwind CSS v4 through `@tailwindcss/vite`, oklch design tokens
- **Fonts:** Astro's built-in Fonts API (`fonts` in `astro.config.mjs` + `<Font />` from `astro:assets`)
- **Icons:** `.astro` components extracted from the target site
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
  pages/            # Astro routes
  layouts/          # Layout.astro — <head>, fonts, global metadata
  components/       # .astro components; .tsx only for React islands
    icons/          # Extracted SVG icons as .astro components
  styles/
    globals.css     # Tailwind v4 entry + design tokens
  lib/
    utils.ts        # cn() utility, for use inside React islands
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks (islands only)
public/
  images/           # Downloaded images from target site
  videos/           # Downloaded videos from target site
  seo/              # Favicons, OG images, webmanifest
docs/
  astro/            # Vendored Astro 7 docs — read before writing .astro
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

**Excepción: los errores de entorno no se reintentan nunca.** Red caída, permisos denegados, política de ejecución, sandbox. Codex no va a resolver reintentando un límite de su propio sandbox — escala a la primera.

## SUPERVISIÓN — delegar no es desentenderse
Mientras Codex trabaja, Claude vigila. Un agente reintentando en bucle no está progresando: está quemando tokens.

- **Si tarda, entra a mirar.** Pasados unos minutos sin cierre, Claude abre la salida del proceso y comprueba en qué está.
- **Mismo error repetido = cortar.** Si el log repite el mismo fallo —sobre todo de entorno— Claude mata el proceso y asume la tarea. No espera al timeout.
- **Nunca dejar una ejecución larga sin vigilancia.** Despachar en background y olvidarse es tan caro como no delegar.

## ANTES DE DESPACHAR: que la verificación sea posible
La regla "verificación automática primero" solo sirve si Codex puede ejecutarla. Antes de despachar, Claude comprueba que el camino de verificación existe de verdad:

- Si la tarea necesita dependencias nuevas, **Claude las instala antes**. Codex no tiene red.
- Si la verificación no es ejecutable por Codex, la tarea **deja de ser rutinaria**: Claude la verifica en cuanto Codex entrega, antes de darla por buena.
- **`verification: "fail"` o `"skipped"` no es trabajo terminado.** Es una entrega a medias, y cerrarla es responsabilidad de Claude. Código que nadie verificó no se da por bueno aunque parezca correcto.

## LEER BIEN LOS CÓDIGOS DE SALIDA
`cmd | tail` devuelve el código de salida de `tail`, no el de `cmd`: un lint o un build que falla se ve como éxito. Usar `set -o pipefail` siempre que se canalice la salida de una verificación, y no fiarse de un exit code que pasó por una tubería.

## PROHIBIDO
- Diálogos largos Claude↔Codex.
- Doble opinión en tareas rutinarias (el test ya es el segundo parecer, gratis).
- Claude releyendo/reconstruyendo lo que Codex ya verificó.
- Codex devolviendo output crudo (logs/código/HTML completo) en vez de resumen.

## FLUJO
Objetivo y qué cuenta como crítico se definen al inicio de la tarea → Codex explora/propone (si aplica) y ejecuta → verificación automática → Claude revisa solo lo crítico o lo que falló → resultado.

## Qué cuenta como crítico en este proyecto
- **El modelo de interacción de una sección** (scroll-driven vs click-driven vs hover vs time). Equivocarse obliga a reescribir el componente entero y ningún test lo detecta.
- **Los tokens de diseño globales** — `src/styles/globals.css` y las fuentes declaradas en `astro.config.mjs` + `src/layouts/Layout.astro`. Todo el clon hereda de ahí.
- **La elección de formato de cada componente** — `.astro`, `.astro` + `<script>`, o isla React con su directiva `client:*`. Determina cuánto JS envía el clon y ningún test lo detecta.
- **El ensamblado de `src/pages/index.astro`** — capas z-index, sticky, scroll containers.
- **Merges de worktrees con conflictos no triviales.**
- **Cualquier cambio irreversible:** borrados, force push, reescritura de historial, o config fuera del repo.

Todo lo demás es rutinario: Codex ejecuta y verifica sin pedir veredicto.

## Aplicación a `/clone-website`
Esta sección **sobrescribe el despacho de builders** descrito en el skill. Los builders son invocaciones de Codex, no subagentes de Claude.

**Claude conserva** (requiere navegador o vista, no delegable — Codex no tiene MCP de navegador):
- Fase 1 completa: screenshots y barridos de scroll/click/hover/responsive
- La decisión del modelo de interacción de cada sección
- `docs/research/PAGE_TOPOLOGY.md` y `BEHAVIORS.md`
- Fase 2: el mapeo de colores y fuentes del target a tokens CSS y a la Fonts API
- Fase 5: el QA visual diff contra el original

**Codex ejecuta:**
- Los builders: spec `.md` → `.astro` (o `.tsx` si es isla), uno por worktree
- La conversión de dump crudo → spec `.md`
- `scripts/download-assets.mjs` (escribirlo y ejecutarlo)
- Los iconos `.astro` de `src/components/icons/` a partir de los SVG volcados a disco
- Las interfaces TS de `src/types/`
- El ensamblado mecánico de `src/pages/index.astro` a partir de `PAGE_TOPOLOGY.md`
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

### Límites de Codex en esta máquina (comprobados)
- **No tiene red.** `npm install` falla con `EACCES` contra `registry.npmjs.org`. Instalar dependencias es trabajo de Claude; Codex verifica sobre el `node_modules` ya existente. Si una tarea necesita deps nuevas, Claude las instala **antes** de despachar.
- **Invoca `npm.cmd`, no `npm`.** La política de ejecución de PowerShell bloquea `npm.ps1` en este equipo.
- **`-o` debe apuntar dentro del workspace.** Fuera de él la escritura se deniega por sandbox.
<!-- END:claude-codex-protocol -->

@docs/research/INSPECTION_GUIDE.md
