/**
 * ═══════════════════════════════════════════════════════════════════
 * IGNICIÓN: AIP_landing_v0.1 — Bootstrap del Sistema
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   0.1.0
 * DOCTRINA:  R0 | R2 | R3 | R4
 * DEPS:      store.js → at-i18n.js → theme-engine.js → scene-manager.js
 * ═══════════════════════════════════════════════════════════════════
 */

import { Store }        from './core/store.js';
import { SceneManager } from './core/scene-manager.js';
import { ThemeEngine }  from './core/theme-engine.js';
import { i18n }         from './core/at-i18n.js';
import { PassportEngine } from './core/passport-engine.js';
import { GenesisEngine }  from './core/genesis-engine.js';
import '../src/layouts/app-shell.js'; // Registra el Web Component soberano (R2 Light DOM)

document.addEventListener('DOMContentLoaded', async () => {
    console.group('🚀 [AIP_LANDING] SYSTEM IGNITION');

    try {
        // 1. Inicializar Store con ADN de la vertical
        Store.init('AIP_LANDING');

        // 2. Inicializar Motores Centrales
        PassportEngine.init();

        // 3. Inicializar i18n (locale por defecto: español)
        await i18n.init('es');

        // 4. Inicializar ThemeEngine (inyecta tokens CSS en :root)
        ThemeEngine.init();

        // 5. Inicializar Controladores de Escenas
        GenesisEngine.init();

        // 6. Inicializar SceneManager (determina escena inicial)
        SceneManager.init();

        console.log('✅ [AIP_LANDING] SYSTEM READY');
    } catch (error) {
        console.error('🔥 [AIP_LANDING] CRITICAL BOOT ERROR:', error);
    }

    console.groupEnd();
});
