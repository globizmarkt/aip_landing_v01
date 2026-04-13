/**
 * @file i18n-engine.js
 * @role DOM & Logic Engineer — Cirugía de Re-mapeo i18n
 * @location src/core/i18n-engine.js
 * @doctrine R0 (Vanilla), R4 (Zero Hardcoded), D2/D3 (Sincronización STITCH→Canónico)
 * @description Motor con capa de re-mapeo para claves STITCH inválidas. 23 nodos → visibles.
 * @event Skeleton:System:Hydrated
 */

(function () {
    'use strict';

    // ============================================================
    // MAPA DE RE-MAPEO STITCH → CANÓNICO
    // ============================================================

    const KEY_REMAP = {
        // Hero Investor
        'hero.investor_badge': 'hero.investor.badge',
        'hero.investor_title': 'hero.investor.title',
        'hero.investor_desc': 'hero.investor.subtitle',
        'hero.investor_button': 'hero.investor.cta',

        // Hero Staff/Agent
        'hero.agent_label': 'hero.staff.label',
        'hero.agent_title': 'hero.staff.title',
        'hero.agent_desc': 'hero.staff.subtitle',
        'hero.agent_action_title': 'hero.staff.action.title',
        'hero.agent_action_desc': 'hero.staff.action.desc',
        'hero.or_divider': 'common.divider_or',
        'hero.agent_emergency': 'hero.staff.emergency',

        // Gate (gatekeeper en canónico)
        'gate.title': 'gatekeeper.title',
        'gate.subtitle': 'gatekeeper.subtitle',
        'gate.input_label': 'gatekeeper.input.label',
        'gate.placeholder': 'gatekeeper.input.placeholder',
        'gate.cta': 'gatekeeper.cta',
        'gate.disclaimer': 'gatekeeper.disclaimer',

        // Meta
        'app.name': 'meta.app_name'
    };

    const SELECTOR_I18N = '[data-i18n]';
    const ATTR_I18N = 'data-i18n';
    const ATTR_PLACEHOLDER = 'data-i18n-placeholder';
    const DEFAULT_LOCALE = 'es';
    const EVENT_HYDRATED = 'Skeleton:System:Hydrated';

    // ============================================================
    // NÚCLEO DE RESOLUCIÓN
    // ============================================================

    function resolvePath(obj, path) {
        if (!obj || typeof path !== 'string') return null;
        const segments = path.split('.');
        let cursor = obj;
        for (let i = 0; i < segments.length; i++) {
            if (cursor === null || cursor === undefined || typeof cursor !== 'object') return null;
            cursor = cursor[segments[i]];
        }
        return (typeof cursor === 'string') ? cursor : null;
    }

    function resolveKey(key, dictionary) {
        // Intentar clave canónica directa
        let value = resolvePath(dictionary, key);
        if (value !== null) return { value, resolvedKey: key, remapped: false };

        // Intentar re-mapeo STITCH → canónico
        const canonicalKey = KEY_REMAP[key];
        if (canonicalKey) {
            value = resolvePath(dictionary, canonicalKey);
            if (value !== null) return { value, resolvedKey: canonicalKey, remapped: true };
        }

        // Fallback: clave no resuelta
        return { value: null, resolvedKey: key, remapped: false };
    }

    // ============================================================
    // HIDRATACIÓN
    // ============================================================

    function hydrateNode(node, dictionary) {
        const rawKey = node.getAttribute(ATTR_I18N);
        const placeholderKey = node.getAttribute(ATTR_PLACEHOLDER);

        if (!rawKey && !placeholderKey) return;

        // Hidratación textContent
        if (rawKey) {
            const result = resolveKey(rawKey, dictionary);
            const finalValue = result.value !== null ? result.value : `[${rawKey}]`;

            node.textContent = finalValue;
            node.setAttribute(result.value !== null ? 'data-i18n-ok' : 'data-i18n-missing',
                result.remapped ? `${rawKey}→${result.resolvedKey}` : rawKey);
        }

        // Hidratación placeholder
        if (placeholderKey) {
            const result = resolveKey(placeholderKey, dictionary);
            const finalValue = result.value !== null ? result.value : `[${placeholderKey}]`;
            node.placeholder = finalValue;
        }
    }

    function hydrate() {
        const dictionary = window.__LOCALES__?.[window.__CURRENT_LOCALE__ || DEFAULT_LOCALE];

        if (!dictionary) {
            console.error('[i18n-engine] Diccionario no disponible');
            return { success: false, hydrated: 0, missing: 0, remapped: 0 };
        }

        const nodes = document.querySelectorAll(SELECTOR_I18N);
        let hydrated = 0, missing = 0, remapped = 0;

        nodes.forEach(node => {
            const rawKey = node.getAttribute(ATTR_I18N);
            const result = resolveKey(rawKey, dictionary);

            hydrateNode(node, dictionary);

            if (result.value !== null) {
                hydrated++;
                if (result.remapped) remapped++;
            } else {
                missing++;
            }
        });

        return { success: true, hydrated, missing, remapped, total: nodes.length };
    }

    // ============================================================
    // RENDER LOCK & AUTO-INIT
    // ============================================================

    function initialize() {
        console.log('[i18n-engine] Iniciando hidratación con re-mapeo STITCH...');

        const stats = hydrate();

        document.dispatchEvent(new CustomEvent(EVENT_HYDRATED, {
            bubbles: true,
            detail: {
                engine: 'i18n-engine',
                version: '1.1.0',
                stats: stats,
                timestamp: Date.now()
            }
        }));

        console.log(`[i18n-engine] Hidratado: ${stats.hydrated}/${stats.total}, Re-mapeados: ${stats.remapped}, Faltantes: ${stats.missing}`);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // ============================================================
    // API PÚBLICA
    // ============================================================

    window.Skeleton = window.Skeleton || {};
    window.Skeleton.i18n = {
        hydrate: hydrate,
        t: function (key) {
            const dict = window.__LOCALES__?.[window.__CURRENT_LOCALE__ || DEFAULT_LOCALE];
            const result = resolveKey(key, dict);
            return result.value || `[${key}]`;
        },
        remap: KEY_REMAP,
        stats: () => ({ locale: window.__CURRENT_LOCALE__ || DEFAULT_LOCALE })
    };

})();