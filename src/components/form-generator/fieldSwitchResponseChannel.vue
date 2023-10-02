<template>
  <div id="response_channels">
    <span
      v-for="toggle in toggles"
      :key="toggle.id"
    >
      <label
        :for="'rc' + toggle.id + '_' + toggle.name"
        :key="'l_' + toggle.id"
      >{{ toggle.name }}</label>
      <toggle-button
        :id="'rc' + toggle.id + '_' + toggle.name"
        :key="toggle.id"
        :value="activeChannelsToggles.includes(toggle.id.toString())"
        :name="toggle.id.toString()"
        :disabled="!loaded"
        :sync="true"
        type="checkbox"
        @change="changeToggleState"
      />
    </span>
  </div>
</template>

<script>
import irisField from './irisField.js'
import { abstractField } from 'vue-form-generator'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'FieldSwitchResponseChannel',
  mixins: [irisField, abstractField],
  data: function() {
    return {
      activeChannelsToggles: [],
      loaded: false,
    }
  },
  computed: {
    ...mapState('masters', {
      toggles: 'responseChannels',
    }),
    initialValidation() {
      return this.schema.initialValidation
    },
  },
  mounted() {
    // Load ResponseChannels
    this.load().then(() => {
      // Load active ResponseChannels
      const valueList = this.value || []
      this.activeChannelsToggles = valueList.map(
        value => '' + value.responsechannel
      )
      // Enable toggles
      this.loaded = true
      if (this.initialValidation) {
        this.validate()
      }
    })
  },
  methods: {
    ...mapActions('masters', { load: 'retrieveResponseChannels' }),
    changeToggleState: function changeToggleState(info) {
      let id = info.srcEvent.srcElement.name
      if (info.value === true) {
        if (!this.activeChannelsToggles.includes(id)) {
          this.activeChannelsToggles.push(id)
        }
      } else {
        if (this.activeChannelsToggles.includes(id)) {
          this.activeChannelsToggles.splice(
            this.activeChannelsToggles.indexOf(id),
            1
          )
        }
      }
      // Set the list of activeChannelsToggles
      this.value = this.activeChannelsToggles.map(value => {
        return { responsechannel: parseInt(value) }
      })
      this.validate()
    },
    validate() {
      if (this.schema.required && this.value.length == 0) {
        this.$emit(
          'validated',
          false,
          [this.$t('detail_no_answer_channels')],
          this
        )
      } else {
        this.$emit('validated', true, [], this)
      }
    },
  },
}
</script>

<style>
#response_channels span {
  display: inline-flex;
  flex-direction: column;
  margin: 5px;
}
</style>
