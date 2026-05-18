# Intrinsic Systems / OASIS CORE Architecture Catalogue

## Current App Trees

### Root app: `src/`
Purpose: Current public Intrinsic Systems site and legacy/embedded CORE copy.
Status: Still active for local root Vite app and likely public site deployment.
Risk: High duplication with `apps/core/src`.

### CORE app: `apps/core/src/`
Purpose: Intended standalone OASIS CORE app.
Status: Used for isolated CORE deployment.
Risk: Must not rely on duplicated `src/core`, `src/acma`, or `src/styles`.

### Shared styles: `packages/ui/styles/`
Purpose: Shared CSS/design system.
Status: Imported by `apps/core/src/main.tsx`.
Risk: Some styles overlap with older `src/styles`.

## Immediate Separation Tasks

1. Confirm which Vercel project builds from root vs `apps/core`.
2. Restore public site `/` to Intrinsic Systems homepage.
3. Keep OASIS CORE at `/core/start` inside CORE app, or preferably own domain.
4. Remove/retire duplicated CORE code from root `src/` only after confirming no live deployment depends on it.
5. Move shared design styles into `packages/ui/styles`.
6. Keep app-specific overrides separated:
   - site-specific: `src/styles` or future `apps/site`
   - CORE-specific: `packages/ui/styles/core-app.css`

## Do Not Delete Yet

- `src/core`
- `src/acma`
- `src/styles`

These may still be used by the root/public app.

## Target Architecture

/apps/site
  Public Intrinsic Systems website

/apps/core
  OASIS CORE application

/packages/ui
  Shared design system/styles/components
