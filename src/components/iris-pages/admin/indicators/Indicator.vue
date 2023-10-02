<template >
  <div
    :title="text"
    class="indicator">
    <div
      class="indicator__number"
      v-text="number"
    />
    <div
      :title="text"
      class="indicator__text d-flex">
      {{ text }}
    </div>
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    number: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      default: '',
    },
    activeIndicator: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss">
// .indicator base, main modifications
.indicator {
  cursor: pointer;
  width: 235px;
  margin: 1rem;
  flex-grow: 1;
  opacity: 0.9;
  overflow: hidden;
  display: flex;
  font-weight: 100;
  border-bottom: 2px solid $gray;
  font-size: 0.875rem;
  &__number,
  &__text {
    padding: 1rem 0.5rem;
  }

  &__number {
    flex-grow: 1;
    flex: 1 1 120px;
    font-size: 3em;
    text-align: right;
    line-height: 1;
    border-left: 0.2em solid transparent;
  }
  &__text {
    flex: 1 1 100px;
    align-self: flex-end;
  }
  svg {
    transition: 0.3s ease-in-out;
    margin-left: 0;
  }
}

// Styles of .indicator default
@each $element, $color in $indicators {
  .indicator.#{$element} {
    color: $color;
  }
  .indicator--active.#{$element} .indicator__number {
    border-left-color: $color;
  }
}

// Styles of .indicator-list
$indicatorColor: #bb9cd8;
$indicatorFontColor: $black;

.indicator.collapsed .svg-inline--fa {
  transform: rotate(-90deg);
}
.indicator-list {
  width: auto;
  margin: 0;
  color: $indicatorFontColor;
  background-color: $indicatorColor;
  border-bottom: 1px solid lighten($indicatorColor, 10);
  font-size: 1rem;
  font-weight: 900;
  align-items: center;
  .indicator {
    &__number,
    &__text {
      border: none;
      padding: 0.26rem;
      white-space: nowrap;
      flex: 0 1 auto;
    }
    &__number {
      min-width: initial;
      font-size: 1.25em;
      min-width: 4em;
    }
    &__text {
      width: 80%;
      overflow: hidden;
    }
  }
}

// MODIFICATIONS OF .indicator-list, indicator-list--child and indicator-list--grandchild
.indicator-list {
  &--child,
  &--grandchild {
    font-size: 0.9rem;
    font-weight: 500;
  }
  &--child {
    background-color: rgba($indicatorColor, 0.6);
  }
  &--grandchild {
    background-color: rgba($indicatorColor, 0.3);
    //first element/title highlighted
    &:first-child {
      background-color: rgba($indicatorColor, 0.4);
      font-weight: 600;
    }
  }
}
</style>
