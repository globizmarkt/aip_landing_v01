/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: firebase-connector.js — Enlace Asíncrono de Persistencia
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   1.1.0 (Auditoría Sentinel R5 Aprobada — Sutura Sistémica)
 * DOCTRINA:  R0 (Agnosticismo) | R5 (Soberanía Fiduciaria)
 * PROPÓSITO: Establecer el túnel hacia Firestore mediante Lazy Loading
 *            con validación estricta y sincronización de estado.
 * ═══════════════════════════════════════════════════════════════════
 */

import { initializeApp } from "firebase/app";
import { Store } from './store.js';
import { AIP_CONSTANTS } from '../config/constants.js';

// Inicialización diferida controlada (Sentinel Protocol)
const getFirebaseConfig = () => ({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
});

/**
 * Captura de leads con validación y metadatos automáticos.
 * @param {string} email 
 * @param {object} customData 
 */
export const saveLead = async (email, customData = {}) => {
    // 1. VALIDACIÓN ESTRICTA (Directiva Sentinel)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.error('[SENTINEL] Fallo de validación: Email inválido.');
        Store.setState({ ui: { submissionStatus: 'error' } });
        throw new Error("INVALID_EMAIL_FORMAT");
    }

    try {
        Store.setState({ ui: { submissionStatus: 'loading' } });

        // 2. CARGA PEREZOSA (Optimización LCP)
        const { getFirestore, collection, addDoc, serverTimestamp } = await import("firebase/firestore");

        const app = initializeApp(getFirebaseConfig());
        const db = getFirestore(app);
        const leadRef = collection(db, "leads");

        // 3. INYECCIÓN DE METADATOS (Sentinel R5)
        const docRef = await addDoc(leadRef, {
            email,
            ...customData,
            landing_version: 'v0.1',
            u_agent: navigator.userAgent,
            client_timestamp: new Date().toISOString(),
            server_timestamp: serverTimestamp(),
            integrityScore: 75,
            origin: 'VIBE-CPII-FACTORY'
        });

        // 4. SUTURA SQUEMA & NOTIFICACIÓN
        Store.setState({ ui: { submissionStatus: 'success' } });
        
        document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.LEAD_SUBMISSION_RESULT, {
            bubbles: true,
            detail: { success: true, id: docRef.id }
        }));

        console.log(`[FIREBASE-CONNECTOR] 🔒 Lead capturado. ID: ${docRef.id}`);
        return { success: true, id: docRef.id };

    } catch (error) {
        console.error("[SENTINEL ALERT] Fallo en persistencia:", error.code || error);
        Store.setState({ ui: { submissionStatus: 'error' } });
        
        document.dispatchEvent(new CustomEvent(AIP_CONSTANTS.EVENTS.LEAD_SUBMISSION_RESULT, {
            bubbles: true,
            detail: { success: false, error: error.message }
        }));
        
        throw new Error("DATA_PERSISTENCE_FAILURE");
    }
};