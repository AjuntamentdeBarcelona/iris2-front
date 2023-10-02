<template>
  <div
    class="applicant row"
  >
    <div 
      v-if="!applicant" 
      class="irisbox alert-warning col-12">
      {{ $t('record_card_no_applicant') }}
    </div>
    <div 
      v-if="applicant && applicant.citizen" 
      class="col-xl-8 col-6">
      <!-- Citizen selected -->
      <span
        v-if="applicant.citizen"
        class="row no-gutters"
      >
        <div class="col-12 cardi__card">
          <div class="cardi__title">
            {{ $t('name') }}
          </div>
          <div class="cardi__description">
            {{ applicant.citizen.name }}
          </div>
        </div>
        <div class="col-12 cardi__card">
          <div class="cardi__title">
            {{ $t('first_surname') }}
          </div>
          <div class="cardi__description">
            {{ applicant.citizen.first_surname }}
          </div>
        </div>
        <div class="col-12 cardi__card">
          <div class="cardi__title">
            {{ $t('second_surname') }}
          </div>
          <div class="cardi__description">
            {{ applicant.citizen.second_surname }}
          </div>
        </div>
        <div class="col-12 cardi__card">
          <div class="cardi__title">
            {{ $t('identity_card') }}
          </div>
          <div class="cardi__description">
            {{ applicant.citizen.dni }}
          </div>
        </div>
      </span>

      <!-- Company selected -->
      <span
        v-if="applicant.social_entity"
        class="row no-gutters"
      >
        <div class="col-12 cardi__card">
          <div class="cardi__title">
            {{ $t('social_reason') }}
          </div>
          <div class="cardi__description">
            {{ applicant.social_entity.social_reason }}
          </div>
        </div>
        <div class="col-12 cardi__card">
          <div class="cardi__title">
            {{ $t('cif') }}
          </div>
          <div class="cardi__description">
            {{ applicant.social_entity.cif }}
          </div>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  computed: {
    applicant() {
      return this.model.applicant
    },
  },
}
</script>
