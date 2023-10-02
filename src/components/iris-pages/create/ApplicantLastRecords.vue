<template>
  <div class="applicant-last-records">
    <h5 class="font-weight-bolder">{{ $t('applicant_last_records_title') }}</h5>
    <list
      v-if="applicantId"
      ref="list"
      :url="requestUrl"
    >
      <template
        slot="list-items"
        slot-scope="{ item }">
        <span>
          <record-card-modal :record-id="item.normalized_record_id">
            <strong v-b-popover.hover.left="truncate(item.description)">#{{ item.normalized_record_id }} {{ item.element_detail }}</strong>
          </record-card-modal>
          <p>{{ item.created_at|date }}</p>
        </span>
      </template>
    </list>
  </div>
</template>


<script>
import List from '~/components/pages/list/List.vue'
import RecordCardModal from '~/components/iris-pages/records/RecordCardModal.vue'
import { truncate } from '~/assets/js/helpers'

/**
 * This component displays the last records created by the applicant passed by props.
 */
export default {
  name: 'ApplicantLastRecords',
  components: {
    List,
    RecordCardModal,
  },
  props: {
    /**
     * Id of the applicant.
     */
    applicantId: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: false,
      default: '/api/record_cards/applicant-last-records/',
    },
    emptyMessageKey: {
      type: String,
      default: 'applicant_last_records_no_records',
    },
  },
  computed: {
    requestUrl() {
      return `${this.url}${this.applicantId}/`
    },
  },
  methods: {
    truncate(text) {
      return truncate(text || '', 1000, true)
    },
  },
}
</script>

<style lang="scss" scoped>
h4.title {
  font-weight: bolder;
}
</style>
