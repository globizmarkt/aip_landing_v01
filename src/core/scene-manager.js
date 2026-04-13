/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: scene-manager.js — Orquestador de Navegación
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   1.0.0 (Skeleton Core)
 * DOCTRINA:  R0 (Agnosticismo Radical) | R3 (Zero-Hex)
 * DEPS:      store.js, gatekeeper.js
 * ───────────────────────────────────────────────────────────────────
 * REGLAS DE ESTE ARCHIVO:
 *   ✅ Toda comunicación con el DOM es vía document.dispatchEvent.
 *   ✅ Toda transición pasa por Gatekeeper antes de ejecutarse.
 *   ✅ El historial es inmutable (append-only).
 *   ❌ Prohibido manipular el DOM del Canvas directamente.
 *   ❌ Prohibido referenciar nombres de negocio.
 * ═══════════════════════════════════════════════════════════════════
 */

import { Store }      from './store.js';
import { Gatekeeper } from './gatekeeper.js'; // Dependencia externa al núcleo

/* [SEC-01] REGISTRO CANÓNICO DE ESCENAS
 *
 * Cada escena declara:
 *   id:             Identificador único en SCREAMING_SNAKE_CASE.
 *   requiredClaim:  Claim O(1) que el operador debe tener. null = acceso libre.
 *   fallbackScene:  Escena a la que redirige si el acceso falla.
 *   orbitConfig:    Visibilidad de órbitas al entrar en esta escena.
 *
 * La vertical extiende este registro con sus propias escenas usando
 * SceneManager.registerScene() en su bootstrap.
 */
const _CORE_SCENES = [
    {
        id:            'LANDING',
        requiredClaim: null,            // Libre — cualquier operador
        fallbackScene: null,            // Escena inicial, sin fallback
        orbitConfig:   { orbit1: false, orbit3: false }  // Solo el canvas
    },
    {
        id:            'JURISDICTION',
        requiredClaim: null,            // Filtro suave inicial
        fallbackScene: 'LANDING',
        orbitConfig:   { orbit1: false, orbit3: false }
    },
    {
        id:            'PRE_KYC',
        requiredClaim: null,            // Diálogo Fiduciario
        fallbackScene: 'JURISDICTION',
        orbitConfig:   { orbit1: false, orbit3: false }
    },
    {
        id:            'GATE',
        requiredClaim: null,            // Evaluado post integridad
        fallbackScene: 'PRE_KYC',
        orbitConfig:   { orbit1: false, orbit3: false }
    },
    {
        id:            'WORKSPACE',
        requiredClaim: 'canAccessWorkspace',  // Custom Claim requerido (O(1))
        fallbackScene: 'GATE',
        orbitConfig:   { orbit1: true, orbit3: true }   // Trinity completo
    },
    {
        id:            'CUSTODY',           // Escena de bloqueo (Fiduciary Hold)
        requiredClaim: null,
        fallbackScene: null,
        orbitConfig:   { orbit1: false, orbit3: false }
    }
];

/* [SEC-02] SINGLETON EXPORTADO */
export const SceneManager = {

    // Mapa de escenas registradas: Map<id, SceneDefinition>
    _registry: new Map(),

    // Historial inmutable de navegación (append-only)
    _history:  [],

    // Escena actualmente activa
    _current:  null,

    // Flag de inicialización
    _ready:    false,

    /* ─────────────────────────────────────────────
     * INICIALIZACIÓN
     * ───────────────────────────────────────────── */

    /**
     * Inicializa el SceneManager.
     * Registra las escenas del core y espera a que el Shell esté listo.
     */
    init() {
        // Registrar escenas del núcleo
        _CORE_SCENES.forEach(scene => this.registerScene(scene));

        // Esperar a que el Shell haya montado el DOM
        document.addEventListener('skeleton:shell:ready', () => {
            this._ready = true;
            this._resolveInitialScene();
        }, { once: true });

        // Escuchar cambios de autenticación para re-evaluar la escena activa
        document.addEventListener('skeleton:auth:changed', () => {
            if (this._ready && this._current) {
                this._reevaluateCurrent();
            }
        });

        // Escuchar solicitudes de navegación del sistema de navegación
        document.addEventListener('skeleton:nav:request', (e) => {
            const { sceneId } = e.detail ?? {};
            if (sceneId) this.navigate(sceneId);
        });

        console.log('[SCENE-MANAGER] ✅ Iniciado. Escenas registradas:', [...this._registry.keys()]);
    },

    /* ─────────────────────────────────────────────
     * REGISTRO DE ESCENAS
     * ───────────────────────────────────────────── */

    /**
     * Registra una escena en el sistema.
     * Las verticales llaman a este método en su bootstrap para extender el núcleo.
     *
     * @param {Object} sceneDef - Definición de la escena.
     */
    registerScene(sceneDef) {
        if (!sceneDef?.id) {
            console.error('[SCENE-MANAGER] registerScene: id es requerido.', sceneDef);
            return;
        }
        this._registry.set(sceneDef.id, sceneDef);
    },

    /* ─────────────────────────────────────────────
     * NAVEGACIÓN
     * ───────────────────────────────────────────── */

    /**
     * Solicita una transición a la escena indicada.
     * Pasa por:
     *   1. Validación de existencia de la escena.
     *   2. Evento preventable (skeleton:scene:before-change).
     *   3. Verificación del Gatekeeper (Custom Claims).
     *   4. Emisión final de skeleton:scene:activate al AppShell.
     *
     * @param {string} sceneId - ID de la escena destino.
     */
    async navigate(sceneId) {
        const scene = this._registry.get(sceneId);
        if (!scene) {
            console.warn(`[SCENE-MANAGER] Escena desconocida: "${sceneId}". Navegación cancelada.`);
            return;
        }

        const from = this._current;
        const to   = sceneId;

        // --- PASO 1: Evento preventable ---
        const beforeEvent = new CustomEvent('skeleton:scene:before-change', {
            detail:     { from, to },
            cancelable: true,
            bubbles:    false
        });
        document.dispatchEvent(beforeEvent);

        if (beforeEvent.defaultPrevented) {
            console.log(`[SCENE-MANAGER] Transición ${from} → ${to} cancelada por listener externo.`);
            return;
        }

        // --- PASO 2: Verificación del Gatekeeper ---
        if (scene.requiredClaim) {
            const state   = Store.getState();
            const claims  = state.auth?.claims ?? {};
            const allowed = Gatekeeper.evaluateClaim(claims, scene.requiredClaim);

            if (!allowed) {
                const fallback = scene.fallbackScene ?? 'GATE';
                console.warn(`[SCENE-MANAGER] Acceso denegado a "${to}". Claim requerido: "${scene.requiredClaim}". Redirigiendo a "${fallback}".`);

                // Emitir evento de bloqueo
                document.dispatchEvent(new CustomEvent('skeleton:scene:blocked', {
                    detail: {
                        attempted: to,
                        fallback,
                        reason:    `claim_missing:${scene.requiredClaim}`
                    }
                }));

                // Redirigir al fallback sin volver a pasar por navigate() recursivamente
                this._activate(fallback);
                return;
            }
        }

        // --- PASO 3: Activar la escena ---
        this._activate(to);
    },

    /* ─────────────────────────────────────────────
     * ACTIVACIÓN (INTERNA)
     * ───────────────────────────────────────────── */

    /**
     * Ejecuta la transición real: actualiza el Store, el historial
     * y emite el evento de activación al AppShell.
     * @private
     */
    _activate(sceneId) {
        const scene = this._registry.get(sceneId);
        if (!scene) return;

        const from = this._current;
        this._current = sceneId;

        // Sincronizar el Store
        Store.setState({ meta: { currentScene: sceneId } });

        // Registrar en historial inmutable
        this._history.push({ from, to: sceneId, timestamp: Date.now() });

        // ─────────────────────────────────────────
        // DESPACHO VÍA document.dispatchEvent
        // R-SM-02: Prohibidas referencias directas al DOM del Shell.
        // El AppShell escucha este evento y aplica la visibilidad.
        // ─────────────────────────────────────────
        document.dispatchEvent(new CustomEvent('skeleton:scene:activate', {
            detail: {
                target:       sceneId,
                orbitConfig:  scene.orbitConfig ?? { orbit1: true, orbit3: true }
            }
        }));

        // Emitir confirmación post-transición
        document.dispatchEvent(new CustomEvent('skeleton:scene:after-change', {
            detail: { from, to: sceneId, timestamp: Date.now() }
        }));

        console.log(`[SCENE-MANAGER] 🎬 ${from ?? 'BOOT'} → ${sceneId}`);
    },

    /* ─────────────────────────────────────────────
     * ESCENA INICIAL
     * ───────────────────────────────────────────── */

    /**
     * Determina la primera escena al arrancar.
     * Lee el estado del Store para decidir si hay sesión activa.
     * @private
     */
    _resolveInitialScene() {
        const state = Store.getState();
        const user  = state.auth?.user;

        if (user) {
            // Hay sesión activa → intentar ir al Workspace
            this.navigate('WORKSPACE');
        } else {
            // Sin sesión → Landing
            this._activate('LANDING');
        }
    },

    /* ─────────────────────────────────────────────
     * RE-EVALUACIÓN ANTE CAMBIO DE SESIÓN
     * ───────────────────────────────────────────── */

    /**
     * Re-evalúa la escena actual cuando cambian los claims del operador.
     * Si ya no tiene acceso, lo redirige al fallback.
     * @private
     */
    _reevaluateCurrent() {
        const scene = this._registry.get(this._current);
        if (!scene?.requiredClaim) return; // Escena libre, sin restricción

        const state   = Store.getState();
        const claims  = state.auth?.claims ?? {};
        const allowed = Gatekeeper.evaluateClaim(claims, scene.requiredClaim);

        if (!allowed) {
            const fallback = scene.fallbackScene ?? 'LANDING';
            console.warn(`[SCENE-MANAGER] Re-evaluación: acceso revocado a "${this._current}". Redirigiendo a "${fallback}".`);
            this._activate(fallback);
        }
    },

    /* ─────────────────────────────────────────────
     * UTILIDADES PÚBLICAS
     * ───────────────────────────────────────────── */

    /** Retorna la escena actualmente activa. */
    getCurrent() {
        return this._current;
    },

    /** Retorna el historial de navegación (snapshot inmutable). */
    getHistory() {
        return [...this._history];
    }
};
