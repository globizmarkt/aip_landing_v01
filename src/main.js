/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: main.js — ORQUESTADOR SANEADO v5.2.0 (Fase 2 Final)
 * ═══════════════════════════════════════════════════════════════════
 */

import { Store } from './core/store.js';
import { SceneManager } from './core/scene-manager.js';
import { PassportEngine } from './core/passport-engine.js';
import { FirebaseConnector } from './core/firebase-triple-write.js';
import { UIBinder } from './core/ui-binder.js';
import { GoldenGate } from './core/golden-gate.js';
import { LandingOrbitLogic } from './core/landing-orbit-logic.js';
import { loadNamespace } from './core/i18n-engine.js';

const boot = async () => {
    console.log('[BOOTLOADER] 🚀 Iniciando secuencia fiduciaria...');

    try {
        // [PASO 1] Carga de Vocabulario (R4)
        await loadNamespace('core', 'es');
        await loadNamespace('gate', 'es');

        // [PASO 2] Motores Core
        Store.init();
        PassportEngine.init();

        // [PASO 3] Conexión de Persistencia y Seguridad (Cierra error de Firebase)
        // Importante: Inyectamos el conector para que GoldenGate tenga combustible
        GoldenGate.init(PassportEngine, FirebaseConnector);

        // [PASO 4] Lógica de Órbitas y Escenas
        LandingOrbitLogic.init();
        SceneManager.init();
        UIBinder.init();

        console.log('[BOOTLOADER] ✅ Planta Iluminada. Operación Nominal.');

        // [PASO 5] SEÑAL DE IGNICIÓN (Abre la cortina en index.html)
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