/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: core/firebase.js
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.0.0 (AIP_landing Placeholder)
 * DOCTRINA:  R0 (Agnosticismo Radical)
 * PROPÓSITO: Singleton de conexión. Los datos reales se inyectan en
 *            el Sprint 3 (DT-LND-02).
 * ═══════════════════════════════════════════════════════════════════
 */

/* [SEC-01] IMPORTACIONES OFICIALES (v10.7.1) */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* [SEC-02] ESTRUCTURA DE CREDENCIALES (A rellenar en Sprint 3)
 * @track A - Structural
 * @task DT-LND-02
 */
const firebaseConfig = {
    apiKey:             "AIzaSy-PLACEHOLDER-AIP-LANDING-V0",
    authDomain:         "aip-landing-v0.firebaseapp.com",
    projectId:          "aip-landing-v0",
    storageBucket:      "aip-landing-v0.appspot.com",
    messagingSenderId:  "000000000000",
    appId:              "1:000000000000:web:000000000000000000000",
    measurementId:      "G-XXXXXXXXXX"
};

/* [SEC-03] INICIALIZACIÓN Y EXPORTACIONES */
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log(`🔥 [FIREBASE] Inicialización estructural en [${firebaseConfig.projectId}] lista.`);
} catch (error) {
    console.error("🔥 [FIREBASE] Error crítico en inicialización:", error);
}

export const auth           = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db             = getFirestore(app);
