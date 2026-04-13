---
METAFAC_VER: 0.3.3
GEO_LOC: MetaFactory/lab/AIP/01_arquitectura/GATEKEEPER_TRUTH_TABLES.md
PRODUCED_BY: Antigravity
AFFINITY_GROUP: SISTEMA
CONTENT_CAT: AUDIT
PATTERN_TYPE: ARCHITECT
STATUS: AUDITED
TIMESTAMP: 2026-03-15
---

# SPEC: Gatekeeper Truth Tables (Determinist Logic)

**Estado:** AGNOSTIC / Clean Twin
**Origen:** `quarantine/residues/GATEKEEPER_DECISION_TABLES.md` (v2.4)
**Auditado por:** El Bibliotecario (Antigravity v0.3.3)

---

## 1. Matriz Maestra de Estados

| Estado | Auth | Project | Legal | Reseller | Escena Resultante |
|---|---|---|---|---|---|
| **VISITANTE** | ❌ null | ❌ null | N/A | N/A | `IDENTITY` |
| **FANTASMA** | ✅ valid | ❌ null | N/A | N/A | `GENESIS` |
| **SEED** | ✅ valid | ✅ local | ✅ signed | ✅ clean | `WORKSPACE` |
| **STARTUP** | ✅ valid | ✅ cloud | ✅ signed | ✅ clean | `WORKSPACE` |
| **BLOQUEADO** | ✅ valid | ✅ cloud | ✅ signed | ❌ conflict | `BLOCK` |

## 2. Lógica de Verificación Secuencial

El Gatekeeper evalúa los checks en orden estricto. El primer fallo detiene la ejecución:

1.  **Identity Check**: ¿Tiene Firebase Auth? Si NO -> `LOGIN_REQUIRED`.
2.  **ADN Check**: ¿Tiene `offeringConfig` válido? Si NO -> `GO_GENESIS`.
3.  **Legal Check**: ¿Existe firma inmutable en `legal_audit`? Si NO -> `BLOCK_LEGAL`.
4.  **Reseller Policy**: ¿Tiene ya un proyecto activo diferente? Si SÍ -> `BLOCK_RESELLER`.
5.  **Success**: Inyección nominal de la Órbita 2 y 3.

## 3. Matriz de Firma Legal (Inmutabilidad)

| Escenario | Existe Firma | Versión == Current | Resultado |
|---|---|---|---|
| **First Access** | ❌ No | N/A | `BLOCK_LEGAL` (Forzar Firma) |
| **Outdated** | ✅ Sí | ❌ No | `BLOCK_LEGAL` (Refirma requerida) |
| **Compliant** | ✅ Sí | ✅ Sí | `PASS` (Acceso concedido) |

---
*Lógica purgada de residuos legacy. Estándar determinista para el Gatekeeper agnóstico.*
