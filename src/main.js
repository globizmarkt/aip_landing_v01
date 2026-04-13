/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: main.js
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   3.0.0 (Convergencia Soberana — OPORD-P-01)
 * DOCTRINA:  R0 (Agnosticismo Radical) | R2 (Light DOM)
 * PROPÓSITO: Bootloader Centralizado (Track A + Track B)
 * ═══════════════════════════════════════════════════════════════════
 */

/* 1. IMPORTACIONES — TRACK A (Arquitectura Core) */
import { Store }          from './core/store.js';
import { SceneManager }   from './core/scene-manager.js';
import { PassportEngine } from './core/passport-engine.js';
import { GenesisEngine }  from './core/genesis-engine.js';

/* 2. IMPORTACIONES — TRACK B (Lógica & UI) */
import { ReferralCapture }    from './core/referral-capture.js';
import { JurisdictionRouter } from './core/routing/jurisdiction-router.js';
import { PreKycEngine }       from './core/compliance/pre-kyc-engine.js';

/**
 * INYECTOR DINÁMICO DE LÓGICA POR ESCENA
 * Mantiene el núcleo ciego al negocio (R0)
 */
const handleSceneChange = (event) => {
    const { target } = event.detail ?? {};
    if (!target) return;

    console.log(`[BOOTLOADER] 🎭 Escena montada: ${target}`);

    switch (target) {
        case 'LANDING':
            GenesisEngine.init();
            break;
            
        case 'JURISDICTION':
            JurisdictionRouter.init();
            break;

        case 'PRE_KYC':
            PreKycEngine.init();
            break;

        case 'GATE':
            // Lógica de acceso (Access Gate logic)
            break;
    }
};

/**
 * BOOTLOADER — SECUENCIA DE ARRANQUE DETERMINISTA
 */
const initBootloader = () => {
    console.log('[BOOTLOADER] 🚀 Iniciando secuencia de convergencia...');

    try {
        // [Fase 1] — Inicialización de persistencia y estado
        Store.init();
        
        // [Fase 2] — Captura de red (Referidos)
        ReferralCapture.init();

        // [Fase 3] — Motores de confianza y validación
        // Nota: PassportEngine ya escucha 'Skeleton:PreKyc:Submitted' internamente
        PassportEngine.init();

        // [Fase 4] — Orquestación de Navegación
        // Suscribirse a cambios de escena antes de inicializar SceneManager
        document.addEventListener('skeleton:scene:activate', handleSceneChange);
        
        SceneManager.init();

        console.log('[BOOTLOADER] ✅ Sistema soberano en estado funcional.');

    } catch (error) {
        console.error('[BOOTLOADER] ❌ Fallo crítico en la ignición:', error);
    }
};

// Punto de entrada único (DOM Ready)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBootloader);
} else {
    initBootloader();
}