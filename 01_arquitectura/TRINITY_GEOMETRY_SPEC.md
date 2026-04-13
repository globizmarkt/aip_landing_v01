---
METAFAC_VER: 0.3.3
GEO_LOC: MetaFactory/lab/AIP/01_arquitectura/TRINITY_GEOMETRY_SPEC.md
PRODUCED_BY: Antigravity
AFFINITY_GROUP: SISTEMA
CONTENT_CAT: ARCH
PATTERN_TYPE: ARCHITECT
STATUS: AUDITED
TIMESTAMP: 2026-03-15
---

# SPEC: Trinity Geometry (WebOS Layout)
**Estado:** AGNOSTIC / Baselines v2.5
**Aplicación:** Agnostic Core (Skeleton / Meta SaaS)

## 1. Concepto: El WebOS de Tres Órbitas
El sistema no se comporta como una web tradicional, sino como un **Sistema Operativo Web (WebOS)**. La estructura de 3 columnas (Órbitas) permite que la verticalidad del negocio (Inmobiliaria, Commodities, Legal) sea intercambiable sin afectar la experiencia del usuario.

## 2. Anatomía de las Órbitas

| Órbita | Ancho | Función | Responsabilidad |
|---|---|---|---|
| **Órbita 1 (Sidebar)** | 250px | Navegador de Contextos | Selector de "mundos" o módulos. Colapsable a 64px. |
| **Órbita 2 (Canvas)** | flex: 1 | Área de Ejecución | Inyección dinámica de Gadgets (`gd-*`). Grid de 12 columnas. |
| **Órbita 3 (Inspector)** | 320px | Gobernanza y Sistema | AIMON (IA), Gatekeeper Status, Metadatos. |

## 3. Geometría CSS (Design Tokens)

```css
:root {
  --orbit-1-width: 250px;
  --orbit-2-min-width: 600px;
  --orbit-3-width: 320px;
  --header-height: 64px;
  --footer-height: 48px;

  /* Colores de Sistema (Agnósticos) */
  --surface-primary: #0a1628;  /* Fondo Base */
  --surface-elevated: #112240; /* Sidebar/Inspector */
  --surface-canvas: #fafafa;   /* Lienzo de Trabajo */
  --accent-primary: #3b82f6;   /* Color de Acción Principal */
  --border-standard: rgba(255,255,255,0.1);
}
```

## 4. Reglas de Inyección Automática
- El `project_manifest.json` define qué Gadgets se cargan en la **Órbita 2**.
- La **Órbita 1** emite eventos de cambio de contexto a través del `globalBus`.
- La **Órbita 3** inspecciona reactivamente el estado del Gadget activo en la Órbita 2.

---
*Extraído y Agnostizado por El Bibliotecario desde los residuos históricos v2.5.*
