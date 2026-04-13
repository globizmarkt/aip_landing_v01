/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: main.js
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   5.0.0 (Unified Stitch-Compatible — OPORD-P-03)
 * DOCTRINA:  R0 (Agnosticismo Radical)
 * PROPÓSITO: Secuencia de ignición soberana con hidratación externa (v1.1.0)
 * ═══════════════════════════════════════════════════════════════════
 */

/* 1. IMPORTACIONES CORE */
import { Store }          from './core/store.js';
import { SceneManager }   from './core/scene-manager.js';
import { PassportEngine } from './core/passport-engine.js';
import { GenesisEngine }  from './core/genesis-engine.js';
import { UIBinder }       from './core/ui-binder.js';
import { Gatekeeper }     from './core/gatekeeper.js';

/**
 * INYECTOR DINÁMICO DE LÓGICA POR ESCENA
 */
const handleSceneChange = (event) => {
    const { target } = event.detail ?? {};
    if (!target) return;

    // [VECTOR 1] DEFENSA DE RUTA PROFUNDA: Pre-flight Check
    // Protege la hidratación dinámica en caso de un evento directo o acceso por URL
    if (!Gatekeeper.canAccess(target)) {
        console.warn(`[DEFENSA DE RUTA] Acceso denegado a escena: ${target}. Forzando fallback a LANDING.`);
        SceneManager.navigate('LANDING');
        return;
    }

    switch (target) {
        case 'LANDING':      GenesisEngine.init(); break;
        case 'JURISDICTION': import('./core/routing/jurisdiction-router.js').then(m => m.JurisdictionRouter.init()); break;
        case 'PRE_KYC':      import('./core/compliance/pre-kyc-engine.js').then(m => m.PreKycEngine.init()); break;
    }
};

/**
 * BOOTLOADER — SECUENCIA DE ARRANQUE DETERMINISTA (OPORD-P-03)
 */
const initBootloader = async () => {
    console.log('[BOOTLOADER] 🚀 Iniciando Ignición Soberana (D3/D8/D9)...');

    try {
        // [PASO 1] — Fetch de locales (Diccionario Externo v1.1.0)
        const response = await fetch('./src/locales/locales.json');
        if (!response.ok) throw new Error('Fallo al cargar diccionario locales.json');
        const localesData = await response.json();

        // [PASO 2] — Poblar Globales para i18n-engine.js (D3 Stitch Compatibility)
        window.__LOCALES__ = localesData;
        window.__CURRENT_LOCALE__ = 'es';

        // [PASO 3] — Registrar Componentes Visuales y Motores i18n
        await import('./components/ticker-module.js');
        await import('./core/i18n-engine.js'); // Motor con re-mapeo STITCH

        // [PASO 4] — Arrancar Motores Core y Emitir Hydration Signal
        Store.init();
        PassportEngine.init();
        Gatekeeper.init(PassportEngine);
        UIBinder.init();
        
        document.addEventListener('skeleton:scene:activate', handleSceneChange);
        SceneManager.init();

        console.log('[BOOTLOADER] ✅ Sistema Hydrated. Operación Nominal.');

    } catch (error) {
        console.error('[BOOTLOADER] ❌ FALLO CRÍTICO:', error.message);
        document.body.innerHTML = `<div style="color:white; padding:2rem; background:#0a1628; height:100vh;">[ERROR_FIDUCIARIO] Fallo de integridad en la carga de activos: ${error.message}</div>`;
    }
};

// Ignición
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBootloader);
} else {
    initBootloader();
}