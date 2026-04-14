/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: passport-engine.js — Motor de Pasaportes de Identidad
 * VERSIÓN:   2.1.3 (Consolidación Sentinel R0 + Integridad Funcional)
 * DOCTRINA:  R0 (Agnosticismo) | D-10 (Namespace) | R5 (Soberanía)
 * ═══════════════════════════════════════════════════════════════════
 */

(async function (global) {
    'use strict';

    // R0: Importaciones dinámicas blindadas dentro del scope local
    const { Store } = await import('./store.js');
    const { AIP_CONSTANTS } = await import('../config/constants.js');
    const { saveLead } = await import('./firebase-connector.js');

    const _PRIVATE_SCOPE = {
        PASSPORT_KEY: AIP_CONSTANTS.CREDENTIAL.SESSION_KEY,
        DEFAULT_THRESHOLD: AIP_CONSTANTS.CREDENTIAL.INTEGRITY_MIN_SCORE,
        PassportState: Object.freeze({
            ANONYMOUS: 'ANONYMOUS',
            AUTHENTICATED: 'AUTHENTICATED',
            KYC_PENDING: 'KYC_PENDING',
            VALIDATED: 'VALIDATED',
            CUSTODY_HOLD: 'CUSTODY_HOLD'
        }),
        EMPTY_PASSPORT: Object.freeze({
            state: 'ANONYMOUS', uid: null, email: null, claims: {},
            integrityScore: null, custodyReason: null, verifiedAt: null, expiresAt: null
        })
    };

    let _passport = structuredClone(_PRIVATE_SCOPE.EMPTY_PASSPORT);
    let _threshold = _PRIVATE_SCOPE.DEFAULT_THRESHOLD;

    const PassportEngine = {
        init: function () {
            const config = Store.getState().project?.config;
            if (config?.complianceThreshold) _threshold = config.complianceThreshold;

            this._hydrateFromSession();

            // Track A: Motor de Autenticación
            document.addEventListener(AIP_CONSTANTS.EVENTS.AUTH_TOKEN_READY, (e) => {
                if (!e.detail) return;
                const { user, claims } = e.detail;
                if (user) this._processAuthentication(user, claims ?? {});
            });

            // Track B: Orquestación UI
            document.addEventListener(AIP_CONSTANTS.EVENTS.UI_ACTION_REQUESTED, (e) => {
                if (!e.detail) return;
                this._handleUIActionRequest(e.detail);
            });

            console.log('[PASSPORT-ENGINE] ✅ Motor de Pasaportes (v2.1.3) blindado e íntegro.');
        },

        _processAuthentication: function (user, rawClaims) {
            const normalizedClaims = this._normalizeClaims(rawClaims);
            const score = rawClaims.integrityScore ?? null;

            if (this._isCustodyActive(rawClaims, score)) {
                const reasonKey = rawClaims.custodyReason ?? AIP_CONSTANTS.CREDENTIAL.DEFAULT_CUSTODY_REASON;
                this._activateCustodyHold(user, normalizedClaims, score, reasonKey);
                return;
            }

            let passportState = _PRIVATE_SCOPE.PassportState.AUTHENTICATED;
            if (normalizedClaims.isKycVerified === true) passportState = _PRIVATE_SCOPE.PassportState.VALIDATED;
            else if (normalizedClaims.isKycPending === true) passportState = _PRIVATE_SCOPE.PassportState.KYC_PENDING;

            _passport = {
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

        _handleUIActionRequest: function (detail) {
            const { action, credential } = detail;

            if (action === AIP_CONSTANTS.ACTIONS.INVESTOR_CTA) {
                this._processAuthentication(
                    { uid: 'guest_investor', email: null },
                    { role_investor: true, canAccessWorkspace: true }
                );
                this._requestOrbitTransition(AIP_CONSTANTS.ORBITS.INVESTOR, 'investor');
                return;
            }

            if (action === AIP_CONSTANTS.ACTIONS.VALIDATE_GATE) {
                if (this._validateInstitutionalCredential(credential)) {
                    this._processAuthentication(
                        { uid: 'staff_operator', email: null },
                        { role_staff: true, canAccessWorkspace: true }
                    );
                    this._requestOrbitTransition(AIP_CONSTANTS.ORBITS.WORKSPACE, 'staff');
                } else {
                    this._activateCustodyHold(
                        { uid: 'unknown', email: null },
                        {}, 0, 'gatekeeper.violation.invalid_credential'
                    );
                }
            }

            if (action === AIP_CONSTANTS.ACTIONS.LEAD_SUBMIT) {
                Store.setState({ ui: { submissionStatus: 'loading' } });

                saveLead(credential).then((res) => {
                    const input = document.getElementById('investor-email-input');
                    if (input) input.value = '';

                    Store.setState({ ui: { submissionStatus: 'success' } });
                    document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.LEAD_SUBMISSION_RESULT, {
                        bubbles: true, cancelable: false,
                        detail: Object.freeze({ success: true, id: res.id })
                    }));
                }).catch(err => {
                    Store.setState({ ui: { submissionStatus: 'error' } });
                    document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.LEAD_SUBMISSION_RESULT, {
                        bubbles: true, cancelable: false,
                        detail: Object.freeze({ success: false, error: err.message })
                    }));
                });
            }
        },

        _validateInstitutionalCredential: function (input) {
            const secret = AIP_CONSTANTS.CREDENTIAL.VALID_KEY;
            if (!input || typeof input !== 'string') return false;
            return input.length === secret.length && [...input].every((ch, i) => ch === secret[i]);
        },

        _requestOrbitTransition: function (orbit, role) {
            const eventName = role === 'investor'
                ? AIP_CONSTANTS.EVENTS.INVESTOR_ACCESS_REQUESTED
                : AIP_CONSTANTS.EVENTS.SCENE_REQUEST_ORBIT;

            document.dispatchEvent(new CustomEvent(eventName, {
                bubbles: true, cancelable: false,
                detail: Object.freeze({ orbit, role, timestamp: Date.now() })
            }));
        },

        _normalizeClaims: function (rawClaims) {
            const normalized = {};
            for (const [key, value] of Object.entries(rawClaims)) {
                if (typeof value === 'boolean') normalized[key] = value;
            }
            return normalized;
        },

        _isCustodyActive: function (rawClaims, score) {
            return rawClaims.custodyActive === true || (score !== null && score < _threshold);
        },

        _activateCustodyHold: function (user, claims, score, reasonI18nKey) {
            _passport = {
                ...structuredClone(_PRIVATE_SCOPE.EMPTY_PASSPORT),
                state: _PRIVATE_SCOPE.PassportState.CUSTODY_HOLD,
                uid: user.uid,
                claims,
                integrityScore: score,
                custodyReason: reasonI18nKey,
                verifiedAt: Date.now()
            };

            this._commit();

            document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.GATEKEEPER_VIOLATION, {
                bubbles: true, cancelable: false,
                detail: Object.freeze({ reason: reasonI18nKey, score, timestamp: Date.now() })
            }));
        },

        _commit: function () {
            Store.setState({
                auth: {
                    user: { uid: _passport.uid, email: _passport.email, role: _passport.state },
                    claims: _passport.claims
                }
            });

            try {
                sessionStorage.setItem(_PRIVATE_SCOPE.PASSPORT_KEY, JSON.stringify(_passport));
            } catch (e) {
                console.error('[PASSPORT-ENGINE] Fallo en persistencia R5:', e);
            }

            document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.PASSPORT_UPDATED, {
                bubbles: true, cancelable: false,
                detail: Object.freeze({ ..._passport })
            }));
        },

        _hydrateFromSession: function () {
            try {
                const serialized = sessionStorage.getItem(_PRIVATE_SCOPE.PASSPORT_KEY);
                if (!serialized) return;

                const saved = JSON.parse(serialized);
                if (saved.expiresAt && Date.now() > saved.expiresAt) {
                    this.clear();
                    return;
                }

                _passport = saved;
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

        clear: function () {
            _passport = structuredClone(_PRIVATE_SCOPE.EMPTY_PASSPORT);
            sessionStorage.removeItem(_PRIVATE_SCOPE.PASSPORT_KEY);
            Store.setState({ auth: { user: null, claims: {} } });

            document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.PASSPORT_CLEARED, {
                bubbles: true, cancelable: false,
                detail: Object.freeze({})
            }));
        },

        getPassport: () => structuredClone(_passport),
        getState: () => _passport.state,
        States: _PRIVATE_SCOPE.PassportState
    };

    // R0: Inyección Canónica D-10
    if (!global.Skeleton) global.Skeleton = {};
    global.Skeleton.PassportEngine = Object.freeze(PassportEngine);

})(window);