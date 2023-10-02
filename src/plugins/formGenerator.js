import Vue from 'vue'
import fieldAutocomplete from '~/components/form-generator/fieldAutocomplete.vue'
import fieldAutocompleteMultiple from '~/components/form-generator/fieldAutocompleteMultiple.vue'
import fieldTimePicker from '~/components/form-generator/fieldTimePicker.vue'
import fieldRecordType from '~/components/form-generator/fieldSelectRecordType.vue'
import fieldSwitchResponseChannel from '~/components/form-generator/fieldSwitchResponseChannel.vue'
import fieldTagSelector from '~/components/form-generator/fieldTagSelector.vue'
import fieldMultiAttributeSelect from '~/components/form-generator/details/fieldMultiAttributeSelect.vue'
import fieldToggle from '~/components/form-generator/fieldToggle.vue'
import fieldSelectList from '~/components/form-generator/fieldSelectList.vue'
import fieldFavorite from '~/components/form-generator/fieldFavorite.vue'
import fieldMultiform from '~/components/form-generator/fieldMultiform.vue'
import FieldNestedForm from '~/components/form-generator/FieldNestedForm.vue'
import fieldWysiwyg from '~/components/form-generator/fieldWysiwyg.vue'
import fieldTextAreaCount from '~/components/form-generator/fieldTextAreaCount.vue'
import detailSelector from '~/components/form-generator/detailSelector.vue'
import geoBcn from '~/components/form-generator/fieldGeoBcn.vue'
import fieldAttributes from '~/components/form-generator/records/fieldAttributes.vue'
import fieldApplicantSelector from '~/components/form-generator/create/fieldApplicantSelector.vue'
import fieldAnswer from '~/components/form-generator/records/fieldAnswer.vue'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import AutocompleteVuexSelect from '~/components/form-generator/masters/AutocompleteVuexSelect.vue'
import fieldConfirm from '~/components/form-generator/fieldConfirm.vue'
import fieldId from '~/components/form-generator/create/fieldId.vue'
import FieldM2MSelect from '~/components/form-generator/FieldM2MSelect'
import FieldPikaday from '~/components/form-generator/FieldPikaday'
import FieldReadOnlyValue from '~/components/form-generator/fieldReadOnlyValue'
import FieldPortalTarget from '~/components/form-generator/FieldPortalTarget'
import FieldBase64 from '~/components/form-generator/fieldBase64.vue'

import V_Pikaday from 'vue-pikaday-directive'
import pikaday from 'pikaday'

if (window) {
  window.Pikaday = pikaday
}

Vue.directive('pikaday', V_Pikaday)
Vue.component('field-pikaday', FieldPikaday) // Overrides VFG's built-in FieldPikaday
Vue.component('field-autocomplete', fieldAutocomplete)
Vue.component('field-autocomplete-multiple', fieldAutocompleteMultiple)
Vue.component('field-time-picker', fieldTimePicker)
Vue.component('field-select-record-type', fieldRecordType)
Vue.component('field-switch-response-channel', fieldSwitchResponseChannel)
Vue.component('field-tag-selector', fieldTagSelector)
Vue.component('field-multi-attribute-select', fieldMultiAttributeSelect)
Vue.component('field-toggle', fieldToggle)
Vue.component('field-select-list', fieldSelectList)
Vue.component('field-favorite', fieldFavorite)
Vue.component('field-multiform', fieldMultiform)
Vue.component('field-nested-form', FieldNestedForm)
Vue.component('field-wysiwyg', fieldWysiwyg)
Vue.component('field-detail-selector', detailSelector)
Vue.component('field-geo-bcn', geoBcn)
Vue.component('field-attributes', fieldAttributes)
Vue.component('field-answer', fieldAnswer)
Vue.component('field-applicant-selector', fieldApplicantSelector)
Vue.component('field-textarea-count', fieldTextAreaCount)
Vue.component('field-vuex-select', VuexSelect)
Vue.component('field-autocomplete-vuex-select', AutocompleteVuexSelect)
Vue.component('field-confirm', fieldConfirm)
Vue.component('field-id', fieldId)
Vue.component('field-m2m-select', FieldM2MSelect)
Vue.component('field-readonly', FieldReadOnlyValue)
Vue.component('field-portal-target', FieldPortalTarget)
Vue.component('field-base64', FieldBase64)
