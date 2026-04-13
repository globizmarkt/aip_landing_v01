/**
 * 🛰️ AT-I18N | AIP ATOM
 * 
 * ARCHIVO:    src/core/at-i18n.js
 * VERSIÓN:     2.0.0 → 2.0.1
 *              🛰️ AT-I18N | AIP ATOM
 * PROPÓSITO:   Motor de traducción reactivo (Artifact)
 *              R5 — purga de referencia "BREEDER HUB" en cabecera
 * 
 */

import { globalBus } from './event-bus.js';

class I18nEngine {
    constructor() {
        this.currentLang = 'es';
        this.locales = {
            es: {
                "app": {
                    "name": "Atlantis International Projects",
                    "tagline": "UK-based, globally connected",
                    "role": "SuperAdmin",
                    "tier": "OWNER",
                    "title": "AIP — Atlantis International Projects"
                },
                "nav": {
                    "holding": "Holding Central",
                    "trading": "Mesa de Trading",
                    "financial": "AIP Financial Advisory",
                    "realestate": "Real Estate & Investments",
                    "agents": "Red de Agentes"
                },
                "lang": {
                    "es": "ESPAÑOL",
                    "en": "ENGLISH"
                },
                "panteon": {
                    "language": "LOCALIZACIÓN"
                },
                "gatekeeper": {
                    "title": "SEGURIDAD GATEKEEPER",
                    "tier": { "label": "Nivel:" },
                    "kyc": { "label": "KYC:", "status": "VERIFICADO (ed25519)" }
                },
                "aimon": {
                    "title": "ORÁCULO DEL SISTEMA (AIMON)",
                    "sync": "Sincronizando con el Oráculo...",
                    "holding": "El Oráculo está analizando el contexto de la Holding. No hay alertas críticas.",
                    "trading": "Nathalie reporta cambios en la normativa EN590. Revisar especificaciones de Azufre.",
                    "financial": "MT760 Trace activo. Proyección de adquisición de Banco Físico (Junio/Julio).",
                    "realestate": "Antonio Padilla reporta: Expansión de plazas en residencia de Madrid aprobada.",
                    "agents": "Análisis de red activo. Reporte de Country Heads generado."
                },
                "agents": {
                    "title": "Ficha del Agente",
                    "rank": "Rango Operativo",
                    "founder": "Fundador",
                    "director_gen": "Director General",
                    "director_sec": "Director de Sección",
                    "agent": "Agente Senior",
                    "score": { "op": "Score Operativo", "admin": "Score Administrativo" },
                    "controls": { "killswitch_deal": "Veto de Deal", "killswitch_agent": "Killswitch Agente", "monitor": "Monitor de Actividad" }
                },
                "canvas": {
                    "welcome_title": "Bienvenido al Workspace Central",
                    "empty_state": "Seleccione un instrumento o módulo de la Órbita 1 para comenzar la operación.",
                    "explore_btn": "Explorar Dashboard",
                    "search_placeholder": "Buscar instrumentos...",
                    "no_results": "No se encontraron coincidencias."
                },
                "footer": { "status": "AIP_v0.1 — ENGINE: SKELETON v2.4.0 — ALL SYSTEMS NOMINAL" }
            },
            en: {
                "app": {
                    "name": "Atlantis International Projects",
                    "tagline": "UK-based, globally connected",
                    "role": "SuperAdmin",
                    "tier": "OWNER",
                    "title": "AIP — Atlantis International Projects"
                },
                "nav": {
                    "holding": "Holding Central",
                    "trading": "Trading Desk",
                    "financial": "AIP Financial Advisory",
                    "realestate": "Real Estate & Investments",
                    "agents": "Agent Network"
                },
                "lang": {
                    "es": "SPANISH",
                    "en": "ENGLISH"
                },
                "panteon": {
                    "language": "LOCALIZATION"
                },
                "gatekeeper": {
                    "title": "GATEKEEPER SECURITY",
                    "tier": { "label": "Tier:" },
                    "kyc": { "label": "KYC:", "status": "VERIFIED (ed25519)" }
                },
                "aimon": {
                    "title": "SYSTEM ORACLE (AIMON)",
                    "sync": "Synchronizing with the Oracle...",
                    "holding": "The Oracle is analyzing the Holding context. No critical alerts reported.",
                    "trading": "Nathalie reports changes in EN590 regulations. Review Sulfur specifications.",
                    "financial": "MT760 Trace active. Physical Bank acquisition projected (June/July).",
                    "realestate": "Antonio Padilla reports: Madrid senior residence capacity expansion approved.",
                    "agents": "Network analysis active. Country Heads report generated."
                },
                "agents": {
                    "title": "Agent File",
                    "rank": "Operational Rank",
                    "founder": "Founder",
                    "director_gen": "General Director",
                    "director_sec": "Section Director",
                    "agent": "Senior Agent",
                    "score": { "op": "Operational Score", "admin": "Administrative Score" },
                    "controls": { "killswitch_deal": "Deal Veto", "killswitch_agent": "Agent Killswitch", "monitor": "Activity Monitor" }
                },
                "canvas": {
                    "welcome_title": "Welcome to Central Workspace",
                    "empty_state": "Select an instrument or module from Orbit 1 to start operation.",
                    "explore_btn": "Explore Dashboard",
                    "search_placeholder": "Search instruments...",
                    "no_results": "No matches found."
                },
                "footer": { "status": "AIP_v0.1 — ENGINE: SKELETON v2.4.0 — ALL SYSTEMS NOMINAL" }
            }
        };

        // Registrar listener de cambio de idioma
        globalBus.on('CMD_LANG_SWITCH', (detail) => this.switch(detail.lang));
    }

    init(lang = 'es') {
        this.currentLang = lang;
        this.translate();
    }

    translate() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const path = el.getAttribute('data-i18n');
            const translation = this.getValue(path);
            if (translation) el.innerText = translation;
        });
        console.log(`[AT-I18N] Interface localized to: ${this.currentLang}`);
    }

    getValue(path) {
        const dictionary = this.locales[this.currentLang];
        return path.split('.').reduce((obj, key) => obj && obj[key], dictionary);
    }

    switch(lang) {
        if (!this.locales[lang]) return;
        this.currentLang = lang;
        this.translate();
        globalBus.emit('EVT_LANG_CHANGED', { lang });
    }
}

export const i18n = new I18nEngine();
