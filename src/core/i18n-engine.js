/**
 * 🛠️ i18n-ENGINE R4 (Versión Lead Architect + Hardening Sentinel)
 */
const NS_REGEX = /^[a-z0-9-_]+$/i;
const LANG_REGEX = /^(es|en|fr|pt)$/;
const APP_PREFIX = 'AIP_LANDING_V0_';

window.Skeleton = window.Skeleton || {};
window.Skeleton.i18n = { locales: {}, loaded: new Set() };

export async function loadNamespace(ns, lang = 'es') {
    if (!NS_REGEX.test(ns) || !LANG_REGEX.test(lang)) throw new Error('Security Breach');

    const cacheKey = `${APP_PREFIX}${lang}_${ns}`;
    if (window.Skeleton.i18n.loaded.has(`${lang}:${ns}`)) return;

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
        window.Skeleton.i18n.locales[lang] = { ...window.Skeleton.i18n.locales[lang], [ns]: Object.freeze(JSON.parse(cached)) };
        window.Skeleton.i18n.loaded.add(`${lang}:${ns}`);
        document.dispatchEvent(new CustomEvent('Skeleton:i18n:Loaded', { detail: { ns, lang } }));
        return;
    }

    try {
        const res = await fetch(`./src/locales/${lang}/${ns}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        window.Skeleton.i18n.locales[lang] = { ...window.Skeleton.i18n.locales[lang], [ns]: Object.freeze(data) };
        window.Skeleton.i18n.loaded.add(`${lang}:${ns}`);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));

        document.dispatchEvent(new CustomEvent('Skeleton:i18n:Loaded', { detail: { ns, lang } }));
    } catch (e) {
        console.warn(`[i18n] Fallback activo:`, e.message);
    }
}

window.Skeleton.t = (key, ns = 'gate', lang = 'es') => {
    return window.Skeleton.i18n.locales[lang]?.[ns]?.[key] || key;
};