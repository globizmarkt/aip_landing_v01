/**
 * 🛡️ CARTOGRAFÍA QUIRÚRGICA v3.6
 * ------------------------------------------------------------------
 * ARCHIVO:    src/core/aimon-client.js
 * VERSIÓN:    1.1.0 (Hybrid Environment Aware)
 * PROPÓSITO:  Capa de abstracción con soporte nativo para Simulación.
 * ------------------------------------------------------------------
 */

/* [SEC-01] CONFIGURACIÓN Y CONSTANTES */
const CONFIG = {
    ENDPOINT: "https://aimon-backend-788513086126.us-central1.run.app",
    IS_DEV: true,            // 🟢 INTERRUPTOR MAESTRO (Simulación)
    MAX_RETRIES: 2,          // Reintentos permitidos
    RETRY_DELAY_MS: 1000,    // Espera entre reintentos
    TIMEOUT_MS: 15000        // Tiempo límite de respuesta
};

/* [SEC-02] LÓGICA DE SIMULACIÓN (MOCK) */
const MockService = {
    /**
     * Simula una respuesta de IA sin coste de red ni tokens.
     * @private
     */
    getResponse: async (message) => {
        console.log("🤖 MOCK AGENT: Procesando visión en modo simulación...");
        await new Promise(r => setTimeout(r, 1200)); // Latencia realista

        return {
            success: true,
            response: "Entendido, Director. He procesado la visión de tu proyecto. El esquema polimórfico v3.0 está listo para la cristalización. ¿Procedemos?",
            raw: { source: 'mock' }
        };
    }
};

/* [SEC-03] CLIENTE AIMON (CORE) */
export const AImonClient = {

    /**
     * Orquestador de comunicación. Bifurca entre Nube y Simulación.
     */
    sendMessage: async (context, message) => {
        // [CHECK 0] ¿Estamos en modo simulación?
        if (CONFIG.IS_DEV) {
            return await MockService.getResponse(message);
        }

        // [LOGICA DE RED REAL]
        let lastError = null;
        for (let attempt = 0; attempt <= CONFIG.MAX_RETRIES; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

                const response = await fetch(CONFIG.ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ context, message }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                return { success: true, response: data.response || "", raw: data };

            } catch (error) {
                lastError = error;
                console.warn(`⚠️ AImonClient: Intento ${attempt + 1} fallido:`, error.message);
                if (error.name === 'AbortError' || attempt === CONFIG.MAX_RETRIES) break;
                await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY_MS * (attempt + 1)));
            }
        }

        return { success: false, response: "Error de conexión.", error: lastError?.message };
    },

    /**
     * Wrapper para el flujo del Wizard.
     */
    sendWizardStep: async (history, instruction) => {
        const combinedMessage = `HISTORY: ${history} | INSTRUCTION: ${instruction}`;
        return await AImonClient.sendMessage(null, combinedMessage);
    },

    /**
     * NUEVO: generateWhitepaper
     * Cumple con la interfaz esperada por GenesisEngine
     */
    generateWhitepaper: async (data) => {
        const instruction = `Genera un whitepaper profesional para el proyecto ${data.projectName} con el eslogan ${data.slogan} en la vertical ${data.vertical}.`;
        return await AImonClient.sendMessage("WIZARD_GENESIS", instruction);
    }
};
