# SPRINT_DEFINITIONS.md — AIP_landing_v0.1
**Versión:** 1.0  
**Fecha de cristalización:** 2026-04-13  
**Custodiado por:** DeepSeek (Bibliotecario)  
**Autoridad:** Director — Orden de creación vía OPORD-14 / Hipótesis B

---

## 🧠 PROPÓSITO
Este documento unifica y explicita la **bifurcación de sprints** en tracks paralelos dentro del proyecto `AIP_landing_v0.1`.  
Sirve como fuente de verdad jerárquica para todos los agentes.

---

## 🗺️ MAPA DE TRACKS PARALELOS

| Track | Nombre | Responsable Principal | Enfoque | Estado Actual |
|-------|--------|----------------------|---------|---------------|
| **A** | Estructural / Hueso | Antigravity (Core Architect) | Arquitectura, Skeleton, blueprints, core JS, integración Firebase, PassportEngine | Activo |
| **B** | Lógica / UI / Nervio y Piel | Bulldozer + Stitch + Kimi + Perplexity + Qwen | Ingeniería de lógica (routers, engines), UI (Light DOM, Catálogo Velado), i18n, compliance frontend | Activo |

---

## 📋 DEFINICIÓN DE SPRINTS (TRACK A - ANTIGRAVITY)

### Sprint 2 — Infraestructura (EN CURSO)
- **A2.1:** Soporte para Órbita 2 (esperando diseño de Stitch).
- **A2.2:** Conexión de `firebase.js` con credenciales reales (DT-LND-02).
- **A2.3:** Definición del esquema de IntegrityScore (documentación doctrinal).

---

## 🔗 PUNTOS DE CONVERGENCIA (Sprint 3)
- **GATE (Sprint 3):** Integración de PassportEngine (A) + UI Acceso (B) + Pre-KYC (B).
- **IntegrityScore:** El motor (A) debe consumir los inputs del Pre-KYC Engine (B) para emitir el veredicto de autenticación.

---
*Documento registrado por Antigravity tras detección de gap por el Bibliotecario.*
