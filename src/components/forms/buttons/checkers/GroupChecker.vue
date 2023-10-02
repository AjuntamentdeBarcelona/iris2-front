<template>
  <div>
    <div
      v-if="differentGroup"
      class="alert alert-warning"
    >{{ $t('checks_different_group') }}:<br>
      "{{ currentGroup.description }}" <font-awesome-icon icon="arrow-right"/> <b>"{{ nextGroup.description }}"</b>
    </div>

    <div
      v-if="differentAmbit"
      class="alert alert-warning"
      v-text="$t('checks_different_ambit')"
    />
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'GroupChecker',
  props: {
    model: {
      type: Object,
      required: true,
    },
    checkResponse: {
      type: Object,
      required: true,
    },
  },
  computed: {
    differentAmbit() {
      return this.checkResponse.different_ambit
    },
    currentGroup() {
      return this.model.responsible_profile
    },
    nextGroup() {
      return this.checkResponse.next_group
    },
    differentGroup() {
      const currentGroupId = _.get(this, 'currentGroup.id')
      const nextGroupId = _.get(this, 'nextGroup.id')
      return (
        currentGroupId && nextGroupId && currentGroupId !== this.nextGroup.id
      )
    },
  },
}
</script>
