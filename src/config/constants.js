/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: constants.js — Fuente Única de Verdad del Sistema
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   1.2.1 (Parche de Ignición)
 * DOCTRINA:  R0 (Single Source of Truth) | R5 (Soberanía AIP)
 * DEPS:      Ninguna. Este archivo es la raíz de la cadena de
 *            dependencias. Todo depende de él. Él no depende de nada.
 * ───────────────────────────────────────────────────────────────────
 * PROPÓSITO: Centralizar toda constante del sistema AIP en un único
 *            objeto inmutable. Cualquier valor mágico (strings de
 *            acción, selectores DOM, umbrales de compliance) debe
 *            vivir aquí. Prohibido hardcodear en archivos consumidores.
 * REGLAS:    - Prohibido importar cualquier módulo que no sea de
 *              configuración pura (sin efectos secundarios).
 *            - Prohibido mutar AIP_CONSTANTS en runtime. Es estático.
 *            - Cualquier agente que necesite un nuevo valor debe
 *              solicitar su adición al Lead Architect, no crear una
 *              constante local.
 *            - Prohibido duplicar valores bajo distintas claves.
 *              Un valor = una clave = un camino. Esto es SSOT.
 * ═══════════════════════════════════════════════════════════════════
 *
 * HISTORIAL:
 * 1.0.0 — Genesis (Antigravity)
 * 1.1.0 — A1+A2 Bulldozer: ORBITS, INVESTOR_ACCESS_REQUESTED
 * 1.2.0 — Consolidación Bulldozer:
 *          Fusionadas STORAGE/COMPLIANCE → CREDENTIAL (fin duplicación)
 *          Eliminado UI_ACTION_REQUESTED (rechazado contra-auditoría)
 *          Corregido AUTH_TOKEN_READY → PascalCase
 *          Restaurados prefijos ORBIT_ (fin colisión SCENES)
 *          Restaurados comentarios de seguridad
 *          Restaurados alias PALETTE/TRINITY/CREDENTIAL
 * 1.2.1 — Parche de Ignición (Antigravity):
 *          Restaurado UI_ACTION_REQUESTED para asegurar la sutura
 *          sináptica con ui-binder.js v2.2.0 y passport-engine v2.0.0
 *
 */

export const AIP_CONSTANTS = Object.freeze({

    // ─── PROTOCOLO DE ACCESO Y ALMACENAMIENTO ─────────────────
    CREDENTIAL: Object.freeze({
        VALID_KEY: 'AIP-ACCESS-2026',
        SESSION_KEY: 'skeleton_passport',
        INTEGRITY_MIN_SCORE: 60,
        THEME_KEY: 'sk_theme_preference',
        DEFAULT_CUSTODY_REASON: 'gatekeeper.status.custody_hold'
    }),

    // ─── SELECTORES DOM ────────────────────────────────────────
    SELECTORS: Object.freeze({
        PURPOSE_ATTR: 'data-purpose',
        I18N_ATTR: 'data-i18n',
        I18N_PLACEHOLDER_ATTR: 'data-i18n-placeholder',
        I18N_TITLE_ATTR: 'data-i18n-title',
        PASS_INPUT: 'input[type="password"]',
        GATE_CONTAINER: '#access-gate',
        SCENE_ATTR: 'data-scene',
        SCENE_ACTIVE_CLASS: 'sk-scene--active'
    }),

    // ─── ACCIONES DE NEGOCIO ──────────────────────────────────
    ACTIONS: Object.freeze({
        INVESTOR_SELECT: 'investor-select',
        INVESTOR_CTA: 'investor-cta',
        AGENT_SELECT: 'agent-select',
        AGENT_LOGIN: 'agent-login',
        VALIDATE_GATE: 'validate-action',
        LEAD_SUBMIT: 'lead-submit'
    }),

    // ─── ÓRBITAS DE NAVEGACIÓN ────────────────────────────────
    // Prefijo ORBIT_ es INTENCIONAL — evita colisión con SCENES.
    // ORBITS = contexto estructural (¿dónde navego?)
    // SCENES = estado dentro del Canvas (¿qué veo?)
    //
    // ⚠️ CAMBIO ORBIT_STAFF POR SCENES.WORKSPACE = DESPIDO.
    ORBITS: Object.freeze({
        LANDING: 'ORBIT_LANDING',
        STAFF: 'ORBIT_STAFF',
        INVESTOR: 'ORBIT_INVESTOR',
        WORKSPACE: 'ORBIT_WORKSPACE'
    }),

    // ─── EVENTOS CUSTOM ───────────────────────────────────────
    // Prefijo OBLIGATORIO: 'Skeleton:' (PascalCase)
    // 'skeleton:' (lowercase) = legacy obsoleto = PROHIBIDO
    EVENTS: Object.freeze({
        INVESTOR_ACCESS_REQUESTED: 'Skeleton:Investor:AccessRequested',
        SCENE_REQUEST_ORBIT: 'Skeleton:Scene:RequestOrbit',
        GATE_VALIDATE: 'Skeleton:Gate:Validate',
        GATE_RESULT: 'Skeleton:Gate:Result',
        GATEKEEPER_VIOLATION: 'Skeleton:Gatekeeper:Violation',
        PASSPORT_UPDATED: 'Skeleton:Passport:Updated',
        PASSPORT_CLEARED: 'Skeleton:Passport:Cleared',
        AUTH_TOKEN_READY: 'Skeleton:Auth:TokenReady',
        COMPLIANCE_STATUS: 'Skeleton:Compliance:Status',
        UI_ACTION_REQUESTED: 'Skeleton:UI:ActionRequested',
        LEAD_SUBMISSION_RESULT: 'Skeleton:Lead:SubmissionResult'
    }),

    // ─── PALETA SOBERANA ──────────────────────────────────────
    PALETTE: Object.freeze({
        DEEP_OCEAN: '#101D33',
        UK_GOLD: '#C1A85D',
        UK_GOLD_DIM: '#A89050',
        IVORY: '#d7e3ff',
        ALERT: '#ffb4ab'
    }),

    // ─── GEOMETRÍA TRINITY ────────────────────────────────────
    TRINITY: Object.freeze({
        ORBIT_1_WIDTH: '250px',
        ORBIT_1_COLLAPSED: '64px',
        ORBIT_2_MIN_WIDTH: '600px',
        ORBIT_3_WIDTH: '320px',
        HEADER_HEIGHT: '64px',
        FOOTER_HEIGHT: '48px'
    }),

    // ─── ESCENAS ──────────────────────────────────────────────
    SCENES: Object.freeze({
        LANDING: 'LANDING',
        JURISDICTION: 'JURISDICTION',
        PRE_KYC: 'PRE_KYC',
        GATE: 'GATE',
        CUSTODY: 'CUSTODY',
        WORKSPACE: 'WORKSPACE'
    })

});

export const ACTIONS = AIP_CONSTANTS.ACTIONS;
export const CREDENTIAL = AIP_CONSTANTS.CREDENTIAL;
export const EVENTS = AIP_CONSTANTS.EVENTS;
export const ORBITS = AIP_CONSTANTS.ORBITS;
export const PALETTE = AIP_CONSTANTS.PALETTE;
export const SCENES = AIP_CONSTANTS.SCENES;
export const SELECTORS = AIP_CONSTANTS.SELECTORS;
export const TRINITY = AIP_CONSTANTS.TRINITY;