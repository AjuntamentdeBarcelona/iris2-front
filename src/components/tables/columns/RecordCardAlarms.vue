<template>
  <div class="alarms-wrapper">
    <div class="alarms">
      <div
        :class="{ bordered: collapseAlarms, alarms__wrapper: showAlarms }"
      >
        <div
          v-if="showAlarms"
          class="alarms__inner"
        >
          <div
            v-if="collapseAlarms"
            class="alarms__seemore"
          >
            <font-awesome-icon :icon="['fas', 'ellipsis-h']"/>
          </div>
          <font-awesome-icon-composer
            v-for="(alarmIcon, key, index) in alarmIcons"
            :icons="alarmIcon"
            :key="index"
            layers-class="fa-2x"
          />
        </div>
        <div
          v-else
          class="ml-2">-</div>
      </div>
    </div>
    <div
      v-b-popover.hover.top="userId"
      v-if="userId"
      class="user-id">
      {{ shortUserId }}
    </div>
  </div>
</template>

<script>
import { objectFilter } from '~/assets/js/helpers'
import FontAwesomeIconComposer from '~/components/tables/FontAwesomeIconComposer'
import RecordState from '~/assets/js/iris2/model/RecordState'
import {
  possibleSimilarRecordsAlarm,
  urgentAlarm,
  pendingCitizenResponseAlarm,
  responseTimeExpiredAlarm,
  externalReturnedId,
} from '~/assets/js/iris2/constants'

export const iconMap = vm => ({
  mayorship: [
    {
      icon: 'fas fa-university',
      title: vm.$t('alarm_mayorship'),
      legend: vm.$t('legend_mayorship'),
    },
  ],
  possible_similar_records: [
    {
      icon: 'fas fa-copy',
      title: vm.$t('alarm_possible_similar_records'),
      legend: vm.$t('legend_possible_similar_records'),
      class: 'text-blue',
    },
  ],
  cancel_request: [
    {
      icon: 'far fa-comment',
      title: vm.$t('alarm_cancel_request'),
      legend: vm.$t('legend_cancel_request'),
    },
    { icon: 'fas fa-times' },
  ],
  citizen_claim: [
    {
      icon: 'far fa-comment',
      title: vm.$t('alarm_citizen_claim'),
      legend: vm.$t('legend_citizen_claim'),
    },
    { icon: 'fas fa-bolt', class: 'text-red' },
  ],
  citizen_web_claim: [
    {
      icon: 'far fa-comment',
      title: vm.$t('alarm_citizen_web_claim'),
      legend: vm.$t('legend_citizen_web_claim'),
    },
    { icon: 'fas fa-bolt', class: 'text-blue' },
  ],
  pend_citizen_response: [
    {
      icon: 'far fa-comment-dots',
      title: vm.$t('alarm_pend_citizen_response'),
      legend: vm.$t('legend_pend_citizen_response'),
      class: 'text-blue',
    },
  ],
  pend_response_responsible: [
    {
      icon: 'far fa-comment-dots',
      title: vm.$t('alarm_pend_response_responsible'),
      legend: vm.$t('legend_pend_internal_external_response'),
    },
  ],
  citizen_response: [
    {
      icon: 'far fa-comment',
      title: vm.$t('alarm_citizen_response'),
      legend: vm.$t('legend_citizen_response'),
      class: 'text-green',
    },
    { icon: 'fas fa-check', class: 'text-green' },
  ],
  response_to_responsible: [
    {
      icon: 'far fa-comment',
      title: vm.$t('alarm_response_to_responsible'),
      legend: vm.$t('legend_internal_external_response'),
    },
    { icon: 'fas fa-check' },
  ],
  response_time_expired: [
    {
      icon: 'far fa-clock slash',
      title: vm.$t('alarm_response_time_expired'),
      legend: vm.$t('legend_response_time_expired'),
      class: 'text-red',
    },
  ],
  reasigned_task: [
    {
      icon: 'fas fa-share',
      title: vm.$t('alarm_reasigned_task'),
      legend: vm.$t('legend_reasigned_task'),
    },
  ],
  related_records: [
    {
      icon: 'far fa-copy',
      title: vm.$t('alarm_related_records'),
      legend: vm.$t('legend_related_records'),
    },
  ],
})

export default {
  components: {
    FontAwesomeIconComposer,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    column: {
      type: String,
      required: true,
    },
    maxIdLength: {
      type: Number,
      default: 12,
    },
  },
  data() {
    return {
      iconMap: iconMap(this),
    }
  },
  computed: {
    userId() {
      return this.data.user_displayed
    },
    shortUserId() {
      const uid = this.userId.split('@')[0]
      return uid.length > this.maxIdLength
        ? uid.substring(0, this.maxIdLength) + '..'
        : uid
    },
    recordCardPendingValidation() {
      return [RecordState.PENDING_VALIDATE.id, externalReturnedId].includes(
        this.data.record_state.id
      )
    },
    /**
     * Frontend changes over received alarms:
     * 1º A fix has been implemented where if a RC has been validated, the status for the
     *    possibleSimilarRecordsAlarm is always set to false regardless of how it's received
     * 2º urgent alarms are hidden as requested
     * 3º If we have a responseTimeExpiredAlarm, then pendingCitizenResponseAlarm isn't shown
     */
    activeAlarms() {
      return objectFilter(
        this.data.alarms,
        alarm =>
          alarm.key === urgentAlarm ||
          (alarm.key === possibleSimilarRecordsAlarm &&
            !this.recordCardPendingValidation) ||
          (alarm.key === pendingCitizenResponseAlarm &&
            this.data.alarms[responseTimeExpiredAlarm])
            ? false
            : alarm.value
      )
    },
    alarmIcons() {
      return objectFilter(this.iconMap, icon =>
        Object.keys(this.activeAlarms).includes(icon.key)
      )
    },
    showAlarms() {
      return Object.keys(this.activeAlarms).length
    },
    collapseAlarms() {
      return Object.keys(this.activeAlarms).length > 3
    },
  },
}
</script>

<style lang="scss">
$borderColor: $gray-400;
$backgroundColor: $white;
$backgroundColorODD: $bgtable;
.alarms-wrapper {
  position: relative;
  height: 48px;
  margin-top: -4px;
}
.user-id {
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 0.75rem;
  padding: 2px;
  font-weight: bold;
  // line-height: 1;
}
.alarms {
  position: relative;
  width: 90px;
  height: 30px;
  z-index: 0;
  &:hover {
    z-index: 5;

    .alarms__wrapper {
      transform: translateY(0);
    }
    .alarms__inner {
      transform: translateY(0);
    }
    .alarms__seemore {
      color: transparent;
    }
  }
}

.alarms {
  &__seemore {
    position: absolute;
    top: 15px;
    right: 2px;
    font-size: 0.65rem;
    transition: 0.4s ease-out;
    transform: scale(0.7);
  }
  &__wrapper {
    pointer-events: none;
    position: absolute;
    top: 2px;
    overflow: hidden;
    z-index: 5;
    // &.bordered {
    //   // border-bottom: 2px solid $borderColor;
    // }
    transition: 0.4s ease-out;
    transform: translateY(calc(-100% + 30px));
    display: flex;
    flex-wrap: wrap;
    // max-width: 105px;
  }
  &__inner {
    pointer-events: auto;
    transition: 0.4s ease-out;
    // border: 2px solid $borderColor;
    // border-bottom: none;
    transform: translateY(calc(100% - 30px));
    background-color: $backgroundColor;
  }
}

// tr:hover td {
//   position: relative;
//   z-index: 150;
// }
// tr td {
//   position: relative;
//   z-index: 0;
// }
tr:nth-child(odd) .alarms__inner {
  background-color: $backgroundColorODD;
}
</style>
