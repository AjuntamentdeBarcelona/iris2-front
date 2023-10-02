c
<template>
  <add-record-card-twitter/>
</template>

<script>
import AddRecordCardTwitter from '~/components/iris-pages/create/AddRecordCardTwitter.vue'

export default {
  name: 'TwitterRecordCardCreatePage',
  layout: 'backoffice',
  components: {
    AddRecordCardTwitter,
  },
}
</script>
