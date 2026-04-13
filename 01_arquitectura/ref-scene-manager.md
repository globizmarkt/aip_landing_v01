# BLUEPRINT: scene-manager.js — Orquestador de Navegación
**Tipo:** Tejido Nuclear (Core)
**Doctrina:** R0, R3, R5
**Versión Spec:** 1.0.0
**Custodio:** Antigravity (Core Architect)

---

## 1. VISIÓN

El `SceneManager` es el **sistema nervioso central de la navegación**. Determina qué escena es visible en la Órbita 2 (Canvas) en cada momento, aplicando las reglas de acceso antes de cualquier transición.

Es el único módulo autorizado a emitir el evento `skeleton:scene:activate`. Nada más controla la visibilidad del Canvas directamente.

---

## 2. MODELO MENTAL: ESTADO DE UNA MÁQUINA

El SceneManager opera como una **state machine** determinista:

```
          [BOOT]
             │
             ▼
        ┌─────────┐   → Regla de acceso cumplida →  ┌──────────────┐
        │ LANDING │                                   │ DESTINATION  │
        └─────────┘   ← Sesión expirada/revocada ←   └──────────────┘
             │
             ▼
        [GATE/LOCK]  ← IntegrityScore < umbral
```

Cada transición pasa por el **Gatekeeper** antes de ejecutarse. Si la evaluación falla, el SceneManager emite `skeleton:scene:activate` con la escena de bloqueo correspondiente, nunca con la escena destino.

---

## 3. REGISTRO DE ESCENAS

Las escenas válidas se registran en el `SceneManager` al arrancar. El registro incluye:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` | Identificador único. Ej: `'WORKSPACE'` |
| `requiredClaim` | `string\|null` | Custom Claim requerido para acceder. `null` = libre. |
| `fallbackScene` | `string` | Escena a la que redirige si el acceso falla. |
| `orbitConfig` | `object` | Estado de visibilidad de las órbitas en esta escena. |

---

## 4. REGLAS DE INMUTABILIDAD

| Regla | Descripción |
|-------|-------------|
| **R-SM-01** | Toda navegación DEBE pasar por `SceneManager.navigate(sceneId)`. Prohibido manipular el DOM del Canvas directamente. |
| **R-SM-02** | El SceneManager comunica con el AppShell **exclusivamente** vía `document.dispatchEvent`. Prohibidas las referencias directas al elemento DOM. |
| **R-SM-03** | El historial de navegación es inmutable. Una vez registrado, `_history` solo crece, nunca se edita. |
| **R-SM-04** | El SceneManager no renderiza contenido. Solo activa/desactiva escenas ya presentes en el DOM. |
| **R-SM-05** | Antes de cualquier transición, el SceneManager emite `skeleton:scene:before-change`. Si algún listener llama `e.preventDefault()`, la transición se cancela. |

---

## 5. FRONTERAS CON LA LÓGICA DE NEGOCIO

- ✅ Recibe el `offeringConfig` del Store para saber qué escenas están habilitadas en la vertical activa.
- ✅ Lee los `claims` del Store para evaluar el acceso (pero no los interpreta — delega al Gatekeeper).
- ❌ Nunca renderiza componentes de negocio directamente.
- ❌ Nunca llama a Firebase, APIs externas ni hace I/O.

---

## 6. DEPENDENCIAS ESTRICTAS

| Módulo | Tipo | Justificación |
|--------|------|---------------|
| `store.js` | Import directo | Lee `auth.claims` y `meta.currentScene`. |
| `gatekeeper.js` | Import directo | Verifica el acceso antes de cada transición. |
| `app-shell.js` (DOM) | Evento | Emite `skeleton:scene:activate` que el Shell escucha. |

---

## 7. EVENTOS QUE EMITE

| Evento | Payload | Cuándo |
|--------|---------|--------|
| `skeleton:scene:before-change` | `{ from, to }` | Preventable. Antes de ejecutar la transición. |
| `skeleton:scene:activate` | `{ target, orbitConfig }` | Cuando la escena destino está verificada y autorizada. |
| `skeleton:scene:blocked` | `{ attempted, fallback, reason }` | Cuando el acceso fue denegado. |
| `skeleton:scene:after-change` | `{ from, to, timestamp }` | Después de completar la transición. |

---

## 8. EVENTOS QUE ESCUCHA

| Evento | Emisor | Acción |
|--------|--------|--------|
| `skeleton:shell:ready` | AppShell | Arranca la navegación inicial. |
| `skeleton:auth:changed` | AuthManager | Re-evalúa la escena actual ante cambio de sesión. |
| `skeleton:nav:request` | UniversalNav | Recibe solicitudes de navegación del usuario. |

---

## 9. NOTAS DE UPGRADE

- En versiones futuras, el historial puede exportarse para análisis de uso anónimo (sin PII).
- La transición de escenas puede incluir animaciones CSS sin modificar la lógica del SceneManager (separation of concerns puro).
