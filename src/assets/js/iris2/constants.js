export const ALL_ERROR = 'non_field_errors'

export const lookupExpressions = ['iexact', 'ilike_contains', 'istartswith']

export const possibleSimilarRecordsAlarm = 'possible_similar_records'

export const urgentAlarm = 'urgent'

export const pendingCitizenResponseAlarm = 'pend_citizen_response'

export const responseTimeExpiredAlarm = 'response_time_expired'

export const externalReturnedId = 8

export const emailResponseChannel = 0

export const localStorageProjectPrefix = 'iris2spa_'

// src/record_cards/models.py Citizen.CITIZEN_CHOICE
export const applicantTypeCitizenChoice = 1

// src/record_cards/models.py SocialEntity.SOCIAL_ENTITY_CHOICE
export const applicantTypeSocialEntityChoice = 2

export const twitterElementdetailParameter = 'TWITTER_ELEMENT_DETAIL'
export function supportInfoType(vm = { $t: k => k }) {
  return {
    faq: { id: 0, name: vm.$t('support_faq_questions') },
    glossary: { id: 1, name: vm.$t('support_glossary') },
    documentation: { id: 2, name: vm.$t('support_docs') },
    video: { id: 3, name: vm.$t('support_videos') },
    news: { id: 4, name: vm.$t('support_news') },
  }
}

export function supportInfoCategory(vm = { $t: k => k }) {
  return {
    course: {
      id: 0,
      name: vm.$t('support_training_course'),
      shortName: vm.$t('support_docs_course'),
    },
    report: {
      id: 1,
      name: vm.$t('support_daiq_report'),
      shortName: vm.$t('support_docs_report'),
    },
    manual: {
      id: 2,
      name: vm.$t('support_user_manual'),
      shortName: vm.$t('support_docs_manual'),
    },
    regulation: {
      id: 3,
      name: vm.$t('support_regulation'),
      shortName: vm.$t('support_docs_regulation'),
    },
    link: {
      id: 4,
      name: vm.$t('support_link'),
      shortName: vm.$t('support_docs_link'),
    },
    other: {
      id: 5,
      name: vm.$t('support_other'),
      shortName: vm.$t('support_docs_other'),
    },
  }
}

export const supportEndpoint = '/api/supports-info/'

// src/iris_masters/models.py Reason.RECORDCARD_INVALID_MAIL
export const recordCardInvalidEmail = 1600

export const allowedExtensionsParameter = 'EXTENSIONS_PERMESES_FITXERS'

export const maxFileSizeParameter = 'MIDA_MAXIMA_FITXERS'
