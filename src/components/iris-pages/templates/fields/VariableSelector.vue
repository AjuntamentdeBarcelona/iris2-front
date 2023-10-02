<template>
  <div class="variable-selector">
    <div class="form-group col-12 p-0">
      <span class="input-group">
        <input
          v-model="internalSearch"
          :placeholder="$t('template_vars_search')"
          type="text"
          class="form-control"
          @input="debouncedSearch">
      </span>
    </div>
    <ul class="list-group">
      <li 
        v-for="variable in answers"
        :key="variable.name"
        class="list-group-item" 
        @click="select(variable.name)">{{ variable.name }}</li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'VariableSelector',
  data() {
    return {
      searchText: '',
      internalSearch: '',
    }
  },
  computed: {
    ...mapState('masters', { templateVars: 'templateVars' }),
    answers() {
      if (this.searchText) {
        return this.templateVars.filter(item => this.isVarInSearch(item))
      }
      return this.templateVars
    },
  },
  created() {
    this.debouncedSearch = _.debounce(this.search, 300)
    this.loadTemplateVars()
  },
  methods: {
    select(varKey) {
      this.$emit('selected', varKey)
    },
    ...mapActions('masters', {
      loadTemplateVars: 'retrieveTemplateVars',
    }),
    search() {
      this.searchText = this.internalSearch
    },
    isVarInSearch(item) {
      const words = this.searchText.split(' ')
      for (let word of words) {
        if (item.name.toLowerCase().indexOf(word.toLowerCase()) >= 0) {
          return true
        }
      }
      return false
    },
  },
}
</script>

<style>
.variable-selector ul {
  height: 100%;
  overflow: auto;
  max-height: 300px;
}
</style>
