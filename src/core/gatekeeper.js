/**
 * 🛡️ GATEKEEPER | UNIVERSAL ACCESS CORE
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO:    core/gatekeeper.universal.js
 * VERSIÓN:    2.0.0 (Skeleton Agnostic)
 * FECHA:      2026-03-18
 * DOCTRINA:   Agnosticismo Total | Event-Driven | Zero-UI
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    const DEFAULT_RULES = {
        '*': 'tier>=FREE'
    };

    const EVENT_NAMESPACE = 'Skeleton:Gatekeeper';

    class UniversalGatekeeper {
        constructor(passportEngine, ruleMap = {}) {
            if (!passportEngine || typeof passportEngine.generatePassport !== 'function') {
                throw new Error('UniversalGatekeeper requires valid PassportEngine instance');
            }
            this.engine = passportEngine;
            this.rules = Object.assign({}, DEFAULT_RULES, ruleMap);
        }

        requestAccess(resourceId, userData = null) {
            const passport = userData
                ? this.engine.generatePassport(userData)
                : this.engine.generatePassport();

            const rule = this.rules[resourceId] || this.rules['*'] || 'none';
            const verification = this.engine.verify(rule, passport);

            const decision = this._buildDecision(resourceId, passport, verification, rule);

            this._dispatch(decision.event, decision.payload);

            return decision;
        }

        _buildDecision(resourceId, passport, verification, rule) {
            if (!verification.granted) {
                if (this._isTierInsufficient(verification, rule)) {
                    return {
                        event: 'UpgradeRequired',
                        payload: {
                            resource: resourceId,
                            passport: passport,
                            reason: 'TIER_INSUFFICIENT',
                            required: this._extractTierRequirement(rule),
                            current: passport.tier,
                            rule: rule
                        }
                    };
                }

                return {
                    event: 'Denied',
                    payload: {
                        resource: resourceId,
                        passport: passport,
                        reason: verification.reason || 'REQUIREMENT_FAILED',
                        failed_checks: verification.failed_checks || [],
                        rule: rule
                    }
                };
            }

            return {
                event: 'Granted',
                payload: {
                    resource: resourceId,
                    passport: passport,
                    reason: 'VERIFICATION_PASSED',
                    rule: rule
                }
            };
        }

        _isTierInsufficient(verification, rule) {
            if (!verification.failed_checks) return false;
            return verification.failed_checks.some(check =>
                check.startsWith('tier>=') && !verification.tier_sufficient
            );
        }

        _extractTierRequirement(rule) {
            const match = rule.match(/tier>=([A-Z_]+)/);
            return match ? match[1] : null;
        }

        _dispatch(eventName, payload) {
            const fullEventName = `${EVENT_NAMESPACE}:${eventName}`;
            const event = new CustomEvent(fullEventName, {
                detail: {
                    ...payload,
                    timestamp: Date.now(),
                    source: 'UniversalGatekeeper'
                },
                bubbles: true,
                cancelable: false
            });
            window.dispatchEvent(event);
        }

        updateRules(newRules) {
            this.rules = Object.assign({}, this.rules, newRules);
        }

        getRule(resourceId) {
            return this.rules[resourceId] || this.rules['*'] || null;
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { UniversalGatekeeper };
    } else {
        window.Skeleton = window.Skeleton || {};
        window.Skeleton.UniversalGatekeeper = UniversalGatekeeper;
    }
})();