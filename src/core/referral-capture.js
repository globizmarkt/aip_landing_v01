/**
 * @file referral-capture.js
 * @role DOM & Logic Engineer — OPORD-12
 * @doctrine R2 (Light DOM), Vanilla Zero-Deps
 * @description Captura de parámetro ref=? y persistencia en sessionStorage
 * @key AIP_REFERRAL_NODE (sessionStorage)
 */

(function() {
    'use strict';
    
    const STORAGE_KEY = 'AIP_REFERRAL_NODE';
    const URL_PARAM = 'ref';
    
    const NS = window.Skeleton || (window.Skeleton = {});
    
    /**
     * Inicialización: Captura referido desde URL
     * Ejecutar al arranque de aplicación (antes de cualquier escena)
     */
    function initReferralCapture() {
        const urlParams = new URLSearchParams(window.location.search);
        const agentId = urlParams.get(URL_PARAM);
        
        if (agentId && isValidAgentId(agentId)) {
            // Persistir en sessionStorage
            sessionStorage.setItem(STORAGE_KEY, agentId);
            
            // Emitir evento para otros módulos
            document.dispatchEvent(new CustomEvent('Skeleton:Referral:Captured', {
                detail: { 
                    agentId: agentId,
                    source: 'url_param',
                    timestamp: Date.now()
                }
            }));
            
            // Opcional: Limpiar URL de parámetro (sin recargar)
            cleanUrlParam();
            
            return agentId;
        }
        
        // Si no hay en URL, verificar si ya existe en sessionStorage
        return sessionStorage.getItem(STORAGE_KEY);
    }
    
    /**
     * Validación básica de formato agent_id
     */
    function isValidAgentId(id) {
        // Alfanumérico, guiones, underscores. Longitud 3-32.
        return /^[a-zA-Z0-9_-]{3,32}$/.test(id);
    }
    
    /**
     * Limpiar parámetro ref de URL sin recargar
     */
    function cleanUrlParam() {
        if (window.history && window.history.replaceState) {
            const url = new URL(window.location.href);
            url.searchParams.delete(URL_PARAM);
            window.history.replaceState({}, document.title, url.toString());
        }
    }
    
    /**
     * Getter público para otros módulos
     */
    function getReferralNode() {
        return sessionStorage.getItem(STORAGE_KEY);
    }
    
    /**
     * Setter manual (para uso interno o testing)
     */
    function setReferralNode(agentId) {
        if (isValidAgentId(agentId)) {
            sessionStorage.setItem(STORAGE_KEY, agentId);
            return true;
        }
        return false;
    }
    
    // Exposición pública
    NS.ReferralCapture = {
        init: initReferralCapture,
        get: getReferralNode,
        set: setReferralNode,
        clear: () => sessionStorage.removeItem(STORAGE_KEY)
    };
    
})();