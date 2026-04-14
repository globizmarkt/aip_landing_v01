/**
 * 🛡️ CARTOGRAFÍA QUIRÚRGICA v3.1
 * ------------------------------------------------------------------
 * ARCHIVO:    src/core/auth-manager.js
 * VERSIÓN:    5.1.0 (Super-Blend Edition)
 * FECHA:      2026-01-07
 * AUTOR:      Gemini 3 Pro (Integrador de Agentes Aurex/Nexus/Lux)
 * PROPÓSITO:  Gestor de Identidad Singleton con persistencia en Firestore
 * y protocolo de limpieza profunda (Nuke) para demos.
 * ------------------------------------------------------------------
 */

/* [SEC-01] IMPORTACIONES & DEPENDENCIAS */
import { Store } from './store.js'; 
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

import { auth, db } from './firebase.js';
import { globalBus } from './event-bus.js';

/* [SEC-02] DEFINICIÓN DE CLASE SINGLETON */
class AuthManager {
    constructor() {
        // Enforce Singleton Pattern
        if (AuthManager._instance) {
            return AuthManager._instance;
        }

        // Estado Interno
        this.currentUser = null;
        this.userProfile = null; // Perfil extendido de Firestore

        // Configuración Provider
        this.provider = new GoogleAuthProvider();
        this.provider.setCustomParameters({
            prompt: 'select_account' // Fuerza el selector de cuentas siempre
        });

        // Inicialización
        this._initAuthListener();

        AuthManager._instance = this;
        console.log('🛡️ AuthManager v5.1: Initialized & Ready');
    }

    /* [SEC-03] OBSERVADORES DE ESTADO (LISTENER) */
    /**
     * Única fuente de verdad para el estado de la sesión.
     * Gestiona la reactividad entre pestañas y recargas.
     */
    _initAuthListener() {
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // ✅ LA SUTURA: Ahora firebaseUser es real y detectable
                this.currentUser = this._normalizeUser(firebaseUser);
                Store.setUser(this.currentUser);

                // B. Sincronización con Base de Datos (Auto-aprobación)
                await this._ensureUserProfile(firebaseUser);

                // C. Emisión de Evento Global
                globalBus.emit('AUTH_LOGIN', {
                    user: this.currentUser,
                    profile: this.userProfile,
                    source: 'AUTH_STATE_RESTORE'
                });
            } else {
                // D. Usuario Desconectado
                this.currentUser = null;
                this.userProfile = null;
                globalBus.emit('AUTH_LOGOUT');
            }
        });
    }

    /* [SEC-04] LÓGICA DE DATOS & NORMALIZACIÓN */
    /**
     * Crea una estructura de usuario limpia, desacoplada de Firebase.
     */
    _normalizeUser(user) {
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            providerId: user.providerData?.[0]?.providerId || 'unknown',
            status: 'ACTIVE' // Hardcoded para Fase Seed (Todos entran)
        };
    }

    /**
     * Asegura que el usuario exista en Firestore.
     * Implementa la lógica de "Auto-aprobación".
     */
    async _ensureUserProfile(firebaseUser) {
        try {
            const userRef = doc(db, 'users', firebaseUser.uid);

            // Operación Atómica: Crea o Actualiza (Merge)
            // Esto evita lecturas innecesarias y garantiza el timestamp
            await setDoc(userRef, {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: 'user',           // Rol por defecto
                status: 'ACTIVE',       // Auto-aprobación
                lastLoginAt: serverTimestamp()
            }, { merge: true });

            // Hidratación del perfil en memoria
            const snap = await getDoc(userRef);
            this.userProfile = snap.data();

        } catch (error) {
            console.warn('⚠️ Profile Sync Warning (Offline/Permisos):', error);
            // Fallback robusto en memoria para no romper la UX
            this.userProfile = { status: 'ACTIVE', role: 'user', fallback: true };
        }
    }

    /* [SEC-05] ACCIONES PÚBLICAS (LOGIN / LOGOUT) */
    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, this.provider);
            // Nota: No emitimos evento aquí manualmente, el Listener (_initAuthListener)
            // lo hará automáticamente al detectar el cambio de estado.
            return { success: true, user: this._normalizeUser(result.user) };
        } catch (error) {
            const code = error?.code || 'auth/unknown';

            // Manejo de cancelación voluntaria
            if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
                console.warn('Login flow cancelled by user');
                return { success: false, reason: 'cancelled' };
            }

            console.error('Login Critical Error:', error);
            return { success: false, reason: 'error', message: error.message };
        }
    }

    async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error('Logout Error:', error);
            return { success: false, error };
        }
    }

    /* [SEC-06] PROTOCOLO INFINITY RESET (NUKE) */
    /**
     * Limpieza profunda de 5 capas.
     * Garantiza una experiencia "Tabula Rasa" para demos.
     */
    async nuke() {
        console.warn('☢️ NUKE PROTOCOL INITIATED: DEEP CLEANING...');

        // CAPA 1: Inalidación de Token (Server Side)
        try { await signOut(auth); } catch (e) { /* Non-blocking */ }

        // CAPA 2: Almacenamiento Local (Client State)
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) { console.warn('Storage clear warning'); }

        // CAPA 3: IndexedDB (Firestore Offline Cache)
        // CRÍTICO: Evita "fantasmas" de datos anteriores
        try {
            if ('databases' in indexedDB) {
                const dbs = await indexedDB.databases();
                dbs.forEach(db => indexedDB.deleteDatabase(db.name));
            }
        } catch (e) {
            console.warn('IndexedDB clear warning (Browser compatibility)');
        }

        // CAPA 4: Service Worker Caches (PWA Assets)
        try {
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(key => caches.delete(key)));
            }
        } catch (e) { /* Non-blocking */ }

        // CAPA 5: Recarga Forzada con Cache Busting
        // Usamos location.replace para destruir el historial de navegación
        globalBus.emit('AUTH_NUKE'); // Aviso final

        setTimeout(() => {
            const cleanUrl = window.location.href.split('?')[0];
            window.location.replace(`${cleanUrl}?reset=${Date.now()}`);
        }, 100);
    }

    /* [SEC-07] HELPERS & EXPORT */
    isAuthenticated() { return !!this.currentUser; }
    getUser() { return this.currentUser; }
    getProfile() { return this.userProfile; }
}

// Exportación de Instancia Única (Singleton)
export const Auth = new AuthManager();
