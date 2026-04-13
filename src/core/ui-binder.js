/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: ui-binder.js — Sensor Unificado de Sinapsis
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.2.0 (Frecuencia Unificada — Sentinel Approved)
 * DOCTRINA:  R0 (Vanilla) | R4 (i18n Strict)
 * ═══════════════════════════════════════════════════════════════════
 */
import { AIP_CONSTANTS } from '../config/constants.js';

export const UIBinder = {
    init() {
        document.addEventListener('click', (e) => this._handleAction(e));
        console.log('[UI-BINDER] ✅ Nervios conectados a la frecuencia: ' + AIP_CONSTANTS.EVENTS.UI_ACTION_REQUESTED);
    },

    _handleAction(e) {
        const target = e.target.closest(`[${AIP_CONSTANTS.SELECTORS.PURPOSE_ATTR}]`);
        if (!target) return;

        const action = target.getAttribute(AIP_CONSTANTS.SELECTORS.PURPOSE_ATTR);
        e.preventDefault();

        let credential = null;

        // Si el botón es el de la Bóveda (Gate), extraemos la clave
        if (action === AIP_CONSTANTS.ACTIONS.VALIDATE_GATE) {
            const input = document.querySelector(AIP_CONSTANTS.SELECTORS.PASS_INPUT);
            credential = input?.value || null;
        }

        // DESPACHO UNIFICADO (El Engine v2.0.0 escucha esto)
        document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.UI_ACTION_REQUESTED, {
            bubbles: true,
            detail: { action, credential, timestamp: Date.now() }
        }));
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIBinder.init());
} else {
    UIBinder.init();
}