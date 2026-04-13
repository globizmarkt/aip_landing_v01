# CONVERSATION_INDEX — Sprint 1 (Tejido Vivo)
## Proyecto: AIP_landing_v0.1 / Skeleton Fractal
## Fecha de apertura: 2026-04-13

---

### 1. MAPA DE SESIONES

| Nº | Sesión | Agentes | Tema | Output clave |
|----|--------|---------|------|--------------|
| OPORD-10 | 2026-04-13 | Antigravity | Cirugía Estructural y Cierre de Deuda Técnica | Alineación de núcleo (scene-manager, i18n, genesis, passport) con `AIP_LANDING_DOCTRINE.md`. |

---

### 2. DECISIONES DE ARQUITECTURA ACTIVAS (SPRINT 1)

| Decisión | Doctrina | Inamovible |
|----------|----------|-----------|
| Nuevo Modelo de Navegación | Arquitectura de Fricción | ✅ |
| Lexicón Prohibido aplicado a i18n | AIP_LANDING_DOCTRINE | ✅ |

#### 2.1 Modelo Mental de Navegación (Architectura de la Fricción)

El flujo se actualiza incorporando interceptores explícitos:

```
LANDING → JURISDICTION → PRE_KYC → [GATE (si IntegrityScore > 60) | CUSTODY_HOLD]
```
- **LANDING**: Manifiesto de Cristalización.
- **JURISDICTION**: Selector inicial por país o residencia (filtro suave).
- **PRE_KYC**: Diálogo Fiduciario, recopilación de datos mínimos.
- **GATE**: Acceso Staff/Partners, validado vía IntegrityScore preliminar.

#### 2.2 Purga de ADN Lingüístico

*   Eliminados términos vetados ("Garantizado", "Retail", "Cripto", etc.).
*   CTA generalizado: "Establish Sovereign Contact" / "Establecer Diálogo Fiduciario".

---

### 3. DEUDA TÉCNICA CERRADA EN SPRINT 1

| ID | Deuda | Estado | Resolución |
|----|-------|--------|------------|
| DT-LND-03 | `genesis-engine.js` — Conectar con contenido del Manifiesto | CERRADA | Sincronizado para habilitar el flujo a JURISDICTION. |
| DT-LND-04 | `en.json`/`es.json` — Purgar claves heredadas no aplicables | CERRADA | Se aplicó depuración del Lexicón Prohibido e inserción de nuevos CTAs. |
| DT-LND-05 | `scene-manager.js` — Registrar escenas propias de la landing | CERRADA | Inyectados: `JURISDICTION`, `PRE_KYC` y atados al flujo principal. |

---

### 4. DEUDA TÉCNICA ABIERTA

| ID | Deuda | Estado |
|----|-------|--------|
| DT-LND-02 | `firebase.js` — Credenciales reales del proyecto | ABIERTA |

---

### 5. PRÓXIMOS SPRINTS

| Sprint | Objetivo |
|--------|----------|
| Sprint 2 — Estética | Stitch diseña el Manifiesto de Cristalización (Órbita 2 en LANDING). |
| Sprint 3 — Gate | Conectar Firebase Auth + PassportEngine. Flujo Staff → Workspace. |

