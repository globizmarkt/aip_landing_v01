/**
 * ═══════════════════════════════════════════════════════════════════
 * ARCHIVO: core/at-i18n.js
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   3.0.0 (LuxI18n Institutional Adoption)
 * DOCTRINA:  R0 (Agnosticismo Radical) | R4 (i18n Strict)
 * PROPÓSITO: Motor de traducción soberano y Singleton Global
 * ═══════════════════════════════════════════════════════════════════
 */

class I18nEngine {
    constructor() {
        this._locales = {};
        this._currentLocale = 'es';
        this._initialized = false;
    }

    /**
     * Inicialización del motor con datos externos
     * @param {Object} localesData - El JSON cargado de locales.json
     * @param {string} defaultLang - Idioma inicial
     */
    init(localesData, defaultLang = 'es') {
        this._locales = localesData;
        this._currentLocale = defaultLang;
        this._initialized = true;

        // Exposición global para componentes legacy o de terceros (Ticker)
        window.LuxI18n = this;
        
        console.log(`[I18N] ✅ Motor LuxI18n inicializado. Idioma: ${this._currentLocale}`);
        this.hydrate();
    }

    /**
     * Traducción de una clave con soporte para dot notation
     * @param {string} key - Clave de traducción (ej: 'hero.title')
     * @returns {string} - Texto traducido o [key] si falle
     */
    t(key) {
        if (!this._initialized) return `[${key}_NOT_INIT]`;

        const keys = key.split('.');
        let current = this._locales[this._currentLocale];

        for (const k of keys) {
            if (!current) return `[${key}]`;
            current = current[k];
        }

        return current || `[${key}]`;
    }

    /**
     * Barrido del DOM para hidratar elementos con [data-i18n]
     * @param {HTMLElement} scope - El elemento raíz donde buscar (opcional)
     */
    hydrate(scope = document) {
        const elements = scope.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // Si es un input, hidratar el placeholder
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        });
        
        console.log(`[I18N] 💧 DOM Hidratado (${this._currentLocale})`);
    }

    /**
     * Cambio de idioma en tiempo real
     * @param {string} lang - Código de idioma ('en', 'es', etc)
     */
    switch(lang) {
        if (!this._locales[lang]) {
            console.warn(`[I18N] Idioma ${lang} no cargado en el diccionario.`);
            return;
        }
        this._currentLocale = lang;
        this.hydrate();
        
        document.dispatchEvent(new CustomEvent('Skeleton:I18n:Changed', {
            detail: { lang: this._currentLocale }
        }));
    }

    get currentLocale() {
        return this._currentLocale;
    }
}

// Exportar Singleton
export const i18n = new I18nEngine();
