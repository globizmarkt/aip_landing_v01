/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: constants.js — Fuente Única de Verdad del Sistema
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   1.0.0
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
 * ═══════════════════════════════════════════════════════════════════
 */

export const AIP_CONSTANTS = Object.freeze({

    // ─── PROTOCOLO DE ACCESO ───────────────────────────────────
    CREDENTIAL: Object.freeze({
        VALID_KEY: 'AIP-ACCESS-2026',
        SESSION_KEY: 'skeleton_passport',
        INTEGRITY_MIN_SCORE: 60
    }),

    // ─── ALMACENAMIENTO (Keys) ────────────────────────────────
    STORAGE: Object.freeze({
        PASSPORT_KEY: 'skeleton_passport',
        THEME_KEY: 'sk_theme_preference'
    }),

    // ─── COMPLIANCE (Umbrales) ───────────────────────────────
    COMPLIANCE: Object.freeze({
        MIN_INTEGRITY_SCORE: 60,
        DEFAULT_CUSTODY_REASON: 'gatekeeper.status.custody_hold'
    }),

    // ─── SELECTORES DOM (Anclas de binding) ────────────────────
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

    // ─── ACCIONES DE NEGOCIO (data-purpose values) ────────────
    ACTIONS: Object.freeze({
        INVESTOR_SELECT: 'investor-select',
        INVESTOR_CTA: 'investor-cta',
        AGENT_SELECT: 'agent-select',
        AGENT_LOGIN: 'agent-login',
        VALIDATE_GATE: 'validate-action'
    }),

    // ─── EVENTOS CUSTOM (prefijo Skeleton:) ────────────────────
    EVENTS: Object.freeze({
        GATEKEEPER_VIOLATION: 'Skeleton:Gatekeeper:Violation',
        SCENE_REQUEST_ORBIT: 'Skeleton:Scene:RequestOrbit',
        PASSPORT_UPDATED: 'Skeleton:Passport:Updated',
        PASSPORT_CLEARED: 'Skeleton:Passport:Cleared',
        GATE_VALIDATE: 'Skeleton:Gate:Validate',
        GATE_RESULT: 'Skeleton:Gate:Result',
        COMPLIANCE_STATUS: 'Skeleton:Compliance:Status',
        UI_ACTION_REQUESTED: 'Skeleton:UI:ActionRequested',
        AUTH_TOKEN_READY: 'skeleton:auth:token-ready',
        INVESTOR_ACCESS_REQUESTED: 'Skeleton:Investor:AccessRequested'
    }),

    // ─── ÓRBITAS (Espacios de navegación) ──────────────────────
    ORBITS: Object.freeze({
        LANDING: 'LANDING',
        STAFF: 'STAFF',
        INVESTOR: 'INVESTOR',
        WORKSPACE: 'WORKSPACE'
    }),

    // ─── PALETA SOBERANA (referencia de contrato) ──────────────
    // Estos valores deben coincidir con :root en index.html y
    // tailwind.config. Son la tercera copia de la SSOT cromática.
    PALETTE: Object.freeze({
        DEEP_OCEAN: '#101D33',
        UK_GOLD: '#C1A85D',
        UK_GOLD_DIM: '#A89050',
        IVORY: '#d7e3ff',
        ALERT: '#ffb4ab'
    }),

    // ─── GEOMETRÍA TRINITY (tokens de layout) ──────────────────
    TRINITY: Object.freeze({
        ORBIT_1_WIDTH: '250px',
        ORBIT_1_COLLAPSED: '64px',
        ORBIT_2_MIN_WIDTH: '600px',
        ORBIT_3_WIDTH: '320px',
        HEADER_HEIGHT: '64px',
        FOOTER_HEIGHT: '48px'
    }),

    // ─── ESCENAS (data-scene values) ───────────────────────────
    SCENES: Object.freeze({
        LANDING: 'LANDING',
        JURISDICTION: 'JURISDICTION',
        PRE_KYC: 'PRE_KYC',
        GATE: 'GATE',
        CUSTODY: 'CUSTODY',
        WORKSPACE: 'WORKSPACE'
    })

});

// Alias de conveniencia para imports cortos
export const ACTIONS = AIP_CONSTANTS.ACTIONS;
export const EVENTS = AIP_CONSTANTS.EVENTS;
export const SELECTORS = AIP_CONSTANTS.SELECTORS;
export const SCENES = AIP_CONSTANTS.SCENES;
export const ORBITS = AIP_CONSTANTS.ORBITS;
export const STORAGE = AIP_CONSTANTS.STORAGE;