---
METAFAC_VER: 0.3.3
GEO_LOC: MetaFactory/lab/AIP/01_arquitectura/UNIVERSAL_GATEKEEPER_LOGIC.md
PRODUCED_BY: Antigravity
AFFINITY_GROUP: SISTEMA
CONTENT_CAT: CODE
PATTERN_TYPE: ARCHITECT
STATUS: AUDITED
TIMESTAMP: 2026-03-15
---

# SPEC: Universal Gatekeeper Logic (v2.5)
-Check System)
**Estado:** AGNOSTIC / Security Standard
**Aplicación:** Auth & Authorization Layer

## 1. Principio: Acceso Fractal
La seguridad no es binaria, es progresiva. El sistema evalúa el pasaporte del usuario a través de 5 cámaras de validación sucesivas.

## 2. Las 5 Cámaras del Gatekeeper

| Check | Nombre | Validación | Fallo (Escena de Redirección) |
|---|---|---|---|
| **0** | **Persistence** | Carga del estado maestro local. | `LANDING` |
| **1** | **Identity** | Autenticación real (SSO/JWT). | `AUTH` |
| **2** | **ADN** | Configuración de la marca/vertical. | `GENESIS_WIZARD` |
| **3** | **Legal** | Firma de términos y auditoría legal. | `LEGAL_GATE` |
| **4** | **Compliance** | Verificación de nivel (KYC/KYB/Status). | `COMPLIANCE_HOLD` |
| **5** | **Success** | Inyección del Workspace. | `ALLOW_DASHBOARD` |

## 3. Concepto: Late Binding (Vinculación Tardía)
Permite que un usuario interactúe con el sistema en modo "Seed" (Local) antes de forzar el registro.
- **Fase Seed (localStorage)**: Operaciones no sensibles, exploración, configuración de wizard.
- **Fase Crystal (Firestore)**: Al subir el primer documento sensible o llegar al Check 3, el Gatekeeper fuerza el Login y vincula el estado local al UID real.

## 4. Estructura de Claims (JWT)
El acceso se gestiona en el Edge a través de Custom Claims inmutables:
- `role`: (Agent, Manager, Admin, etc.)
- `tenant_id`: Aislamiento multi-tenant en FireRules.
- `tier`: (Seed, Startup, Enterprise).

---
*Extraído y Agnostizado por El Bibliotecario desde los residuos históricos v2.5.*
