/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: store.js — Motor de Estado Global (Vanilla)
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.0.0 (Sovereign Core — OPORD-P-06)
 * DOCTRINA:  R0 (Single Source of Truth) | R3 (Zero-Hex)
 * DEPS:      Ninguna.
 * ───────────────────────────────────────────────────────────────────
 * PROPÓSITO: Centralizar el estado reactivo del sistema Skeleton.
 *            Implementa un patrón Pub/Sub para que los componentes
 *            se suscriban a cambios en parcelas específicas.
 * REGLAS:    - Prohibido mutar el estado directamente (usar setState).
 *            - Solo el PassportEngine puede escribir en 'auth'.
 *            - Solo el SceneManager puede escribir en 'navigation'.
 * ═══════════════════════════════════════════════════════════════════
 */

export const Store = {
    
    _state: {
        auth: {
            user: null,    // { uid, email, role }
            claims: {}     // Hash plano O(1)
        },
        navigation: {
            orbit: 'LANDING',
            scene: 'LANDING',
            context: {}
        },
        project: {
            config: {},
            lastSync: null
        }
    },

    _listeners: [],

    /**
     * Inicializa el Store (Placeholder para inyección de configuraciones)
     */
    init() {
        console.log('[STORE] ✅ Motor de Estado inicializado.');
    },

    /**
     * Retorna un snapshot inmutable del estado actual
     */
    getState() {
        return JSON.parse(JSON.stringify(this._state));
    },

    /**
     * Actualiza el estado mediante un merge profundo (Shallow merge en primer nivel)
     */
    setState(newState) {
        this._state = {
            ...this._state,
            ...newState
        };

        this._notify();
    },

    /**
     * Suscribirse a cambios en el Store
     * @param {Function} listener 
     */
    subscribe(listener) {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    },

    _notify() {
        const snapshot = this.getState();
        this._listeners.forEach(listener => listener(snapshot));
    }
};
