/**
 * ⚡ FIREBASE TRIPLE WRITE — AIP-FIED CLONE (v1.0.0)
 * ============================================================
 * Archivo:      02_auditoria/indexacion de planos CPII 2026-04-14/firebase-triple-write.js
 * ============================================================
 * DOCTRINAS:    [R0] Agnosticismo | [R5] Sentinel — No Window Exposure
 * SENTINEL R0:  Wrapper IIFE + _PRIVATE_SCOPE + Object.freeze
 * ============================================================
 */

(function(global) {
    'use strict';

    const _PRIVATE_SCOPE = {
        APP_PREFIX: 'AIP_LANDING_V0_',
        config: {
            telegramFunctionUrl: null,
            sheetsSyncUrl: null,
            tenantId: 'aip_v0.1',
            landingVersion: 'v0.1',
            _initialized: false
        }
    };

    function _dispatchResult(detail) {
        document.dispatchEvent(new CustomEvent('Skeleton:Lead:SubmissionResult', {
            detail: Object.freeze(detail),
            bubbles: true,
            composed: false
        }));
    }

    const FirebaseConnector = {
        configureTripleWrite: function(config = {}) {
            if (!config.telegramFunctionUrl || !config.sheetsSyncUrl) {
                console.warn('[TripleWrite] ⚠️ Configuración incompleta. URLs de destino no definidas.');
            }
            _PRIVATE_SCOPE.config = {
                ..._PRIVATE_SCOPE.config,
                ...config,
                _initialized: true
            };
            console.info('[TripleWrite] ✅ Conector configurado. Tenant:', _PRIVATE_SCOPE.config.tenantId);
        },

        executeTripleWrite: async function(leadData, firebaseDeps) {
            if (!_PRIVATE_SCOPE.config._initialized) {
                console.error('[TripleWrite] ❌ configureTripleWrite() no ha sido llamado.');
                _dispatchResult({ success: false, error: 'CONNECTOR_NOT_CONFIGURED' });
                throw new Error('TRIPLE_WRITE_NOT_CONFIGURED');
            }

            const { db, collection, addDoc, serverTimestamp } = firebaseDeps;
            const enrichedPayload = {
                ...leadData,
                metadata: {
                    ...leadData.metadata,
                    tenant_id: _PRIVATE_SCOPE.config.tenantId,
                    landing_version: _PRIVATE_SCOPE.config.landingVersion,
                    u_agent: navigator.userAgent,
                    client_timestamp: new Date().toISOString(),
                    server_timestamp: serverTimestamp(),
                    source: 'AIP_LANDING_FORM'
                }
            };

            let firestoreId = null;

            try {
                const docRef = await addDoc(collection(db, 'leads'), enrichedPayload);
                firestoreId = docRef.id;
                console.info(`[TripleWrite] ✅ [1/3] Firestore. ID: ${firestoreId}`);

                if (_PRIVATE_SCOPE.config.telegramFunctionUrl) {
                    try {
                        const telegramPayload = {
                            name:     leadData.perfil?.nombre    || leadData.name    || '—',
                            email:    leadData.perfil?.email     || leadData.email   || '—',
                            phone:    leadData.perfil?.telefono  || leadData.phone   || '—',
                            country:  leadData.perfil?.pais      || leadData.country || '—',
                            referral: leadData.perfil?.embajador || leadData.referral || 'ORGANIC'
                        };

                        await fetch(_PRIVATE_SCOPE.config.telegramFunctionUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(telegramPayload)
                        });
                        console.info('[TripleWrite] ✅ [2/3] Telegram enviado.');
                    } catch (telegramError) {
                        console.warn('[TripleWrite] ⚠️ [2/3] Telegram falló (non-critical):', telegramError.message);
                    }
                }

                if (_PRIVATE_SCOPE.config.sheetsSyncUrl) {
                    fetch(_PRIVATE_SCOPE.config.sheetsSyncUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify(enrichedPayload)
                    }).then(() => {
                        console.info('[TripleWrite] ✅ [3/3] Sheets sync enviado.');
                    }).catch(sheetsError => {
                        console.warn('[TripleWrite] ⚠️ [3/3] Sheets sync falló (non-critical):', sheetsError.message);
                    });
                }

                _dispatchResult({ success: true, id: firestoreId });
                return { success: true, id: firestoreId };

            } catch (error) {
                console.error('[TripleWrite] ❌ Falla crítica en persistencia:', error.code || error.message);
                _dispatchResult({ success: false, error: error.message, id: null });
                throw new Error('TRIPLE_WRITE_FAILURE');
            }
        }
    };

    if (!global.Skeleton) global.Skeleton = {};
    global.Skeleton.FirebaseConnector = Object.freeze(FirebaseConnector);

})(window);
