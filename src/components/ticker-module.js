/**
 * @file ticker-module.js
 * @role Junior Dev-QA — Motor de Datos Reactivo para Ticker
 * @location src/components/ticker-module.js
 * @doctrine R0 (Vanilla Zero-Deps), R3 (Zero-Hex), R4 (i18n Strict)
 * @description Custom Element <ticker-commodities>: inyección de datos financieros con aislamiento numérico, 
 *              actualización eficiente vía requestAnimationFrame, y limpieza GC en disconnectedCallback.
 * @event Skeleton:Ticker:Updated (emite tras cada ciclo de actualización)
 */
(function () {
    'use strict';

    // ============================================================
    // CONFIGURACIÓN Y TOKENS (R3: Zero-Hex)
    // ============================================================
    const UPDATE_INTERVAL_MS = 2500; // Throttle para simulación de mercado
    const VOLATILITY_MIN = 0.0005;   // ±0.05% fluctuación mínima
    const VOLATILITY_MAX = 0.003;    // ±0.3% fluctuación máxima

    // ============================================================
    // DATOS REACTIVOS (Fuente de Verdad del Componente)
    // ============================================================
    const reactiveData = {
        commodities: [
            { symbol: 'XAU', nameKey: 'commodities.XAU.name', categoryKey: 'commodities.XAU.category', price: 2341.50, change: 0, trend: 'neutral' },
            { symbol: 'XAG', nameKey: 'commodities.XAG.name', categoryKey: 'commodities.XAG.category', price: 28.42, change: 0, trend: 'neutral' },
            { symbol: 'BRENT', nameKey: 'commodities.BRENT.name', categoryKey: 'commodities.BRENT.category', price: 84.15, change: 0, trend: 'neutral' },
            { symbol: 'XPT', nameKey: 'commodities.XPT.name', categoryKey: 'commodities.XPT.category', price: 912.30, change: 0, trend: 'neutral' },
            { symbol: 'COPPER', nameKey: 'commodities.COPPER.name', categoryKey: 'commodities.COPPER.category', price: 4.23, change: 0, trend: 'neutral' }
        ],
        news: [
            { key: 'news.item_1', timestamp: '2026-04-14T08:00:00Z' },
            { key: 'news.item_2', timestamp: '2026-04-14T07:30:00Z' },
            { key: 'news.item_3', timestamp: '2026-04-14T07:00:00Z' },
            { key: 'news.item_4', timestamp: '2026-04-14T06:30:00Z' },
            { key: 'news.item_5', timestamp: '2026-04-14T06:00:00Z' }
        ]
    };

    // ============================================================
    // NÚCLEO DEL COMPONENTE
    // ============================================================
    class TickerCommodities extends HTMLElement {
        constructor() {
            super();
            this._animationFrameId = null;
            this._lastUpdate = 0;
            this._isConnected = false;
        }

        connectedCallback() {
            this._isConnected = true;
            this._renderSkeleton();
            this._hydrateI18n();
            this._startUpdateLoop();
        }

        disconnectedCallback() {
            // GC: Purga de bucles y listeners (Doctrina Garbage Collection)
            this._isConnected = false;
            if (this._animationFrameId) {
                cancelAnimationFrame(this._animationFrameId);
                this._animationFrameId = null;
            }
            this._lastUpdate = 0;
        }

        // ------------------------------------------------------------
        // RENDERIZADO INICIAL (Light DOM, R2 compliant)
        // ------------------------------------------------------------
        _renderSkeleton() {
            // Estructura base con atributos data-i18n para hidratación externa
            const fragment = document.createDocumentFragment();

            // Contenedor de commodities
            const commoditiesSection = document.createElement('section');
            commoditiesSection.className = 'ticker-commodities'; // Tailwind classes inyectadas por Stitch
            commoditiesSection.setAttribute('aria-label', window.LuxI18n?.t('commodities.ticker.live_feed') || 'Live Market Feed');

            reactiveData.commodities.forEach(item => {
                const row = document.createElement('div');
                row.className = 'ticker-row';
                row.dataset.symbol = item.symbol;

                // R4: Nombre del activo → data-i18n (hidratación delegada a Kimi)
                const nameSpan = document.createElement('span');
                nameSpan.className = 'ticker-name';
                nameSpan.setAttribute('data-i18n', item.nameKey);

                // R4: Categoría → data-i18n (opcional, según diseño de Stitch)
                const categorySpan = document.createElement('span');
                categorySpan.className = 'ticker-category';
                categorySpan.setAttribute('data-i18n', item.categoryKey);

                // R4 Aislamiento Numérico: Precio → <span> dedicado, cero texto hardcodeado
                const priceSpan = document.createElement('span');
                priceSpan.className = 'ticker-price';
                priceSpan.dataset.priceTarget = item.symbol;
                priceSpan.textContent = item.price.toFixed(2);

                // R4 Aislamiento Numérico: Cambio → <span> dedicado con atributo data-trend
                const changeSpan = document.createElement('span');
                changeSpan.className = 'ticker-change';
                changeSpan.dataset.changeTarget = item.symbol;
                changeSpan.dataset.trend = item.trend;
                changeSpan.textContent = `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%`;

                row.append(nameSpan, categorySpan, priceSpan, changeSpan);
                commoditiesSection.appendChild(row);
            });

            fragment.appendChild(commoditiesSection);
            this.appendChild(fragment);
        }

        // ------------------------------------------------------------
        // HIDRATACIÓN i18n (Delegación a Motor Kimi - R4 Strict)
        // ------------------------------------------------------------
        _hydrateI18n() {
            // R4 Strict: Invocación directa del motor pre-Trinity o espera de Render Lock
            if (window.LuxI18n && typeof window.LuxI18n.hydrate === 'function') {
                window.LuxI18n.hydrate();
            } else {
                document.addEventListener('Skeleton:System:Hydrated', () => {
                    if (window.LuxI18n) window.LuxI18n.hydrate();
                }, { once: true });
            }
        }

        _collectI18nKeys() {
            const keys = [];
            reactiveData.commodities.forEach(item => {
                keys.push(item.nameKey, item.categoryKey);
            });
            reactiveData.news.forEach(item => keys.push(item.key));
            return keys;
        }

        // ------------------------------------------------------------
        // CICLO DE ACTUALIZACIÓN (Performance: requestAnimationFrame + throttle)
        // ------------------------------------------------------------
        _startUpdateLoop() {
            const tick = (timestamp) => {
                if (!this._isConnected) return;

                // Throttle: solo actualiza si han pasado UPDATE_INTERVAL_MS
                if (timestamp - this._lastUpdate >= UPDATE_INTERVAL_MS) {
                    this._simulateMarketMovement();
                    this._renderNumericValues();
                    this._emitUpdateEvent();
                    this._lastUpdate = timestamp;
                }

                this._animationFrameId = requestAnimationFrame(tick);
            };

            this._animationFrameId = requestAnimationFrame(tick);
        }

        // ------------------------------------------------------------
        // SIMULACIÓN DE MERCADO (Lógica de negocio aislada)
        // ------------------------------------------------------------
        _simulateMarketMovement() {
            reactiveData.commodities.forEach(item => {
                // Volatilidad aleatoria controlada
                const volatility = VOLATILITY_MIN + Math.random() * (VOLATILITY_MAX - VOLATILITY_MIN);
                const direction = Math.random() > 0.5 ? 1 : -1;
                const changePercent = direction * volatility * 100;

                // Actualiza precio base + cambio
                item.price = item.price * (1 + (changePercent / 100));
                item.change = changePercent;
                item.trend = changePercent > 0.05 ? 'up' : changePercent < -0.05 ? 'down' : 'neutral';
            });
        }

        // ------------------------------------------------------------
        // INYECCIÓN NUMÉRICA (Aislamiento R4: solo cifras en <span>)
        // ------------------------------------------------------------
        _renderNumericValues() {
            reactiveData.commodities.forEach(item => {
                // Precio: inyección directa en <span> dedicado
                const priceEl = this.querySelector(`[data-price-target="${item.symbol}"]`);
                if (priceEl) {
                    priceEl.textContent = item.price.toFixed(2);
                }

                // Cambio: inyección directa con formato de signo
                const changeEl = this.querySelector(`[data-change-target="${item.symbol}"]`);
                if (changeEl) {
                    changeEl.textContent = `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%`;
                    changeEl.dataset.trend = item.trend; // Actualiza atributo para estilos CSS
                }
            });
        }

        // ------------------------------------------------------------
        // COMUNICACIÓN (CustomEvent con prefijo Skeleton:)
        // ------------------------------------------------------------
        _emitUpdateEvent() {
            const updateEvent = new CustomEvent('Skeleton:Ticker:Updated', {
                bubbles: true,
                cancelable: false,
                detail: {
                    timestamp: Date.now(),
                    commodities: reactiveData.commodities.map(c => ({
                        symbol: c.symbol,
                        price: c.price,
                        change: c.change,
                        trend: c.trend
                    }))
                }
            });
            document.dispatchEvent(updateEvent);
        }
    }

    // ============================================================
    // REGISTRO DEL COMPONENTE (Vanilla Zero-Deps)
    // ============================================================
    if (!customElements.get('ticker-commodities')) {
        customElements.define('ticker-commodities', TickerCommodities);
    }
})();