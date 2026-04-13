/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: gatekeeper.js — Guardián de Transiciones y Acceso (R0)
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   3.0.0 (Sovereign Core — OPORD-P-06)
 * DOCTRINA:  R0 (Agnosticismo Radical) | R3 (Zero-Hex)
 * DEPS:      src/core/passport-engine.js | src/config/constants.js
 * ───────────────────────────────────────────────────────────────────
 * PROPÓSITO: Evaluar si el pasaporte actual permite la transición a
 *            una escena o recurso específico.
 * REGLAS:    - No contacta el backend. Confía en el PassportEngine.
 *            - Emite eventos canónicos ante violaciones de acceso.
 * ═══════════════════════════════════════════════════════════════════
 */

import { AIP_CONSTANTS } from '../config/constants.js';

export const Gatekeeper = {

    _passportEngine: null,
    
    // Reglas de acceso por escena
    _rules: {
        'LANDING':     () => true, // Acceso público
        'WORKSPACE':   (pe) => pe.hasClaim('canAccessWorkspace'),
        'GATE':        (pe) => pe.getState() === 'AUTHENTICATED',
        'JURISDICTION':(pe) => pe.getState() === 'AUTHENTICATED'
    },

    init(passportEngine) {
        this._passportEngine = passportEngine;
        console.log('[GATEKEEPER] ✅ Guardián de acceso activo.');
    },

    /**
     * Evalúa si se permite el acceso a una escena
     */
    canAccess(sceneName) {
        const rule = this._rules[sceneName] || (() => false);
        const result = rule(this._passportEngine);

        if (!result) {
            this._reportViolation(sceneName);
        }

        return result;
    },

    _reportViolation(sceneName) {
        const event = new CustomEvent(AIP_CONSTANTS.EVENTS.GATEKEEPER_VIOLATION, {
            bubbles: true,
            detail: {
                scene: sceneName,
                reason: 'INSUFFICIENT_CLAIMS',
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
        console.warn(`[GATEKEEPER] 🛡️ Acceso Denegado a: ${sceneName}`);
    }
};