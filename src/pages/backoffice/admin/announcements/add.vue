<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import SchemaUtils from '~/assets/js/iris2/forms/SchemaUtils.js'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import { validators } from 'vue-form-generator'
import Permissions from '~/assets/js/iris2/Permissions.js'

function getAnnouncementsDefinition(vm) {
  const descriptions = SchemaUtils.getDescription(
    50,
    null,
    vm.$t('title'),
    'title',
    {
      placeholder: vm.$t('title'),
      styleClasses: 'col-12 col-lg-9',
    }
  )
  /**
   * 'id', 'title', 'description', 'expiration_date', 'important'
   */
  return new FormDefinition(
    {
      ...descriptions,
      expiration_date: {
        type: 'pikaday',
        label: vm.$t('announcement_end_date'),
        placeholder: vm.$t('select_a_date'),
        format: 'YYYY-MM-DDTHH:mm',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        styleClasses: 'col-lg-3',
        validator: validators.date,
      },
      description: {
        type: 'textArea',
        label: vm.$t('announcement_body'),
        placeholder: vm.$t('text'),
        required: true,
        styleClasses: 'col-12',
        rows: 4,
      },
      important: {
        type: 'checkbox',
        default: false,
        label: vm.$t('announcement_important'),
        styleClasses: 'col-12 col-lg-4',
      },
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: Object.keys(descriptions).concat([
            'expiration_date',
            'description',
            'important',
          ]),
        },
      ],
    }
  )
}

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'AnnouncementForm',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/masters/announcements/',
    },
    title: {
      type: String,
      default: 'announcement_add',
    },
    definition: {
      type: Function,
      default: getAnnouncementsDefinition,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-announcements',
    },
    addNewUrl: {
      type: String,
      default: 'backoffice-admin-announcements-add',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-announcements',
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ANNOUNCEMENT,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('profile_save_success_title'),
    }
  },
}
</script>

<style lang="scss" scoped>
/* Allows textarea's rows attribute to work */
/deep/ .form-group.field-textArea .form-control {
  height: unset;

  // Unsets non scoped css by https://w33.bcn.cat/geobcn/js/0.5/jsapi.css
  border-color: rgb(212, 212, 212);
  background-color: #fff;
  outline: initial;
  box-shadow: initial;
  -webkit-box-shadow: initial;
  -moz-box-shadow: initial;
  -ms-box-shadow: initial;
}
</style>
