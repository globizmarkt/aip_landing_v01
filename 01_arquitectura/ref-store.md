# BLUEPRINT: store.js — Master State Manager
**Tipo:** Tejido Nuclear (Core)
**Doctrina:** R0, R3, R5
**Versión Spec:** 1.0.0
**Custodio:** Antigravity (Core Architect)

---

## 1. VISIÓN

El `Store` es la **Única Fuente de Verdad** del sistema. Todo estado que afecte la UI o la lógica de negocio debe residir aquí y solo aquí. Ningún módulo guarda estado localmente.

Es un Singleton reactivo (patrón Zustand-like en Vanilla JS puro): los suscriptores reciben notificaciones automáticas de cambios específicos sin ningún framework externo.

---

## 2. ANATOMÍA DEL ESTADO

El estado está dividido en **3 ramas canónicas**. Esta estructura es **INMUTABLE** — ninguna vertical puede renombrar ni eliminar ramas:

```
state
 ├── auth         → Identidad del operador activo
 ├── project      → Configuración inyectada por la vertical
 └── meta         → Datos operativos del chasis
```

La propiedad `project.offeringConfig` es el **punto de inyección** de la vertical. El Core nunca lee su contenido directamente.

---

## 3. REGLAS DE INMUTABILIDAD

| Regla | Descripción |
|-------|-------------|
| **R-STORE-01** | Solo `Store.setState()` puede mutar el estado. Prohibido acceder a `Store.state` directamente para escritura. |
| **R-STORE-02** | Las ramas `auth`, `project` y `meta` no pueden ser eliminadas ni renombradas por inyecciones verticales. |
| **R-STORE-03** | `Store.nuke()` es el único método que resetea el estado completo. Requiere confirmación explícita en el código llamante. |
| **R-STORE-04** | El sistema de suscripción es la única vía de comunicación reactiva. Prohibido usar polling o setInterval para detectar cambios. |
| **R-STORE-05** | El almacenamiento físico (`sessionStorage`) es un efecto secundario del Store, no una fuente de verdad paralela. |

---

## 4. FRONTERAS CON LA LÓGICA DE NEGOCIO

El `Store` es **ciego al negocio**:
- ✅ Sabe que existe `project.offeringConfig` pero **no interpreta** su contenido.
- ✅ Sabe que `auth.user` tiene un `role` pero **no aplica** reglas de acceso (eso es trabajo del `Gatekeeper`).
- ❌ Nunca importa módulos de negocio (`passport-engine`, esquemas, etc.).
- ❌ Nunca hace llamadas a Firebase directamente.

---

## 5. DEPENDENCIAS ESTRICTAS

| Módulo | Tipo | Justificación |
|--------|------|---------------|
| Ninguno | — | El Store es la capa más baja del Core. Cero dependencias de otros módulos del proyecto. |

---

## 6. INTERFAZ PÚBLICA

```javascript
Store.init(verticalDNA?: string): void
Store.getState(): StateSnapshot
Store.setState(patch: Partial<State>): void
Store.subscribe(path: string, callback: Function): UnsubscribeFn
Store.nuke(): void
```

---

## 7. NOTAS DE UPGRADE

- La función `snapshot()` (persistencia) puede ser separada en un módulo `persistence-adapter.js` en versiones futuras sin romper el contrato público.
- El patrón de suscripción por `path` (ej: `'auth.user'`) permite granularidad O(n-suscriptores) sin re-renderizar componentes no afectados.
