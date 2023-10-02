export default {
  list(vm) {
    return [
      {
        value: '',
        label: vm.$t('select'),
      },
      {
        value: 't',
        label: vm.$t('record_card_answer_worked'),
      },
      {
        value: 'p',
        label: vm.$t('record_card_answer_template_changed'),
      },
      {
        value: 'o',
        label: vm.$t('record_card_answer_others'),
      },
    ]
  },
}
