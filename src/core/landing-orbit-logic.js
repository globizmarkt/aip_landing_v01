/**
 * 🌐 LANDING ORBIT LOGIC — AIP-FIED CLONE (v1.0.0)
 * ============================================================
 * Archivo:      02_auditoria/indexacion de planos CPII 2026-04-14/landing-orbit-logic.js
 * ============================================================
 * DOCTRINAS:    [R0] Agnosticismo | [R2] Light DOM | [R5] APP_PREFIX
 * SENTINEL R0:  Wrapper IIFE + _PRIVATE_SCOPE + Object.freeze
 * ============================================================
 */

(function(global) {
    'use strict';

    const _PRIVATE_SCOPE = {
        APP_PREFIX: 'AIP_LANDING_V0_'
    };

    const LandingOrbitLogic = {
        captureReferralFromUrl: function() {
            try {
                const urlParams = new URLSearchParams(global.location.search);
                const ref = urlParams.get('ref');

                if (ref && ref.trim()) {
                    const normalized = ref.toLowerCase().trim();
                    global.localStorage.setItem(`${_PRIVATE_SCOPE.APP_PREFIX}REF`, normalized);

                    document.dispatchEvent(new CustomEvent('Skeleton:Referral:Captured', {
                        detail: Object.freeze({ ref: normalized, source: 'url_param' }),
                        bubbles: true
                    }));
                }
            } catch (e) {
                console.warn('[LandingOrbit] Referral capture falló:', e.message);
            }
        },

        preselectProfileType: function() {
            try {
                const urlParams = new URLSearchParams(global.location.search);
                const tipo = (urlParams.get('tipo') || '').toLowerCase();
                if (!tipo) return;

                let targetId = null;
                if (tipo === 'inversor') targetId = 'profile-inversor';
                else if (tipo === 'promotor' || tipo === 'gestor') targetId = 'profile-promotor';

                if (targetId) {
                    const radio = document.getElementById(targetId);
                    if (radio) {
                        radio.checked = true;
                        document.dispatchEvent(new CustomEvent('Skeleton:Landing:ProfilePreselected', {
                            detail: Object.freeze({ tipo, targetId }),
                            bubbles: true
                        }));
                    }
                }
            } catch (e) {
                console.warn('[LandingOrbit] Profile preselect falló:', e.message);
            }
        },

        initOrbit2ScrollHydration: function() {
            const sections = document.querySelectorAll('[data-orbit2-section]');
            if (!sections.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('sk-orbit2--visible');
                        observer.unobserve(entry.target);

                        document.dispatchEvent(new CustomEvent('Skeleton:Orbit2:SectionVisible', {
                            detail: Object.freeze({
                                id: entry.target.id || entry.target.dataset.orbit2Section,
                                timestamp: Date.now()
                            }),
                            bubbles: true
                        }));
                    }
                });
            }, { threshold: 0.15 });

            sections.forEach(section => observer.observe(section));
        },

        initStickyHeader: function() {
            const header = document.querySelector('[data-sk-header]');
            if (!header) return;

            let ticking = false;
            global.addEventListener('scroll', () => {
                if (!ticking) {
                    global.requestAnimationFrame(() => {
                        if (global.scrollY > 10) header.classList.add('sk-header--scrolled');
                        else header.classList.remove('sk-header--scrolled');
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        },

        enrichCtaLinks: function() {
            try {
                const ref = global.localStorage.getItem(`${_PRIVATE_SCOPE.APP_PREFIX}REF`);
                if (!ref) return;

                const ctaLinks = document.querySelectorAll('[data-cta-access]');
                ctaLinks.forEach(link => {
                    const url = new URL(link.href, global.location.origin);
                    if (!url.searchParams.has('ref')) {
                        url.searchParams.set('ref', ref);
                        link.href = url.toString();
                    }
                });
            } catch (e) {
                console.warn('[LandingOrbit] CTA enrichment falló:', e.message);
            }
        },

        init: function() {
            this.captureReferralFromUrl();
            this.preselectProfileType();
            this.initOrbit2ScrollHydration();
            this.initStickyHeader();
            this.enrichCtaLinks();

            document.dispatchEvent(new CustomEvent('Skeleton:Orbit2:Ready', {
                detail: Object.freeze({ version: '1.0.0-AIP', timestamp: Date.now() }),
                bubbles: true
            }));
        }
    };

    if (!global.Skeleton) global.Skeleton = {};
    global.Skeleton.LandingOrbitLogic = Object.freeze(LandingOrbitLogic);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => global.Skeleton.LandingOrbitLogic.init());
    } else {
        global.Skeleton.LandingOrbitLogic.init();
    }

})(window);
