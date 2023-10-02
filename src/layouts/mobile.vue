<template>
  <div
    :class="env"
    class="mobile-layout bg-white">
    <iris-header
      mobile
      collapsed />
    <div
      v-if="groupsLoading"
      class="loading-overlay full-page">
      <div class="loader" />
    </div>
    <main
      id="content"
      role="main"
      class="main-mobile flex-grow-1"
    >
      <div
        class="fullWidth main-content flex-grow-1">
        <div
          class="contentwrapper fullWidth flex-grow-1">
          <slot name="before-content"/>
          <nuxt v-if="isReady"/>
          <slot name="after-content"/>
          <footer class="main-footer">
            <p>
              Versió {{ VERSION }}.
            </p>
          </footer>
        </div>

      </div>
    </main>
    <notifications group="iris" />
    <group-error />
    <script
      v-if="issueCollectorEnabled"
      :src="issueCollectorUrl"
      type="text/javascript"
    />
  </div>
</template>

<script>
import Backoffice from './backoffice'

export default {
  extends: Backoffice,
}
</script>

<style lang="scss">
.main-mobile {
  display: flex;
  .dropdown-menu {
    // border: 2px solid red !important;
    // .font-weight-bold a {
    //   background-color: red !important;
    // }
    padding: 0 !important;
    background-color: $gray-300 !important;
    color: $gray-800;
    max-height: calc(100vh - 16rem) !important;
    ul,
    li {
      // margin: 0 !important;
      padding: 0 !important;
    }

    li {
      &.highlight,
      &.active {
        background-color: rgba($primary, 0.7) !important;
        color: $white;
        a {
          background-color: transparent !important;
        }
        &:after {
          color: $white !important;
        }
      }
      a {
        flex-grow: 1;
      }
    }
    .collapse.show > li > a {
      border: 1px solid $gray;
    }
    .detail {
      position: relative;
      color: $black;
      background-color: $white;
      padding: 0.5rem 0.25rem !important;
      border-bottom: 1px solid $gray-300;
      a {
        white-space: normal;
      }
      &:after {
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        content: '\f054';
        color: $black;
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  // Style for elements that are not the tree from of the firs step
  .next-step {
    .dropdown-menu {
      li {
        position: relative;
        color: $black;
        background-color: $white;
        padding: 0.5rem 0.25rem !important;
        border-bottom: 1px solid $gray-300;
        a {
          white-space: normal;
        }
        &:after {
          font-family: 'Font Awesome 5 Free';
          font-weight: 900;
          content: '\f054';
          color: $black;
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}

.mobile-layout {
  // border: 2px solid red;
  height: 100vh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 1.5rem;
  .footer-buttons {
    width: 100%;
    padding: 0 0.5rem;
  }
  .sweet-modal .sweet-title h2 {
    font-size: 1.2rem;
    line-height: 2.5rem;
  }
}

.main-content {
  min-height: 100%;
  &.fullWidth {
    .file-detail {
      .cardi__footer {
        width: 100%;
        max-width: 100%;
      }
    }
  }
}

.fullWidth {
  width: 100%;
  max-width: 100%;
}
.contentwrapper.fullWidth {
  width: 100%;
  max-width: 100%;
}

.proces-succes {
  font-size: 2.5rem;
  margin: 2rem auto 1rem;
  border: 2px solid rgba($primary, 0.5);
  line-height: 1;
  padding: 0.5em;
  border-radius: 50%;
}
.mobile-side-btn {
  font-size: 1.75rem;
  position: fixed;
  bottom: 1vmin;
  right: 1vmin;
  z-index: $zindex-fixed;
}
.btn-mobile {
  &.btn-danger,
  &a.btn-danger {
    color: white !important;
  }
  font-size: 2.5rem;
  cursor: pointer;
  position: relative;
  border-radius: 50%;
  margin: 0.25em 1vmin;
  width: 2em;
  height: 2em;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: inherit !important;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0px 5px 8px 0px rgba($black, 0.5);
  }

  &__name {
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    white-space: nowrap;
    position: absolute;
    right: 100%;
    margin-right: 1rem;
    color: $black;
    background-color: rgba($white, 0.7);
    padding: 0.5rem;
  }
  // &.btn-primary
  &:hover {
    .btn-mobile__name {
      opacity: 1;
    }
  }
}

.management {
  min-height: 300px;
  .detail {
    display: flex;
    flex-direction: column;
  }

  &-header {
    background-color: $gray-400;
    padding: 1rem;
    font-size: 1.25rem;
  }
  .list-content {
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
  }
  &-item {
    text-align: center;
    height: initial;
    padding: 1rem;
    margin: 1rem;
    min-width: 150px;
    border: 2px solid $gray-400;
    transition: 0.3s ease-in-out;
    &:hover {
      color: $gray-600;
      text-decoration: none;
      opacity: 0.75;
    }
    $hasExclamation: urgent;
    @each $element, $color in $indicators {
      &.#{$element} {
        color: $color;
        // Exclamation hightlight - to has an exclamation and border color
        @if ($element == $hasExclamation) {
          font-weight: 600;
          border-color: $color;
          .management-number {
            font-weight: 600;
          }
          .management-number::after {
            content: '!';
          }
        }
        // END exclamation
        &:focus {
          outline-color: $color;
        }
      }
    }
  }
  &-number {
    margin-top: 1.5rem;
    font-size: 3.5rem;
    line-height: 1;
    font-weight: 300;
  }
  &-itemDescription {
    min-height: 2rem;
  }
}
.announcements {
  .list-content {
    padding: 1rem;
  }
}
.announcements {
  width: 100%;
  &-header {
    font-size: 1.125rem;
    font-weight: 700;
    background: none;
    display: flex;
    justify-content: space-between;
  }
  &-item {
    height: 100%;
    padding: 2rem 1rem 1rem;
    display: flex;
    flex-direction: column;
  }
  &-itemTitle {
    height: initial;
    font-weight: 700;
  }
  &-itemFooter {
    margin-top: auto;
    padding-top: 1rem;
    display: flex;
    justify-content: flex-end;
    color: $gray-500;
    align-items: center;
    .fa-info {
      width: 1.6em;
      height: 1.6em;
      display: flex;
      padding: 0.3em 0.6em;
      background-color: $gray-400;
      color: $gray-500;
      border-radius: 1rem;
      margin-right: 0.8em;
    }
  }
}

.mobile-layout {
  .wizardStep {
    padding-top: 0px !important;
    .field-answer,
    .files,
    .field-textarea-count {
      padding-top: 20px;
    }
  }
  .form-group {
    &.field-geo-bcn {
      padding: 0px;
    }
    &.field-detail-search,
    &.field-autocomplete,
    &.field-vuex-select {
      padding: 0;
    }
    &.field-input {
      width: 100%;
    }
    &.answer-data {
      .iris-page {
        padding: 0px 10px;
        .iris-form {
          padding: 0px;
          .confirm-field {
            .col {
              min-width: 100%;
            }
          }
        }
      }
    }
  }
  .v-select,
  .v-select.v-select-tree {
    .dropdown-toggle {
      border: 0px;
      border-radius: 0px;
      background-color: lightgray;
      .selected-tag {
        color: black;
        background-color: white;
        border-radius: 5px;
        padding: 2px 10px !important;
        opacity: 1;
        font-size: 1.1rem;
      }
    }
    .dropdown-menu {
      border: 0px;
      width: 100%;
      box-shadow: none;
      li > a {
        padding: 7px 20px;
        font-size: 1.1rem;
      }
    }
  }
}

.announcements-itemTitle {
  background: none;
}
.announcements-itemFooter {
  border: none !important;
}

@include media-breakpoint-up(lg) {
  .management {
    &-item {
      width: 25%;
    }
  }
}

@include media-breakpoint-down(md) {
  .sweet-modal.is-mobile-fullscreen .sweet-buttons {
    position: relative !important;
  }
}
</style>
