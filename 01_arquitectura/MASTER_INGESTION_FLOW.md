---
METAFAC_VER: 0.3.3
GEO_LOC: MetaFactory/lab/AIP/01_arquitectura/MASTER_INGESTION_FLOW.md
PRODUCED_BY: Antigravity
AFFINITY_GROUP: SISTEMA
CONTENT_CAT: LOGISTIC
PATTERN_TYPE: ARCHITECT
STATUS: AUDITED
TIMESTAMP: 2026-03-15
---

# SPEC: Master Ingestion Flow (Hydration Logic)

**Estado:** AGNOSTIC / Clean Twin
**Origen:** `quarantine/residues/MASTER_FLUJO_ENTRADA.md` (v2.4)
**Auditado por:** El Bibliotecario (Antigravity v0.3.3)

---

## 1. La Ley de Hierro: Adopción Tardía
"El proyecto nace antes que el usuario". El sistema permite la gestación de datos en modo anónimo (Fase Seed) y solo fuerza la vinculación real (Login) en el momento del "Sellado de Propiedad" (Guardado).

## 2. Ciclo de Hidratación (Store)

```
1. Carga de index.html
2. Store.init() -> Lee SKELETON_V0_MASTER_STATE_V1 (localStorage)
3. Si status === 'GÉNESIS' -> Hidratación Silenciosa (Recuperación automática de borrador)
4. Auth.onAuthStateChanged() -> Sincronización con Cloud
```

## 3. Las Tres Leyes de Invariancia
1.  **Puerta Única**: Ningún componente puede renderizar AppShell sin el veredicto del Gatekeeper.
2.  **Triple Escritura Atómica**: Toda creación de proyecto debe impactar simultáneamente en `localStorage`, `MasterStore` y `Firestore` para evitar desincronización.
3.  **Soberanía del Store**: El Store es la única fuente de verdad; la lectura directa de `localStorage` está prohibida tras la inicialización.

## 4. Jerarquía IA (Agnóstica)
- **KAIROS**: El Demiurgo (Diseño de Alto Nivel).
- **AIMON**: El Gestor Contextual (Acompañamiento en el Wizard).
- **AITOR**: El Optimizador (Refinado de Prompts y Geometría).

---
*Este diseño de flujo ha sido rescatado y agnostizado para servir como base del nuevo AIP y el Skeleton universal.*
