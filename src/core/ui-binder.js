/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: ui-binder.js — Sensor Unificado con Inhibición de Doble Disparo
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.3.0 (Vector 2 — Protección del Event Bus)
 * DOCTRINA:  R0 (Vanilla Zero-Deps) | R4 (i18n Strict) | R5 (Soberanía)
 * DEPS:      ../config/constants.js (AIP_CONSTANTS)
 * ───────────────────────────────────────────────────────────────────
 * PROPÓSITO: Capturar intenciones de UI, despachar evento canónico y
 *            saturar el Event Bus.
 * REGLAS:    - Bloqueo inmediato (disabled + data-status="loading").
 *            - Liberación solo por PASSPORT_UPDATED o GATEKEEPER_VIOLATION.
 *            - Cero strings mágicos. Cero inferencia DOM.
 * ═══════════════════════════════════════════════════════════════════
 */

import { AIP_CONSTANTS } from '../config/constants.js';

export const UIBinder = {
    _activeButton: null, // Referencia segura al nodo en procesamiento

    init() {
        // Delegación global (R2 Light DOM compliant)
        document.addEventListener('click', (e) => this._handleAction(e));

        // Escuchadores de resolución para liberar el bloqueo táctil
        document.addEventListener(AIP_CONSTANTS.EVENTS.PASSPORT_UPDATED, () => this._resetState());
        document.addEventListener(AIP_CONSTANTS.EVENTS.GATEKEEPER_VIOLATION, () => this._resetState());

        console.log('[UI-BINDER] ✅ Sinapsis activa. Inhibición de doble disparo habilitada.');
    },

    /**
     * Orquestador de clics. Filtra por PURPOSE_ATTR → Despacho determinista.
     */
    _handleAction(e) {
        const target = e.target.closest(`[${AIP_CONSTANTS.SELECTORS.PURPOSE_ATTR}]`);
        if (!target) return;

        // VECTOR 2: Inhibición de doble disparo
        if (this._activeButton) return;

        const action = target.getAttribute(AIP_CONSTANTS.SELECTORS.PURPOSE_ATTR);
        e.preventDefault();

        // Bloqueo táctil inmediato
        target.disabled = true;
        target.setAttribute('data-status', 'loading');
        this._activeButton = target;

        let credential = null;
        if (action === AIP_CONSTANTS.ACTIONS.VALIDATE_GATE) {
            const input = document.querySelector(AIP_CONSTANTS.SELECTORS.PASS_INPUT);
            credential = input?.value || null;
        }

        // Despacho unificado (El Engine v2.0.0 escucha esto)
        document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.UI_ACTION_REQUESTED, {
            bubbles: true,
            detail: { action, credential, timestamp: Date.now() }
        }));
    },

    /**
     * Libera el botón bloqueado al recibir señal de éxito o fallo.
     */
    _resetState() {
        if (this._activeButton) {
            // Validación GC: asegurar que el nodo sigue vivo antes de mutarlo
            if (document.contains(this._activeButton)) {
                this._activeButton.disabled = false;
                this._activeButton.removeAttribute('data-status');
            }
            this._activeButton = null;
        }
    }
};

// Inicialización robusta (DOM Ready + Fallback)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIBinder.init());
} else {
    UIBinder.init();
}