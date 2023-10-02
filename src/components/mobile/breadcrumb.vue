<template>
  <div
    class="mb-breadcrumb-wrapper">
    <div class="text-primary text-uppercase">
      <strong>{{ active }}</strong>
      {{ title }}
    </div>
    <div class="mb-breadcrumb">
      <div
        v-for="n in max"
        :key="n"
        :class="stepProces(n)"
        class="mb-breadcrumb-step"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileBreadcrumb',
  props: {
    title: {
      type: String,
      default: '',
    },
    active: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    errors: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    stepProces(step) {
      const error =
        this.errors.length > 0 && this.errors[step - 1] ? 'error ' : ' '
      if (step > this.active) {
        return error + ''
      }
      if (step < this.active) {
        return error + 'done'
      }
      if (step === this.active) {
        return error + 'current'
      }
    },
  },
}
</script>

<style lang="scss">
$spacing: 0.25rem;
$active: $primary;
$number: $white;
$disabled: $dark;

.mb-breadcrumb-wrapper {
  margin: 0 2rem;
  position: absolute;
  bottom: -1.5rem;
  left: 0;
  right: 0;
  &.showFooter {
    bottom: 0;
  }
}

.mb-breadcrumb {
  padding-top: 3 * $spacing;
  display: flex;

  position: absolute;
  background-color: $white;
  position: relative;
  &-step {
    margin: 0 $spacing;
    flex-grow: 1;
    border: 2px solid $disabled;
    height: 2px;
    &__hint {
      display: none;
      position: absolute;
      left: 0.5rem;
      bottom: 100%;
      font-weight: bolder;
      font-size: 1.125rem;
      color: $active;
      z-index: 5;
    }
  }
}
.mb-breadcrumb-step {
  &.current {
    .mb-breadcrumb-step__hint {
      display: block;
    }
  }
  &.current,
  &.done {
    border-color: $primary;
  }
  &.error {
    border-color: $danger;
  }
}
</style>
