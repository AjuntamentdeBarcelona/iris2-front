<template>
  <div class="time-picker">
    <select
      v-model="selectedHour"
      :disabled="schema.disabled"
      class="form-control">
      <option :value="null">-</option>
      <option
        v-for="hour in hours"
        :key="hour"
        :value="hour">{{ pad(hour) }}</option>
    </select>
    :
    <select
      v-model="selectedMinute"
      :disabled="schema.disabled"
      class="form-control">
      <option :value="null">-</option>
      <option
        v-for="minute in minutes"
        :key="minute"
        :value="minute">{{ pad(minute) }}</option>
    </select>
  </div>
</template>

<script>
import _ from 'lodash'
import { abstractField } from 'vue-form-generator'
import irisField from './irisField.js'
import moment from 'moment'
import { pad } from '~/assets/js/helpers.js'

export default {
  name: 'FieldTimePicker',
  mixins: [irisField, abstractField],
  data() {
    return {
      selectedHour: null,
      selectedMinute: null,
    }
  },
  computed: {
    hours() {
      return _.range(0, 24)
    },
    minutes() {
      return _.range(0, 60)
    },
  },
  watch: {
    value: {
      handler() {
        if (this.value) {
          const value = moment(this.value)
          this.selectedHour = this.value.hours()
          this.selectedMinute = this.value.minutes()
        } else {
          this.selectedHour = null
          this.selectedMinute = null
        }
      },
      immediate: true,
    },
    selectedMinute() {
      this.attachValue()
    },
    selectedHour() {
      this.attachValue()
    },
  },
  methods: {
    attachValue() {
      if (this.selectedHour != null) {
        this.value = moment(
          `${this.selectedHour}:${this.selectedMinute}`,
          'HH:mm'
        )
        if (this.selectedHour != null && this.selectedMinute == null) {
          this.selectedMinute = '0'
        }
      } else {
        this.value = null
      }
    },
    pad(value) {
      return pad(value, 2)
    },
    validate() {
      if (this.schema.required && !this.value) {
        this.$emit('validated', false, [this.$t('required')], this)
      }
    },
  },
}
</script>

<style lang="scss">
.time-picker {
  select.form-control {
    display: inline-block;
    width: 80px;
  }
  white-space: nowrap;
}
</style>
