/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: main.js — ORQUESTADOR SANEADO v5.2.0
 * ═══════════════════════════════════════════════════════════════════
 */

import { Store } from './core/store.js';
import { SceneManager } from './core/scene-manager.js';
import { PassportEngine } from './core/passport-engine.js';
import { FirebaseConnector } from './core/firebase-triple-write.js'; // Inyectado
import { UIBinder } from './core/ui-binder.js';
import { GoldenGate } from './core/golden-gate.js';
import { LandingOrbitLogic } from './core/landing-orbit-logic.js';

const boot = async () => {
    console.log('[BOOTLOADER] 🚀 Iniciando secuencia fiduciaria...');

    try {
        // [PASO 1] Motores Core
        Store.init();
        PassportEngine.init();

        // [PASO 2] Conexión de Persistencia y Seguridad (Cierra el error de Firebase)
        GoldenGate.init(PassportEngine, FirebaseConnector);

        // [PASO 3] Lógica de Órbitas y Escenas
        LandingOrbitLogic.init();
        SceneManager.init();
        UIBinder.init();

        console.log('[BOOTLOADER] ✅ Planta Iluminada. Operación Nominal.');

        // [PASO 4] SEÑAL DE IGNICIÓN (Vector de Apertura de Cortina)
        document.dispatchEvent(new CustomEvent('Skeleton:System:Hydrated', {
            bubbles: true,
            composed: true
        }));

    } catch (error) {
        console.error('[BOOTLOADER] ❌ FALLO DE SECUENCIA:', error.message);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}