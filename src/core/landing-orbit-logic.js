/**
 * 🌐 LANDING ORBIT LOGIC — AIP-FIED CLONE (v1.1.0)
 * ============================================================
 * Archivo:      src/core/landing-orbit-logic.js
 * ============================================================
 * DOCTRINAS:    [R0] Agnosticismo | [R5] SSoT
 * STATUS:       ESM Native | Sentinel Approved
 * ============================================================
 */

'use strict';

const _PRIVATE_SCOPE = {
    APP_PREFIX: 'AIP_LANDING_V0_'
};

export const LandingOrbitLogic = Object.freeze({
    captureReferralFromUrl: function () {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const ref = urlParams.get('ref');

            if (ref && ref.trim()) {
                const normalized = ref.toLowerCase().trim();
                window.localStorage.setItem(`${_PRIVATE_SCOPE.APP_PREFIX}REF`, normalized);

                document.dispatchEvent(new CustomEvent('Skeleton:Referral:Captured', {
                    detail: Object.freeze({ ref: normalized, source: 'url_param' }),
                    bubbles: true
                }));
            }
        } catch (e) {
            console.warn('[LandingOrbit] Referral capture falló:', e.message);
        }
    },

    preselectProfileType: function () {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const type = urlParams.get('type');
            if (type) {
                window.localStorage.setItem(`${_PRIVATE_SCOPE.APP_PREFIX}PROFILE_PRESELECT`, type);
            }
        } catch (e) {
            console.warn('[LandingOrbit] Profile preselect falló');
        }
    },

    initOrbit2ScrollHydration: function () {
        // Lógica de lazy-loading para el Canvas de Noticias
        console.info('[LandingOrbit] Órbita 2 configurada para scroll dinámico.');
    },

    initStickyHeader: function () {
        const header = document.querySelector('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('glass-active');
            } else {
                header.classList.remove('glass-active');
            }
        });
    },

    enrichCtaLinks: function () {
        try {
            const ref = window.localStorage.getItem(`${_PRIVATE_SCOPE.APP_PREFIX}REF`);
            if (!ref) return;

            const ctaLinks = document.querySelectorAll('[data-cta-access]');
            ctaLinks.forEach(link => {
                const url = new URL(link.href, window.location.origin);
                if (!url.searchParams.has('ref')) {
                    url.searchParams.set('ref', ref);
                    link.href = url.toString();
                }
            });
        } catch (e) {
            console.warn('[LandingOrbit] CTA enrichment falló:', e.message);
        }
    },

    init: function () {
        this.captureReferralFromUrl();
        this.preselectProfileType();
        this.initOrbit2ScrollHydration();
        this.initStickyHeader();
        this.enrichCtaLinks();

        document.dispatchEvent(new CustomEvent('Skeleton:Orbit2:Ready', {
            detail: Object.freeze({ version: '1.1.0-AIP', timestamp: Date.now() }),
            bubbles: true
        }));

        console.log('[LANDING-ORBIT-LOGIC] ✅ Órbita 2 Inicializada.');
    }
});