/**
 * 🛰️ EVENT BUS | BREEDER HUB CORE
 * ═══════════════════════════════════════════════════════════════
 * VERSIÓN:      1.1.0 (Vitamina waitFor Integrada)
 * FECHA:        2026-02-03
 * CHANGELOG:    + waitFor() para promesas basadas en eventos
 * ═══════════════════════════════════════════════════════════════
 */

class EventBus {
    constructor() {
        this.bus = new Comment('🛰️ global-event-bus');
        this.listeners = new Map();

        if (typeof window !== 'undefined') {
            window.__eventBus = this;
        }
    }

    emit(event, detail = {}) {
        const customEvent = new CustomEvent(event, {
            detail: {
                ...detail,
                timestamp: new Date().toISOString(),
                source: detail.source || 'unknown'
            }
        });

        this.bus.dispatchEvent(customEvent);

        if (this._isDevelopment()) {
            console.log(`🛰️ EventBus.emit → ${event}`, detail);
        }
    }

    on(event, callback) {
        const wrappedCallback = (e) => {
            try {
                callback(e.detail);
            } catch (error) {
                console.error(`❌ EventBus: Error en listener de "${event}"`, error);
            }
        };

        this.bus.addEventListener(event, wrappedCallback);

        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(wrappedCallback);

        return () => {
            this.off(event, wrappedCallback);
        };
    }

    once(event, callback) {
        const wrappedCallback = (detail) => {
            callback(detail);
            this.off(event, wrappedCallback);
        };

        this.on(event, wrappedCallback);
    }

    off(event, callback) {
        this.bus.removeEventListener(event, callback);

        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    // 🆕 VITAMINA KIMI: waitFor con timeout
    waitFor(eventName, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`[EventBus] Timeout esperando: ${eventName}`));
            }, timeout);

            this.once(eventName, (detail) => {
                clearTimeout(timer);
                resolve(detail);
            });
        });
    }

    getListeners() {
        const result = {};
        this.listeners.forEach((callbacks, event) => {
            result[event] = callbacks.length;
        });
        return result;
    }

    _isDevelopment() {
        return window.location.hostname === 'localhost'
            || window.location.hostname === '127.0.0.1';
    }
}

export const globalBus = new EventBus();
console.log('🛰️ EventBus inicializado. Usa window.__eventBus para debugging.');
export default globalBus;

// 🆕 VISIBILIDAD GLOBAL PARA TESTING
if (typeof window !== 'undefined') {
    window.globalBus = globalBus;
    console.log('🛰️ EventBus visible en consola. Usa window.globalBus para pruebas.');
}
