/**
 * ═══════════════════════════════════════════════════════════════════
 * BLUEPRINT: app-shell.js — Contenedor Soberano (Trinity Shell)
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN:   1.0.0 (Skeleton Core)
 * DOCTRINA:  R2 (Light DOM Estricto) | R3 (Zero-Hex) | R4 (i18n Total)
 * DEPS:      workspace-layout.css (debe estar cargado antes)
 * ───────────────────────────────────────────────────────────────────
 * REGLAS DE ESTE ARCHIVO:
 *   ✅ Light DOM — usa getRootNode() y clases scoped `.sk-*`
 *   ✅ Todos los textos chrome usan data-i18n
 *   ✅ Todos los colores via var(--theme-*) o var(--sk-*)
 *   ✅ Geometría Trinity INMUTABLE: nav | canvas | inspector
 *   ❌ Prohibido attachShadow()
 *   ❌ Prohibido hexadecimales inline
 *   ❌ Prohibido importar lógica de negocio
 * ═══════════════════════════════════════════════════════════════════
 */

/* [SEC-01] ATRIBUTOS OBSERVADOS — Contratos de la interfaz HTML */
const OBSERVED_ATTRS = ['theme', 'orbit-1-visible', 'orbit-3-visible', 'locale'];

/* [SEC-02] DEFINICIÓN DEL WEB COMPONENT */
class AppShell extends HTMLElement {

    /* ─────────────────────────────────────────────
     * CICLO DE VIDA
     * ───────────────────────────────────────────── */

    constructor() {
        super();
        // R2: Light DOM. Cero attachShadow().
        this._orbit1Visible = true;
        this._orbit3Visible = true;
        this._theme         = 'dark';
        this._locale        = 'en';
    }

    static get observedAttributes() {
        return OBSERVED_ATTRS;
    }

    connectedCallback() {
        this._render();
        this._applyTheme(this._theme);
        this._bindEvents();
        this._syncLocale(this._locale);
        this._emitReady();
    }

    disconnectedCallback() {
        this._removeListeners?.();
    }

    attributeChangedCallback(name, _old, next) {
        if (_old === next) return;
        switch (name) {
            case 'theme':
                this._theme = next;
                this._applyTheme(next);
                break;
            case 'orbit-1-visible':
                this._orbit1Visible = next !== 'false';
                this._syncOrbitVisibility();
                break;
            case 'orbit-3-visible':
                this._orbit3Visible = next !== 'false';
                this._syncOrbitVisibility();
                break;
            case 'locale':
                this._locale = next;
                this._syncLocale(next);
                break;
        }
    }

    /* ─────────────────────────────────────────────
     * RENDERIZADO — GEOMETRÍA TRINITY (INMUTABLE)
     * ───────────────────────────────────────────── */

    /**
     * Inyecta la estructura Trinity en el Light DOM.
     * INVARIANTE: 3 órbitas en orden fijo. Ninguna escena puede alterar esto.
     */
    _render() {
        // R4: Todos los textos usan data-i18n. El motor i18n hidratará en skeleton:i18n:ready.
        // R3: Cero colores hexadecimales. Solo var(--theme-*) y var(--sk-*).
        this.innerHTML = `
            <div class="sk-shell" role="application" aria-label="Skeleton Workspace">

                <!-- ÓRBITA 1: NAVEGACIÓN (izquierda, ancho fijo) -->
                <nav  id="sk-orbit-1"
                      class="sk-orbit sk-orbit--1"
                      aria-label="Orbit 1: Navigation"
                      role="navigation">
                    <slot name="orbit-1">
                        <!-- Contenido inyectado por la vertical vía slot -->
                    </slot>
                </nav>

                <!-- ÓRBITA 2: CANVAS (centro, expansivo) -->
                <main id="sk-orbit-2"
                      class="sk-orbit sk-orbit--2"
                      aria-label="Orbit 2: Workspace Canvas"
                      role="main">
                    <slot name="orbit-2">
                        <!-- Contenido inyectado por la vertical vía slot -->
                    </slot>
                </main>

                <!-- ÓRBITA 3: INSPECTOR (derecha, ancho fijo) -->
                <aside id="sk-orbit-3"
                       class="sk-orbit sk-orbit--3"
                       aria-label="Orbit 3: Inspector"
                       role="complementary">
                    <slot name="orbit-3">
                        <!-- Contenido inyectado por la vertical vía slot -->
                    </slot>
                </aside>

            </div>
        `;
    }

    /* ─────────────────────────────────────────────
     * TEMA
     * ───────────────────────────────────────────── */

    /**
     * Aplica el tema recibido como clase en el host.
     * Esto activa los tokens CSS correspondientes en :root o [data-theme="..."].
     * R3: No almacena colores. Solo delega al sistema de tokens.
     */
    _applyTheme(theme) {
        // Limpiar temas anteriores
        this.classList.forEach(cls => {
            if (cls.startsWith('sk-theme-')) this.classList.remove(cls);
        });
        if (theme) {
            this.classList.add(`sk-theme-${theme}`);
        }
    }

    /* ─────────────────────────────────────────────
     * VISIBILIDAD DE ÓRBITAS
     * ───────────────────────────────────────────── */

    _syncOrbitVisibility() {
        const orbit1 = this.querySelector('#sk-orbit-1');
        const orbit3 = this.querySelector('#sk-orbit-3');

        if (orbit1) {
            orbit1.classList.toggle('sk-orbit--hidden', !this._orbit1Visible);
            orbit1.setAttribute('aria-hidden', String(!this._orbit1Visible));
        }
        if (orbit3) {
            orbit3.classList.toggle('sk-orbit--hidden', !this._orbit3Visible);
            orbit3.setAttribute('aria-hidden', String(!this._orbit3Visible));
        }

        document.dispatchEvent(new CustomEvent('skeleton:shell:orbit-toggle', {
            detail: {
                orbit1: this._orbit1Visible,
                orbit3: this._orbit3Visible
            }
        }));
    }

    /* ─────────────────────────────────────────────
     * LOCALE
     * ───────────────────────────────────────────── */

    /**
     * Propaga el locale al atributo `lang` del elemento raíz del documento.
     */
    _syncLocale(locale) {
        if (locale && document.documentElement.lang !== locale) {
            document.documentElement.lang = locale;
        }
    }

    /* ─────────────────────────────────────────────
     * EVENT BUS — ESCUCHA DE EVENTOS GLOBALES
     * ───────────────────────────────────────────── */

    _bindEvents() {
        // Escucha cambios de escena provenientes del SceneManager
        const onSceneChange = (e) => {
            const { target } = e.detail ?? {};
            if (target) this._activateScene(target);
        };

        // Escucha peticiones de toggle de órbitas
        const onOrbitToggle = (e) => {
            const { orbit, visible } = e.detail ?? {};
            if (orbit === 1) this.setAttribute('orbit-1-visible', String(visible));
            if (orbit === 3) this.setAttribute('orbit-3-visible', String(visible));
        };

        document.addEventListener('skeleton:scene:activate', onSceneChange);
        document.addEventListener('skeleton:orbit:toggle',   onOrbitToggle);

        // Cleanup al desconectar el componente
        this._removeListeners = () => {
            document.removeEventListener('skeleton:scene:activate', onSceneChange);
            document.removeEventListener('skeleton:orbit:toggle',   onOrbitToggle);
        };
    }

    /**
     * Cambia el data-scene del canvas. El CSS maneja la visibilidad.
     * El Shell NO decide qué escena mostrar — solo la aplica.
     */
    _activateScene(sceneName) {
        const canvas = this.querySelector('#sk-orbit-2');
        if (canvas) {
            canvas.dataset.activeScene = sceneName;
        }
    }

    /* ─────────────────────────────────────────────
     * EMISIÓN DE EVENTO DE ARRANQUE
     * ───────────────────────────────────────────── */

    _emitReady() {
        document.dispatchEvent(new CustomEvent('skeleton:shell:ready', {
            detail: { timestamp: Date.now() }
        }));
        console.log('[APP-SHELL] ✅ Shell soberano montado. Geometría Trinity activa.');
    }
}

/* [SEC-03] REGISTRO DEL CUSTOM ELEMENT */
if (!customElements.get('app-shell')) {
    customElements.define('app-shell', AppShell);
} else {
    console.warn('[APP-SHELL] Ya registrado. Omitiendo re-registro.');
}

/*
 * ─────────────────────────────────────────────────────────────
 * USO EN HTML (plantilla fija — no modificar la estructura):
 * ─────────────────────────────────────────────────────────────
 *
 * <app-shell theme="dark" orbit-1-visible="true" orbit-3-visible="true" locale="en">
 *
 *   <nav-component slot="orbit-1"></nav-component>
 *
 *   <div slot="orbit-2">
 *     <!-- Escenas inyectadas por la vertical -->
 *     <scene-landing  data-scene="LANDING">...</scene-landing>
 *     <scene-workspace data-scene="WORKSPACE">...</scene-workspace>
 *   </div>
 *
 *   <inspector-panel slot="orbit-3"></inspector-panel>
 *
 * </app-shell>
 *
 * ─────────────────────────────────────────────────────────────
 */
