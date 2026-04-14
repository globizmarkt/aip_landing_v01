/**
 * 📋 ACCESS FORM SCHEMA — AIP-FIED CLONE (v1.0.0)
 * ============================================================
 * Archivo:      02_auditoria/indexacion de planos CPII 2026-04-14/access-form-schema.js
 * ============================================================
 * DOCTRINAS:    [R0] Agnosticism | [R5] Aislamiento APP_PREFIX
 * SENTINEL R0:  Wrapper IIFE + _PRIVATE_SCOPE + export en window.Skeleton
 * ============================================================
 */
(function(global) {
    'use strict';

    const _PRIVATE_SCOPE = {
        APP_PREFIX: 'AIP_LANDING_V0_'
    };

    const CLUB_MANAGER_MAP = Object.freeze({
        PT: 'UID_GESTOR_PORTUGAL',
        ES: 'UID_GESTOR_ESPANA',
        BR: 'UID_GESTOR_BRASIL',
        MX: 'UID_GESTOR_MEXICO',
        AR: 'UID_GESTOR_ARGENTINA',
        US: 'UID_GESTOR_DEFAULT',
        GB: 'UID_GESTOR_DEFAULT',
        FR: 'UID_GESTOR_DEFAULT',
        DE: 'UID_GESTOR_DEFAULT',
        IT: 'UID_GESTOR_DEFAULT',
        OTHER: 'UID_GESTOR_DEFAULT',
        _DEFAULT: 'UID_GESTOR_DEFAULT'
    });

    const AMBASSADOR_EXCEPTIONS = Object.freeze({
        'pedro_carvalho':  'Pedro Carvalho',
        'edmundo_barata':  'Edmundo Barata',
        'pedro_lagoa':     'Pedro Carvalho',
        'edmundo_antunes': 'Edmundo Barata',
        'rui_lopes':       'Rui Lopes',
        'kelly_silva':     'Kélly C. Silva',
        'mauricio_caires': 'Maurício Caires',
        'maria_santos':    'Maria da Luz Santos',
        'francisco_dias':  'Francisco Dias',
        'ismael_ferreira': 'Ismael Ferreira'
    });

    const AUTHORIZED_AMBASSADORS = Object.freeze([
        'david_almeida', 'carlos_balboa', 'elena_colomina', 'egidio_silva',
        'elisabete_nascimento', 'luis_pereira', 'francisco_santiago', 'pedro_carvalho',
        'pedro_lagoa', 'edmundo_barata', 'edmundo_antunes', 'alexandre_rodrigues',
        'rui_lopes', 'kelly_silva', 'francisco_dias', 'mauricio_caires',
        'ismael_ferreira', 'maria_santos'
    ]);

    const AccessFormSchema = {
        CLUB_MANAGER_MAP,
        AMBASSADOR_EXCEPTIONS,
        AUTHORIZED_AMBASSADORS,

        getClubManager: function(countryCode) {
            return this.CLUB_MANAGER_MAP[countryCode] || this.CLUB_MANAGER_MAP._DEFAULT;
        },

        resolveAmbassadorName: function(slug) {
            const normalized = (slug || '').toLowerCase().trim();
            if (!normalized) return null;

            if (this.AMBASSADOR_EXCEPTIONS[normalized]) {
                return this.AMBASSADOR_EXCEPTIONS[normalized];
            }

            if (this.AUTHORIZED_AMBASSADORS.includes(normalized)) {
                return normalized
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }

            return null;
        },

        initAmbassadorTracking: function() {
            const urlParams = new URLSearchParams(global.location.search);
            const refRaw = urlParams.get('ref') || global.localStorage.getItem(`${_PRIVATE_SCOPE.APP_PREFIX}REF`) || '';
            const slug = refRaw.toLowerCase().trim();
            const displayName = this.resolveAmbassadorName(slug);

            if (slug && displayName) {
                global.localStorage.setItem(`${_PRIVATE_SCOPE.APP_PREFIX}REF`, slug);
                document.dispatchEvent(new CustomEvent('Skeleton:Ambassador:Resolved', {
                    detail: Object.freeze({ slug, displayName }),
                    bubbles: true
                }));
            }

            return { slug: slug || null, displayName };
        },

        validateLeadForm: function(formData) {
            const errors = {};
            const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!formData.fullname || !formData.fullname.trim()) errors.fullname = 'required';
            if (!formData.email || !EMAIL_REGEX.test(formData.email.trim())) errors.email = 'invalid_format';
            if (!formData.phone || !formData.phone.trim()) errors.phone = 'required';
            if (!formData.country) errors.country = 'required';
            if (!formData.ambassador) errors.ambassador = 'required';
            if (!formData.profileType || !['inversor', 'promotor', 'gestor'].includes(formData.profileType)) errors.profileType = 'invalid_value';
            if (!formData.termsAccepted) errors.terms = 'must_accept';

            return {
                valid: Object.keys(errors).length === 0,
                errors
            };
        },

        buildLeadPayload: function(formData) {
            return {
                tipo: formData.profileType,
                perfil: {
                    nombre:    formData.fullname.trim(),
                    email:     formData.email.trim().toLowerCase(),
                    telefono:  formData.phone.trim(),
                    pais:      formData.country,
                    embajador: formData.ambassador
                },
                metadata: {
                    club_manager:  this.getClubManager(formData.country),
                    status:        'pending_review',
                    source:        'AIP_LANDING_FORM',
                    rgpd_consent:  true,
                    created_at:    new Date().toISOString()
                }
            };
        }
    };

    if (!global.Skeleton) global.Skeleton = {};
    global.Skeleton.AccessFormSchema = Object.freeze(AccessFormSchema);

})(window);
