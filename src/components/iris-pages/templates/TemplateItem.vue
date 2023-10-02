<template>
  <button
    v-if="item" 
    class="template"
    @click="select">
    <div class="template__name">
      {{ item.description }}
    </div>
    <div class="template-service">
      <div
        :class="{'template-disabled': lacksEmail}" 
        class="template-service__name">
        E-mail
      </div>  
      <ul 
        v-if="showLangs" 
        class="template-service__language">
        <li>
          Castellà
        </li>
        <li>
          Català
        </li>
      </ul>  
    </div>
    <div class="template-service">
      <div
        :class="{'template-disabled': lacksSMS}" 
        class="template-service__name">
        SMS
      </div>  
      <ul 
        v-if="showLangs" 
        class="template-service__language">
        <li>
          Castellà
        </li>
        <li>
          Català
        </li>
      </ul>  
    </div>
  </button>
  <button
    v-else 
    class="template"
    @click="assign">
    <div class="template__name">
      {{ $t('templates_add') }}
    </div>
    <div class="template__new">
      +
    </div>
  </button>
</template>


<script>
export default {
  name: 'TemplateItem',
  props: {
    showLangs: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    lacksEmail() {
      return !this.item.write_medium_catalan || !this.item.write_medium_spanish
    },
    lacksSMS() {
      return !this.item.sms_medium_catalan || !this.item.sms_medium_spanish
    },
  },
  methods: {
    assign() {
      this.$emit('assign')
    },
    select() {
      this.$emit('selected', this.item)
    },
  },
}
</script>
