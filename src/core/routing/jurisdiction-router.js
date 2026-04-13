/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: core/routing/jurisdiction-router.js
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.0.0 (Modularized)
 * DOCTRINA:  R2 (Light DOM), R4 (i18n Strict), Vanilla Zero-Deps
 * PROPÓSITO: Motor de enrutamiento jurisdiccional con persistencia
 * ═══════════════════════════════════════════════════════════════════
 */

const COOKIE_NAME      = 'skeleton_jurisdiction_visited';
const FALLBACK_URL     = '/restricted.html';
const VALID_JURISDICTIONS = ['UK', 'CH', 'EU', 'Americas-QP'];

export const JurisdictionRouter = {

    /**
     * Inicialización del Router Jurisdiccional
     * Llamar desde main.js al cargar la escena JURISDICTION
     */
    init() {
        // Caso 1: Cookie existe → Navegar directo al Hero (LANDING)
        if (this.isVisited()) {
            document.dispatchEvent(new CustomEvent('Skeleton:Navigation:Request', {
                detail: { target: 'LANDING', reason: 'jurisdiction_cookie_present' }
            }));
            return;
        }
        
        // Caso 2: Esperar interacción del usuario (Light DOM Selector)
        const confirmBtn = document.querySelector('[data-action="confirm-residence"]');
        if (!confirmBtn) {
            console.warn('[JurisdictionRouter] Botón confirm-residence no encontrado');
            return;
        }
        
        // Usar arrow function para mantener el contexto o bind
        confirmBtn.addEventListener('click', (e) => this._handleJurisdictionConfirm(e));
    },

    isVisited() {
        return !!this._getCookie(COOKIE_NAME);
    },

    clearCookie() {
        document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    },

    /* --- PRIVADOS --- */

    _handleJurisdictionConfirm(event) {
        const jurisdictionSelect = document.querySelector('[data-jurisdiction-select]');
        const selectedJurisdiction = jurisdictionSelect ? jurisdictionSelect.value : null;
        const jurisdiction = selectedJurisdiction || event.target.dataset.jurisdiction;
        
        if (!jurisdiction) {
            console.error('[JurisdictionRouter] No se detectó jurisdicción seleccionada');
            return;
        }
        
        if (VALID_JURISDICTIONS.includes(jurisdiction)) {
            this._setJurisdictionCookie();
            
            document.dispatchEvent(new CustomEvent('Skeleton:Navigation:JurisdictionConfirmed', {
                detail: { 
                    jurisdiction: jurisdiction,
                    timestamp: Date.now(),
                    nextScene: 'LANDING'
                }
            }));
            
        } else {
            document.dispatchEvent(new CustomEvent('Skeleton:Navigation:RedirectToFallback', {
                detail: { 
                    jurisdiction: jurisdiction,
                    fallbackUrl: FALLBACK_URL,
                    reason: 'unsupported_jurisdiction'
                }
            }));
            
            // Redirección física de seguridad
            window.location.href = FALLBACK_URL;
        }
    },

    _setJurisdictionCookie() {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = `${COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    },

    _getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }
};