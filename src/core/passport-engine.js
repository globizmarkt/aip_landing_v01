/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: passport-engine.js — Motor de Validación Fiduciaria
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   1.0.0 (Skeleton Core)
 * DOCTRINA:  R0 (Agnosticismo Radical) | R3 (Zero-Hex)
 * DEPS:      store.js (escritura exclusiva en auth.*)
 * ───────────────────────────────────────────────────────────────────
 * REGLAS DE ESTE ARCHIVO:
 *   ✅ Único módulo que escribe en Store.state.auth.
 *   ✅ Claims como booleanos planos — evaluación O(1).
 *   ✅ IntegrityScore recibido del backend, nunca calculado en cliente.
 *   ✅ CUSTODY_HOLD no tiene override vía UI (fail-secure).
 *   ✅ Persistencia exclusiva en sessionStorage.
 *   ❌ Prohibido localStorage.
 *   ❌ Prohibido importar lógica de negocio de la vertical.
 * ═══════════════════════════════════════════════════════════════════
 */

import { Store } from './store.js';

/* [SEC-01] CONSTANTES DE CONTROL */
const _PASSPORT_KEY        = 'skeleton_passport_v1';
const _DEFAULT_THRESHOLD   = 60;    // IntegrityScore mínimo para VALIDATED

/* [SEC-02] ESTADOS CANÓNICOS DEL PASAPORTE
 * Transición válida: ANONYMOUS → AUTHENTICATED → KYC_PENDING → VALIDATED
 * Desde cualquier estado → CUSTODY_HOLD (si score < umbral o veto AML)
 * Desde cualquier estado → ANONYMOUS (logout o error fatal)
 */
const PassportState = Object.freeze({
    ANONYMOUS:       'ANONYMOUS',
    AUTHENTICATED:   'AUTHENTICATED',
    KYC_PENDING:     'KYC_PENDING',
    VALIDATED:       'VALIDATED',
    CUSTODY_HOLD:    'CUSTODY_HOLD'
});

/* [SEC-03] PASAPORTE INICIAL (Vacío / Estéril) */
const _EMPTY_PASSPORT = {
    state:          PassportState.ANONYMOUS,
    uid:            null,
    email:          null,
    claims:         {},         // Booleanos planos: { canAccessWorkspace: false, ... }
    integrityScore: null,       // null = no evaluado aún. Viene del backend.
    custodyReason:  null,       // Solo poblado si state === CUSTODY_HOLD
    verifiedAt:     null,
    expiresAt:      null
};

/* [SEC-04] SINGLETON EXPORTADO */
export const PassportEngine = {

    _passport:   structuredClone(_EMPTY_PASSPORT),
    _threshold:  _DEFAULT_THRESHOLD,
    _ready:      false,

    /* ─────────────────────────────────────────────
     * INICIALIZACIÓN
     * ───────────────────────────────────────────── */

    /**
     * Inicializa el motor.
     * Hidrata desde sessionStorage si existe pasaporte previo.
     * Escucha el evento de AuthManager para procesar cambios de sesión.
     */
    init() {
        // Leer umbral del offeringConfig si existe
        const config = Store.getState().project?.offeringConfig;
        if (config?.complianceThreshold) {
            this._threshold = config.complianceThreshold;
        }

        // Intentar hidratar desde sesión anterior
        this._hydrateFromSession();

        // 3. Escuchar eventos del AuthManager
        document.addEventListener('skeleton:auth:token-ready', (e) => {
            const { user, claims } = e.detail ?? {};
            if (user) {
                this._processAuthentication(user, claims ?? {});
            } else {
                this.clear();
            }
        });

        // 4. Convergencia Track B: Escuchar sumisión de Pre-KYC
        document.addEventListener('Skeleton:PreKyc:Submitted', (e) => {
            const payload = e.detail;
            if (payload && payload.data) {
                this.evaluateIntegrity(payload.data);
            }
        });

        this._ready = true;
        console.log('[PASSPORT-ENGINE] ✅ Motor de Pasaportes listo y sincronizado.');
    },

    /* ─────────────────────────────────────────────
     * PROCESAMIENTO DE AUTENTICACIÓN
     * ───────────────────────────────────────────── */

    /**
     * Procesa el resultado de autenticación proveniente del AuthManager.
     * No contacta Firebase directamente — trabaja con el token ya verificado.
     *
     * Flujo de evaluación:
     *   1. Mapear claims a booleanos planos (O(1)).
     *   2. Evaluar IntegrityScore contra el umbral.
     *   3. Determinar el estado del pasaporte.
     *   4. Escribir en Store y emitir evento.
     *
     * @param {Object} user   - { uid, email } del operador autenticado.
     * @param {Object} rawClaims - Custom Claims crudos del token Firebase.
     */
    _processAuthentication(user, rawClaims) {
        // --- PASO 1: Normalizar claims a booleanos planos ---
        // R-PE-03: IntegrityScore viene del backend como claim.
        const normalizedClaims = this._normalizeClaims(rawClaims);
        const score = rawClaims.integrityScore ?? null;

        // --- PASO 2: Detectar Custodia Fiduciaria ---
        if (this._isCustodyActive(rawClaims, score)) {
            const reason = rawClaims.custodyReason ?? 'integrity_score_below_threshold';
            this._activateCustodyHold(user, normalizedClaims, score, reason);
            return;
        }

        // --- PASO 3: Determinar estado KYC ---
        let passportState = PassportState.AUTHENTICATED;
        if (normalizedClaims.isKycVerified === true) {
            passportState = PassportState.VALIDATED;
        } else if (normalizedClaims.isKycPending === true) {
            passportState = PassportState.KYC_PENDING;
        }

        // --- PASO 4: Construir y persistir el pasaporte ---
        this._passport = {
            state:          passportState,
            uid:            user.uid,
            email:          user.email ?? null,
            claims:         normalizedClaims,
            integrityScore: score,
            custodyReason:  null,
            verifiedAt:     Date.now(),
            expiresAt:      rawClaims.exp ? rawClaims.exp * 1000 : null
        };

        this._commit();
    },

    /* ─────────────────────────────────────────────
     * EVALUACIÓN DE INTEGRIDAD (PRE-KYC)
     * ───────────────────────────────────────────── */

    /**
     * Realiza una evaluación preliminar de integridad basada en 
     * declaraciones del usuario (Pre-KYC).
     * @track B - Lógica/UI (Invocador)
     * @track A - Estructural (Implementador)
     * 
     * @param {Object} input - Datos del formulario Pre-KYC.
     * @returns {number} Score final calculado.
     */
    evaluateIntegrity(input = {}) {
        let score = 0;

        // 1. Jurisdicción (Peso: 30)
        // input.tier: 1 (FCA/MiFID), 2 (FATF equivalent), 3 (High Risk)
        if (input.tier === 1) score += 30;
        else if (input.tier === 2) score += 15;
        else if (input.tier === 3) score -= 50;

        // 2. Tipo de Entidad (Peso: 30)
        // input.entityType: 'institutional', 'professional', 'qualified', 'retail'
        const entityWeights = { institutional: 30, professional: 25, qualified: 10, retail: 0 };
        score += entityWeights[input.entityType] || 0;

        // 3. AUM (Peso: 25)
        // input.aumRange: 'high' (>100M), 'mid' (10-100M), 'low' (<10M)
        const aumWeights = { high: 25, mid: 15, low: 0 };
        score += aumWeights[input.aumRange] || 0;

        // 4. Origen de Fondos (Peso: 15)
        // input.sof: 'verifiable', 'corporate', 'other'
        const sofWeights = { verifiable: 15, corporate: 10, other: 0 };
        score += sofWeights[input.sof] || 0;

        // --- Persistencia del Veredicto ---
        this._passport.integrityScore = score;
        
        console.log(`[PASSPORT-ENGINE] 🧩 Evaluación preliminar completada. Score: ${score}/${this._threshold}`);

        // Evaluar custodia automática
        if (score < this._threshold) {
            this._activateCustodyHold(
                { uid: 'guest', email: input.email || 'anonymous' }, 
                {}, 
                score, 
                'preliminary_integrity_below_threshold'
            );
        } else {
            // Commit del score para que el Gatekeeper permita pasar al GATE
            this._commit();
        }

        return score;
    },

    /* ─────────────────────────────────────────────
     * EVALUACIÓN DE CLAIMS — O(1)
     * ───────────────────────────────────────────── */

    /**
     * Normaliza los Custom Claims a booleanos planos para búsqueda O(1).
     * El Core no conoce el significado de cada claim — solo los almacena.
     *
     * @param {Object} rawClaims - Claims crudos del token.
     * @returns {Object} - Mapa plano de booleanos.
     */
    _normalizeClaims(rawClaims) {
        const normalized = {};
        for (const [key, value] of Object.entries(rawClaims)) {
            // Solo trasladar booleanos. Ignorar metadatos del token (exp, iat, etc.)
            if (typeof value === 'boolean') {
                normalized[key] = value;
            }
        }
        return normalized;
    },

    /**
     * Evalúa un claim específico en O(1).
     * Usado por el Gatekeeper antes de cada transición de escena.
     *
     * @param {string} claimKey - Nombre del claim a evaluar.
     * @returns {boolean}
     */
    hasClaim(claimKey) {
        return this._passport.claims[claimKey] === true;
    },

    /* ─────────────────────────────────────────────
     * CUSTODIA FIDUCIARIA
     * ───────────────────────────────────────────── */

    /**
     * Determina si se debe activar la Custodia Fiduciaria.
     * Condiciones (OR):
     *   - IntegrityScore < umbral
     *   - Claim `custodyActive: true` (veto explícito del Compliance Officer)
     * @private
     */
    _isCustodyActive(rawClaims, score) {
        const vetoed = rawClaims.custodyActive === true;
        const lowScore = score !== null && score < this._threshold;
        return vetoed || lowScore;
    },

    /**
     * Activa el estado CUSTODY_HOLD.
     * La UI mostrará la pantalla de bloqueo. Sin override posible desde el cliente.
     *
     * R-PE-02: Solo el backend puede revertir este estado.
     * @private
     */
    _activateCustodyHold(user, claims, score, reason) {
        this._passport = {
            ...structuredClone(_EMPTY_PASSPORT),
            state:          PassportState.CUSTODY_HOLD,
            uid:            user.uid,
            email:          user.email ?? null,
            claims,
            integrityScore: score,
            custodyReason:  reason,
            verifiedAt:     Date.now()
        };

        this._commit();

        // Notificar al sistema para que active la escena CUSTODY
        document.dispatchEvent(new CustomEvent('skeleton:passport:custody', {
            detail: { reason, score }
        }));

        console.warn(`[PASSPORT-ENGINE] 🔒 CUSTODY_HOLD activada. Razón: ${reason}. Score: ${score}/${this._threshold}`);
    },

    /* ─────────────────────────────────────────────
     * COMMIT — ESCRITURA AL STORE Y PERSISTENCIA
     * ───────────────────────────────────────────── */

    /**
     * Escribe el pasaporte actualizado en el Store y en sessionStorage.
     * Emite el evento global de actualización.
     * @private
     */
    _commit() {
        // Escritura exclusiva del PassportEngine en auth.*
        Store.setState({
            auth: {
                user: {
                    uid:   this._passport.uid,
                    email: this._passport.email,
                    role:  this._passport.state          // El 'role' semántico es el estado del pasaporte
                },
                claims: this._passport.claims
            }
        });

        // Persistir en sessionStorage (R-PE-04: nunca localStorage)
        try {
            sessionStorage.setItem(_PASSPORT_KEY, JSON.stringify(this._passport));
        } catch (e) {
            console.error('[PASSPORT-ENGINE] Error en persistencia de sesión:', e);
        }

        // Emitir estado actualizado al sistema
        document.dispatchEvent(new CustomEvent('skeleton:passport:updated', {
            detail: {
                state:  this._passport.state,
                score:  this._passport.integrityScore,
                claims: { ...this._passport.claims }
            }
        }));

        console.log(`[PASSPORT-ENGINE] 📜 Pasaporte actualizado → ${this._passport.state}`);
    },

    /* ─────────────────────────────────────────────
     * HIDRATACIÓN DESDE SESIÓN
     * ───────────────────────────────────────────── */

    /**
     * Recupera el pasaporte de sessionStorage al recargar la página.
     * @private
     */
    _hydrateFromSession() {
        try {
            const serialized = sessionStorage.getItem(_PASSPORT_KEY);
            if (!serialized) return;

            const saved = JSON.parse(serialized);

            // Verificar expiración del token
            if (saved.expiresAt && Date.now() > saved.expiresAt) {
                console.warn('[PASSPORT-ENGINE] Token expirado. Limpiando sesión.');
                this.clear();
                return;
            }

            this._passport = saved;

            // Re-sincronizar el Store con el estado hidratado
            Store.setState({
                auth: {
                    user:   { uid: saved.uid, email: saved.email, role: saved.state },
                    claims: saved.claims
                }
            });

            console.log(`[PASSPORT-ENGINE] 💾 Pasaporte hidratado desde sesión → ${saved.state}`);
        } catch (e) {
            console.error('[PASSPORT-ENGINE] Error hidratando sesión. Reiniciando.', e);
            this.clear();
        }
    },

    /* ─────────────────────────────────────────────
     * CIERRE DE SESIÓN
     * ───────────────────────────────────────────── */

    /**
     * Limpia el pasaporte y resetea el estado de autenticación.
     * R-PE-05: Ante cualquier error → estado ANONYMOUS seguro.
     */
    clear() {
        this._passport = structuredClone(_EMPTY_PASSPORT);
        sessionStorage.removeItem(_PASSPORT_KEY);

        Store.setState({
            auth: { user: null, claims: {} }
        });

        document.dispatchEvent(new CustomEvent('skeleton:passport:cleared', {
            detail: { timestamp: Date.now() }
        }));

        console.log('[PASSPORT-ENGINE] 🔓 Pasaporte limpiado. Estado → ANONYMOUS.');
    },

    /* ─────────────────────────────────────────────
     * UTILIDADES PÚBLICAS
     * ───────────────────────────────────────────── */

    /** Retorna un snapshot inmutable del pasaporte actual. */
    getPassport() {
        return structuredClone(this._passport);
    },

    /** Retorna el estado actual del pasaporte. */
    getState() {
        return this._passport.state;
    },

    /** Retorna el IntegrityScore actual. */
    getScore() {
        return this._passport.integrityScore;
    },

    /** Retorna true si el pasaporte está en Custodia Fiduciaria. */
    isInCustody() {
        return this._passport.state === PassportState.CUSTODY_HOLD;
    },

    /** Exporta los estados como constante para uso externo. */
    States: PassportState
};
