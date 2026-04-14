/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: scene-manager.js — Orquestador de Navegación y Escenas
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.0.0 (Sovereign Core — OPORD-P-06)
 * DOCTRINA:  R0 (Agnosticismo Radical) | R3 (Zero-Hex)
 * DEPS:      src/core/store.js | src/config/constants.js
 * ───────────────────────────────────────────────────────────────────
 * PROPÓSITO: Gestionar la transición entre escenas y órbitas,
 *            asegurando que el AppShell refleje el estado del Store.
 * REGLAS:    - Prohibido manipular el DOM directamente (usar eventos).
 *            - Integración obligatoria con Gatekeeper.
 * ═══════════════════════════════════════════════════════════════════
 */

import { Store } from './store.js';
import { AIP_CONSTANTS } from '../config/constants.js';
import { Gatekeeper } from './gatekeeper.js';

const _SCENE_REGISTRY = [
    { id: 'LANDING',      orbit: 'LANDING' },
    { id: 'JURISDICTION', orbit: 'LANDING' },
    { id: 'PRE_KYC',      orbit: 'LANDING' },
    { id: 'GATE',         orbit: 'LANDING' },
    { id: 'CUSTODY',      orbit: 'LANDING' },
    { id: 'WORKSPACE',    orbit: 'WORKSPACE' }
];

export const SceneManager = {

    _current: 'LANDING',
    _ready: false,

    init() {
        // Escuchar peticiones de órbita (desde PassportEngine o UI)
        document.addEventListener(AIP_CONSTANTS.EVENTS.SCENE_REQUEST_ORBIT, (e) => {
            const { orbit, context } = e.detail;
            this.navigateByOrbit(orbit, context);
        });

        // Escuchar acceso de inversor (Directiva Turno 137)
        document.addEventListener(AIP_CONSTANTS.EVENTS.INVESTOR_ACCESS_REQUESTED, (e) => {
            this.navigateByOrbit(AIP_CONSTANTS.ORBITS.INVESTOR, e.detail);
        });

        this._ready = true;
        console.log('[SCENE-MANAGER] ✅ Orquestador de escenas activo.');
    },

    /**
     * Navegación por Órbita (Modelo Trinity Expansion)
     */
    navigateByOrbit(orbitName, context = {}) {
        console.log(`[SCENE-MANAGER] 🚀 Solicitando órbita: ${orbitName}`);
        
        // Mapear órbita a escena inicial de esa órbita
        let targetScene = 'LANDING';
        if (orbitName === AIP_CONSTANTS.ORBITS.WORKSPACE) targetScene = 'WORKSPACE';
        if (orbitName === AIP_CONSTANTS.ORBITS.STAFF) targetScene = 'GATE';
        if (orbitName === AIP_CONSTANTS.ORBITS.INVESTOR) targetScene = 'WORKSPACE'; // Órbita Inversor usa el Workspace con claims limitados

        this.navigate(targetScene, context);
    },

    /**
     * Navegación por Escena (Controlada por Gatekeeper)
     */
    navigate(sceneId, context = {}) {
        if (!Gatekeeper.canAccess(sceneId)) {
            // El Gatekeeper ya emitió la violación, nosotros abortamos o vamos a CUSTODY si es grave
            return;
        }

        const from = this._current;
        this._current = sceneId;

        // Actualizar estado global
        Store.setState({
            navigation: {
                scene: sceneId,
                orbit: this._getOrbitForScene(sceneId),
                context
            }
        });

        // Emitir activación al AppShell (R-SM-02)
        document.dispatchEvent(new CustomEvent('skeleton:scene:activate', {
            bubbles: true,
            detail: {
                target: sceneId,
                from,
                timestamp: Date.now()
            }
        }));

        console.log(`[SCENE-MANAGER] 🎬 Transición: ${from} → ${sceneId}`);
    },

    _getOrbitForScene(sceneId) {
        const found = _SCENE_REGISTRY.find(s => s.id === sceneId);
        return found ? found.orbit : 'LANDING';
    }
};
