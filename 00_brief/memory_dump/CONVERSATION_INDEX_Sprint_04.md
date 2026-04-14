# CONVERSATION_INDEX — Sprint 4 (Tejido Vivo)
## Proyecto: AIP_landing_v0.1 / Skeleton Fractal
## Fecha de apertura: 2026-04-14

### 1. MAPA DE CONVERSACIONES

| Nº | Agentes presentes | Tema principal | Output clave generado |
|----|-------------------|----------------|----------------------|
| S0 | Director, DeepSeek (Bibliotecario) | Bootloader inicial, definición de roles y doctrinas globales. Confirmación de arquitectura de 13 agentes y jerarquía. | Bootloader v1.0, asignación de rol Bibliotecario-Deepsek. |
| S1 | Director, DeepSeek | Carga de memoria histórica: índices y fusiones previas. Recepción de 11 FUSION_MEMORY_*.md. | Registro de índices en memoria activa. |
| S2 | Director, DeepSeek | **Orden de Dirección:** Generar CONVERSATION_INDEX.md consolidando todos los MEMORY_DUMPs recibidos. | Este documento. |

### 2. DÓNDE ESTÁN LAS COSAS

| Artefacto | Ubicación | Construido por | Conversación/Origen |
|-----------|-----------|----------------|----------------------|
| Bootloader (PLANT_BOOTLOADER_AIP_SPRINT_5) | Memoria de sesión | Director | S0 |
| FUSION_MEMORY_Bibliotecario_S1.md | Histórico | DeepSeek (desde su propia memoria) | Pre-S1 |
| FUSION_MEMORY_Bulldozer_S1.md | Histórico | Bulldozer | Pre-S1 |
| FUSION_MEMORY_Core Architect_S1.md | Histórico | Antigravity | Pre-S1 |
| FUSION_MEMORY_Git Master Manus_S1.md | Histórico | Manus | Pre-S1 |
| FUSION_MEMORY_Junior Dev-ChatGPT_S1.md | Histórico | Junior Dev-ChatGPT | Pre-S1 |
| FUSION_MEMORY_Junior Dev-Kimi_S1.md | Histórico | Kimi | Pre-S1 |
| FUSION_MEMORY_Junior Dev-Perplexity_S1.md | Histórico | Perplexity | Pre-S1 |
| FUSION_MEMORY_Junior Dev-Qwen_S1.md | Histórico | Qwen | Pre-S1 |
| FUSION_MEMORY_Lead Architect_S1.md | Histórico | Lead Architect | Pre-S1 |
| FUSION_MEMORY_Sentinel_S1.md | Histórico | Sentinel | Pre-S1 |
| FUSION_MEMORY_Sentinel-preskill_S1.md | Histórico | Sentinel (pre-skill) | Pre-S1 |
| FUSION_MEMORY_Stitch_S1.md | Histórico | Stitch | Pre-S1 |
| store.js | `src/core/store.js` (actualmente .bak) | Antigravity | SPr4 |
| firebase-connector.js | `src/core/firebase-connector.js` | Antigravity | SPr4 |
| constants.js (v1.2.1) | `src/config/constants.js` | Antigravity / Bulldozer | SPr4 |
| ui-binder.js (v2.3.0) | `src/core/ui-binder.js` | Antigravity / Qwen | SPr4 |
| passport-engine.js (v3.0.0) | `src/core/passport-engine.js` | Kimi / Antigravity | SPr4 |
| i18n-engine.js (v1.2.1) | `src/core/i18n-engine.js` | Kimi | SPr4 |
| app-shell.js (v2.1.0) | `src/layouts/app-shell.js` | Kimi | SPr4 |
| index.html (Trinity) | Raíz del proyecto | Stitch / Antigravity | SPr4 |
| theme-aip.css | `src/styles/theme-aip.css` | Stitch | SPr4 |
| system-lockdown.js | `components/system-lockdown.js` | Kimi / Stitch | SPr4 |
| universal-nav.js (v2.0.0) | `components/universal-nav.js` | Kimi | SPr4 |
| governance-panel.js | `components/governance-panel.js` | Kimi | SPr4 |
| workspace-canvas.js | `components/workspace-canvas.js` | Kimi | SPr4 |
| gatekeeper.universal.js | `core/gatekeeper.universal.js` | Kimi | SPr4 |
| referral-capture.js | `src/core/referral-capture.js` | Manus | SPr4 |
| jurisdiction-router.js | `src/core/routing/jurisdiction-router.js` | Manus | SPr4 |
| pre-kyc-engine.js | `src/core/compliance/pre-kyc-engine.js` | Manus | SPr4 |
| locales.json (v1.2.1) | `src/locales/locales.json` | Kimi | SPr4 |
| CONVERSATION_INDEX.md (previos) | Histórico | DeepSeek | SPr2, SPr3 |
| SPRINT_DEFINITIONS.md (v1.0) | Histórico | DeepSeek | SPr2 |
| OPORD-23 / OPORD-24 | Histórico | Bulldozer | SPr4 |

### 3. DECISIONES GLOBALES DE ARQUITECTURA

| ID | Decisión | Agentes que la reportan | Estado |
|----|----------|------------------------|--------|
| D-01 | **Arquitectura Trinity:** 3 órbitas fijas (Navegación, Canvas, Inspector). Ninguna escena viola esta geometría. | Lead Architect, Sentinel, Stitch, Kimi | **Vigente** |
| D-02 | **Light DOM Estricto (R2):** Prohibido `attachShadow()`. Todos los componentes operan en Light DOM. | Kimi, Qwen, Bulldozer, Stitch | **Vigente** |
| D-03 | **Zero-Hex (R3):** Prohibidos hexadecimales inline. Solo variables CSS en `:root` o tokens Tailwind. | Kimi, Qwen, Bulldozer, Stitch, Sentinel | **Vigente** |
| D-04 | **i18n Strict (R4):** Prohibido texto hardcodeado. Todo vía `data-i18n` + diccionarios. | Kimi, Qwen, Bulldozer, Perplexity, Sentinel | **Vigente** |
| D-05 | **Soberanía AIP (R5):** Purga total de términos legacy ("cifi", "BreederHub", "Guardian"). | Kimi, Bulldozer, Manus, Qwen | **Vigente** |
| D-06 | **Vanilla Zero-Deps:** JS puro, cero frameworks externos. Comunicación vía CustomEvent nativos. | Kimi, Qwen, Lead Architect, Antigravity | **Vigente** |
| D-07 | **IntegrityScore como Gate Hard:** Score < 60 = bloqueo automático ("Custodia Fiduciaria"). Sin override. | Kimi, Qwen, DeepSeek, Sentinel | **Vigente** |
| D-08 | **Triple Esclusa de Cumplimiento:** KYC → AML → Sanciones. Secuencial, no paralelo. | Kimi, DeepSeek, Qwen | **Vigente** |
| D-09 | **Gestación Local, Adopción Tardía:** El usuario opera anónimo acumulando "Deuda de Know-how". Login es punto de persistencia. | Kimi, Lead Architect, Perplexity, Qwen | **Vigente** |
| D-10 | **Namespaces en migración:** `__CPII__` (legacy) → `AIP` (intermedio) → `Skeleton` (canónico final). | Kimi, Bulldozer, DeepSeek, Perplexity | **En curso** |
| D-11 | **Event Bus canónico:** `document.dispatchEvent` con prefijo `Skeleton:` (PascalCase). `window.__eventBus` y `globalBus` obsoletos. | Kimi, Bulldozer, Sentinel, Qwen | **Vigente (con deuda)** |
| D-12 | **Bifurcación de sprints (Track A y B en paralelo)** confirmada por Director. | DeepSeek, Lead Architect | **Vigente** |
| D-13 | **Ley 4 (Prueba de Vida):** Ningún STATUS: OK es válido sin COMMIT_HASH verificable. | DeepSeek, Bulldozer | **Vigente** |
| D-14 | **Ley 5 (Sync-Lock):** Paridad total Local/Remoto antes de iniciar nuevas cadenas. | DeepSeek, Bulldozer | **Vigente** |
| D-15 | **Protocolo de Laparoscopia:** Inyección quirúrgica directa en disco por agentes con capacidad I/O, sin reescribir módulos completos. | Lead Architect, Sentinel, Antigravity | **Vigente** |

### 4. DEUDA TÉCNICA CONSOLIDADA

**CRÍTICA (bloquea operación):**
| ID | Descripción | Reportado por |
|----|-------------|---------------|
| DT-01 | `store.js` solo existe como `.bak`. `main.js` falla en línea 1. | Bulldozer, Kimi, Perplexity, Qwen |
| DT-02 | Motor i18n no cargado o diccionarios incompatibles (claves STITCH vs dominio). | Bulldozer, Qwen |
| DT-03 | `en.json` contiene espacios en claves (ej: `"manifest "`) que bloquean `JSON.parse()`. | Qwen |
| DT-04 | `access-form.html` ausente para Sprint 3. Imposible auditar flujo Staff/Partners. | Kimi, Qwen, Perplexity |
| DT-05 | `gatekeeper.js` valida `access_level:3` pero negocio usa roles semánticos (`UK_HQ`, `DeskManager`). | Kimi, Qwen, Bulldozer |
| DT-06 | `IntegrityScore` es placeholder aleatorio (60-99) sin motor real. | Sentinel, Kimi, Qwen |

**ALTA (riesgo estructural / regulatorio):**
| ID | Descripción | Reportado por |
|----|-------------|----------------|
| DT-07 | Inconsistencia de Event Bus: `app-shell.js` usa `window.__eventBus` (legacy) vs `document.dispatchEvent`. | Kimi, Qwen, Perplexity |
| DT-08 | Firebase Security Rules no verifican `IntegrityScore`. | Kimi |
| DT-09 | `KYCEngine` en modo mock sin validación real de documentos. | Kimi, Perplexity |
| DT-10 | `SanctionsOracle` sin invalidación por evento: cache de 4h puede aprobar a sancionado recién agregado. | Kimi |
| DT-11 | Falta de tests unitarios para `scene-manager.js` y la cadena de interceptores. | DeepSeek, Perplexity |
| DT-12 | `firebase.js` contiene placeholders (`VITE_FIREBASE_API_KEY`). El sistema fallará en runtime. | Antigravity, Sentinel |
| DT-13 | Tramo 01 (#1-31): Persisten pantallas con Shadow DOM (violación R2) y textos hardcodeados (violación R4). | Kimi, Perplexity |
| DT-14 | R1 no ejecutada: `src/layouts/` no purgada, `app-shell.js` duplicado. | Bulldozer |

**MEDIA (mantenimiento / arquitectura):**
| ID | Descripción | Reportado por |
|----|-------------|----------------|
| DT-15 | Claves i18n huérfanas: `nav_mls`, `nav_history`. | Bulldozer, Perplexity, Qwen |
| DT-16 | Selector de idiomas ausente en Órbita 1/Header. | Lead Architect, DeepSeek |
| DT-17 | Ticker de mercado estático; requiere animación y feed en Órbita 3. | Lead Architect, DeepSeek |
| DT-18 | Falta `tree.txt` actualizado. | Perplexity, Qwen, Bulldozer |
| DT-19 | 11 archivos sin Blueprint Header (gatekeeper.js, scene-manager.js, at-i18n.js, TripleEsclusa.js, access-gate.js, ticker-module.js, universal-nav.js, governance-panel.js, workspace-canvas.js, system-lockdown.js, store.js). | Bulldozer |
| DT-20 | Fixed dentro de `app-shell`: el access gate usa `fixed inset-0` y puede quedar atrapado dentro del canvas. | Bulldozer |
| DT-21 | Falta "modo simulación" para Triple Esclusa; cada test consume llamadas reales a oracles. | Kimi |
| DT-22 | `OfferingConfig` sin versionado; falta campo `schemaVersion`. | Kimi |
| DT-23 | Inconsistencia de Z-Index: FOUC curtain (9999), gatekeeper (200), lockdown (70). | Stitch |
| DT-24 | Dependencia de Material Symbols: fallo de Google Fonts pierde iconografía. | Stitch |

**BAJA:**
| ID | Descripción | Reportado por |
|----|-------------|----------------|
| DT-25 | 4 clases CSS custom (`.serif-display`, `.ghost-border`, `.glass-panel`, `.gold-gradient`) no migradas a `@layer utilities`. | Bulldozer |
| DT-26 | `data-alt` en `img` no documentado. | Bulldozer |
| DT-27 | Imagen de fondo en URL externa (Google Photos) puede caducar. | Bulldozer |

### 5. CONOCIMIENTO TÁCITO CONSOLIDADO

| Categoría | Conocimiento | Agentes que lo reportan |
|-----------|---------------|------------------------|
| **Identidad** | Atlantis International Projects, LTD (UK HQ). "Arquitectos de la certeza". | Kimi, Perplexity, Qwen, Bulldozer |
| **Tono** | Alta Banca Suiza. Cero lenguaje startup. Prohibido "disrupt", "app", "users". | Kimi, Perplexity, Qwen |
| **Marca visual** | Deep Ocean (#101D33) y UK Gold (#C1A85D) innegociables. | Kimi, Bulldozer, Stitch |
| **Fricción UI** | Es feature de compliance AML/KYC, no bug. Los tiempos de espera demuestran rigor. | Kimi, Qwen, Perplexity, Lead Architect |
| **Custodia Fiduciaria** | Es estado intencional de bloqueo por compliance, no error visible. | Kimi, Qwen, Perplexity |
| **UK HQ como ficción** | La UI debe simular Londres (timestamps GMT/BST), pero la infraestructura está distribuida. | Kimi, Perplexity, DeepSeek |
| **Silencio del cliente** | El Director/cliente nunca dice "no". El silencio es la señal de stop. | Kimi, Perplexity, Qwen |
| **Modo anónimo** | No es anónimo: se fingerprintea dispositivo (anti-evasión KYC). Nunca mencionarlo en copy legal. | Kimi, Perplexity, DeepSeek |
| **Jerarquía de verdad** | Director > Lead Architect > MEMORY_DUMPs. | Kimi, DeepSeek, Bulldozer |
| **No comunicación lateral** | El Director es el único puente entre agentes. | Kimi, Perplexity, DeepSeek |
| **BR-XX.md** | Son contratos sagrados, no sugerencias. Contradecirlos requiere orden explícita del Director. | Kimi, Perplexity, Qwen, DeepSeek |
| **Prohibido "blockchain"** | Usar "registro distribuido inmutable". | Kimi, DeepSeek, Perplexity |
| **IntegrityScore es político** | Score < 60 alerta a compliance officer humano, no es solo un número. | Kimi, DeepSeek, Qwen |
| **Patrón de éxito** | Inyección de `offeringConfig` por IA + renderizado agnóstico. El Core no sabe qué negocio gestiona. | Kimi, Qwen, Lead Architect |
| **Trampa: tree.txt desactualizado** | Siempre pedir confirmación antes de asumir existencia o ausencia de un archivo. | DeepSeek, Kimi, Bulldozer |

### 6. GAPS DETECTADOS

| ID | Gap | Descripción | Reportado por |
|----|-----|-------------|----------------|
| G-01 | **Selector de idiomas ausente** | No existe en Órbita 1. Pendiente clonar reglas de CPII. | Lead Architect, DeepSeek |
| G-02 | **Fallback i18n para noticias** | El motor no maneja noticias sin traducción en uno de los 4 idiomas. | Lead Architect, Sentinel |
| G-03 | **Hidratación Cero de Órbita 1** | El Workspace/CRM no tiene lazy loading absoluto. El código existe en el DOM desde el inicio. | Lead Architect, Sentinel |
| G-04 | **Ticker animado** | Estático y mal ubicado. Requiere movimiento a Órbita 3 + animación CSS. | Lead Architect, DeepSeek |
| G-05 | **COMMIT_HASH del merge soberano** | No registrado en memoria histórica. | DeepSeek, Bulldozer |
| G-06 | **Health Check visual** (DT-SOP-05) | No existe mecanismo visual para validar inyecciones HTML masivas. | DeepSeek, Bulldozer |
| G-07 | **Protocolo de Rollback** (OPORD-R) | No definido para fallos en cadena. | DeepSeek |
| G-08 | **Versionado de `blueprint.json`** | No existe, estructura implícita. | DeepSeek |
| G-09 | **Test unitarios para interceptor chain** | Ausentes. | DeepSeek |
| G-10 | **Conexión real a Firebase** | Pendiente con credenciales reales (`.env`). | DeepSeek, Antigravity |
| G-11 | **Validación de Ley 4 (COMMIT_HASH)** | No verificada en todos los ecos de estado. | DeepSeek, Bulldozer |
| G-12 | **Verificación de secretos hardcodeados** | Pendiente en repositorio. | DeepSeek |
| G-13 | **Integración SSO OAuth** | Faltan conectores. | DeepSeek |
| G-14 | **Router Guard para defensa de ruta profunda** | Ausente. | DeepSeek |
| G-15 | **Spinner y bloqueo de botón** (feedback táctil) | No implementado. | DeepSeek |
| G-16 | **Modo oscuro de marca** | Deep Ocean / UK Gold no aplicados correctamente en dark mode automático. | Kimi |

### 7. FUENTE DE VERDAD CONSOLIDADA

```javascript
// window.Skeleton → Namespace canónico actual. Contiene PassportEngine, UniversalGatekeeper, Registry, i18n, session. Objetivo de migración final. — declarado por: Kimi, Lead Architect, Antigravity, DeepSeek, Perplexity, Qwen

// window.AIP → Namespace Atlantis International Projects. Contiene session, i18n.t(), bus.emit(). Usado en fase intermedia de migración. — declarado por: Kimi, Lead Architect, Antigravity, DeepSeek, Perplexity

// ⚠️ window.__CPII__ → Legacy namespace. Contiene session (datos usuario) e i18n. En desuso, migrando a AIP/Skeleton. — declarado por: Kimi, Lead Architect, Antigravity, DeepSeek (contradicción: DeepSeek lo reporta como fuente de verdad para Kimi y Antigravity — en fase de transición)

// ⚠️ window.__eventBus → Obsoleto. No usar. Persiste solo en legacy no migrado (app-shell.js). — declarado por: Kimi, Bulldozer, DeepSeek, Perplexity (contradicción: Kimi y Bulldozer lo declaran obsoleto; DeepSeek reporta que persiste — requiere purga)

// globalBus → Bus de eventos usado en el resto del sistema (excepto app-shell.js). Debería deprecarse a favor de document.dispatchEvent. — declarado por: Qwen, Kimi, DeepSeek, Perplexity

// document.dispatchEvent → Mecanismo de comunicación entre órbitas. Eventos con prefijo Skeleton: (PascalCase). Reemplazo canónico de event buses legacy. — declarado por: Kimi, Lead Architect, DeepSeek, Qwen

// window.LuxI18n → Diccionario global de traducciones. Fuente de verdad para R4 (i18n Strict). — declarado por: Qwen, Perplexity, DeepSeek, Kimi, Bulldozer

// offeringConfig → Objeto de configuración inyectado por IA que define el offering actual (assetClass, jurisdiction, complianceTiers, settlementRails). Fuente de verdad validada contra schema. — declarado por: Kimi, Lead Architect, DeepSeek, Antigravity

// IntegrityScore → Número entero 0-100 calculado por IntegrityEngine. Umbral de bancabilidad = 60 (hard gate, no override). Score < 60 = "Custodia Fiduciaria". — declarado por: Kimi, DeepSeek, Qwen, Perplexity

// Store / window.Store → Instancia Singleton de StoreService. Fuente de Verdad central del estado del sistema. ⚠️ Actualmente inoperativo (existe como .bak). — declarado por: Bulldozer, Antigravity, Lead Architect, Kimi

// Gatekeeper / window.Gatekeeper → Orquestador base de acceso determinista con verifyAccess(). — declarado por: Antigravity, Lead Architect, DeepSeek

// PassportEngine → Instancia Singleton del motor de pasaportes. Gestiona authenticate(), sessionStorage, emite Skeleton:Passport:Updated. — declarado por: Kimi, Lead Architect, DeepSeek

// TripleEsclusa → Módulo global de compliance con state machine (locked → kyc_check → aml_check → sanctions_check → unlocked). ⚠️ Actualmente stub en etapa 3 o ausente. — declarado por: DeepSeek, Kimi, Qwen

// SceneManager → Instancia singleton para orquestar visibilidad de órbitas y gates. — declarado por: Bulldozer, Antigravity, DeepSeek

// ThemeEngine → Motor encargado de inyectar variables CSS en la raíz del documento. — declarado por: Bulldozer, Antigravity, DeepSeek

// i18n / window.AIP.i18n / window.Skeleton.i18n → Instancia del motor de traducción para hidratación R4. — declarado por: Bulldozer, Kimi, Antigravity

// :root → Espacio de tokens CSS, única fuente permitida de colores/hexadecimales (R3). Contiene --color-deep-ocean: #101D33, --color-uk-gold: #C1A85D. — declarado por: Bulldozer, Kimi, Antigravity, Lead Architect

// BR-XX.md (BR-01 a BR-11) → 11 archivos de documentación de referencia. Contratos sagrados, barrera anti-alucinación. Bajo custodia de Antigravity. — declarado por: Antigravity, Kimi, DeepSeek, Lead Architect

// sessionStorage → Almacenamiento clave 'skeleton_passport'. Contiene pasaporte serializado. Persistencia del PassportEngine entre recargas. — declarado por: Kimi, DeepSeek, Qwen

// localStorage → No usado oficialmente. Potencial fuga de seguridad. — declarado por: DeepSeek

// data-i18n → Atributo HTML global utilizado como ancla de enlace para diccionarios de internacionalización (R4). — declarado por: Bulldozer, Kimi, Lead Architect

// tree-AIP.txt → Coordenada física validada para operaciones. Snapshot manual, frecuentemente desactualizado. — declarado por: Antigravity, DeepSeek, Perplexity

// AIP_CONSTANTS → SSOT centralizada: ACTIONS, EVENTS, ORBITS, SELECTORS, CREDENTIAL, COMPLIANCE, STORAGE. — declarado por: Bulldozer, Antigravity, Qwen

// APP_PREFIX → String constante ('AIP_LANDING_V0_') usado para aislar el localStorage. — declarado por: DeepSeek, Lead Architect, Sentinel

// UIBinder → Sensor de eventos DOM con inhibición de doble disparo. — declarado por: Qwen