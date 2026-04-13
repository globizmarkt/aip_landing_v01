/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: ui-binder.js — Sensor de Eventos y Despachador de Acciones
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.2.0 (Sovereign Core — OPORD-P-06)
 * DOCTRINA:  R0 (Vanilla) | R4 (i18n) | R5 (Soberanía)
 * DEPS:      src/config/constants.js (SELECTORS, ACTIONS, EVENTS)
 * ───────────────────────────────────────────────────────────────────
 * PROPÓSITO: Capturar intenciones del usuario en el DOM y emitir
 *            eventos canónicos hacia los motores core.
 * REGLAS:    - Delegación de eventos única sobre 'document'.
 *            - Agnosticismo total sobre el resultado de la acción.
 *            - Consumir selectores exclusivamente de AIP_CONSTANTS.
 * ═══════════════════════════════════════════════════════════════════
 */

import { AIP_CONSTANTS } from '../config/constants.js';

export const UIBinder = {
    
    _initialized: false,

    init() {
        if (this._initialized) return;

        // Delegación de eventos (R2 Compliant)
        document.addEventListener('click', (e) => this._handleGlobalClick(e));
        
        // Manejo de sumisión de formularios (Gate)
        document.addEventListener('submit', (e) => this._handleGlobalSubmit(e));

        this._initialized = true;
        console.log('[UI-BINDER] ✅ Sensor de eventos activo (v2.2.0).');
    },

    _handleGlobalClick(e) {
        const target = e.target.closest(`[${AIP_CONSTANTS.SELECTORS.PURPOSE_ATTR}]`);
        if (!target) return;

        const purpose = target.getAttribute(AIP_CONSTANTS.SELECTORS.PURPOSE_ATTR);
        
        // Si el botón está dentro de un formulario y es submit, dejar que lo maneje _handleGlobalSubmit
        if (target.type === 'submit' && target.closest('form')) return;

        e.preventDefault();
        this._dispatchAction(purpose);
    },

    _handleGlobalSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector(`[${AIP_CONSTANTS.SELECTORS.PURPOSE_ATTR}]`);
        if (!submitBtn) return;

        e.preventDefault();
        const purpose = submitBtn.getAttribute(AIP_CONSTANTS.SELECTORS.PURPOSE_ATTR);
        
        let credential = null;
        if (purpose === AIP_CONSTANTS.ACTIONS.VALIDATE_GATE) {
            const input = form.querySelector(AIP_CONSTANTS.SELECTORS.PASS_INPUT);
            credential = input ? input.value : null;
        }

        this._dispatchAction(purpose, credential);
    },

    _dispatchAction(action, credential = null) {
        const actionEvent = new CustomEvent(AIP_CONSTANTS.EVENTS.UI_ACTION_REQUESTED, {
            bubbles: true,
            detail: {
                action,
                credential,
                timestamp: Date.now()
            }
        });

        document.dispatchEvent(actionEvent);
        console.log(`[UI-BINDER] 📡 Acción Despachada: ${action}`);
    }
};