# AIP_LANDING_DOCTRINE.md

## Metadatos
- **Versión:** 1.0
- **Fecha:** 2026-04-13
- **Contexto:** Especificación doctrinal para la construcción de la `AIP_landing` orientada a inversores institucionales, family offices y capital cualificado bajo marcos regulatorios FCA (UK), MiFID II y FATF.
- **Naturaleza:** Documento de referencia para diseño UX, estructura de información y compliance comunicacional. No contiene implementación técnica.

---

## 1. El Lexicón Prohibido

Se establece una lista de términos y construcciones lingüísticas vetadas en la comunicación pública de la `AIP_landing`. Su uso compromete cumplimiento regulatorio y degrada percepción fiduciaria.

### 1.1 Categorías de Exclusión

**Promesas de rendimiento**
- “Garantizado”
- “Rentabilidad fija”
- “Alto retorno”
- Cualquier expectativa cuantificable no verificable

**Accesibilidad masiva**
- “Retail”
- “Para todos”
- “Inversor principiante”
- “Fácil acceso”

**Especulación**
- “Cripto”
- “Blockchain”
- “Alto riesgo / alta recompensa”
- “Disrupción”

**Urgencia manipuladora**
- “Oferta limitada”
- “Invierte ahora”
- “No te lo pierdas”

**Garantías absolutas**
- “Seguro”
- “Sin riesgo”
- “Capital protegido”

### 1.2 Fundamentación

- **MiFID II:** Prohíbe inducir expectativas de rendimiento no justificadas.
- **FATF:** Exige transparencia sobre riesgo y origen de fondos.
- **Doctrina HNWI:** El silencio sobre promesas es señal de rigor institucional.

---

## 2. Arquitectura de la Fricción

La fricción se define como un mecanismo deliberado de filtrado cualitativo. No constituye un error de experiencia, sino un componente de validación de elegibilidad.

### 2.1 Principios Operativos

- La fricción actúa como **filtro de exclusividad**.
- El compliance se presenta como **ancla de confianza (Trust Anchor)**.
- El acceso es **condicionado por jurisdicción y elegibilidad**, no universal.

### 2.2 Mecanismos Identificados

**Jurisdiction Router**
- Selector inicial por país o residencia.
- Redirige a contenido conforme a marcos regulatorios.
- Se presenta como personalización, no restricción.

**Disclaimers como Trust Anchors**
- Ubicación persistente (footer o modal inicial).
- Referencias explícitas a MiFID II / FCA.
- Función dual: legal + señal de soberanía institucional.

**Filtros UX**
- Geolocalización por IP.
- Bloqueos suaves (“Access restricted by jurisdiction”).
- Salida elegante sin error explícito.

### 2.3 Benchmark Institucional

| Institución        | Mecanismo                      | Implementación UX                         |
|------------------|--------------------------------|------------------------------------------|
| Pictet           | Geo-selector inicial           | Acceso segmentado por región             |
| Lombard Odier    | Disclaimer en footer           | Elegibilidad implícita                   |
| Julius Baer      | IP + modal pre-KYC             | Validación previa a contacto             |
| Rothschild & Co  | Footer FCA/MiFID               | Legalidad como insignia de autoridad     |

### 2.4 Interpretación Doctrinal

- El bloqueo no es visible como rechazo, sino como **custodia de acceso**.
- La fricción preserva la **discreción del visitante no elegible**.
- La arquitectura evita exposición a audiencias no cualificadas.

---

## 3. Protocolo de Embarque Pre-KYC

El primer contacto se diseña para recolectar información mínima necesaria para evaluación preliminar, sin comprometer la discreción.

### 3.1 Principios

- Minimización de datos.
- Selecciones cerradas sobre campos abiertos.
- Ausencia de automatización en la respuesta.
- Validación implícita mediante umbral de elegibilidad.

### 3.2 Datos Requeridos

**Campos obligatorios**
- País de residencia
- Tipo de entidad
- Rango estimado de AUM (Assets Under Management)
- Mandato de interés

**Campos opcionales**
- Origen de fondos
- Mensaje fiduciario (texto libre limitado)

### 3.3 Tipología de Datos

| Campo              | Tipo       | Naturaleza              |
|-------------------|-----------|-------------------------|
| Jurisdicción       | Selección  | Lista cerrada           |
| Mandato            | Selección  | Advisory / Trade / Commodities / Compliance |
| AUM                | Selección  | Rangos predefinidos     |
| Origen de capital  | Selección  | Clasificación estándar  |
| Tipo de entidad    | Selección  | Perfil institucional    |
| Mensaje            | Texto      | Limitado                |

### 3.4 Flujo Operativo

1. Usuario accede a formulario.
2. Completa datos mínimos requeridos.
3. Envío del formulario.
4. Confirmación no automática.
5. Evaluación interna.
6. Asignación de Relationship Manager.

**Nota:** No se emiten respuestas automáticas ni confirmaciones instantáneas.

### 3.5 Adaptación AIP

- Sustitución de “Contact Us” por:
  - **“Establecer Diálogo Fiduciario”**
- Avance condicionado a:
  - **IntegrityScore preliminar > 60**

---

## 4. Anexo: Benchmark de Instituciones

### 4.1 Estructura de Landing (Patrón Común)

| Sección                | Función                                      |
|-----------------------|----------------------------------------------|
| Hero institucional     | Declaración de filosofía                     |
| Manifiesto             | Posicionamiento fiduciario                   |
| Servicios velados      | Presentación no comercial                    |
| Trust Anchors          | Validación legal y jurisdiccional            |
| Cierre                 | Contacto selectivo                           |

### 4.2 Comparativa Institucional

| Institución        | Hero                         | Filosofía                          | Servicios                           | Cierre                         |
|------------------|------------------------------|------------------------------------|------------------------------------|--------------------------------|
| Lombard Odier    | Preservación de valor         | Partner-owned                      | Gestión patrimonial, sostenibilidad| Expertise local                |
| Rothschild & Co  | Capital real                  | Independencia familiar             | Wealth management integral         | Contacto por país              |
| Pictet           | Confianza institucional       | Estrategias institucionales        | Fondos, cuentas segregadas         | Formulario                     |
| Julius Baer      | Gestión personalizada         | Enfoque holístico                  | Advisory y planificación           | Validación previa              |

### 4.3 Observaciones Relevantes

- Ausencia de lenguaje comercial directo.
- Servicios presentados sin precios ni llamadas a acción agresivas.
- Contacto siempre mediado por filtros de elegibilidad.
- Legalidad integrada como elemento estructural, no accesorio.

---

## 5. Microcopy Fiduciario (Referencia)

### 5.1 Titulares

- Preserve and Grow Sovereign Capital  
- Fiduciary Mandates Across Generations  
- Institutional Advisory and Trade Structures  
- Commodities and Compliance Frameworks  
- Sovereign Access to UK_HQ Desk  

### 5.2 Call-to-Actions

- Request Fiduciary Dialogue  
- Explore Firm Mandates  
- Establish Sovereign Contact  

---

**Fin del documento**