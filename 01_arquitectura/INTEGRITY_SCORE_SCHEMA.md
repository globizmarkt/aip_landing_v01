# ESQUEMA DE INTEGRITY SCORE — AIP_landing_v0.1
**Versión:** 1.0 (Doctrinal)
**Estatus:** ACTIVO
**Track:** A (Autenticación Estructural)

---

## 🧠 FILOSOFÍA DEL SCORING
El `IntegrityScore` (IS) no es una medida de riqueza, sino de **calidad de relación fiduciaria y riesgo de cumplimiento (MiFID II / AML)**. En la fase Pre-KYC, el IS es una estimación probabilística basada en "Declaraciones Soberanas" del usuario.

## 📊 MATRIZ DE PUNTUACIÓN (CÁLCULO PRELIMINAR)

El sistema inicia con un score base de **0**. La suma de factores determina la elegibilidad (`THRESHOLD = 60`).

### 1. Jurisdicción (Peso: 30%)
Evaluación según marcos regulatorios equivalentes a FCA (UK).
| Grupo | Puntos | Ejemplo |
|-------|--------|---------|
| Tier 1 | +30 | UK, EU, Switzerland, USA, Singapore |
| Tier 2 | +15 | Jurisdicciones con marcos FATF equivalentes |
| Tier 3 | -50 | Jurisdicciones en listas grises/negras (CUSTODY_HOLD automático) |

### 2. Identidad Institucional (Peso: 30%)
Naturaleza de la entidad solicitante.
| Tipo | Puntos |
|------|--------|
| Family Office / Institutional Fund | +30 |
| Asset Manager / Professional Client | +25 |
| Individual Qualifed Investor | +10 |
| Retail / Unknown | +0 |

### 3. Solvencia Declarada - AUM (Peso: 25%)
Assets Under Management (AUM) declarativos.
| Rango | Puntos |
|-------|--------|
| > $100M | +25 |
| $10M - $100M | +15 |
| < $10M | +0 |

### 4. Origen de Fondos (Peso: 15%)
Transparencia inicial en la procedencia del capital.
| Origen | Puntos |
|--------|--------|
| Herencia / Venta de activos verificables | +15 |
| Operativa corporativa | +10 |
| Otros / No detallado | +0 |

---

## 📉 REGLAS DE DECAIMIENTO Y BLOQUEO

1. **Hard Gate:** Si el `IntegrityScore < 60`, el pasaporte transiciona a `CUSTODY_HOLD`. No se permiten CTAs de diálogo.
2. **Decaimiento (Decay):** El score preliminar tiene una validez de **72 horas**. Tras este periodo, si no hay avance a KYC real, el score decae -10 puntos/día hasta llegar a 0.
3. **Blacklist Override:** Cualquier coincidencia negativa en listas de sanción (identificada por el backend en Sprint 3) fuerza un score de **-100** (Bloqueo soberano de IP).

---

## 🔗 INTEGRACIÓN TÉCNICA
El `PassportEngine` expondrá el método `evaluateIntegrity(data)` que recibirá los campos del `pre-kyc-engine.js` (Track B).

---
*Documento de Ingeniería Fiduciaria — Antigravity.*
