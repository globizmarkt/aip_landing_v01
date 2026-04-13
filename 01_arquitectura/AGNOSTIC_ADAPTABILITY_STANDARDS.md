---
METAFAC_VER: 0.3.3
GEO_LOC: MetaFactory/lab/AIP/01_arquitectura/AGNOSTIC_ADAPTABILITY_STANDARDS.md
PRODUCED_BY: Antigravity
AFFINITY_GROUP: SISTEMA
CONTENT_CAT: AUDIT
PATTERN_TYPE: ARCHITECT
STATUS: AUDITED
TIMESTAMP: 2026-03-15
---

# SPEC: Agnostic Adaptability Standards (Adaptability Map)

**Estado:** AGNOSTIC / Compliance Standard
**Aplicación:** Auditoría de Calidad y Deuda Técnica

## 1. El Índice de Adaptabilidad (R0 - R4)
Define el nivel de preparación de un componente o página para ser integrado en el ecosistema agnóstico del Meta SaaS.

| Nivel | Nombre | Descripción Técnica | Estado de Auditoría |
|---|---|---|---|
| **R0** | **Monolítico** | Texto hardcodeado, colores hexadecimales en CSS, lógica vertical acoplada. | **TÓXICO** (Prohibido) |
| **R1** | **Abstraído** | Uso de constantes para textos (no i18n), estilos agrupados pero no variables. | **DEUDA** |
| **R2** | **Tematizado** | Uso de variables CSS para colores, pero nombres no semánticos (ej: `--blue`). | **MEJORABLE** |
| **R3** | **Internacional** | Soporte total `data-i18n`, variables CSS semánticas (`--accent-primary`). | **COMPLIANT** |
| **R4** | **Agnóstico** | Componente 100% modular, sin dependencias de vertical, listo para inyección. | **GOLD STANDARD** |

## 2. Métricas de Distancia
Se mide cuánto esfuerzo requiere un componente para alcanzar el nivel R4:
- **Baja**: Solo falta i18n y ajuste de variables.
- **Media**: Requiere refactorización de lógica para separar contexto vertical.
- **Alta**: Requiere reconstrucción completa desde cero.

## 3. Doctrina de "Inyección Limpia"
Ningún componente puede entrar en el repositorio `Skeleton_v1` si no cumple al menos con el nivel **R3**. El objetivo final de toda la MetaFactory es el nivel **R4**.

---
*Extraído y Agnostizado por El Bibliotecario desde los residuos históricos v2.5.*
