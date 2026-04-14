/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: main.js
 * VERSIÓN:   5.0.1 (Saneamiento de Dependencias - Sprint 5)
 * DOCTRINA:  R0 (Agnosticismo Radical)
 * PROPÓSITO: Secuencia de ignición soberana con hidratación externa
 * ═══════════════════════════════════════════════════════════════════
 */

/* 1. IMPORTACIONES CORE (Saneadas por Sentinel) */
import { Store } from './core/store.js';
import { SceneManager } from './core/scene-manager.js';
import { PassportEngine } from './core/passport-engine.js';
import { GenesisEngine } from './core/genesis-engine.js';
import { UIBinder } from './core/ui-binder.js';

// R0: Inyección de nuevos módulos, purga de gatekeeper.js
import { GoldenGate } from './core/golden-gate.js';
import { LandingOrbitLogic } from './core/landing-orbit-logic.js';

/**
 * INYECTOR DINÁMICO DE LÓGICA POR ESCENA
 */
const handleSceneChange = (event) => {
    const { target } = event.detail ?? {};
    if (!target) return;

    // [VECTOR 1] DEFENSA DE RUTA PROFUNDA (Actualizado a GoldenGate)
    if (!GoldenGate.canAccess(target)) {
        console.warn(`[DEFENSA DE RUTA] Acceso denegado a escena: ${target}.`);
        return;
    }

    document.querySelectorAll('.sk-scene').forEach(scene => {
        if (scene.dataset.scene === target) {
            scene.classList.add('sk-scene--active');
        } else {
            scene.classList.remove('sk-scene--active');
        }
    });
};

/* 2. SECUENCIA DE IGNICIÓN (BOOTLOADER) */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[BOOTLOADER] Iniciando secuencia de encendido fiduciaria...');

    try {
        const response = await fetch('./src/locales/locales.json');
        if (!response.ok) throw new Error('Fallo al cargar diccionario locales.json');
        const localesData = await response.json();

        window.__LOCALES__ = localesData;
        window.__CURRENT_LOCALE__ = 'es';

        await import('./components/ticker-module.js');
        await import('./core/i18n-engine.js');

        // [PASO 4] — Arrancar Motores Core y Emitir Hydration Signal (Enmienda Sentinel)
        Store.init();
        PassportEngine.init();

        // Purga de Gatekeeper, inyección de M2 y M5
        GoldenGate.init(PassportEngine);
        LandingOrbitLogic.init();

        UIBinder.init();

        document.addEventListener('skeleton:scene:activate', handleSceneChange);
        SceneManager.init(); // Fallará solo si el archivo físico no se restauró

        console.log('[BOOTLOADER] ✅ Sistema Hydrated. Operación Nominal.');

    } catch (error) {
        console.error('[BOOTLOADER] ❌ FALLO CRÍTICO:', error.message);
        document.body.innerHTML = `<div style="color:white; padding:2rem; background:#0a1628; height:100vh;">[ERROR_FIDUCIARIO] Fallo de integridad en la carga de activos: ${error.message}</div>`;
    }
});