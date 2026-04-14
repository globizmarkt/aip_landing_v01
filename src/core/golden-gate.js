/**
 * 🛡️ GOLDEN GATE — AIP-FIED CLONE (v1.0.0)
 * ============================================================
 * Archivo:      02_auditoria/indexacion de planos CPII 2026-04-14/golden-gate.js
 * Origen:       CPII_crm_v0.1/features/at-admin-gate.js
 * Tipo:         Componente de Autenticación Fiduciaria
 * Rol:          Gatekeeper de Acceso Élite y Manual
 * Versión:      1.0.1-AIP (Sentinel R0)
 * Timestamp:    2026-04-14
 * ============================================================
 * DOCTRINAS:    [R0] Agnosticism | [R2] Light DOM | [R5] APP_PREFIX Isolation
 * STATUS:       AIP-Compliant | Zero Trust UI | document.dispatchEvent
 * ============================================================
 */

'use strict';

const ENGINE_VERSION = '1.0.1-AIP';

// Sentinel Aislamiento Múltiple
const _PRIVATE_SCOPE = {
    APP_PREFIX: 'AIP_LANDING_V0_',
    listeners: [],
    elements: {},
    auth: null
};

/**
 * GoldenGate — Módulo de autenticación fiduciaria
 */
export const GoldenGate = Object.freeze({

    init: function () {
        try {
            if (typeof global.firebase === 'undefined' || !global.firebase.auth) {
                console.error('[GoldenGate] ❌ Firebase no disponible');
                this._dispatchEvent('Skeleton:Gate:Error', { error: 'FIREBASE_MISSING' });
                return;
            }

            _PRIVATE_SCOPE.auth = global.firebase.auth();
            this._discoverElements();
            this._activateControls();
            this._setupOAuthListeners();
            this._setupManualFlow();

            this._dispatchEvent('Skeleton:Gate:Ready', {
                component: 'golden-gate',
                version: ENGINE_VERSION,
                timestamp: Date.now()
            });

        } catch (error) {
            console.error('[GoldenGate] Error de inicialización:', error);
            this._setState('error');
        }
    },

    _discoverElements: function () {
        const root = document.getElementById('golden-gate-root');
        if (!root) return;

        _PRIVATE_SCOPE.elements = {
            root: root,
            googleBtn: document.getElementById('gate-btn-google'),
            appleBtn: document.getElementById('gate-btn-apple'),
            microsoftBtn: document.getElementById('gate-btn-microsoft'),
            emailInput: document.getElementById('gate-email-input'),
            manualSubmitBtn: document.getElementById('gate-btn-manual-submit'),
            manualConfirm: document.getElementById('gate-manual-confirm'),
            stateLoading: document.getElementById('gate-state-loading'),
            stateError: document.getElementById('gate-state-error'),
            stateSuccess: document.getElementById('gate-state-success')
        };
    },

    _activateControls: function () {
        const el = _PRIVATE_SCOPE.elements;
        if (el.root && el.root.hasAttribute('data-gate-lock')) {
            el.root.removeAttribute('data-gate-lock');
            this._dispatchEvent('Skeleton:Gate:Unlocked', {
                timestamp: Date.now(),
                trigger: '_activateControls'
            });
        }

        const toActivate = [
            el.googleBtn,
            el.appleBtn,
            el.microsoftBtn,
            el.emailInput,
            el.manualSubmitBtn
        ];

        toActivate.forEach(item => {
            if (item && item.hasAttribute('disabled')) {
                item.removeAttribute('disabled');
            }
        });
    },

    _setupOAuthListeners: function () {
        const providers = [
            { key: 'google', btn: _PRIVATE_SCOPE.elements.googleBtn, providerId: 'google.com' },
            { key: 'apple', btn: _PRIVATE_SCOPE.elements.appleBtn, providerId: 'apple.com' },
            { key: 'microsoft', btn: _PRIVATE_SCOPE.elements.microsoftBtn, providerId: 'microsoft.com' }
        ];

        providers.forEach(({ key, btn, providerId }) => {
            if (!btn) return;
            const handler = (e) => {
                e.preventDefault();
                this._handleOAuth(key, providerId);
            };
            btn.addEventListener('click', handler);
            _PRIVATE_SCOPE.listeners.push({ element: btn, event: 'click', handler });
        });
    },

    _setupManualFlow: function () {
        const { manualSubmitBtn, emailInput } = _PRIVATE_SCOPE.elements;
        if (!manualSubmitBtn || !emailInput) return;

        const submitHandler = (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (!this._validateEmail(email)) {
                this._showError('Formato de correo inválido');
                this._setState('error');
                return;
            }
            this._handleManualSubmit(email);
        };

        manualSubmitBtn.addEventListener('click', submitHandler);
        _PRIVATE_SCOPE.listeners.push({ element: manualSubmitBtn, event: 'click', handler: submitHandler });
    },

    _validateEmail: function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    _handleOAuth: async function (providerName, providerId) {
        this._setState('loading');
        try {
            let provider;
            switch (providerId) {
                case 'google.com':
                    provider = new global.firebase.auth.GoogleAuthProvider();
                    provider.addScope('profile');
                    provider.addScope('email');
                    break;
                case 'apple.com':
                    provider = new global.firebase.auth.OAuthProvider('apple.com');
                    break;
                case 'microsoft.com':
                    provider = new global.firebase.auth.OAuthProvider('microsoft.com');
                    break;
                default:
                    throw new Error(`PROVIDER_NOT_SUPPORTED: ${providerId}`);
            }

            const result = await _PRIVATE_SCOPE.auth.signInWithPopup(provider);

            if (!result || !result.user) throw new Error('AUTH_NO_USER');

            const session = this._buildSession(result.user, providerName);

            if (!global.Skeleton) global.Skeleton = {};
            global.Skeleton.session = session;

            try {
                sessionStorage.setItem(`${_PRIVATE_SCOPE.APP_PREFIX}PASSPORT`, JSON.stringify(session));
            } catch (e) {
                console.warn('[GoldenGate] Error persistiendo sesión en storage.');
            }

            this._dispatchEvent('Skeleton:Passport:SessionUpdated', session);
            this._dispatchEvent('Skeleton:Gate:StaffAuthenticated', {
                provider: providerName,
                uid: session.uid,
                timestamp: Date.now()
            });

            this._setState('success');

            setTimeout(() => {
                const redirectUrl = _PRIVATE_SCOPE.elements.root?.dataset?.redirect || '/index.html';
                global.location.href = redirectUrl;
            }, 1200);

        } catch (error) {
            console.error(`[GoldenGate] OAuth ${providerName} error:`, error);
            this._dispatchEvent('Skeleton:Gate:StaffAuthFailed', {
                provider: providerName,
                code: error.code || 'UNKNOWN',
                message: error.message
            });
            this._setState('error');
        }
    },

    _handleManualSubmit: async function (email) {
        this._setState('loading');
        try {
            const actionCodeSettings = {
                url: global.location.href,
                handleCodeInApp: true
            };

            await _PRIVATE_SCOPE.auth.sendSignInLinkToEmail(email, actionCodeSettings);

            if (global.localStorage) {
                global.localStorage.setItem(`${_PRIVATE_SCOPE.APP_PREFIX}EMAIL_SIGNIN`, email);
            }

            if (_PRIVATE_SCOPE.elements.manualConfirm) {
                _PRIVATE_SCOPE.elements.manualConfirm.style.display = 'block';
            }

            this._dispatchEvent('Skeleton:Gate:ManualLinkSent', { email });
            this._setState('idle');

        } catch (error) {
            console.error('[GoldenGate] Manual link error:', error);
            this._setState('error');
        }
    },

    _setState: function (state) {
        const { root, stateLoading, stateError, stateSuccess } = _PRIVATE_SCOPE.elements;
        if (root) root.setAttribute('data-gate-state', state);

        if (stateLoading) stateLoading.style.display = state === 'loading' ? 'flex' : 'none';
        if (stateError) stateError.style.display = state === 'error' ? 'block' : 'none';
        if (stateSuccess) stateSuccess.style.display = state === 'success' ? 'block' : 'none';

        this._dispatchEvent('Skeleton:Gate:StateChanged', { state });
    },

    _buildSession: function (firebaseUser, provider) {
        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || null,
            provider: provider,
            authenticated: true,
            timestamp: new Date().toISOString(),
            claims: {} // PassportEngine lo poblará
        };
    },

    _showError: function (message) {
        const errorMsgEl = document.getElementById('gate-error-message');
        if (errorMsgEl) errorMsgEl.textContent = message;
    },

    _dispatchEvent: function (name, detail) {
        document.dispatchEvent(new CustomEvent(name, {
            detail: Object.freeze(detail || {}),
            bubbles: true,
            composed: false
        }));
    }
});
