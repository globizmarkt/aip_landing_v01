/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: config/constants.js
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   1.0.0 (Sovereign Constants)
 * DOCTRINA:  R0 (Single Source of Truth)
 * ═══════════════════════════════════════════════════════════════════
 */

export const AIP_CONSTANTS = {
    // Protocolo de Acceso
    CREDENTIAL: {
        VALID_KEY: 'AIP-ACCESS-2026',
        SESSION_KEY: 'skeleton_passport',
        INTEGRITY_MIN_SCORE: 60
    },

    // Selectores Stitch (DOM)
    SELECTORS: {
        PURPOSE_ATTR: 'data-purpose',
        PASS_INPUT: 'input[type="password"]',
        GATE_CONTAINER: '#access-gate-container'
    },

    // Acciones de Negocio
    ACTIONS: {
        INVESTOR_CTA: 'investor-cta',
        AGENT_LOGIN: 'agent-login',
        VALIDATE_GATE: 'validate-action'
    }
};
