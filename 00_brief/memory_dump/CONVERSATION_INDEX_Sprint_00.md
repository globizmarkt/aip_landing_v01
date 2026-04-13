# CONVERSATION_INDEX — Sprint Genesis
## Proyecto: AIP_landing_v0.1 / Skeleton Fractal
## Fecha de apertura: 2026-04-13

---

### 1. MAPA DE SESIONES

| Nº | Sesión | Agentes | Tema | Output clave |
|----|--------|---------|------|--------------|
| OPORD-02 | 2026-04-13 | Antigravity | Cristalización del Muñeco de Barro | 11 artefactos en `Skeleton_v1/muñeco_de_barro/` |
| OPORD-08 | 2026-04-13 | Antigravity | Instanciación AIP_landing_v0.1 | Scaffold completo + blueprints inyectados |

---

### 2. DECISIONES DE ARQUITECTURA ACTIVAS

| Decisión | Doctrina | Inamovible |
|----------|----------|-----------|
| Light DOM estricto — prohibido `attachShadow()` | R2 | ✅ |
| Cero hexadecimales inline — solo `var(--theme-*)` | R3 | ✅ |
| Todo texto vía `data-i18n` | R4 | ✅ |
| `sessionStorage` exclusivo para el pasaporte | PassportEngine R-PE-04 | ✅ |
| `document.dispatchEvent` como bus canónico | SceneManager R-SM-02 | ✅ |
| Claims como booleanos planos O(1) | PassportEngine | ✅ |
| Orden CSS constitucional: theme → base → layout | inject-map.md | ✅ |

---

### 3. DEUDA TÉCNICA ABIERTA

| ID | Deuda | Estado |
|----|-------|--------|
| DT-LND-01 | `store.js` — Ajustar `APP_PREFIX` a `'AIP_LANDING_V0_'` | ABIERTA |
| DT-LND-02 | `firebase.js` — Credenciales reales del proyecto | ABIERTA |
| DT-LND-03 | `genesis-engine.js` — Conectar con contenido del Manifiesto de Cristalización | ABIERTA |
| DT-LND-04 | `en.json`/`es.json` — Purgar claves heredadas no aplicables | ABIERTA |
| DT-LND-05 | `scene-manager.js` — Registrar escenas propias de la landing | ABIERTA |

---

### 4. PRÓXIMOS SPRINTS

| Sprint | Objetivo |
|--------|----------|
| Sprint 1 — Tejido Vivo | Conectar genesis-engine + access-gate + i18n. Hacer arrancar el sistema. |
| Sprint 2 — Estética | Stitch diseña el Manifiesto de Cristalización (Órbita 2 en LANDING). |
| Sprint 3 — Gate | Conectar Firebase Auth + PassportEngine. Flujo Staff → Workspace. |
