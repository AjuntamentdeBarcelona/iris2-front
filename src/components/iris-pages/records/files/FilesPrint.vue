<template>
  <div>
    <table>
      <tr>
        <th>{{ $t('files_filename') }}</th>
        <th>{{ $t('files_origin') }}</th>
        <th>{{ $t('created_at') }}</th>
      </tr>
      <tr 
        v-for="file in recordCard.files" 
        :key="file.id">
        <td>{{ file.filename }}</td>
        <td>{{ getLabelTypeFile(file.file_type) }}</td>
        <td>{{ dateStr(file.created_at) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import FileTypes from '~/assets/js/iris2/model/FileTypes.js'
import { dateTime } from '~/assets/js/helpers.js'

export default {
  components: {},
  props: {
    recordCard: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getLabelTypeFile(fileType) {
      return `${this.$t(FileTypes[fileType])}`
    },
    dateStr(data) {
      if (!data) {
        return '-'
      }
      try {
        return `${dateTime(data)}`
      } catch (e) {
        return '-'
      }
    },
  },
}
</script>
<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
</style>
