<template>
  <div class="d-flex align-items-center">
    <button
      class="btn btn-secondary py-0 px-1"
      @click="reduceDate"
    >
      <font-awesome-icon
        icon="chevron-left"/>
    </button>
    <span
      class="date mx-2"
      v-text="`${pad((month + 1), 2)} / ${year}`"
    />

    <button
      :disabled="disabledIncreaseDateBtn"
      class="btn btn-secondary py-0 px-1"
      @click="increaseDate"
    >
      <font-awesome-icon
        icon="chevron-right"/>
    </button>
  </div>
</template>

<script>
import { pad } from '~/assets/js/helpers'

const currentDate = new Date()

export default {
  name: 'DateSelector',
  data() {
    return {
      value: new Date(new Date().setDate(1)),
      pad: pad,
    }
  },
  computed: {
    disabledIncreaseDateBtn() {
      return (
        new Date(this.value).setMonth(this.month + 1) > currentDate.getTime()
      )
    },
    month() {
      return this.value.getMonth()
    },
    year() {
      return this.value.getFullYear()
    },
    currentValue() {
      return {
        month: this.month + 1,
        year: this.year,
      }
    },
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.emitValue()
      },
      immediate: true,
    },
  },
  methods: {
    reduceDate() {
      this.value = new Date(this.value.setMonth(this.month - 1))
    },
    increaseDate() {
      this.value = new Date(this.value.setMonth(this.month + 1))
    },
    emitValue() {
      this.$emit('value-updated', this.currentValue)
    },
  },
}
</script>
<style lang="scss" scoped>
.date {
  font-weight: bolder;
  font-size: 1rem;
  white-space: nowrap;
}
</style>
