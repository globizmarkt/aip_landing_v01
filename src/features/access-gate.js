/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: access-gate.js — Interfaz de Validación Fiduciaria
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.0.0 (Sovereign Core — OPORD-P-06)
 * DOCTRINA:  R2 (Light DOM) | R3 (Zero-Hex) | R4 (i18n) | R5 (AIP)
 * DEPS:      src/config/constants.js | src/core/ui-binder.js
 * ───────────────────────────────────────────────────────────────────
 * PROPÓSITO: Proporcionar la interfaz de bloqueo institucional (Gate)
 *            para la validación de credenciales de Staff/Partners.
 * REGLAS:    - Consume AIP_CONSTANTS para selectores y eventos.
 *            - Delegación de submit vía UI-Binder.
 *            - Sin lógica de autenticación propia (usa el motor Core).
 * ═══════════════════════════════════════════════════════════════════
 */

import { AIP_CONSTANTS } from '../config/constants.js';

export const AccessGate = {

    _container: null,

    /**
     * Inicializa y monta el Gate en el contenedor indicado
     */
    init(container) {
        this._container = container;
        this._render();
        console.log('[ACCESS-GATE] ✅ Interfaz de validación montada.');
    },

    _render() {
        if (!this._container) return;

        // R3: Cero hexadecimales inline. Solo clases de Tailwind o tokens.
        // R4: Todos los textos usan data-i18n para hidratación diferida.
        this._container.innerHTML = `
            <div id="sk-access-gate" class="sk-gate-overlay">
                <div class="sk-gate-card">
                    <header class="sk-gate-header">
                        <h2 data-i18n="gate.title">Acceso Restringido</h2>
                        <p data-i18n="gate.subtitle">Verificación Institucional Requerida</p>
                    </header>

                    <form id="gate-auth-form" class="sk-gate-form">
                        <div class="sk-form-group">
                            <label class="sk-form-label" data-i18n="gate.input_label">Credenciales de Acceso</label>
                            <input 
                                type="password" 
                                class="sk-form-input" 
                                required 
                                data-i18n-placeholder="gate.placeholder"
                            />
                        </div>

                        <div id="gate-error-msg" class="sk-gate-error hidden">
                            <span data-i18n="gatekeeper.violation.invalid_credential">Credencial Inválida</span>
                        </div>

                        <button 
                            type="submit" 
                            class="sk-gate-btn sk-gradient-gold"
                            data-purpose="${AIP_CONSTANTS.ACTIONS.VALIDATE_GATE}"
                        >
                            <span data-i18n="gate.cta">Verificar Identidad</span>
                        </button>
                    </form>

                    <footer class="sk-gate-footer">
                        <p data-i18n="gate.disclaimer"></p>
                    </footer>
                </div>
            </div>
        `;
    },

    /**
     * Muestra visualmente el estado de error/denegación
     */
    showViolation() {
        const errorContainer = this._container.querySelector('#gate-error-msg');
        if (errorContainer) {
            errorContainer.classList.remove('hidden');
        }
    }
};