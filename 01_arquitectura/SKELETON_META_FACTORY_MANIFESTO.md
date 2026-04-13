---
METAFAC_VER: 0.3.3
GEO_LOC: MetaFactory/lab/AIP/01_arquitectura/SKELETON_META_FACTORY_MANIFESTO.md
PRODUCED_BY: Antigravity
AFFINITY_GROUP: SISTEMA
CONTENT_CAT: ARCH
PATTERN_TYPE: ARCHITECT
STATUS: AUDITED
TIMESTAMP: 2026-03-15
---

# MANIFIESTO: Skeleton Meta-Factory (Chasis Universal)

**Estado:** AGNOSTIC / Clean Twin
**Origen:** `quarantine/residues/MEMORIA_ARQUITECTONICA_v1_20260224.md`
**Auditado por:** El Bibliotecario (Antigravity v0.3.3)

---

## 1. Definición Canónica
Skeleton no es un SaaS final; es una **Meta-Factoría de SaaS**. Es un chasis arquitectónico inmutable que se configura mediante la inyección de ADN (offeringConfig) para desplegar verticales de negocio (Real Estate, Logistics, Trade, etc.) sin reprogramar el núcleo.

## 2. Arquitectura de 3 Capas

1.  **CAPA 1: Core Inmutable (El Chasis)**: `store`, `event-bus`, `scene-manager`, `gatekeeper`, `auth`. Zero business logic.
2.  **CAPA 2: ADN Inyectable (offeringConfig)**: Metadatos generados por el Wizard de AIMON que definen la marca, la vertical y los campos de datos.
3.  **CAPA 3: Blueprints / Web Components**: Widgets funcionales (`wd-*`) y artefactos (`at-*`) portables y agnósticos al framework.

## 3. Los 5 Diferenciadores Útiles
- **Polimorfismo Radical**: Una sola entidad sirve para N verticales mediante esquemas definidos en runtime.
- **Adopción Tardía**: El usuario configura primero (Fase Seed) y se loguea después (Sello de Propiedad).
- **Gatekeeper Compliance**: Seguridad fractal y firma legal forzada por diseño.
- **Triple Escritura Atómica**: Sincronización garantizada entre Local, Store y Cloud.
- **Dependencia Arquitectónica**: El valor se genera a través de la configuración y el know-how acumulado, no por cautiverio técnico.

## 4. Jerarquía IA (Agnóstica)
- **AITOR**: Optimizador de prompts y herramientas de desarrollo.
- **KAIROS**: El Demiurgo que valida la arquitectura y los modelos de negocio.
- **AIMON**: El Gestor Operativo que guía al usuario y gestiona la monetización contextual.

---
*Este documento preserva la visión original del sistema, purgada de incertidumbres técnicas y lista para guiar la evolución de Skeleton y AIP.*
