/**
 * ============================================================================
 * [CABECERA DE CONTROL]
 * Archivo: src/core/theme-engine.js
 * Versión: 3.2.0 (Cartography Compliant)
 * Fecha: 2026-01-06
 * Propósito: Gestión de temas visuales con persistencia y API pública.
 * ============================================================================
 * [ÍNDICE MAESTRO]
 * [SEC-01] IMPORTACIONES
 * [SEC-02] DEFINICIÓN DE TEMAS
 * [SEC-03] LÓGICA DE INICIALIZACIÓN
 * [SEC-04] API DE APLICACIÓN
 * [SEC-05] GETTERS PÚBLICOS
 * ============================================================================
 */

/* [SEC-01] IMPORTACIONES */
import { Store } from './store.js';

export const ThemeEngine = {

    /* [SEC-02] DEFINICIÓN DE TEMAS */
    themes: {
        'breeder-classic': 'Breeder Classic (Hybrid v8)',
        'grand-luxury': 'Grand Luxury (Gold & Serif)',
        'corporate-blue': 'Corporate Blue (Tech & Sans)',
        'light-green': 'Light Green (Eco & Round)',
        'plain-ground': 'Plain Ground (Industrial & Mono)'
    },

    /* [SEC-03] LÓGICA DE INICIALIZACIÓN */
    init() {
        // Recuperar preferencia guardada (o default a grand-luxury si no existe)
        const savedTheme = Store.get('org_theme', 'grand-luxury');
        this.apply(savedTheme);
        console.log(`🎨 ThemeEngine: Boot sequence [${savedTheme}]`);
    },

    /* [SEC-04] API DE APLICACIÓN */
    apply(themeId) {
        // 1. Limpieza quirúrgica de clases anteriores
        document.body.classList.remove(
            'theme-breeder-classic',
            'theme-grand-luxury',
            'theme-corporate-blue',
            'theme-light-green',
            'theme-plain-ground'
        );

        // 2. Inyección de nueva clase
        if (themeId && this.themes[themeId]) {
            document.body.classList.add(`theme-${themeId}`);
            // 3. Persistencia
            Store.set('org_theme', themeId);
        }
    },

    /* [SEC-05] GETTERS PÚBLICOS */
    getOptions() {
        return this.themes;
    },

    getCurrent() {
        return Store.get('org_theme', 'grand-luxury');
    }
};
