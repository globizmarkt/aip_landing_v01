/**
 * 🛡️ CARTOGRAFÍA QUIRÚRGICA v3.1
 * ------------------------------------------------------------------
 * ARCHIVO:    src/core/router.js
 * VERSIÓN:    1.0.0
 * PROPÓSITO:  Enrutador simple basado en Hash y Estado.
 * Maneja la redirección al Dashboard Admin.
 * ------------------------------------------------------------------
 */

/* [SEC-00] ÍNDICE MAESTRO
 * [SEC-01] IMPORTACIONES
 * [SEC-02] CLASE ROUTER
 * [SEC-03] EXPORTACIÓN
 */

/* [SEC-01] IMPORTACIONES */
import { Auth } from './auth-manager.js';
import { Gatekeeper } from './gatekeeper.js';
import { AdminDashboard } from '../features/dashboard/admin-dashboard.js'; // <--- NUEVO

/* [SEC-02] CLASE ROUTER */
class AppRouter {
    constructor() {
        this.routes = {
            '': this._loadHome.bind(this),
            '#dashboard': this._loadAdminDashboard.bind(this)
        };

        // Escuchar cambios de hash
        window.addEventListener('hashchange', () => this._handleRoute());

        // Escuchar carga inicial
        window.addEventListener('load', () => this._handleRoute());
    }

    async _handleRoute() {
        const hash = window.location.hash || '';
        console.log('🔄 Router: Navigating to', hash || 'HOME');

        // Esperar a Auth antes de decidir (evita rebotes)
        await this._waitForAuth();

        if (hash === '#dashboard') {
            await this._loadAdminDashboard();
        } else {
            // Si estamos en HOME pero tenemos sesión y proyecto activo, redirigir
            if (Auth.isAuthenticated()) {
                const user = Auth.getUser();
                // Verificación ligera (podría optimizarse leyendo de caché local)
                // Aquí asumimos que si hay user, el Gatekeeper tiene la última palabra
                // Para simplificar: Si entra en Home y está logueado, AImon arranca, 
                // pero si tiene proyecto, el Gatekeeper lo parará al intentar crear otro.
                // Opcional: Redirección automática si ya tiene proyecto.
            }
        }
    }

    _waitForAuth() {
        return new Promise(resolve => {
            const check = () => {
                if (Auth.isAuthenticated() !== null) resolve(); // null = cargando, false/true = resuelto
                else setTimeout(check, 100);
            };
            check();
        });
    }

    _loadHome() {
        // Comportamiento por defecto (AImon carga)
        // No hacemos nada, dejamos que wizard.js haga su trabajo
    }

    async _loadAdminDashboard() {
        // 1. Verificación de Seguridad
        if (!Auth.isAuthenticated()) {
            console.warn('Router: Access denied. Redirecting to Home.');
            window.location.hash = '';
            return;
        }

        console.log('Router: Loading Admin Dashboard...');

        // 2. Ocultar AImon / Wizard
        // (Aseguramos ocultar el wrapper principal definido en genesis.html)
        const wizardContainer = document.querySelector('.wd-genesis-wrapper');
        if (wizardContainer) wizardContainer.style.display = 'none';

        // 3. Renderizar Dashboard Real
        // Usamos el body o un contenedor 'app' si existiera.
        const appContainer = document.body;

        // Evitamos re-render si ya existe
        if (!document.getElementById('admin-dashboard-root')) {
            AdminDashboard.render(appContainer);
        }
    }
}

/* [SEC-03] EXPORTACIÓN */
export const Router = new AppRouter();
