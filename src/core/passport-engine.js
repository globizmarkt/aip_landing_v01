/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: passport-engine.js — Motor de Pasaportes de Identidad
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.1.0 (Sovereign Core — OPORD-P-06)
 * DOCTRINA:  R0 (Agnosticismo Radical) | R4 (i18n) | R5 (Soberanía)
 * DEPS:      src/config/constants.js (CREDENTIAL, EVENTS, SCENES, ORBITS)
 * ───────────────────────────────────────────────────────────────────
 * PROPÓSITO: Gestionar el ciclo de vida del pasaporte de identidad.
 * REGLAS:    - Prohibido escribir en localStorage (fuga de seguridad).
 *            - IntegrityScore < 60 = bloqueo automático (hard gate).
 * ═══════════════════════════════════════════════════════════════════
 */

import { Store } from './store.js';
import { AIP_CONSTANTS } from '../config/constants.js';

/* [SEC-01] CONSTANTES INTERNAS */
const _PASSPORT_KEY = AIP_CONSTANTS.STORAGE.PASSPORT_KEY;
const _DEFAULT_THRESHOLD = AIP_CONSTANTS.COMPLIANCE.MIN_INTEGRITY_SCORE;

/* [SEC-02] ESTADOS CANÓNICOS */
const PassportState = Object.freeze({
    ANONYMOUS: 'ANONYMOUS',
    AUTHENTICATED: 'AUTHENTICATED',
    KYC_PENDING: 'KYC_PENDING',
    VALIDATED: 'VALIDATED',
    CUSTODY_HOLD: 'CUSTODY_HOLD'
});

const _EMPTY_PASSPORT = {
    state: PassportState.ANONYMOUS,
    uid: null,
    email: null,
    claims: {},
    integrityScore: null,
    custodyReason: null,
    verifiedAt: null,
    expiresAt: null
};

export const PassportEngine = {

    _passport: structuredClone(_EMPTY_PASSPORT),
    _threshold: _DEFAULT_THRESHOLD,
    _ready: false,

    init() {
        const config = Store.getState().project?.config;
        if (config?.complianceThreshold) {
            this._threshold = config.complianceThreshold;
        }

        this._hydrateFromSession();

        // Escuchar AuthManager (Track A)
        document.addEventListener(AIP_CONSTANTS.EVENTS.AUTH_TOKEN_READY, (e) => {
            const { user, claims } = e.detail ?? {};
            if (user) {
                this._processAuthentication(user, claims ?? {});
            }
        });

        // Escuchar UI-Binder (Track B)
        document.addEventListener(AIP_CONSTANTS.EVENTS.UI_ACTION_REQUESTED, (e) => {
            this._handleUIActionRequest(e.detail);
        });

        this._ready = true;
        console.log('[PASSPORT-ENGINE] ✅ Motor de Pasaportes sincronizado (v2.1.0).');
    },

    _processAuthentication(user, rawClaims) {
        const normalizedClaims = this._normalizeClaims(rawClaims);
        const score = rawClaims.integrityScore ?? null;

        if (this._isCustodyActive(rawClaims, score)) {
            const reasonKey = rawClaims.custodyReason ?? AIP_CONSTANTS.COMPLIANCE.DEFAULT_CUSTODY_REASON;
            this._activateCustodyHold(user, normalizedClaims, score, reasonKey);
            return;
        }

        let passportState = PassportState.AUTHENTICATED;
        if (normalizedClaims.isKycVerified === true) passportState = PassportState.VALIDATED;
        else if (normalizedClaims.isKycPending === true) passportState = PassportState.KYC_PENDING;

        this._passport = {
            state: passportState,
            uid: user.uid,
            email: user.email ?? null,
            claims: normalizedClaims,
            integrityScore: score,
            custodyReason: null,
            verifiedAt: Date.now(),
            expiresAt: rawClaims.exp ? rawClaims.exp * 1000 : null
        };

        this._commit();
    },

    _handleUIActionRequest(detail) {
        const { action, credential } = detail;

        // ACCIÓN: Acceso Inversor (Directiva Turno 137)
        if (action === AIP_CONSTANTS.ACTIONS.INVESTOR_CTA) {
            this._processAuthentication(
                { uid: 'guest_investor', email: null },
                { role_investor: true, canAccessWorkspace: true }
            );
            this._requestOrbitTransition(AIP_CONSTANTS.ORBITS.INVESTOR, 'investor');
            return;
        }

        // ACCIÓN: Validación de Gate (Staff)
        if (action === AIP_CONSTANTS.ACTIONS.VALIDATE_GATE) {
            if (this._validateInstitutionalCredential(credential)) {
                this._processAuthentication(
                    { uid: 'staff_operator', email: null },
                    { role_staff: true, canAccessWorkspace: true }
                );
                // Staff siempre pasa por el flujo de validación de Bóveda
                this._requestOrbitTransition(AIP_CONSTANTS.ORBITS.WORKSPACE, 'staff');
            } else {
                this._activateCustodyHold(
                    { uid: 'unknown', email: null },
                    {},
                    0,
                    'gatekeeper.violation.invalid_credential'
                );
            }
        }
    },

    _validateInstitutionalCredential(input) {
        const secret = AIP_CONSTANTS.CREDENTIAL.VALID_KEY;
        if (!input || typeof input !== 'string') return false;
        return input.length === secret.length && [...input].every((ch, i) => ch === secret[i]);
    },

    _requestOrbitTransition(orbit, role) {
        // Emitir evento unificado de transición de órbita
        const eventName = role === 'investor' 
            ? AIP_CONSTANTS.EVENTS.INVESTOR_ACCESS_REQUESTED 
            : AIP_CONSTANTS.EVENTS.SCENE_REQUEST_ORBIT;

        document.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: {
                orbit,
                role,
                timestamp: Date.now()
            }
        }));
    },

    _normalizeClaims(rawClaims) {
        const normalized = {};
        for (const [key, value] of Object.entries(rawClaims)) {
            if (typeof value === 'boolean') normalized[key] = value;
        }
        return normalized;
    },

    _isCustodyActive(rawClaims, score) {
        return rawClaims.custodyActive === true || (score !== null && score < this._threshold);
    },

    _activateCustodyHold(user, claims, score, reasonI18nKey) {
        this._passport = {
            ...structuredClone(_EMPTY_PASSPORT),
            state: PassportState.CUSTODY_HOLD,
            uid: user.uid,
            claims,
            integrityScore: score,
            custodyReason: reasonI18nKey,
            verifiedAt: Date.now()
        };

        this._commit();

        document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.GATEKEEPER_VIOLATION, {
            bubbles: true,
            detail: { reason: reasonI18nKey, score, timestamp: Date.now() }
        }));
    },

    _commit() {
        Store.setState({
            auth: {
                user: {
                    uid: this._passport.uid,
                    email: this._passport.email,
                    role: this._passport.state
                },
                claims: this._passport.claims
            }
        });

        try {
            sessionStorage.setItem(_PASSPORT_KEY, JSON.stringify(this._passport));
        } catch (e) {
            console.error('[PASSPORT-ENGINE] Fallo en persistencia:', e);
        }

        document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.PASSPORT_UPDATED, {
            bubbles: true,
            detail: { ...this._passport }
        }));
    },

    _hydrateFromSession() {
        try {
            const serialized = sessionStorage.getItem(_PASSPORT_KEY);
            if (!serialized) return;

            const saved = JSON.parse(serialized);
            if (saved.expiresAt && Date.now() > saved.expiresAt) {
                this.clear();
                return;
            }

            this._passport = saved;
            Store.setState({
                auth: {
                    user: { uid: saved.uid, email: saved.email, role: saved.state },
                    claims: saved.claims
                }
            });
        } catch (e) {
            this.clear();
        }
    },

    clear() {
        this._passport = structuredClone(_EMPTY_PASSPORT);
        sessionStorage.removeItem(_PASSPORT_KEY);
        Store.setState({ auth: { user: null, claims: {} } });
        document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.PASSPORT_CLEARED));
    },

    getPassport() { return structuredClone(this._passport); },
    getState() { return this._passport.state; },
    States: PassportState
};