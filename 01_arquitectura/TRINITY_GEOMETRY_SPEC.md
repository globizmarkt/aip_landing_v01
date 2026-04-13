# SPEC: Trinity Geometry (WebOS Layout)
**Estado:** SOBERANO / Baselines v3.0 (Post-Purga)
**Versión:** 3.0.1
**Doctrina:** R3 (Zero-Hex) / Alta Banca

---

## 1. Concepto: El WebOS de Tres Órbitas
El sistema no se comporta como una web tradicional, sino como un **Sistema Operativo Web (WebOS)**. La estructura de 3 columnas (Órbitas) garantiza la inmutabilidad de la experiencia mientras la lógica de negocio fluye dinámicamente.

## 2. Anatomía de las Órbitas

| Órbita | Ancho | Función | Responsabilidad |
|---|---|---|---|
| **Órbita 1 (Sidebar)** | `var(--sidebar-width)` | Navegador de Contextos | Selector de mundos. Colapsable a 64px. |
| **Órbita 2 (Canvas)** | `flex: 1` | Área de Ejecución | Inyección dinámica de Gadgets. |
| **Órbita 3 (Inspector)** | `var(--inspector-width)` | Gobernanza y Sistema | AIMON (IA), Gatekeeper y Metadatos. |

## 3. Geometría CSS (Abstracción Total)

Queda estrictamente prohibido el uso de valores hexadecimales en este documento. Toda la geometría debe referenciar los tokens institucionales del `theme-landing.css`:

```css
:root {
  /* Dimensiones Trinity */
  --orbit-1-width: var(--sidebar-width);
  --orbit-2-min-width: 600px;
  --orbit-3-width: var(--inspector-width);
  --header-height: var(--header-height);
  --footer-height: var(--footer-height);

  /* Colores de Sistema (Soberanos) */
  --surface-primary: var(--color-bg-primary);     /* Profundidad Fiduciaria */
  --surface-elevated: var(--color-bg-elevated);   /* Elevación de Contexto */
  --surface-canvas: var(--color-bg-primary);      /* Inmutabilidad del Fondo */
  --accent-primary: var(--color-accent);          /* UK Gold (Autoridad) */
  --border-standard: var(--color-border);         /* Rejilla Estructural */
}
```

## 4. Invariantes de Diseño
1.  **Cero Hexadecimales:** Ningún componente puede definir colores fuera de la variable `--color-*`.
2.  **Espaciado Aislado:** El Canvas (Órbita 2) no puede afectar el ancho de las Órbitas 1 y 3.
3.  **Fiduciary Tone:** El uso de bordes debe limitarse a la separación de contextos (Structural Grid).

---
*Rectificado por Antigravity tras Auditoría Sentinel v2.5. La arquitectura SaaS ha sido purgada.*
