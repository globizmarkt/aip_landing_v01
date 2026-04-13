/**
 * 🛡️ PASSPORT-ENGINE | UNIVERSAL ACCESS CORE
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO:    core/passport-engine.universal.js
 * VERSIÓN:    2.0.0 (Skeleton Agnostic)
 * FECHA:      2026-03-18
 * DOCTRINA:   Agnosticismo Total | R2 Light DOM | R4 i18n
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    const DEFAULT_CONFIG = {
        tiers: ['FREE', 'PRO', 'INSTITUTIONAL', 'OWNER'],
        statuses: ['ACTIVE', 'SUSPENDED', 'PENDING', 'REVOKED'],
        defaultTier: 'FREE',
        defaultStatus: 'PENDING',
        sessionSource: () => window.Skeleton?.session || null
    };

    class PassportEngine {
        constructor(config = {}) {
            this.config = Object.assign({}, DEFAULT_CONFIG, config);
        }

        generatePassport(userData = {}) {
            const session = this._resolveSession(userData);

            if (!session || !session.uid) {
                return this._createNullPassport();
            }

            const mochila = {
                uid: session.uid,
                tier: this._resolveTier(session),
                integrity_score: this._calculateIntegrity(session),
                status: this._resolveStatus(session),
                claims: session.claims || {},
                issued_at: Date.now(),
                expires_at: this._calculateExpiry(session),
                _immutable: true
            };

            return Object.freeze(mochila);
        }

        verify(requirementString, passport) {
            if (!passport || passport._immutable !== true) {
                return { granted: false, reason: 'INVALID_PASSPORT' };
            }

            if (passport.status !== 'ACTIVE') {
                return {
                    granted: false,
                    reason: 'STATUS_BLOCKED',
                    current_status: passport.status
                };
            }

            const parser = this._parseRequirement(requirementString);
            const evaluation = parser(passport);

            return {
                granted: evaluation.passed,
                reason: evaluation.passed ? 'GRANTED' : 'REQUIREMENT_FAILED',
                failed_checks: evaluation.failed || [],
                tier_sufficient: this._compareTiers(passport.tier, requirementString)
            };
        }

        _resolveSession(userData) {
            if (Object.keys(userData).length > 0) return userData;
            const source = this.config.sessionSource;
            return typeof source === 'function' ? source() : source;
        }

        _resolveTier(session) {
            const requested = session.tier || session.subscription || session.level;
            if (this.config.tiers.includes(requested)) return requested;
            return this.config.defaultTier;
        }

        _resolveStatus(session) {
            const requested = session.status || session.kyc_status || session.state;
            if (this.config.statuses.includes(requested)) return requested;
            return this.config.defaultStatus;
        }

        _calculateIntegrity(session) {
            const validations = [];
            let score = 0;

            if (session.email_verified) {
                validations.push('EMAIL_VERIFIED');
                score += 20;
            }
            if (session.identity_verified) {
                validations.push('IDENTITY_VERIFIED');
                score += 30;
            }
            if (session.payment_method_valid) {
                validations.push('PAYMENT_VALID');
                score += 20;
            }
            if (session.two_factor_enabled) {
                validations.push('2FA_ENABLED');
                score += 15;
            }
            if (session.manual_review_passed) {
                validations.push('MANUAL_REVIEW');
                score += 15;
            }

            return {
                score: Math.min(score, 100),
                validations: validations,
                threshold_met: score >= 60
            };
        }

        _calculateExpiry(session) {
            const duration = session.session_duration || 86400000;
            return Date.now() + duration;
        }

        _createNullPassport() {
            return Object.freeze({
                uid: null,
                tier: 'NONE',
                integrity_score: { score: 0, validations: [], threshold_met: false },
                status: 'REVOKED',
                claims: {},
                issued_at: null,
                expires_at: null,
                _immutable: true
            });
        }

        _parseRequirement(reqString) {
            if (!reqString || reqString === 'none') {
                return () => ({ passed: true, failed: [] });
            }

            const conditions = reqString.split(',').map(c => c.trim()).filter(Boolean);

            return (passport) => {
                const failed = [];

                for (const condition of conditions) {
                    if (!this._evaluateCondition(condition, passport)) {
                        failed.push(condition);
                    }
                }

                return {
                    passed: failed.length === 0,
                    failed: failed
                };
            };
        }

        _evaluateCondition(condition, passport) {
            if (condition.includes(':')) {
                const [key, value] = condition.split(':').map(s => s.trim());
                return this._checkClaim(passport.claims, key, value);
            }

            if (condition.startsWith('tier>=')) {
                const required = condition.replace('tier>=', '');
                return this._compareTiers(passport.tier, required) >= 0;
            }

            if (condition.startsWith('score>=')) {
                const min = parseInt(condition.replace('score>=', ''));
                return passport.integrity_score.score >= min;
            }

            return true;
        }

        _checkClaim(claims, key, expected) {
            const actual = this._getNestedValue(claims, key);
            if (actual === undefined) return false;

            const numExpected = parseFloat(expected);
            const numActual = parseFloat(actual);

            if (!isNaN(numExpected) && !isNaN(numActual)) {
                return numActual >= numExpected;
            }

            return String(actual) === String(expected);
        }

        _getNestedValue(obj, path) {
            return path.split('.').reduce((current, key) => {
                return current && current[key] !== undefined ? current[key] : undefined;
            }, obj);
        }

        _compareTiers(current, required) {
            const currentIdx = this.config.tiers.indexOf(current);
            const requiredIdx = this.config.tiers.indexOf(required);

            if (currentIdx === -1 || requiredIdx === -1) return -1;
            return currentIdx - requiredIdx;
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { PassportEngine };
    } else {
        window.Skeleton = window.Skeleton || {};
        window.Skeleton.PassportEngine = PassportEngine;
    }
})();