/**
 * ============================================================
 * ARCHIVO  : src/features/access-gate.js
 * VERSIÓN  : 1.1.0 (Founder Edition)
 * FECHA    : 2026-03-18
 * PROPÓSITO: Portal de acceso institucional. Autentica al
 *            administrador contra PassportEngine y emite
 *            USER_LOGGED_IN al SceneManager vía globalBus.
 * HERENCIA : v1.0.0 (Antigravity) + Lógica Kimi [GATE-ELECTRO-01]
 * DOCTRINA : R2 (Agnóstico) | R3 (Zero-Hex) | R4 (i18n Estricto)
 * ============================================================
 */

/**
 * ÍNDICE MAESTRO
 * [SEC-01] Importaciones
 * [SEC-02] Estilos (Variables de Token — R3 Compliant)
 * [SEC-03] Clase AccessGateService
 * [SEC-04] render() — Estructura DOM
 * [SEC-05] _bindEvents() — Autenticación Fiduciaria
 * [SEC-06] _displayAccessDenied() — Feedback de Denegación
 * [SEC-07] _clearErrorState() — Higiene de Estado
 * [SEC-08] Exportación Singleton
 */

/* [SEC-01] IMPORTACIONES ────────────────────────────────────── */
import { i18n } from '../core/at-i18n.js';
import { globalBus } from '../core/event-bus.js';
import { passportEngine } from '../core/passport-engine.js';

/* [SEC-02] ESTILOS (TOKEN-MAPPED — R3 COMPLIANT) ────────────── */
const STYLES = `
    .gate-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(10, 10, 10, 0.85);
        z-index: 10000;
        display: flex; justify-content: center; align-items: center;
        backdrop-filter: blur(12px);
        animation: gateFadeIn 0.4s ease-out;
    }
    .gate-card {
        background: var(--color-bg-panel);
        border: 1px solid var(--color-border);
        width: 90%; max-width: 550px;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        color: var(--color-text-main);
        font-family: 'Outfit', sans-serif;
        overflow: hidden;
    }
    .gate-header {
        padding: 2rem;
        border-bottom: 1px solid var(--color-border);
        text-align: center;
    }
    .gate-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-text-main);
        margin-bottom: 0.5rem;
    }
    .gate-header p {
        font-size: 0.8rem;
        color: var(--color-text-muted);
    }
    .gate-body { padding: 2.5rem; }
    .gate-footer {
        padding: 1.5rem 2rem;
        background: rgba(0, 0, 0, 0.2);
        border-top: 1px solid var(--color-border);
        display: flex; justify-content: flex-end;
    }
    .form-group { margin-bottom: 1.25rem; }
    .form-label {
        display: block;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--color-accent);
        margin-bottom: 0.5rem;
    }
    .form-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        padding: 0.75rem 1rem;
        color: var(--color-text-main);
        font-size: 0.9rem;
        transition: border-color 0.2s;
        box-sizing: border-box;
    }
    .form-input:focus {
        outline: none;
        border-color: var(--color-accent);
    }
    .form-input.input-error {
        border-color: var(--color-emergency);
    }
    .gate-btn {
        background: var(--color-accent);
        color: var(--color-bg-base);
        border: none;
        padding: 1rem 2rem;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        width: 100%;
    }
    .gate-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
    .gate-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .gate-error-container {
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        background: rgba(var(--color-emergency-rgb, 220, 38, 38), 0.1);
        border: 1px solid var(--color-emergency);
        color: var(--color-emergency);
        font-size: 0.85rem;
    }
    .gate-error-container.hidden { display: none; }
    @keyframes gateFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to   { opacity: 1; transform: scale(1); }
    }
`;

/* [SEC-03] CLASE ACCESSGATESERVICE ──────────────────────────── */
class AccessGateService {
    constructor() {
        this.element = null;
        this._injectStyles();
    }

    _injectStyles() {
        if (document.getElementById('at-gate-styles')) return;
        const style = document.createElement('style');
        style.id = 'at-gate-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    /* [SEC-04] RENDER — ESTRUCTURA DOM ──────────────────────── */
    render(container) {
        if (this.element) return;

        this.element = document.createElement('div');
        this.element.className = 'gate-overlay';
        this.element.innerHTML = `
            <div class="gate-card">

                <div class="gate-header">
                    <h2 data-i18n="auth.gate.title">Acceso Institucional</h2>
                    <p data-i18n="auth.gate.subtitle">Verificación de Identidad Requerida</p>
                </div>

                <div class="gate-body">
                    <form id="gate-access-form" novalidate>

                        <div class="form-group">
                            <label class="form-label" data-i18n="auth.gate.name_label">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                data-gate="name"
                                class="form-input"
                                autocomplete="name"
                                required
                                data-i18n-placeholder="auth.gate.name_placeholder"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label" data-i18n="auth.gate.email_label">
                                Correo Institucional
                            </label>
                            <input
                                type="email"
                                data-gate="email"
                                class="form-input"
                                autocomplete="email"
                                required
                                data-i18n-placeholder="auth.gate.email_placeholder"
                            />
                        </div>

                        <div id="gate-error-container" class="gate-error-container hidden">
                            <span
                                data-gate-error="text"
                                data-i18n="auth.gate.error_denied"
                            >Credenciales no autorizadas</span>
                        </div>

                        <div class="form-group" style="margin-top: 2rem; margin-bottom: 0;">
                            <button
                                type="submit"
                                id="gate-submit-btn"
                                class="gate-btn"
                                data-i18n="auth.gate.submit_btn"
                            >Solicitar Acceso</button>
                        </div>

                    </form>
                </div>

            </div>
        `;

        container.appendChild(this.element);
        i18n.translate();
        this._bindEvents();
    }

    /* [SEC-05] _bindEvents — AUTENTICACIÓN FIDUCIARIA ───────── */
    _bindEvents() {
        const form = this.element.querySelector('#gate-access-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = this.element.querySelector('[data-gate="email"]');
            const nameInput = this.element.querySelector('[data-gate="name"]');
            const submitBtn = this.element.querySelector('#gate-submit-btn');

            const email = emailInput?.value?.trim() || '';
            const name = nameInput?.value?.trim() || '';

            // Higiene: limpiar errores previos
            this._clearErrorState();

            // Bloquear botón durante verificación
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.setAttribute('data-i18n', 'auth.gate.verifying');
                submitBtn.textContent = 'Verificando...';
            }

            // Llamada soberana al motor de pasaportes
            const success = passportEngine.authenticate(email, 'admin123');

            if (success) {
                // PassportEngine ya disparó Skeleton:Passport:Updated
                // y persistió en sessionStorage automáticamente.

                globalBus.emit('USER_LOGGED_IN', {
                    passport: passportEngine.getPassport(),
                    meta: {
                        email,
                        displayName: name,
                        entryPoint: 'access-gate',
                        timestamp: Date.now()
                    }
                });

                form.reset();

            } else {
                // Restaurar botón antes de mostrar error
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.setAttribute('data-i18n', 'auth.gate.submit_btn');
                    submitBtn.textContent = 'Solicitar Acceso';
                }

                this._displayAccessDenied();

                // Log de seguridad sin datos sensibles
                console.warn('[AccessGate] Autenticación denegada —',
                    email.replace(/(?<=.{3}).(?=[^@]*@)/g, '*'));
            }
        });
    }

    /* [SEC-06] _displayAccessDenied — FEEDBACK DENEGACIÓN ───── */
    _displayAccessDenied() {
        const errorContainer = this.element.querySelector('#gate-error-container');
        const errorText = this.element.querySelector('[data-gate-error="text"]');
        const emailInput = this.element.querySelector('[data-gate="email"]');

        if (errorContainer) {
            errorContainer.classList.remove('hidden');

            if (errorText) {
                const msg = window.LuxI18n?.['auth.gate.error_denied']
                    || window.AIP?.i18n?.get?.('auth.gate.error_denied')
                    || 'Credenciales no autorizadas';
                errorText.textContent = msg;
            }
        }

        // Marcar input con error (R3: clase utilitaria, no hex)
        if (emailInput) {
            emailInput.classList.add('input-error');
            emailInput.focus();
        }
    }

    /* [SEC-07] _clearErrorState — HIGIENE DE ESTADO ─────────── */
    _clearErrorState() {
        const errorContainer = this.element.querySelector('#gate-error-container');
        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }

        this.element.querySelectorAll('[data-gate]').forEach(input => {
            input.classList.remove('input-error');
        });
    }
}

/* [SEC-08] EXPORTACIÓN SINGLETON ────────────────────────────── */
export const AccessGate = new AccessGateService();