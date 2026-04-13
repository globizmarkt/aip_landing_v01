/**
 * @file jurisdiction-router.js
 * @role DOM & Logic Engineer — OPORD-12
 * @doctrine R2 (Light DOM), R4 (i18n Strict), Vanilla Zero-Deps
 * @description Motor de enrutamiento jurisdiccional con persistencia de cookie
 * @event Skeleton:Navigation:JurisdictionConfirmed
 * @event Skeleton:Navigation:RedirectToFallback
 */

(function() {
    'use strict';
    
    const COOKIE_NAME = 'skeleton_jurisdiction_visited';
    const COOKIE_MAX_AGE = 31536000; // 1 año en segundos
    const FALLBACK_URL = '/restricted.html';
    const VALID_JURISDICTIONS = ['UK', 'CH', 'EU', 'Americas-QP'];
    
    // Namespace canónico
    const NS = window.Skeleton || (window.Skeleton = {});
    
    /**
     * Utilidad: Setear cookie con SameSite=Lax
     */
    function setJurisdictionCookie() {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = `${COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }
    
    /**
     * Utilidad: Leer cookie por nombre
     */
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }
    
    /**
     * Inicialización del Router Jurisdiccional
     * Llamar desde main.js al cargar la escena JURISDICTION
     */
    function initJurisdictionRouter() {
        // Caso 1: Cookie existe → Navegar directo al Hero
        if (getCookie(COOKIE_NAME)) {
            document.dispatchEvent(new CustomEvent('Skeleton:Navigation:Request', {
                detail: { target: 'LANDING', reason: 'jurisdiction_cookie_present' }
            }));
            return;
        }
        
        // Caso 2: Esperar interacción del usuario
        const confirmBtn = document.querySelector('[data-action="confirm-residence"]');
        if (!confirmBtn) {
            console.warn('[JurisdictionRouter] Botón confirm-residence no encontrado');
            return;
        }
        
        confirmBtn.addEventListener('click', handleJurisdictionConfirm);
    }
    
    /**
     * Handler de confirmación de jurisdicción
     */
    function handleJurisdictionConfirm(event) {
        // Leer selección desde atributo data o input asociado
        const jurisdictionSelect = document.querySelector('[data-jurisdiction-select]');
        const selectedJurisdiction = jurisdictionSelect ? jurisdictionSelect.value : null;
        
        // Fallback: buscar en botón si tiene data-jurisdiction
        const jurisdiction = selectedJurisdiction || event.target.dataset.jurisdiction;
        
        if (!jurisdiction) {
            console.error('[JurisdictionRouter] No se detectó jurisdicción seleccionada');
            return;
        }
        
        if (VALID_JURISDICTIONS.includes(jurisdiction)) {
            // Jurisdicción válida: setear cookie y navegar
            setJurisdictionCookie();
            
            document.dispatchEvent(new CustomEvent('Skeleton:Navigation:JurisdictionConfirmed', {
                detail: { 
                    jurisdiction: jurisdiction,
                    timestamp: Date.now(),
                    nextScene: 'LANDING'
                }
            }));
            
        } else {
            // Jurisdicción inválida: redirigir a fallback
            document.dispatchEvent(new CustomEvent('Skeleton:Navigation:RedirectToFallback', {
                detail: { 
                    jurisdiction: jurisdiction,
                    fallbackUrl: FALLBACK_URL,
                    reason: 'unsupported_jurisdiction'
                }
            }));
            
            // Redirección física después del evento
            window.location.href = FALLBACK_URL;
        }
    }
    
    // Exposición pública
    NS.JurisdictionRouter = {
        init: initJurisdictionRouter,
        isVisited: () => !!getCookie(COOKIE_NAME),
        clearCookie: () => {
            document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    };
    
})();