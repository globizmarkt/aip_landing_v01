/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: core/compliance/pre-kyc-engine.js
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.0.0 (Modularized)
 * DOCTRINA:  R2 (Light DOM), R4 (i18n Strict), Vanilla Zero-Deps
 * PROPÓSITO: Motor de captura Pre-KYC con validación
 * ═══════════════════════════════════════════════════════════════════
 */

import { ReferralCapture } from '../referral-capture.js';

const REQUIRED_FIELDS = [
    { selector: '[data-field="aum"]', name: 'aum' },
    { selector: '[data-field="mandate_type"]', name: 'mandate_type' },
    { selector: '[data-field="investment_horizon"]', name: 'investment_horizon' },
    { selector: '[data-field="risk_appetite"]', name: 'risk_appetite' }
];

export const PreKycEngine = {

    /**
     * Inicialización del motor Pre-KYC
     * Llamar al montar la escena PRE_KYC
     */
    init() {
        const form = document.querySelector('[data-scene="pre-kyc"] form, [data-form="pre-kyc"]');
        
        if (!form) {
            console.warn('[PreKycEngine] Formulario Pre-KYC no encontrado');
            return;
        }
        
        form.addEventListener('submit', (e) => this._handlePreKycSubmit(e));
        this._initLiveValidation(form);
    },

    validate() {
        const missing = [];
        for (const field of REQUIRED_FIELDS) {
            const element = document.querySelector(field.selector);
            if (!element || !element.value || element.value.trim() === '') {
                missing.push(field.name);
                if (element) {
                    element.classList.add('border-error');
                    element.setAttribute('aria-invalid', 'true');
                }
            } else {
                if (element) {
                    element.classList.remove('border-error');
                    element.setAttribute('aria-invalid', 'false');
                }
            }
        }
        return { valid: missing.length === 0, missing };
    },

    getPayload() {
        const data = {};
        document.querySelectorAll('[data-field]').forEach(field => {
            const key = field.dataset.field;
            const value = field.type === 'checkbox' ? field.checked : field.value;
            if (value !== undefined && value !== '') {
                data[key] = value;
            }
        });

        return {
            type: 'pre_kyc_profile',
            version: '1.0.0',
            timestamp: Date.now(),
            sessionId: this._generateSessionFingerprint(),
            referralNode: ReferralCapture.get(),
            data: data
        };
    },

    /* --- PRIVADOS --- */

    _handlePreKycSubmit(event) {
        event.preventDefault();
        const validation = this.validate();
        
        if (!validation.valid) {
            document.dispatchEvent(new CustomEvent('Skeleton:PreKyc:ValidationFailed', {
                detail: { missingFields: validation.missing, timestamp: Date.now() }
            }));
            return;
        }
        
        const payload = this.getPayload();
        
        // Emisión del evento para passport-engine.js (Convergencia Track A)
        document.dispatchEvent(new CustomEvent('Skeleton:PreKyc:Submitted', {
            detail: payload
        }));
        
        console.log('[PreKycEngine] ✅ Payload emitido:', {
            fields: Object.keys(payload.data),
            hasReferral: !!payload.referralNode,
            timestamp: payload.timestamp
        });
    },

    _generateSessionFingerprint() {
        const nav = window.navigator;
        const screen = window.screen;
        const seed = [nav.userAgent, nav.language, screen.width, screen.height, new Date().getTimezoneOffset()].join('|');
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'sess_' + Math.abs(hash).toString(36);
    },

    _initLiveValidation(form) {
        REQUIRED_FIELDS.forEach(fieldDef => {
            const element = form.querySelector(fieldDef.selector);
            if (element) {
                element.addEventListener('change', () => {
                    if (element.value && element.value.trim() !== '') {
                        element.classList.remove('border-error');
                        element.setAttribute('aria-invalid', 'false');
                    }
                });
            }
        });
    }
};