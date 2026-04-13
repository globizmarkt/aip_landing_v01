/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: core/ui-binder.js
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.0.0 (Sovereign Binder — OPORD-P-04)
 * DOCTRINA:  R0 (Vanilla) | R4 (i18n Strict)
 * PROPÓSITO: Sensor de eventos DOM y despachador de acciones fiduciarias
 * ═══════════════════════════════════════════════════════════════════
 */

import { AIP_CONSTANTS } from '../config/constants.js';

export const UIBinder = {
    
    _initialized: false,

    init() {
        if (this._initialized) return;

        // Delegación de eventos para eficiencia (R2 Compliant)
        document.addEventListener('click', (e) => this._handleGlobalClick(e));
        
        this._initialized = true;
        console.log('[UI-BINDER] ✅ Sensor de eventos activo (data-purpose).');
    },

    /**
     * Orquestador de clics globales
     */
    _handleGlobalClick(e) {
        const target = e.target.closest(`[${AIP_CONSTANTS.SELECTORS.PURPOSE_ATTR}]`);
        if (!target) return;

        const purpose = target.getAttribute(AIP_CONSTANTS.SELECTORS.PURPOSE_ATTR);
        
        // Evitar navegación por defecto si es acción interna
        e.preventDefault();

        // 1. Extraer datos si la acción es de validación
        let credential = null;
        if (purpose === AIP_CONSTANTS.ACTIONS.VALIDATE_GATE) {
            const input = document.querySelector(AIP_CONSTANTS.SELECTORS.PASS_INPUT);
            credential = input ? input.value : null;
        }

        // 2. Despachar acción institucional
        this._dispatchAction(purpose, credential);
    },

    /**
     * Emisión de evento soberano hacia el bus de sistema
     */
    _dispatchAction(action, credential = null) {
        const actionEvent = new CustomEvent('Skeleton:UI:ActionRequested', {
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