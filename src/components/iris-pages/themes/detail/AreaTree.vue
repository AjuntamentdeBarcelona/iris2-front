<template>
  <li
    v-if="area.visible"
    class="no-hover"
  >
    <a
      v-b-toggle="`${prefix}-area-${area.id}`"
      class="font-weight-bold"
      @mousedown.prevent.stop="noop"
    >
      {{ area.description }}
      <font-awesome-icon
        icon="caret-down"
        class="ml-1"
      />
    </a>
    <b-collapse
      :id="`${prefix}-area-${area.id}`"
      :visible="search != '' || visible || noCollapse"
    >
      <ul
        class="list-unstyled text-muted pl-2"
      >
        <li
          v-for="element in area.elements"
          :key="element.id"
          class="no-hover"
        >
          <a
            v-b-toggle="`${prefix}-element-${element.id}`"
            v-if="element.visible"
            @mousedown.prevent.stop="noop"
          >
            {{ element.description }}
            <font-awesome-icon
              icon="caret-down"
              class="ml-1 fa-xs"
            />
          </a>
          <b-collapse
            :id="`${prefix}-element-${element.id}`"
            :visible="search != '' || visibleElement === element.id || area.autoopen || noCollapse"
          >
            <ul class="details">
              <li
                v-for="detail in element.details"
                v-show="detail.canSee || !detail.hidden"
                :key="detail.id"
                :class="{highlight: selectedDetail == detail.id}"
                role="option"
                class="detail"
                @mousedown.prevent.stop="select(detail)"
              >
                <a>
                  <slot
                    v-bind="(typeof detail === 'object')?detail:{[label]: detail}"
                    name="option">
                    <span v-if="showCode">{{ detail.display_id }} - </span>
                    {{ detail.description }}
                    <b v-if="detail.hidden">({{ $t('hidden') }})</b>
                  </slot>
                </a>
              </li>
            </ul>
          </b-collapse>
        </li>
      </ul>
    </b-collapse>
  </li>
</template>

<script>
export default {
  name: 'AreaTree',
  props: {
    area: {
      type: Object,
      required: true,
      default: null,
    },
    prefix: {
      type: String,
      required: true,
      default: 'area',
    },
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    search: {
      type: String,
      required: true,
      default: '',
    },
    visibleElement: {
      type: [Number, Boolean],
      required: true,
      default: null,
    },
    selectedDetail: {
      type: [Number, Boolean],
      required: true,
      default: null,
    },
    noCollapse: {
      type: Boolean,
      default: false,
    },
    showCode: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    select(detail) {
      this.$emit('select', detail)
    },
    noop() {},
  },
}
</script>
