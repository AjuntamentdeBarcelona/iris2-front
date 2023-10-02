<template>
  <div class="access-log">
    <div class="col-12">
      <h1>{{ $t('reports_audit') }}</h1>
      <h4>{{ $t('reports_access_log_report') }}. {{ $t('reports_dates') }}: {{ startDate }} - {{ endDate }}</h4>
    </div>
    <table class="col-12 table table-striped table-bordered">
      <thead>
        <tr>
          <th>{{ $t('reports_access_username') }}</th>
          <th>{{ $t('reports_sector') }}</th>
          <th>{{ $t('reports_service_line') }}</th>
          <th>{{ $t('reports_service_grup') }}</th>
          <th>{{ $t('reports_service_enters') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="row in data"
          :key="row.username + row.operador">
          <td>{{ row.username }}</td>
          <td>{{ row.sector }}</td>
          <td>{{ row.linia_servei }}</td>
          <td>{{ row.operador }}</td>
          <td>{{ row.count }}</td>
        </tr>
      </tbody>
    </table>
    <span>{{ $t('reports_access_log_source') }}</span>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'AccessLogTable',
  props: {
    data: {
      type: Array,
      required: true,
    },
    params: {
      type: Object,
      required: true,
    },
  },
  computed: {
    startDate() {
      return this.parseDate(this.params.from_date)
    },
    endDate() {
      return this.parseDate(this.params.to_date)
    },
  },
  methods: {
    parseDate(date) {
      return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
    },
  },
}
</script>
