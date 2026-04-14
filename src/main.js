/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: main.js — ORQUESTADOR SANEADO v5.1.0
 * ═══════════════════════════════════════════════════════════════════
 */

import { Store } from './core/store.js';
import { SceneManager } from './core/scene-manager.js';
import { PassportEngine } from './core/passport-engine.js';
import { GenesisEngine } from './core/genesis-engine.js';
import { UIBinder } from './core/ui-binder.js';
import { GoldenGate } from './core/golden-gate.js'; // R0: Cambio de Gatekeeper a GoldenGate
import { LandingOrbitLogic } from './core/landing-orbit-logic.js';

const handleSceneChange = (event) => {
    const { target } = event.detail ?? {};
    if (!target) return;
    console.log(`[SCENE] Cambio detectado a: ${target}`);
};

const boot = async () => {
    console.log('[BOOTLOADER] 🚀 Iniciando secuencia fiduciaria...');

    try {
        // [PASO 1] Motores Core
        Store.init();
        PassportEngine.init();

        // [PASO 2] El Nuevo Portal (Reemplaza a Gatekeeper)
        GoldenGate.init(PassportEngine);

        // [PASO 3] Lógica de Órbitas y Escenas
        LandingOrbitLogic.init();
        SceneManager.init();

        UIBinder.init();

        document.addEventListener('skeleton:scene:activate', handleSceneChange);

        console.log('[BOOTLOADER] ✅ Planta Iluminada. Operación Nominal.');

    } catch (error) {
        console.error('[BOOTLOADER] ❌ FALLO DE SECUENCIA:', error.message);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}