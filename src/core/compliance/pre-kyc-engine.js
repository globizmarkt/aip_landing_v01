/**
 * @file pre-kyc-engine.js
 * @role DOM & Logic Engineer — OPORD-12
 * @doctrine R2 (Light DOM), R4 (i18n Strict), Vanilla Zero-Deps
 * @description Motor de captura Pre-KYC con validación y emisión de evento
 * @event Skeleton:PreKyc:Submitted
 * @dependency ReferralCapture (para leer AIP_REFERRAL_NODE)
 */

(function() {
    'use strict';
    
    const NS = window.Skeleton || (window.Skeleton = {});
    
    // Selectores de campos obligatorios (data-i18n keys para R4 compliance)
    const REQUIRED_FIELDS = [
        { selector: '[data-field="aum"]', name: 'aum' },
        { selector: '[data-field="mandate_type"]', name: 'mandate_type' },
        { selector: '[data-field="investment_horizon"]', name: 'investment_horizon' },
        { selector: '[data-field="risk_appetite"]', name: 'risk_appetite' }
    ];
    
    /**
     * Inicialización del motor Pre-KYC
     * Llamar al montar la escena PRE_KYC
     */
    function initPreKycEngine() {
        const form = document.querySelector('[data-scene="pre-kyc"] form, [data-form="pre-kyc"]');
        
        if (!form) {
            console.warn('[PreKycEngine] Formulario Pre-KYC no encontrado');
            return;
        }
        
        form.addEventListener('submit', handlePreKycSubmit);
        
        // Validación en tiempo real (opcional, mejora UX)
        initLiveValidation(form);
    }
    
    /**
     * Handler de submit del formulario Pre-KYC
     */
    function handlePreKycSubmit(event) {
        event.preventDefault();
        
        // Validación de campos obligatorios
        const validation = validateRequiredFields();
        
        if (!validation.valid) {
            // Emitir evento de error para UI feedback (no hardcodeado, via i18n)
            document.dispatchEvent(new CustomEvent('Skeleton:PreKyc:ValidationFailed', {
                detail: { 
                    missingFields: validation.missing,
                    timestamp: Date.now()
                }
            }));
            return;
        }
        
        // Construcción del payload
        const payload = buildPayload();
        
        // Emisión del evento para passport-engine.js (futuro interceptor)
        document.dispatchEvent(new CustomEvent('Skeleton:PreKyc:Submitted', {
            detail: payload
        }));
        
        // Log de trazabilidad (no PII sensible)
        console.log('[PreKycEngine] Payload emitido:', {
            fields: Object.keys(payload.data),
            hasReferral: !!payload.referralNode,
            timestamp: payload.timestamp
        });
    }
    
    /**
     * Validación de campos obligatorios
     */
    function validateRequiredFields() {
        const missing = [];
        
        for (const field of REQUIRED_FIELDS) {
            const element = document.querySelector(field.selector);
            if (!element || !element.value || element.value.trim() === '') {
                missing.push(field.name);
                
                // Marcar visualmente el error (clase Tailwind, no hex)
                if (element) {
                    element.classList.add('border-error');
                    element.setAttribute('aria-invalid', 'true');
                }
            } else {
                // Limpiar error previo
                if (element) {
                    element.classList.remove('border-error');
                    element.setAttribute('aria-invalid', 'false');
                }
            }
        }
        
        return {
            valid: missing.length === 0,
            missing: missing
        };
    }
    
    /**
     * Construcción del payload de Pre-KYC
     */
    function buildPayload() {
        const data = {};
        
        // Captura de todos los campos data-field
        document.querySelectorAll('[data-field]').forEach(field => {
            const key = field.dataset.field;
            const value = field.type === 'checkbox' ? field.checked : field.value;
            if (value !== undefined && value !== '') {
                data[key] = value;
            }
        });
        
        // Recuperar nodo de referido (inyectado por referral-capture.js)
        const referralNode = NS.ReferralCapture ? NS.ReferralCapture.get() : null;
        
        return {
            type: 'pre_kyc_profile',
            version: '1.0.0',
            timestamp: Date.now(),
            sessionId: generateSessionFingerprint(),
            referralNode: referralNode,
            data: data
        };
    }
    
    /**
     * Generar fingerprint anónimo de sesión (no PII)
     */
    function generateSessionFingerprint() {
        const nav = window.navigator;
        const screen = window.screen;
        const seed = [
            nav.userAgent,
            nav.language,
            screen.width,
            screen.height,
            new Date().getTimezoneOffset()
        ].join('|');
        
        // Simple hash para trazabilidad técnica
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'sess_' + Math.abs(hash).toString(36);
    }
    
    /**
     * Validación en tiempo real (mejora UX sin bloquear)
     */
    function initLiveValidation(form) {
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
    
    // Exposición pública
    NS.PreKycEngine = {
        init: initPreKycEngine,
        validate: validateRequiredFields,
        getPayload: buildPayload
    };
    
})();