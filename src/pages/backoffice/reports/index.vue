<template>
  <div>
    <h1>{{ $t('navigation_reports') }}</h1>
    <div class="irisbox">
      <ul >
        <li
          v-show="hasOperPermission"
          class="cardi">
          <b class="cardi__main-title px-2">{{ $t('reports_operations') }}</b>
          <ol class="row">
            <li class="cardi__card col-12 col-lg-6 d-flex">
              <b class="cardi__title w-25">{{ $t('reports_workload') }}</b>
              <ul class="d-flex w-50">
                <!-- WhatWhoHow -->
                <li class="cardi__description px-2">
                  <nuxt-link
                    :to="localePath('backoffice-reports-whatwhohow')"
                    class="text_gris_fons_blanc"
                    v-text="$t('reports_what_who_how')"
                  />
                </li>
              </ul>
          </li></ol>
        </li>
        <li 
          v-if="hasManagementPermission"
          class="cardi mt-3">
          <b class="cardi__main-title px-2">{{ $t('reports_management') }}</b>
          <ol class="row">

            <li class="cardi__card col-12 col-lg-6 d-flex"><b class="cardi__title w-50">{{ $t('reports_themes_by_citizen') }}</b>
              <ul class="d-flex w-50">
                <!-- ThemeRank -->
                <li class="cardi__description px-2">
                  <nuxt-link
                    :to="localePath('backoffice-reports-themerank')"
                    class="text_gris_fons_blanc"
                    v-text="$t('reports_theme_rank')"
                  />
                </li>
              </ul>
            </li>
          </ol>
          
          <ol class="row">
            <li class="cardi__card col-12 col-lg-6 d-flex">
              <b class="cardi__title w-50">{{ $t('reports_records_created_closed') }}</b>
              <ul class="row w-50">
                <!-- Created -->
                <li
                  v-show="false"
                  class="cardi__description px-2 ">
                  <nuxt-link
                    :to="localePath('backoffice-reports-created')"
                    class="text_gris_fons_blanc"
                    v-text="$t('reports_entries')"
                  />
                </li>
                <!-- Closed -->
                <li
                  v-show="false"
                  class="cardi__description px-2 ">
                  <nuxt-link
                    :to="localePath('backoffice-reports-closed')"
                    class="text_gris_fons_blanc"
                    v-text="$t('reports_closed')"
                  />
                </li>
                <!-- RecordCardsByState -->
                <li class="cardi__description px-2">
                  <nuxt-link
                    :to="localePath('backoffice-reports-recordsbystate')"
                    v-text="$t('reports_records_by_state')"
                  />
                </li>
              </ul>
            </li>
          </ol>
          <ol class="row">
            <li class="cardi__card col-12 col-lg-6 d-flex">
              <b class="cardi__title w-50">{{ $t('applicant') }}</b>
              <ul class="d-flex w-50">
                <!-- Applicant records -->
                <li class="cardi__description px-2">
                  <nuxt-link
                    :to="localePath('backoffice-reports-applicantrecords')"
                    class="text_gris_fons_blanc"
                    v-text="$t('reports_applicant_records')"
                  />
                </li>
              </ul>
            </li>
          </ol>
        </li>

        <li 
          v-if="hasAuditPermission" 
          class="cardi mt-3">
          <b class="cardi__main-title px-2">{{ $t('reports_audit') }}</b>
          <ul class="cardi__card row">
            <b class="cardi__title col-6 col-lg-3">{{ $t('reports_systems') }}</b>
            <li class="col-6 col-lg-3">
              <nuxt-link
                :to="localePath('backoffice-reports-accesslog')"
                class="cardi__description px-2"
                v-text="$t('reports_access_log')"/>
            </li>
          </ul>

        </li>
        <li 
          v-if="hasQueryPermission"
          class="cardi mt-3">
          <b class="cardi__main-title px-2">{{ $t('reports_queries') }}</b>
          <ul class="cardi__card row">
            <b class="cardi__title col-6 col-lg-3">{{ $t('reports_activity') }}</b>
            <li class="col-6 col-lg-3">
              <nuxt-link
                :to="localePath('backoffice-reports-operators')"
                class="cardi__description px-2"
                v-text="$t('reports_access_question_history')"/>
            </li>
          </ul>

        </li>
        <li
          v-if="showBIUrls && hasBiPermission"
          class="cardi mt-3">
          <b class="cardi__main-title px-2">{{ $t('reports_bi') }}</b>
          <ol>
            <ul class="cardi__card row">
              <b class="cardi__title col-6 col-lg-3">{{ $t('reports_bi') }}</b>
              <li
                v-show="biUrl"
                class="col-6 col-lg-3">
                <a
                  id="bi"
                  :href="biUrl"
                  class="cardi__description px-2"
                  target="blank">
                  {{ $t('reports_bi_iris') }}
                </a>
              </li>

          </ul></ol>
        </li>
        <li v-if="false"><b>Informes MiniVista</b>
          <ol><ul>
            <li><a
              href="#"
              class="text_gris_fons_blanc"
              onmouseover=""
              onmouseout=""
              onclick="showMiniVista();">
              Informes MiniVista</a></li>
          </ul>
          </ol>

        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'Reports',
  layout: 'backoffice',
  computed: {
    ...mapState({ parameters: 'parameters' }),
    ...mapGetters('groups', ['hasPermission']),
    biUrl() {
      return this.parameters.get('LINK_BI')
    },
    showBIUrls() {
      return parseInt(this.parameters.get('VISUALITZACIO_BI')) > 0 && this.biUrl
    },
    hasOperPermission() {
      return this.hasPermission(Permissions.REPORTS.OPER)
    },
    hasManagementPermission() {
      return this.hasPermission(Permissions.REPORTS.MANAGEMENT)
    },
    hasAuditPermission() {
      return this.hasPermission(Permissions.REPORTS.AUDIT)
    },
    hasBiPermission() {
      return this.hasPermission(Permissions.REPORTS.APPLICANTS)
    },
    hasQueryPermission() {
      return this.hasPermission(Permissions.REPORTS.QUERY)
    },
  },
  created() {
    this.loadParams()
  },
  methods: {
    ...mapActions({ loadParams: 'loadParams' }),
  },
}
</script>
<style lang="scss" scoped>
ul,
li,
ol {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
