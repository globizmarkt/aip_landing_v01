/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: core/referral-capture.js
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.0.0 (Modularized)
 * DOCTRINA:  R2 (Light DOM), Vanilla Zero-Deps
 * PROPÓSITO: Captura de parámetro ref=? y persistencia en sessionStorage
 * ═══════════════════════════════════════════════════════════════════
 */

const STORAGE_KEY = 'AIP_REFERRAL_NODE';
const URL_PARAM   = 'ref';

export const ReferralCapture = {

    /**
     * Inicialización: Captura referido desde URL
     * Ejecutar al arranque de aplicación (antes de cualquier escena)
     */
    init() {
        const urlParams = new URL(window.location.href).searchParams;
        const agentId   = urlParams.get(URL_PARAM);
        
        if (agentId && this._isValidAgentId(agentId)) {
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
            this._cleanUrlParam();
            
            return agentId;
        }
        
        // Si no hay en URL, verificar si ya existe en sessionStorage
        return this.get();
    },

    /**
     * Getter público para otros módulos
     */
    get() {
        return sessionStorage.getItem(STORAGE_KEY);
    },

    /**
     * Setter manual (para uso interno o testing)
     */
    set(agentId) {
        if (this._isValidAgentId(agentId)) {
            sessionStorage.setItem(STORAGE_KEY, agentId);
            return true;
        }
        return false;
    },

    clear() {
        sessionStorage.removeItem(STORAGE_KEY);
    },

    /* --- PRIVADOS --- */

    _isValidAgentId(id) {
        // Alfanumérico, guiones, underscores. Longitud 3-32.
        return /^[a-zA-Z0-9_-]{3,32}$/.test(id);
    },

    _cleanUrlParam() {
        if (window.history && window.history.replaceState) {
            const url = new URL(window.location.href);
            url.searchParams.delete(URL_PARAM);
            window.history.replaceState({}, document.title, url.toString());
        }
    }
};