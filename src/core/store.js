/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: store.js — Master State Manager
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   1.0.0 (Skeleton Core)
 * DOCTRINA:  R0 (Agnosticismo Radical) | R5 (Soberanía de Nombres)
 * DEPS:      NINGUNA — Capa más baja del núcleo.
 * ───────────────────────────────────────────────────────────────────
 * REGLAS DE ESTE ARCHIVO:
 *   ✅ Vanilla JS puro. Cero imports de módulos externos.
 *   ✅ La vertical inyecta en `project.offeringConfig`. El Core no lo lee.
 *   ✅ La reactividad es via suscripción por path (O(n-suscriptores)).
 *   ❌ Ninguna referencia a nombres de negocio (AIP, CIFI, etc.).
 *   ❌ Ninguna llamada a Firebase, fetch u otra I/O externa.
 * ═══════════════════════════════════════════════════════════════════
 */

/* [SEC-01] CONSTANTES DE CONTROL */
const _STORAGE_KEY    = 'AIP_LANDING_V0_STATE_V1';
const _VERTICAL_DNA_KEY = 'offeringConfig.vertical';

/* [SEC-02] ESTADO INICIAL CANÓNICO
 * Estas 3 ramas son INMUTABLES. No renombrar, no eliminar.
 */
const _INITIAL_STATE = {
    auth: {
        user:   null,   // { uid, email, role } — poblado por AuthManager
        claims: {}      // Custom Claims planos (O(1) lookup): { canRead: true, canWrite: false }
    },
    project: {
        id:             null,
        owner_uid:      null,           // Vínculo fiduciario (Atomic Handover)
        status:         'GENESIS',      // GENESIS | ACTIVE | ARCHIVED
        offeringConfig: {},             // Inyectado por la vertical. El Core es ciego a su contenido.
        createdAt:      null,
        updatedAt:      null
    },
    meta: {
        version:        '1.0.0',        // Versión del Chasis Fractal
        lastSync:       0,              // Timestamp de última persistencia
        currentScene:   'LANDING',      // Usado por SceneManager
        locale:         'en'            // Usado por i18n Engine
    }
};

/* [SEC-03] REGISTRO INTERNO DE SUSCRIPTORES
 * Map<path: string, Set<callback: Function>>
 * Ejemplo de path: 'auth.user', 'meta.currentScene'
 */
const _subscribers = new Map();

/* [SEC-04] UTILIDAD INTERNA — Resolución de path en objeto */
function _resolvePath(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

/* [SEC-05] UTILIDAD INTERNA — Notificación a suscriptores de un path */
function _notify(path, newValue) {
    if (_subscribers.has(path)) {
        _subscribers.get(path).forEach(cb => {
            try { cb(newValue); }
            catch (e) { console.error(`[STORE] Error en suscriptor de "${path}":`, e); }
        });
    }
}

/* [SEC-06] NÚCLEO DEL STORE — Singleton exportado */
export const Store = {

    // Estado vivo en memoria RAM. Fuente de verdad.
    _state: structuredClone(_INITIAL_STATE),

    // ─────────────────────────────────────────────
    // CICLO DE VIDA
    // ─────────────────────────────────────────────

    /**
     * Inicializa el Store.
     * Hidrata desde sessionStorage si existe un estado válido.
     * @param {string|null} verticalDNA - ADN de la vertical (ej: 'REAL_ESTATE').
     *   Si el estado en disco pertenece a otra vertical → PURGA y reinicio limpio.
     */
    init(verticalDNA = null) {
        try {
            const serialized = sessionStorage.getItem(_STORAGE_KEY);
            if (!serialized) {
                this._bootClean(verticalDNA);
                return;
            }

            const parsed = JSON.parse(serialized);

            // --- PROTECCIÓN DE ADN VERTICAL ---
            const storedDNA = _resolvePath(parsed, _VERTICAL_DNA_KEY);
            if (verticalDNA && storedDNA && storedDNA !== verticalDNA) {
                console.warn(`[STORE] ADN Mismatch: disco=[${storedDNA}] esperado=[${verticalDNA}]. Purga activada.`);
                this.nuke();
                this._bootClean(verticalDNA);
                return;
            }

            // Merge defensivo: estructura nueva prevalece sobre datos guardados
            this._state = this._deepMerge(structuredClone(_INITIAL_STATE), parsed);
            console.log('[STORE] ✅ Estado hidratado desde sesión anterior.');

        } catch (e) {
            console.error('[STORE] 🔥 Corrupción detectada. Reiniciando.', e);
            this.nuke();
            this._bootClean(verticalDNA);
        }
    },

    /**
     * Arranca con estado limpio e inyecta el ADN vertical.
     * @private
     */
    _bootClean(verticalDNA) {
        if (verticalDNA) {
            this._state.project.offeringConfig = {
                vertical:        verticalDNA,
                initializedAt:   Date.now(),
                status:          'STERILE' // El Core nace sin configuración de negocio
            };
        }
        this._persist();
        console.log('[STORE] ✨ Estado limpio inicializado. DNA:', verticalDNA ?? 'AGNOSTIC');
    },

    // ─────────────────────────────────────────────
    // LECTURA Y ESCRITURA
    // ─────────────────────────────────────────────

    /**
     * Retorna un snapshot inmutable del estado completo.
     * @returns {Object}
     */
    getState() {
        return structuredClone(this._state);
    },

    /**
     * Aplica un patch parcial al estado y notifica a los suscriptores afectados.
     * @param {Object} patch - Objeto parcial con las claves a actualizar.
     *   Ejemplo: { auth: { user: { uid: '123', role: 'admin' } } }
     */
    setState(patch) {
        const prevState = structuredClone(this._state);
        this._state = this._deepMerge(this._state, patch);
        this._state.meta.lastSync = Date.now();

        // Notificar solo a los paths que cambiaron
        this._detectChanges(prevState, this._state, '');
        this._persist();
    },

    // ─────────────────────────────────────────────
    // REACTIVIDAD — SISTEMA DE SUSCRIPCIÓN
    // ─────────────────────────────────────────────

    /**
     * Suscribe un callback a cambios en un path específico del estado.
     * @param {string} path - Dot-notation path. Ej: 'auth.user', 'meta.locale'
     * @param {Function} callback - fn(newValue) — recibe el nuevo valor del path.
     * @returns {Function} unsubscribe — llama a esta función para cancelar la suscripción.
     */
    subscribe(path, callback) {
        if (!_subscribers.has(path)) {
            _subscribers.set(path, new Set());
        }
        _subscribers.get(path).add(callback);

        // Notificación inmediata con valor actual (patrón BehaviorSubject)
        callback(_resolvePath(this._state, path));

        return () => {
            _subscribers.get(path)?.delete(callback);
        };
    },

    // ─────────────────────────────────────────────
    // MÉTODOS DE NEGOCIO (AGNÓSTICOS)
    // ─────────────────────────────────────────────

    /** Vincula el proyecto activo al UID del operador autenticado. */
    bindProjectToOperator(uid) {
        this.setState({
            project: {
                owner_uid: uid,
                status:    'ACTIVE',
                updatedAt: Date.now()
            }
        });
        console.log('[STORE] 🧬 Proyecto vinculado al operador UID:', uid);
    },

    /** Actualiza los claims del operador activo. */
    setOperatorClaims(claims = {}) {
        this.setState({ auth: { claims } });
    },

    // ─────────────────────────────────────────────
    // DESTRUCCIÓN
    // ─────────────────────────────────────────────

    /**
     * Elimina el estado de sesión y reinicia la memoria RAM.
     * Operación irreversible. Requiere intención explícita en el llamante.
     */
    nuke() {
        sessionStorage.removeItem(_STORAGE_KEY);
        this._state = structuredClone(_INITIAL_STATE);
        console.log('[STORE] 💥 NUKED. Estado reseteado.');
    },

    // ─────────────────────────────────────────────
    // PRIVADOS — UTILIDADES INTERNAS
    // ─────────────────────────────────────────────

    /** Persiste el estado en sessionStorage. @private */
    _persist() {
        try {
            sessionStorage.setItem(_STORAGE_KEY, JSON.stringify(this._state));
        } catch (e) {
            console.error('[STORE] Error en persistencia:', e);
        }
    },

    /**
     * Merge profundo: aplica `source` sobre `target` sin eliminar claves existentes.
     * @private
     */
    _deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this._deepMerge(target[key] ?? {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    },

    /**
     * Detecta qué paths cambiaron entre dos estados y notifica a sus suscriptores.
     * @private
     */
    _detectChanges(prev, next, prefix) {
        const allKeys = new Set([...Object.keys(prev ?? {}), ...Object.keys(next ?? {})]);
        for (const key of allKeys) {
            const path = prefix ? `${prefix}.${key}` : key;
            const prevVal = prev?.[key];
            const nextVal = next?.[key];
            if (JSON.stringify(prevVal) !== JSON.stringify(nextVal)) {
                _notify(path, nextVal);
                if (typeof nextVal === 'object' && nextVal !== null) {
                    this._detectChanges(prevVal, nextVal, path);
                }
            }
        }
    }
};
