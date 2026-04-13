/**
 * ═══════════════════════════════════════════════════════════════════
 * CORE ENGINE: genesis-engine.js (Landing Controller)
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   1.0.0 (AIP_landing)
 * PROPÓSITO: Renderiza el Manifiesto de Cristalización en la escena
 *            LANDING y gestiona el flujo hacia JURISDICTION.
 * ═══════════════════════════════════════════════════════════════════
 */

import { SceneManager } from './scene-manager.js';
import { i18n } from './at-i18n.js';

export const GenesisEngine = {

    init() {
        this._renderManifesto();
        this._bindEvents();
        
        // Re-hidratar en caso de cambio de idioma
        document.addEventListener('skeleton:i18n:ready', () => {
            this._renderManifesto();
        });

        console.log('[GENESIS-ENGINE] ✅ Motor de Manifiesto iniciado.');
    },

    /**
     * Renderiza el Manifiesto de Cristalización en la LANDING.
     * Construye el markup con claves data-i18n para la hidratación pasiva.
     */
    _renderManifesto() {
        const container = document.getElementById('scene-landing');
        if (!container) return;

        // Limpiar contenido previo
        container.innerHTML = '';

        // Construir la estructura del Manifiesto
        container.innerHTML = `
            <div class="landing-hero sk-layer-2">
                <h1 data-i18n="manifest.crystallization.title"></h1>
                <p class="subtitle" data-i18n="manifest.crystallization.subtitle"></p>
            </div>
            
            <div class="manifesto-principles sk-layer-1">
                <ul>
                    <li data-i18n="manifest.crystallization.principle_1"></li>
                    <li data-i18n="manifest.crystallization.principle_2"></li>
                    <li data-i18n="manifest.crystallization.principle_3"></li>
                    <li data-i18n="manifest.crystallization.principle_4"></li>
                </ul>
            </div>
            
            <div class="landing-action">
                <p class="help-text" data-i18n="manifest.crystallization.help"></p>
                <button id="btn-establish-contact" class="sk-btn sk-btn--primary" data-i18n="manifest.crystallization.action"></button>
            </div>
        `;
        
        // Re-hidratar los textos si i18n ya estaba cargado
        if (i18n.state.ready) {
            i18n.hydrateElement(container);
        }
    },

    /**
     * Vincula eventos de la escena, aplicando la Arquitectura de Fricción.
     */
    _bindEvents() {
        // Delegación de eventos para el botón de CTA fiduciario
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'btn-establish-contact') {
                console.log("[GENESIS] Fiduciary Dialogue initiated. -> JURISDICTION");
                SceneManager.navigate('JURISDICTION');
            }
        });
    }
};
