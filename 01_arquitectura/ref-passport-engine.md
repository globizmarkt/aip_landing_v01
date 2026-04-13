# BLUEPRINT: passport-engine.js — Motor de Validación Fiduciaria
**Tipo:** Tejido Nuclear (Core / Compliance)
**Doctrina:** R0, R3, R5
**Versión Spec:** 1.0.0
**Custodio:** Antigravity (Core Architect)

---

## 1. VISIÓN

El `PassportEngine` es el **guardián de identidad institucional** del sistema. Gestiona el ciclo de vida del "Pasaporte Electrónico" del operador: desde la autenticación anónima hasta la validación KYC completa (o su bloqueo por Custodia Fiduciaria).

No es un autenticador. Es un **evaluador de estado de confianza** — transforma las credenciales crudas de Firebase en un estado de sesión semánticamente rico que el resto del Core puede consumir sin conocer el proveedor de identidad.

---

## 2. ESTADOS DEL PASAPORTE

El pasaporte es siempre uno de estos 5 estados. La transición entre ellos es **secuencial y unidireccional** (no se puede retroceder sin acción explícita del Compliance Officer):

```
ANONYMOUS → AUTHENTICATED → KYC_PENDING → VALIDATED
                                              │
                                         CUSTODY_HOLD  ← si IntegrityScore < umbral
```

| Estado | Descripción | Acceso al Core |
|--------|-------------|----------------|
| `ANONYMOUS` | Sin sesión. Operando en modo Gestación Local. | Solo escenas libres |
| `AUTHENTICATED` | Sesión activa, pero sin verificación KYC. | Escenas básicas + onboarding |
| `KYC_PENDING` | Documentación enviada, en revisión. | Solo lectura |
| `VALIDATED` | KYC aprobado. IntegrityScore ≥ umbral. | Acceso completo según Claims |
| `CUSTODY_HOLD` | Bloqueado por IntegrityScore < umbral o veto de AML. | Cero acceso — UI de bloqueo |

---

## 3. EL INTEGRITY SCORE

El `IntegrityScore` es un entero `0-100` calculado por el motor a partir de los factores de riesgo del operador. Es el **Hard Gate** del sistema:

- **Score ≥ umbral (default: 60):** Acceso garantizado a escenas validadas.
- **Score < umbral:** Activación automática de `CUSTODY_HOLD`. Sin override manual vía UI.

El umbral es configurable por la vertical vía `offeringConfig.complianceThreshold`. El default del Core es `60`.

---

## 4. EVALUACIÓN O(1) DE CUSTOM CLAIMS

Los Custom Claims se almacenan como **booleanos planos** en el objeto `claims` del Store, nunca como arrays ni listas anidadas. Esto garantiza evaluación en tiempo constante:

```javascript
// ✅ Correcto — O(1)
claims = { canAccessWorkspace: true, canWrite: false, isKycVerified: true }

// ❌ Incorrecto — O(n)
claims = { roles: ['admin', 'partner', 'deskManager'] }
```

El PassportEngine es el **único módulo** autorizado a escribir en `auth.claims` del Store.

---

## 5. REGLAS DE INMUTABILIDAD

| Regla | Descripción |
|-------|-------------|
| **R-PE-01** | Solo el PassportEngine escribe en `Store.state.auth`. Ningún otro módulo puede modificar la identidad del operador. |
| **R-PE-02** | El estado `CUSTODY_HOLD` solo puede ser revertido por una acción explícita del Compliance Officer vía backend (Custom Claim `custodyReleased: true`). La UI no tiene esa capacidad. |
| **R-PE-03** | El `IntegrityScore` es calculado en el backend. El frontend lo recibe vía Custom Claims. Nunca se calcula en el cliente. |
| **R-PE-04** | El pasaporte es serializado en `sessionStorage` exclusivamente. Prohibido `localStorage` (riesgo de persistencia inter-sesión). |
| **R-PE-05** | Ante cualquier error de verificación, el motor debe colocar el pasaporte en `ANONYMOUS` (fail-safe), nunca en un estado indeterminado. |

---

## 6. FRONTERAS CON LA LÓGICA DE NEGOCIO

- ✅ Lee `offeringConfig.complianceThreshold` del Store para determinar el umbral de bloqueo.
- ✅ Emite `skeleton:passport:updated` con el estado completo del pasaporte.
- ❌ No sabe qué tipo de activos gestiona la vertical.
- ❌ No conoce los campos del formulario KYC (eso es trabajo de un gadget externo).
- ❌ No llama directamente a proveedores de verificación (Onfido, Jumio, etc.). Solo evalúa el resultado ya procesado en el backend.

---

## 7. DEPENDENCIAS ESTRICTAS

| Módulo | Tipo | Justificación |
|--------|------|---------------|
| `store.js` | Import directo | Único cliente autorizado para escribir en `auth`. |
| Firebase Auth | Evento (externo) | Escucha `onAuthStateChanged` vía `auth-manager.js`. |
| `auth-manager.js` | Evento | Recibe el token ya verificado y los Custom Claims. |

---

## 8. EVENTOS QUE EMITE

| Evento | Payload | Cuándo |
|--------|---------|--------|
| `skeleton:passport:updated` | `{ state, score, claims }` | En cada cambio de estado del pasaporte. |
| `skeleton:passport:custody` | `{ reason, score }` | Cuando se activa la Custodia Fiduciaria. |
| `skeleton:passport:cleared` | `{ timestamp }` | Cuando se cierra la sesión y el pasaporte se limpia. |

---

## 9. NOTAS DE UPGRADE

- La integración con ed25519 (firma de sesión para la Triple Esclusa) se implementa en la Etapa 3 del flujo de compliance, como un método adicional `PassportEngine.signSession(challenge)`.
- El motor puede escalar a múltiples niveles de custodia (`SOFT_HOLD`, `HARD_HOLD`) sin romper el contrato público.
