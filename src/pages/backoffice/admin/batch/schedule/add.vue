<template>
  <div class="schedule-page">
    <div class="alert alert-warning">
      <h3>{{ $t('batch_manual_schedule_tip_title') }}</h3>
      {{ $t('batch_manual_schedule_tip') }}
      <ul>
        <li>{{ $t('batch_manual_schedule_tip_no_overlap_default') }}</li>
        <li>{{ $t('batch_manual_schedule_tip_night') }}</li>
        <li>{{ $t('batch_manual_schedule_tip_ask_devs') }}</li>
      </ul>
    </div>
    <schedule-batch-form />
    <default-schedule />
  </div>
</template>

<script>
import ScheduleBatchForm from '~/components/iris-pages/batch/ScheduleBatchForm.vue'
import DefaultSchedule from '~/components/iris-pages/batch/DefaultSchedule.vue'

export default {
  name: 'ScheduleBatchPage',
  components: {
    ScheduleBatchForm,
    DefaultSchedule,
  },
}
</script>
