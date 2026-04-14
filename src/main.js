/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: main.js — ORQUESTADOR SANEADO v5.2.1 (Sentinel Path Fix)
 * ═══════════════════════════════════════════════════════════════════
 */

import { Store } from './core/store.js';
import { SceneManager } from './core/scene-manager.js';
import { PassportEngine } from './core/passport-engine.js';
import { UIBinder } from './core/ui-binder.js';
import { loadNamespace } from './core/i18n-engine.js';

// RUTAS CORREGIDAS SEGÚN INVENTARIO FÍSICO (SENTINEL)
import { FirebaseConnector } from './core/firebase-connector.js';
import { Gatekeeper as GoldenGate } from './core/gatekeeper.js';

// ALERTA: LandingOrbitLogic no detectado en tree.txt. 
// Se mantiene comentado hasta localización física por Antigravity.
// import { LandingOrbitLogic } from './core/landing-orbit-logic.js';

const boot = async () => {
    console.log('[BOOTLOADER] 🚀 Iniciando secuencia fiduciaria...');

    try {
        // [PASO 1] Carga de Vocabulario (R4)
        await loadNamespace('core', 'es');
        await loadNamespace('gate', 'es');

        // [PASO 2] Motores Core
        Store.init();
        PassportEngine.init();

        // [PASO 3] Seguridad (GoldenGate + Connector)
        GoldenGate.init(PassportEngine, FirebaseConnector);

        // [PASO 4] Lógica de Escenas y UI
        // LandingOrbitLogic?.init(); 
        SceneManager.init();
        UIBinder.init();

        console.log('[BOOTLOADER] ✅ Planta Iluminada. Operación Nominal.');

        // [PASO 5] SEÑAL DE IGNICIÓN
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