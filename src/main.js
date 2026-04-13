/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: main.js
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   4.0.0 (Unified Bootloader — OPORD-P-02)
 * DOCTRINA:  R0 (Agnosticismo Radical)
 * PROPÓSITO: Secuencia de ignición soberana con hidratación externa
 * ═══════════════════════════════════════════════════════════════════
 */

/* 1. IMPORTACIONES CORE */
import { Store }          from './core/store.js';
import { SceneManager }   from './core/scene-manager.js';
import { PassportEngine } from './core/passport-engine.js';
import { GenesisEngine }  from './core/genesis-engine.js';
import { i18n }           from './core/at-i18n.js';

/**
 * INYECTOR DINÁMICO DE LÓGICA POR ESCENA
 */
const handleSceneChange = (event) => {
    const { target } = event.detail ?? {};
    if (!target) return;
    switch (target) {
        case 'LANDING':      GenesisEngine.init(); break;
        case 'JURISDICTION': import('./core/routing/jurisdiction-router.js').then(m => m.JurisdictionRouter.init()); break;
        case 'PRE_KYC':      import('./core/compliance/pre-kyc-engine.js').then(m => m.PreKycEngine.init()); break;
    }
};

/**
 * BOOTLOADER — SECUENCIA DE ARRANQUE DETERMINISTA (OPORD-P-02)
 */
const initBootloader = async () => {
    console.log('[BOOTLOADER] 🚀 Iniciando Ignición Soberana...');

    try {
        // [PASO 1] — Fetch de locales (Diccionario Externo)
        const response = await fetch('./src/locales/locales.json');
        if (!response.ok) throw new Error('Fallo al cargar diccionario locales.json');
        const localesData = await response.json();

        // [PASO 2] — Instanciar window.LuxI18n e inicializar Motor
        i18n.init(localesData, 'es'); 

        // [PASO 3] — Registrar Componentes Visuales (CustomElements)
        await import('./components/ticker-module.js');

        // [PASO 4] — Emitir Hydration Signal y arrancar Motores Core
        Store.init();
        PassportEngine.init();
        
        document.addEventListener('skeleton:scene:activate', handleSceneChange);
        SceneManager.init();

        document.dispatchEvent(new CustomEvent('Skeleton:System:Hydrated'));
        
        console.log('[BOOTLOADER] ✅ Sistema Hydrated. Operación Nominal.');

    } catch (error) {
        console.error('[BOOTLOADER] ❌ FALLO CRÍTICO:', error.message);
        // Fallback: Estado de Custodia si el fetch falla
        document.body.innerHTML = `<div style="color:white; padding:2rem;">[ERROR_FIDUCIARIO] Fallo de integridad en la carga de activos: ${error.message}</div>`;
    }
};

// Ignición
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBootloader);
} else {
    initBootloader();
}