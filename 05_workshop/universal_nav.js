/**
 * ============================================================================
 * [CABECERA DE CONTROL]
 * Archivo: components/universal-nav.js
 * Versión: 2.0.0 (Agnostic Shell - DIY Ready)
 * Propósito: Navegación lateral factory con control externo y sincronización de fases.
 * ============================================================================
 * [ÍNDICE MAESTRO]
 * [SEC-01] CLASE WEB COMPONENT
 * [SEC-02] CICLO DE VIDA Y EVENTOS EXTERNOS
 * [SEC-03] RENDER FACTORY (SHELL DINÁMICO)
 * [SEC-04] CONSTRUCTOR DE PESTAÑAS
 * [SEC-05] GENERACIÓN DINÁMICA DE CONTENIDO
 * [SEC-06] VALIDACIÓN DE FASES Y BLOQUEOS
 * ============================================================================
 */

export class UniversalNav extends HTMLElement {
    /* [SEC-01] CLASE WEB COMPONENT */
    constructor() {
        super();
        this.isCollapsed = false;
        this.activeTab = null;
        this.passportEngine = null;
        this.navConfig = { tabs: [] };
    }

    /* [SEC-02] CICLO DE VIDA Y EVENTOS EXTERNOS */
    connectedCallback() {
        this.passportEngine = this._resolveEngine();
        this.navConfig = this._resolveConfig();
        this.activeTab = this.navConfig.tabs[0]?.id || 'default';

        this.render();
        this._hydrateI18n();
        this._attachExternalEvents();
    }

    disconnectedCallback() {
        this._detachExternalEvents();
    }

    _attachExternalEvents() {
        this._externalHandlers = {
            toggle: (e) => {
                this.isCollapsed = !this.isCollapsed;
                this._updateCollapseState();
            },
            passportUpdate: () => {
                this.render();
                this._hydrateI18n();
            }
        };

        window.addEventListener('Skeleton:Orbit1:Toggle', this._externalHandlers.toggle);
        window.addEventListener('Skeleton:Passport:Updated', this._externalHandlers.passportUpdate);
    }

    _detachExternalEvents() {
        if (!this._externalHandlers) return;
        window.removeEventListener('Skeleton:Orbit1:Toggle', this._externalHandlers.toggle);
        window.removeEventListener('Skeleton:Passport:Updated', this._externalHandlers.passportUpdate);
    }

    _updateCollapseState() {
        const root = this.querySelector('#unav-root');
        if (root) {
            root.classList.toggle('collapsed', this.isCollapsed);
        }
    }

    /* [SEC-03] RENDER FACTORY (SHELL DINÁMICO) */
    render() {
        const brandName = this.getAttribute('brand-name') || '';
        const brandMotto = this.getAttribute('brand-motto') || '';
        const passport = this.passportEngine ? this.passportEngine.generatePassport() : null;

        this.innerHTML = `
            <aside class="unav-architecture ${this.isCollapsed ? 'collapsed' : ''}" id="unav-root">
                
                <div class="unav-strip" id="unav-strip">
                    ${this._buildTabs(this.navConfig, passport)}
                </div>

                <div class="unav-panel" id="unav-panel">
                    <div class="unav-header">
                        <h2 class="brand-title" data-i18n="nav.brand_name">${brandName}</h2>
                        <div class="brand-motto" data-i18n="nav.brand_motto">${brandMotto}</div>
                    </div>

                    <div id="unav-body" class="unav-body">
                        ${this._buildContent(passport)}
                    </div>
                </div>
            </aside>

            <style>
                .unav-architecture {
                    display: flex;
                    height: 100%;
                    width: 300px;
                    background: var(--bg-panel);
                    transition: width 0.3s cubic-bezier(0.25, 1, 0.5, 1);
                    overflow: hidden;
                    border-right: 1px solid var(--border);
                }

                .unav-architecture.collapsed {
                    width: 60px;
                }

                .unav-strip {
                    width: 60px;
                    min-width: 60px;
                    background: var(--bg-strip); 
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1rem 0;
                    z-index: 30;
                    gap: 0.5rem;
                }

                .strip-tab {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    transform: rotate(180deg);
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.4); 
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    padding: 1.5rem 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-left: 2px solid transparent;
                    width: 100%;
                    position: relative;
                }
                
                .strip-tab:hover:not(.locked) { 
                    color: #fff;
                    text-shadow: 0 0 8px rgba(255,255,255,0.5);
                }

                .strip-tab.active:not(.locked) {
                    color: var(--accent-color);
                    border-left-color: var(--accent-color);
                    font-weight: 800;
                    text-shadow: 0 0 12px var(--accent-color);
                    background: linear-gradient(to left, rgba(255,255,255,0.03), transparent);
                }

                .strip-tab.locked {
                    opacity: 0.3;
                    cursor: not-allowed;
                    color: rgba(255,255,255,0.2);
                    pointer-events: none;
                }

                .strip-tab .tab-lock-icon {
                    position: absolute;
                    bottom: 0.5rem;
                    left: 50%;
                    transform: translateX(-50%) rotate(90deg);
                    font-size: 0.6rem;
                    opacity: 0.6;
                }

                .unav-panel {
                    width: 240px;
                    min-width: 240px;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-panel);
                    transition: opacity 0.2s ease;
                    opacity: 1;
                }
                
                .unav-architecture.collapsed .unav-panel {
                    opacity: 0;
                    pointer-events: none;
                }

                .unav-header { 
                    padding: 2rem 1.5rem; 
                    border-bottom: 1px solid var(--border); 
                }

                .brand-title { 
                    font-size: 1.2rem; 
                    font-weight: 800; 
                    color: var(--text-main); 
                    margin:0; 
                    line-height:1.1; 
                }

                .brand-motto { 
                    font-size: 0.65rem; 
                    text-transform: uppercase; 
                    letter-spacing: 0.1em; 
                    color: var(--accent-color); 
                    font-weight: 700; 
                    margin-top:0.5rem; 
                }

                .unav-body { 
                    flex: 1; 
                    padding: 1.5rem; 
                    overflow-y: auto; 
                }

                .nav-group {
                    margin-bottom: 1.5rem;
                }

                .nav-group-label {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                    font-weight: 700;
                }

                .nav-item {
                    padding: 0.8rem 0;
                    cursor: pointer;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    transition: 0.2s;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px dashed rgba(0,0,0,0.05);
                }

                .nav-item:hover:not(.locked) {
                    color: var(--text-main);
                }

                .nav-item.locked {
                    opacity: 0.4;
                    cursor: not-allowed;
                    pointer-events: none;
                }

                .nav-item-indicator {
                    color: var(--accent-color);
                    margin-right: 10px;
                    font-weight: bold;
                }

                .nav-item.locked .nav-item-indicator {
                    color: var(--text-muted);
                }

                .phase-badge {
                    font-size: 0.6rem;
                    padding: 0.2rem 0.4rem;
                    border-radius: 3px;
                    margin-left: auto;
                    background: var(--bg-subtle);
                    color: var(--text-muted);
                }

                .phase-1 { border-left: 2px solid #22c55e; }
                .phase-2 { border-left: 2px solid #eab308; }
                .phase-3 { border-left: 2px solid #ef4444; }
            </style>
        `;

        this._attachInternalEvents();
    }

    /* [SEC-04] CONSTRUCTOR DE PESTAÑAS */
    _buildTabs(config, passport) {
        if (!config.tabs || config.tabs.length === 0) {
            return '<div style="flex:1"></div>';
        }

        return config.tabs.map(tab => {
            const isActive = tab.id === this.activeTab;
            const verification = this._verifyPhaseAccess(tab, passport);
            const isLocked = !verification.granted;

            return `
                <button class="strip-tab ${isActive && !isLocked ? 'active' : ''} ${isLocked ? 'locked' : ''}" 
                        data-tab="${tab.id}"
                        data-phase="${tab.phase || 1}"
                        ${isLocked ? 'disabled' : ''}>
                    ${isLocked ? '<span class="tab-lock-icon">🔒</span>' : ''}
                    <span data-i18n="nav.tab_${tab.label_key || tab.id}"></span>
                </button>
            `;
        }).join('');
    }

    /* [SEC-05] GENERACIÓN DINÁMICA DE CONTENIDO */
    _buildContent(passport) {
        const activeTabConfig = this.navConfig.tabs.find(t => t.id === this.activeTab);

        if (!activeTabConfig || !activeTabConfig.groups) {
            return '';
        }

        return activeTabConfig.groups.map(group => `
            <div class="nav-group">
                <div class="nav-group-label" data-i18n="nav.group_${group.id}"></div>
                ${group.items.map(item => this._renderNavItem(item, passport)).join('')}
            </div>
        `).join('');
    }

    _renderNavItem(item, passport) {
        const verification = this._verifyAccess(item, passport);
        const isLocked = !verification.granted;
        const phaseClass = `phase-${item.phase || 1}`;

        return `
            <div class="nav-item ${isLocked ? 'locked' : ''} ${phaseClass}" 
                 data-action="${item.action}"
                 data-requires="${item.requirements || 'none'}"
                 data-phase="${item.phase || 1}"
                 ${isLocked ? `title="${verification.reason}"` : ''}>
                <span class="nav-item-indicator">${isLocked ? '🔒' : '›'}</span>
                <span data-i18n="nav.item_${item.label_key}"></span>
                ${item.phase ? `<span class="phase-badge" data-i18n="nav.phase_${item.phase}"></span>` : ''}
            </div>
        `;
    }

    _attachInternalEvents() {
        const strip = this.querySelector('#unav-strip');
        if (!strip) return;

        strip.addEventListener('click', (e) => {
            const tab = e.target.closest('.strip-tab');
            if (!tab || tab.classList.contains('locked')) return;

            this.activeTab = tab.dataset.tab;
            this.render();
            this._hydrateI18n();

            this.dispatchEvent(new CustomEvent('unav:tab-change', {
                detail: { tab: this.activeTab },
                bubbles: true
            }));
        });

        const body = this.querySelector('#unav-body');
        if (body) {
            body.addEventListener('click', (e) => {
                const item = e.target.closest('.nav-item');
                if (!item || item.classList.contains('locked')) return;

                const action = item.dataset.action;
                this.dispatchEvent(new CustomEvent('unav:action', {
                    detail: {
                        action,
                        phase: item.dataset.phase,
                        source: 'UniversalNav'
                    },
                    bubbles: true
                }));
            });
        }
    }

    /* [SEC-06] VALIDACIÓN DE FASES Y BLOQUEOS */
    _verifyPhaseAccess(tab, passport) {
        if (!tab.phase || tab.phase === 1) return { granted: true };
        if (!this.passportEngine || !passport) {
            return { granted: false, reason: 'NO_PASSPORT' };
        }

        const phaseRequirement = `phase>=${tab.phase}`;
        return this.passportEngine.verify(phaseRequirement, passport);
    }

    _verifyAccess(item, passport) {
        if (!this.passportEngine || !passport) {
            return { granted: false, reason: 'NO_PASSPORT' };
        }

        if (!item.requirements || item.requirements === 'none') {
            return { granted: true };
        }

        return this.passportEngine.verify(item.requirements, passport);
    }

    _resolveEngine() {
        const EngineClass = window.Skeleton?.PassportEngine;
        if (!EngineClass) return null;
        return new EngineClass();
    }

    _resolveConfig() {
        const configAttr = this.getAttribute('nav-config');
        if (configAttr) {
            try {
                return JSON.parse(configAttr);
            } catch (e) {
                console.warn('[UniversalNav] Invalid nav-config JSON');
            }
        }
        return window.Skeleton?.navConfig || { tabs: [] };
    }

    _hydrateI18n() {
        const i18n = window.Skeleton?.i18n || window.AIP?.i18n;
        if (i18n && typeof i18n.translate === 'function') {
            i18n.translate();
        } else {
            document.dispatchEvent(new CustomEvent('Skeleton:i18n-request', {
                detail: { source: 'universal-nav', timestamp: Date.now() }
            }));
        }
    }
}

if (!customElements.get('universal-nav')) {
    customElements.define('universal-nav', UniversalNav);
}