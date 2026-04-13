/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: store.js — Motor de Estado Global (Sincronizado)
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.1.0 (Ignition Ready — Sprint 3 Final)
 * DOCTRINA:  R0 (SSoT) | R5 (Soberanía del Dato)
 * DEPS:      Ninguna.
 * ───────────────────────────────────────────────────────────────────
 * PROPÓSITO: Centralizar el estado reactivo y despachar eventos al 
 * bus de sistema global (Skeleton:Store:Updated).
 * ═══════════════════════════════════════════════════════════════════
 */

export const Store = {

    _state: {
        auth: {
            user: null,    // { uid, email, role }
            claims: {},    // Hash plano O(1)
            authenticated: false
        },
        navigation: {
            orbit: 'ORBIT_LANDING',
            scene: 'LANDING',
            context: {}
        },
        project: {
            id: 'AIP-2026',
            config: {
                complianceThreshold: 60 // Hard gate institucional
            },
            lastSync: Date.now()
        },
        ui: {
            theme: 'dark',
            gateVisible: true
        }
    },

    _listeners: [],

    init() {
        console.log('[STORE] ✅ Motor de Estado v2.1.0 sincronizado para Ignición.');
    },

    getState() {
        return JSON.parse(JSON.stringify(this._state));
    },

    setState(newState) {
        // Shallow merge de primer nivel para mantener la reactividad
        this._state = {
            ...this._state,
            ...newState,
            // Aseguramos que los objetos anidados no se pierdan si se pasan incompletos
            auth: newState.auth ? { ...this._state.auth, ...newState.auth } : this._state.auth,
            navigation: newState.navigation ? { ...this._state.navigation, ...newState.navigation } : this._state.navigation
        };

        this._notify();
    },

    subscribe(listener) {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    },

    _notify() {
        const snapshot = this.getState();

        // 1. Notificar a suscriptores directos (Pub/Sub)
        this._listeners.forEach(listener => listener(snapshot));

        // 2. Despachar al Bus Global de Skeleton (Sincronía Sentinel)
        document.dispatchEvent(new CustomEvent('Skeleton:Store:Updated', {
            bubbles: true,
            detail: { state: snapshot, timestamp: Date.now() }
        }));
    }
};

// Sellado de integridad R5
// Object.freeze(Store);