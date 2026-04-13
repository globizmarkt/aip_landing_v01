/**
 * @file main-connector-opord12.js
 * @role Entry Point — OPORD-12
 * @description Punto de conexión para main.js. Orquesta inicialización de módulos.
 */

// Orden de carga (respetar dependencias):
// 1. ReferralCapture (sin dependencias, debe correr primero)
// 2. JurisdictionRouter (lee cookie, emite navegación)
// 3. PreKycEngine (depende de ReferralCapture para leer AIP_REFERRAL_NODE)

(function() {
    'use strict';
    
    const NS = window.Skeleton || (window.Skeleton = {});
    
    /**
     * Inicialización maestra OPORD-12
     * Llamar desde main.js al arranque de aplicación
     */
    function initOpord12() {
        // 1. Captura de referido (siempre, en cualquier escena)
        if (NS.ReferralCapture) {
            NS.ReferralCapture.init();
        }
        
        // 2. Escuchar cambios de escena para inicializar routers específicos
        document.addEventListener('Skeleton:Scene:Mounted', handleSceneMount);
        
        // 3. Verificar escena actual al cargar
        const currentScene = document.querySelector('[data-scene-active]')?.dataset.sceneActive;
        if (currentScene) {
            mountSceneLogic(currentScene);
        }
    }
    
    /**
     * Handler de montaje de escena
     */
    function handleSceneMount(event) {
        const scene = event.detail?.scene;
        if (scene) {
            mountSceneLogic(scene);
        }
    }
    
    /**
     * Router de inicialización por escena
     */
    function mountSceneLogic(scene) {
        switch(scene) {
            case 'JURISDICTION':
                if (NS.JurisdictionRouter) {
                    NS.JurisdictionRouter.init();
                }
                break;
                
            case 'PRE_KYC':
                if (NS.PreKycEngine) {
                    NS.PreKycEngine.init();
                }
                break;
                
            case 'LANDING':
                // Hero scene: no requiere lógica específica de OPORD-12
                break;
        }
    }
    
    // Exposición global
    NS.Opord12 = {
        init: initOpord12,
        version: '1.0.0'
    };
    
})();