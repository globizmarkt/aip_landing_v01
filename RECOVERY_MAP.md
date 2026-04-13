# RECOVERY MAP: AIP_landing_v0.1
**Fecha:** 2026-04-13
**Status:** Sin activos de inbox pendientes en génesis.

## 1. ORIGEN DEL CHASIS

Este proyecto fue instanciado desde el Muñeco de Barro (Chasis Fractal Skeleton v1.0.0):

| Artefacto | Origen | Destino | Estado |
|-----------|--------|---------|--------|
| `store.js` | `Skeleton_v1/muñeco_de_barro/blueprints/store-blueprint.js` | `src/core/store.js` | INYECTADO |
| `scene-manager.js` | `Skeleton_v1/muñeco_de_barro/blueprints/scene-manager-blueprint.js` | `src/core/scene-manager.js` | INYECTADO |
| `passport-engine.js` | `Skeleton_v1/muñeco_de_barro/blueprints/passport-engine-blueprint.js` | `src/core/passport-engine.js` | INYECTADO |
| `app-shell.js` | `Skeleton_v1/muñeco_de_barro/blueprints/app-shell-blueprint.js` | `src/layouts/app-shell.js` | INYECTADO |
| Docs doctrinales | `AIP_v0.1/01_arquitectura/` | `01_arquitectura/` | COPIADOS |
| Motores core | `AIP_v0.1/src/core/` | `src/core/` | COPIADOS |
| i18n | `AIP_v0.1/src/i18n/` | `src/i18n/` | COPIADOS |
| Estilos base | `AIP_v0.1/src/styles/` | `src/styles/` | COPIADOS |

## 2. ACTIVOS PENDIENTES DE INBOX

Ninguno en el momento de la génesis.

## 3. DEUDA TÉCNICA INICIAL

| Deuda | Descripción | Prioridad |
|-------|-------------|-----------|
| `store.js` — APP_PREFIX | Ajustar de blueprint genérico a `'AIP_LANDING_V0_'` | CRÍTICA |
| `scene-manager.js` — escenas | Verificar que LANDING/GATE/WORKSPACE/CUSTODY están registradas | CRÍTICA |
| `firebase.js` — config | Sustituir config placeholder por credenciales reales del proyecto | ALTA |
| `theme-landing.css` — nombre | Renombrado de `theme-aip.css`. Verificar que tokens coincidan con `index.html` | ALTA |
| `en.json` / `es.json` — claves | Heredados de AIP_v0.1. Purgar claves no aplicables a la landing. | MEDIA |

---
*Mapa generado por Antigravity (Core Architect) en Sprint Genesis — 2026-04-13.*
