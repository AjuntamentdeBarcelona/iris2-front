<script>
import fieldSelectList from '~/components/form-generator/fieldSelectList.vue'
import Feature from '~/assets/js/iris2/model/Feature.js'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { mapState } from 'vuex'
import IrisFormGenerator from '~/components/pages/form/irisFormGenerator.vue'

/**
 * Component for selecting a list of filters for a RecordList.
 * By default it allows to select arbitrary attributes, but when a
 * detail is selected the list will be reduced to the attributes
 * acceptep by the detail.
 *
 * Since the filter will select many attributes, they are saved within
 * the model following an special format for creating a querystring.
 * For example:
 * feature_1=0&value_1=2&feature_2=129&value_2=33&feature_3=104&value_3=26
 *
 * So these differente attributes must be set within the model and will update
 * many form model attributes in one time.
 *
 */
export default {
  name: 'AttributeFilterField',
  extends: fieldSelectList,
  computed: {
    ...mapState('features', 'masks'),
    elementDetail() {
      return this.model.elementdetail
    },
    listUrl() {
      if (this.elementDetail && this.elementDetail.length == 1) {
        return `api/theme/details/${this.elementDetail[0].id}/features/`
      }
      return this.schema.url
    },
  },
  watch: {
    elementDetail() {
      this.initialLoad()
      // Reset values when selected details change and is not empty
      if (this.elementDetail && this.elementDetail.length > 0) {
        this.selected = []
        this.setValue()
      }
    },
  },
  methods: {
    /**
     * Override getSchemaForItem for generate the appropiate schema for the attribute.
     */
    getSchemaForItem(item) {
      return new FormDefinition(
        {
          value: {
            ...Feature.schemaFromEDFeature({ feature: item }, this.masks, this),
            required: false,
            validator: [],
            styleClasses: 'col-12',
          },
        },
        { fields: ['value'] }
      )
    },
    /**
     * When the features are loaded from a detail, they will be place on the "feature" attribute
     * of the result object.
     */
    processAjaxResult(data) {
      return data.results.map(item => (item.feature ? item.feature : item))
    },
  },
}
</script>
