<template>
  <div
    v-if="opened"
    ref="modal"
    blocking
    width="90%"
    class="irisbox"
    @close="closed"
  >
    <h1>{{ $t('service_schedule') }}</h1>
    <loader v-if="loading"/>
    <div
      v-else-if="text || error"
      class="row">
      <p
        v-if="text"
        class="col-12">
        {{ text }}
      </p>
      <http-error
        :error="error"
        class="col-12" />
      <div class="col-12">
        <button
          class="btn btn-primary"
          @click="searchAgain">
          <font-awesome-icon icon="search"/>
          {{ $t('service_schedule_new_search' ) }}
        </button>
        <button
          class="btn btn-primary"
          @click="close">
          <font-awesome-icon icon="check"/>
          {{ $t('ok' ) }}
        </button>
      </div>
    </div>
    <service-schedule-form
      v-else
      :save-on-submit="false"
      @submit="load"
      @close="close" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Loader from '~/components/utils/Loader'
import HttpError from '~/components/pages/HttpError.vue'
import ServiceScheduleForm from '~/components/iris-pages/records/schedule/ServiceScheduleForm.vue'

export default {
  name: 'ServiceSchedule',
  components: {
    Loader,
    HttpError,
    ServiceScheduleForm,
  },
  data() {
    return {
      loading: false,
      text: '',
      error: null,
      opened: false,
    }
  },
  computed: {
    ...mapState('create', ['detail', 'isEdit']),
  },
  watch: {
    detail() {
      if (this.detail && this.detail.first_instance_response) {
        this.open()
      }
    },
  },
  methods: {
    ...mapActions('create', ['loadDetail']),
    open() {
      this.opened = true
    },
    searchAgain() {
      this.text = ''
      this.error = null
    },
    async load(filter) {
      this.loading = true
      const st = filter.ubication.street_code || filter.ubication.street
      try {
        const resp = await this.$axios.get('/api/furniture/pick-up/', {
          params: {
            street_code: st,
            number: filter.ubication.street2,
            street: filter.ubication.street,
            latitude: filter.ubication.latitude,
            longitude: filter.ubication.longitude,
          },
        })
        const result = resp.data
        this.text =
          result.results.length > 0 ? result.results[0].TEXT : result.TEXT
      } catch (e) {
        this.error = e
      }
      this.loading = false
    },
    close() {
      this.opened = false
      this.searchAgain()
      this.loadDetail(null)
    },
    closed() {
      this.close()
    },
  },
}
</script>
