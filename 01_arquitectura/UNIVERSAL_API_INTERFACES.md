---
METAFAC_VER: 0.3.3
GEO_LOC: MetaFactory/lab/AIP/01_arquitectura/UNIVERSAL_API_INTERFACES.md
PRODUCED_BY: Antigravity
AFFINITY_GROUP: SISTEMA
CONTENT_CAT: CODE
PATTERN_TYPE: ARCHITECT
STATUS: AUDITED
TIMESTAMP: 2026-03-15
---

# SPEC: Universal API Interfaces (v2.5)

**Estado:** AGNOSTIC / Clean Twin
**Origen:** `quarantine/residues/API_CONTRACTS.md` (v2.4)
**Auditado por:** El Bibliotecario (Antigravity v0.3.3)

---

## 1. Propósito
Define los contratos de red y las interfaces de datos compartidas entre los módulos del Meta SaaS. Este documento es el estándar para asegurar que Gadgets (`gd-*`) y Widgets (`wd-*`) se hablen en el mismo dialecto técnico.

## 2. Core Store Interface (Master State)

```typescript
interface MasterState {
  auth: {
    user: User | null;         // Identidad global
  };
  project: {
    offeringConfig: {
      brandName: string;       // Nombre de la marca/SaaS
      vertical: string;        // Dominio (RealEstate, Trade, etc.)
      targetMarket: string;    // B2B, B2C, B2G
    };
    owner_uid: string | null;  // Vínculo fiduciario
    status: 'GÉNESIS' | 'CRISTALIZADO' | 'ACTIVE';
  };
  meta: {
    version: string;           // Versión del chasis (Skeleton)
    lastSync: number;          // Marca de tiempo de persistencia
  }
}
```

## 3. Global Bus Events (Sistema Nervioso)

| Evento | Payload | Disparador |
|---|---|---|
| `AUTH_LOGIN` | `{ user, profile }` | Login exitoso en Firebase Auth. |
| `LEGAL_SIGNED` | `{ uid, timestamp }` | Firma inmutable en la esclusa legal. |
| `SCENE_CHANGE` | `{ from, to }` | Transparencia en la transición de órbita. |
| `WORKSPACE_READY` | `{}` | Gatekeeper ha abierto la esclusa al Dashboard. |

## 4. Auditoría de Agnostización
- Se ha eliminado la dependencia de nombres de producto específicos (CIFI).
- Se han generalizado los tipos de "Market" y "Vertical".
- Se mantiene el soporte para la "Triple Escritura Atómica" como regla de oro.

---
*Este documento ha sido rescatado de la cuarentena y limpiado para su integración en el Laboratorio de AIP.*
