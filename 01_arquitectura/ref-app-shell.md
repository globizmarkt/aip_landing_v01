# BLUEPRINT: app-shell.js — Contenedor Soberano (Trinity Shell)
**Tipo:** Tejido Nuclear (Layout)
**Doctrina:** R0, R2 (Light DOM), R3 (Zero-Hex), R4 (i18n)
**Versión Spec:** 1.0.0
**Custodio:** Antigravity (Core Architect)

---

## 1. VISIÓN

El `AppShell` es el **contenedor arquitectónico irrompible** del sistema. Implementa la **Geometría Trinity** — las 3 órbitas fijas — directamente en el DOM principal, sin Shadow DOM, sin iframes, sin contenedores de terceros.

Es el primer elemento que aparece en el `body` y el último en desaparecer. Ninguna escena, ningún gadget, ninguna vertical puede romper su estructura.

---

## 2. LA GEOMETRÍA TRINITY (INMUTABLE)

```
┌─────────────────────────────────────────────────────────┐
│  [ÓRBITA-1: NAV]  │  [ÓRBITA-2: CANVAS]  │ [ÓRBITA-3] │
│   Navegación Izq  │   Espacio de Trabajo  │  Inspector  │
│   250px fija      │   flex: 1 (expansivo) │  320px fija │
└─────────────────────────────────────────────────────────┘
```

Las dimensiones de las órbitas laterales son configurables vía tokens CSS (`--orbit-1-width`, `--orbit-3-width`), pero su existencia y orden es **constitucional**.

---

## 3. REGLAS DE INMUTABILIDAD

| Regla | Descripción |
|-------|-------------|
| **R-SHELL-01** | El componente se define como `<app-shell>` en el HTML. Jamás se instancia por JS. |
| **R-SHELL-02** | **Prohibido `attachShadow()`** (R2). Todo el CSS es global y scoped por clases `.sk-orbit-*`. |
| **R-SHELL-03** | **Prohibido texto hardcodeado** (R4). Todos los textos usan `data-i18n`. El Shell dispara un evento al arrancar para que el motor i18n hidrate. |
| **R-SHELL-04** | **Prohibido color hexadecimal** (R3). Solo `var(--theme-*)` o `var(--sk-*)`. |
| **R-SHELL-05** | El Shell nunca decide qué escena mostrar. Escucha `'skeleton:scene:change'` y delega la lógica al `SceneManager`. |
| **R-SHELL-06** | Los slots de las 3 órbitas son `<slot name="orbit-1/2/3">`. El contenido es siempre proyectado desde el HTML padre, nunca generado internamente. |

---

## 4. FRONTERAS CON LA LÓGICA DE NEGOCIO

- ✅ Aplica el tema visual recibido vía `offeringConfig.theme` (solo inyecta clases CSS, no interpreta el negocio).
- ✅ Muestra/oculta órbitas según atributos `orbit-1-visible`, `orbit-3-visible`.
- ❌ Nunca importa datos de negocio, esquemas o gadgets específicos.
- ❌ Nunca llama al Gatekeeper, PassportEngine ni Store directamente (solo escucha eventos del bus).

---

## 5. DEPENDENCIAS ESTRICTAS

| Módulo | Tipo | Justificación |
|--------|------|---------------|
| `at-i18n.js` | Dependencia suave (evento) | Escucha `'skeleton:i18n:ready'` para hidratar textos del chrome. |
| `workspace-layout.css` | CSS global | Define la geometría Trinity. Debe cargarse antes del componente. |

---

## 6. ATRIBUTOS OBSERVADOS

```html
<app-shell
  theme="dark"
  orbit-1-visible="true"
  orbit-3-visible="true"
  locale="en"
>
```

| Atributo | Tipo | Default | Efecto |
|----------|------|---------|--------|
| `theme` | `string` | `'dark'` | Añade clase `sk-theme-{value}` al host |
| `orbit-1-visible` | `boolean` | `true` | Colapsa/expande la órbita de navegación |
| `orbit-3-visible` | `boolean` | `true` | Colapsa/expande el inspector |
| `locale` | `string` | `'en'` | Propaga el atributo `lang` al `<html>` |

---

## 7. EVENTOS QUE EMITE

| Evento | Payload | Cuándo |
|--------|---------|--------|
| `skeleton:shell:ready` | `{ timestamp }` | Cuando el DOM del Shell está resuelto |
| `skeleton:shell:orbit-toggle` | `{ orbit, visible }` | Cuando una órbita cambia de visibilidad |

---

## 8. NOTAS DE UPGRADE

- En versiones futuras, los slots pueden reemplazarse por un sistema de paneles dinámicos con animación de entrada/salida.
- El `<app-shell>` puede escalar a un sistema de "teleporting" de órbitas para layouts responsivos sin modificar la geometría base.
