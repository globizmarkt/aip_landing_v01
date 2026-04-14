/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: scene-manager.js — Orquestador de Navegación y Escenas
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   2.1.0 (Sovereign Core — Purga de Gatekeeper)
 * DOCTRINA:  R0 (Agnosticismo Radical) | R3 (Zero-Hex)
 * DEPS:      src/core/store.js | src/config/constants.js
 * ───────────────────────────────────────────────────────────────────
 * PROPÓSITO: Gestionar la transición entre escenas y órbitas.
 * REGLAS:    - Prohibido manipular el DOM directamente (usar eventos).
 * - Validación directa contra PassportEngine (SSoT).
 * ═══════════════════════════════════════════════════════════════════
 */

import { Store } from './store.js';
import { AIP_CONSTANTS } from '../config/constants.js';
// R0: Inyectar PassportEngine en lugar del Gatekeeper extinto
import { PassportEngine } from './passport-engine.js';

const _SCENE_REGISTRY = [
    { id: 'LANDING', orbit: 'LANDING' },
    { id: 'JURISDICTION', orbit: 'LANDING' },
    { id: 'PRE_KYC', orbit: 'LANDING' },
    { id: 'GATE', orbit: 'LANDING' },
    { id: 'CUSTODY', orbit: 'LANDING' },
    { id: 'WORKSPACE', orbit: 'WORKSPACE' }
];

export const SceneManager = {

    _current: 'LANDING',
    _ready: false,

    init() {
        document.addEventListener(AIP_CONSTANTS.EVENTS.SCENE_REQUEST_ORBIT, (e) => {
            const { orbit, context } = e.detail;
            this.navigateByOrbit(orbit, context);
        });

        document.addEventListener(AIP_CONSTANTS.EVENTS.INVESTOR_ACCESS_REQUESTED, (e) => {
            this.navigateByOrbit(AIP_CONSTANTS.ORBITS.INVESTOR, e.detail);
        });

        this._ready = true;
        console.log('[SCENE-MANAGER] ✅ Orquestador de escenas activo (v2.1.0).');
    },

    navigateByOrbit(orbitName, context = {}) {
        console.log(`[SCENE-MANAGER] 🚀 Solicitando órbita: ${orbitName}`);

        let targetScene = 'LANDING';
        if (orbitName === AIP_CONSTANTS.ORBITS.WORKSPACE) targetScene = 'WORKSPACE';
        if (orbitName === AIP_CONSTANTS.ORBITS.STAFF) targetScene = 'GATE';
        if (orbitName === AIP_CONSTANTS.ORBITS.INVESTOR) targetScene = 'WORKSPACE';

        this.navigate(targetScene, context);
    },

    navigate(sceneId, context = {}) {
        // R0: Defensa de Perímetro integrada. Verificamos contra el estado del Pasaporte.
        if (sceneId === 'WORKSPACE') {
            const state = PassportEngine.getState();
            const validStates = [PassportEngine.States.AUTHENTICATED, PassportEngine.States.VALIDATED];

            if (!validStates.includes(state)) {
                console.warn(`[SCENE-MANAGER] ⛔ Acceso denegado a ${sceneId}. Estado fiduciario insuficiente.`);
                return;
            }
        }

        const from = this._current;
        this._current = sceneId;

        Store.setState({
            navigation: {
                scene: sceneId,
                orbit: this._getOrbitForScene(sceneId),
                context
            }
        });

        // R0: Inmutabilidad en la emisión del payload
        document.dispatchEvent(new CustomEvent('skeleton:scene:activate', {
            bubbles: true,
            detail: Object.freeze({
                target: sceneId,
                from,
                timestamp: Date.now()
            })
        }));

        console.log(`[SCENE-MANAGER] 🎬 Transición: ${from} → ${sceneId}`);
    },

    _getOrbitForScene(sceneId) {
        const found = _SCENE_REGISTRY.find(s => s.id === sceneId);
        return found ? found.orbit : 'LANDING';
    }
};