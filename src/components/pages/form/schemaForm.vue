<template>
  <div
    :class="pageClass"
    class="iris-page">
    <authorization-error ref="authorizationError" />
    <unauthorized-page v-if="!isAuthorized" />
    <div
      v-if="isAuthorized"
      class="iris-form"
      @keypress.enter="submitOnEnter && submit"
    >
      <h1
        v-if="pageTitle"
        class="title-line"
      >
        {{ pageTitle }}
      </h1>
      <div
        :class="{irisbox: showBox}"
        class="form-page-form"
      >
        <div
          v-if="hasGlobalError"
          class="alert alert-danger"
        >
          {{ errorMessage }}
          <ul v-if="globalErrors.length > 0">
            <li
              v-for="(error, index) in globalErrors"
              :key="index"
            >
              <!-- Bulk update errors -->
              <template v-if="isPlainObject(error)">
                {{ getElementDescriptionFromId(Object.keys(error)[0]) }}:
                <ul>
                  <li
                    v-for="(error2, key2) in error[Object.keys(error)[0]]"
                    :key="key2"
                    v-text="`${key2}: ${error2}`"
                  />
                </ul>
              </template>
              <!-- Regular errors -->
              <template v-else>
                {{ error }}
              </template>
            </li>
          </ul>
        </div>
        <iris-form-generator
          ref="form"
          :schema="schema"
          :model="model"
          :options="formOptions"
          :is-new-model="isNewModel"
          :external-errors="errors"
          @model-updated="modelUpdated"
          @validated="validated"
          @submit="submit"
        />
        <slot name="buttons">
          <div
            v-if="buttons.length || actionButtons.length"
            class="footer-buttons pt-0"
          >
            <template v-if="buttons.length">
              <component
                v-for="button in buttons"
                :is="button.component"
                v-bind="button.props"
                :class="button.classes"
                :key="button.name"
                @action-done="button.handler"
              />
            </template>
            <template v-else>
              <button
                v-for="button in actionButtons"
                :id="button.name"
                :key="button.name"
                :class="button.classes"
                class="btn d-flex text-nowrap"
                @click="button.click"
              >

                <div
                  v-if="button.icon === 'multifitxa'"
                  class="multifiles-icon">
                  <font-awesome-icon
                    :icon="['fas', 'save']"/>
                  <font-awesome-icon
                    v-for="index in 2"
                    :key="index"
                    :icon="['fas', 'file']"/>
                </div>

                <font-awesome-icon
                  v-else-if="button.icon"
                  :icon="button.icon"
                  class="mr-1"
                />

                {{ button.text }}
              </button>
            </template>
          </div>
        </slot>
        <div
          v-if="showLoading"
          class="loading-overlay"
        >
          <div class="loader" />
        </div>
      </div>
      <MountingPortal
        mount-to="body"
        append
      >
        <exit-confirm ref="exitModal" />
        <confirm
          ref="modalConfirm"
          :id="$options.name ? `modal-confirm-${$options.name}`: null"
        />
      </MountingPortal>
    </div>
  </div>
</template>

<script>
import { schema } from 'vue-form-generator'
import IrisFormGenerator from '~/components/pages/form/irisFormGenerator.vue'
import ExitConfirm from '~/components/pages/form/ExitConfirm.vue'
import Confirm from '~/components/pages/form/Confirm.vue'
import AuthorizationMixin from '~/components/pages/authorization/AuthorizationMixin.js'
import AuthorizationError from '~/components/pages/authorization/AuthorizationError.vue'
import UnauthorizedPage from '~/components/pages/authorization/UnauthorizedPage.vue'
import { isPlainObject } from '~/assets/js/helpers'
import formMixin from '~/components/forms/formMixin'
import { ALL_ERROR } from '~/assets/js/iris2/constants'
import { isFunction, isObject, isArray, isEmpty } from 'lodash'

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  layout: 'backoffice',
  components: {
    'iris-form-generator': IrisFormGenerator,
    'exit-confirm': ExitConfirm,
    confirm: Confirm,
    AuthorizationError,
    UnauthorizedPage,
  },
  mixins: [formMixin, AuthorizationMixin],
  head() {
    return {
      title: 'IRIS: ' + this.pageTitle,
    }
  },
  props: {
    method: {
      type: String,
      default: 'post',
    },
    pageClass: {
      type: String,
      default: '',
    },
    showBox: {
      type: Boolean,
      default: true,
    },
    showLoading: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: '',
      required: false,
    },
    initial: {
      type: Object,
      default: () => {},
    },
    extraData: {
      type: Object,
      default: () => ({}),
    },
    extraInfo: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '',
    },
    definition: {
      type: [Object, Function],
      required: true,
    },
    isNewModel: {
      type: Boolean,
      default: true,
    },
    backButton: {
      type: Boolean,
      default: true,
    },
    backButtonText: {
      type: String,
      default: 'form_back_without_changes',
    },
    backUrl: {
      type: [Object, String],
      default: '',
    },
    resetDefaultButton: {
      type: Boolean,
      default: false,
    },
    submitOnEnter: {
      type: Boolean,
      default: true,
    },
    checkAllRequired: {
      type: Boolean,
      default: false,
    },
    saveButtonText: {
      type: String,
      default: 'form_save',
    },
    saveButtonIcon: {
      type: String,
      default: 'check',
    },
    /**
     * List of fields that must be readonly when included on initial from URL.
     */
    initialReadonly: {
      type: Array,
      required: false,
      default: () => [],
    },
    successUrl: {
      type: String,
      default: '',
    },
    addNewUrl: {
      type: String,
      default: '',
    },
    saveOnSubmit: {
      type: Boolean,
      default: true,
    },
    updateWithSaveData: {
      type: Boolean,
      default: true,
    },
  },
  data: function() {
    const initial = this.getInitial()
    const schemaDef = this.getInitialDefinition().clone()
    for (let param in this.getUrlInitial()) {
      if (
        schemaDef.fields[param] != null &&
        this.initialReadonly.indexOf(param) >= 0
      ) {
        schemaDef.fields[param].readonly = true
      }
    }
    this.adaptSchema(schemaDef, initial)
    return {
      model: initial,
      initialModel: Object.assign({}, initial),
      formOptions: {
        validateAfterChanged: true,
        validateDebounceTime: 0,
      },
      schemaDef: schemaDef,
      saved: false,
      errors: [],
      globalErrors: [],
      errorMessage: '',
      nextScreenFn: () => {},
      valid: true,
      actionButtons: this.getDefaultButtons(),
      successMessageTitle: this.$t('form_save_success_title'),
      successMessage: this.$t('form_save_success_message'),
      validationErrorTitle: this.$t('form_save_error_title'),
      validationErrorMessage: this.$t('form_save_error_message'),
      systemErrorTitle: this.$t('form_save_system_error_title'),
      systemErrorMessage: this.$t('form_save_system_error_message'),
      invalidSaveMsg: this.$t('form_invalid_save'),
      buttons: [],
      modelDefaultSet: false,
    }
  },
  computed: {
    saving: {
      get() {
        return this._saving
      },
      set(value) {
        this._saving = value
        if (value) {
          this.$nuxt.$loading.start()
        } else {
          this.$nuxt.$loading.finish()
        }
      },
    },
    pageTitle() {
      return this.$te(this.title) ? this.$t(this.title) : this.title
    },
    hasGlobalError() {
      return this.errorMessage != '' || this.globalErrors.length > 0
    },
    timeoutErrorText() {
      return this.$t('form_error_timeout_msg')
    },
    hasNonGlobalErrors() {
      return this.errors.length > 0 || !this.valid
    },
    hasError() {
      return this.hasGlobalError || this.hasNonGlobalErrors
    },
    schema() {
      if (this.schemaDef.getFormSchema === undefined) {
        throw Error(
          'Schema Form component needs a valid FormDefinition instance in data. You can set the definition' +
            'by overriding the definition of data.'
        )
      }
      return this.schemaDef.getFormSchema()
    },
    /**
     * Checks if the model has changed any of its fields
     */
    modelHasChanges() {
      if (this.saved) {
        return
      }
      function hasValue(val) {
        if (isArray(val) || isObject(val)) {
          return !isEmpty(val)
        }
        return val != null
      }
      const saveData = this.constructSaveData(this.model)
      for (let field in this.schemaDef.fields) {
        if (
          !this.schemaDef.fields[field].readonly &&
          !this.schemaDef.fields[field].disabled &&
          saveData[field] != this.initialModel[field] &&
          (hasValue(saveData[field]) || hasValue(this.initialModel[field]))
        ) {
          return true
        }
      }
      return false
    },
  },
  watch: {
    initial() {
      this.model = this.getInitial()
      this.initialModel = Object.assign({}, this.model)
    },
  },
  created() {
    this.isPlainObject = isPlainObject
  },
  beforeRouteLeave(to, from, next) {
    this.beforeExit(to, from, next)
  },
  methods: {
    getInitialDefinition() {
      if (isFunction(this.definition)) {
        return this.definition(this)
      } else {
        return this.definition
      }
    },
    /**
     * @returns Initial data from both props and url, giving priority to props
     */
    getInitial() {
      return this.applyInitialTransformation(
        Object.assign({}, this.getUrlInitial(), this.initial)
      )
    },
    /**
     * Perform further initial transformations. Acts as a hook method for adapting the
     * initial data without overriding the getInitialMethod.
     * @returns {Object} Initial
     */
    applyInitialTransformation(initial) {
      return initial
    },
    /**
     * Hook method called for making schema changes before full load.
     */
    adaptSchema(schemaDef, initial) {},
    /**
     * Hook method for customizing the data sent via 'model-updated' event. The returned data will
     * be assigned to the model, so the returned data can include only new attributes or override existing ones.
     *
     * @param {Object} model
     * @return {Object} Dict to assign to the model-updated model data.
     */
    adaptModelUpdated(model) {
      return {}
    },
    emitModelUpdated(model, schema) {
      this.$emit(
        'model-updated',
        { ...model, ...this.adaptModelUpdated(model) },
        schema,
        this.$options.name
      )
    },
    /**
     * Updates the model, changing the sent properties to the provided values
     */
    forceModelUpdate(updatedModel, noEvent) {
      this.model = Object.assign({}, this.model, updatedModel)
      if (!noEvent) {
        this.emitModelUpdated({ ...this.model }, { ...this.schema })
      }
    },
    /**
     * Clears the model if needed or forced
     */
    clearModel(forceUpdate, noEvent) {
      const clearNeeded = forceUpdate ? true : Object.keys(this.model).length
      if (clearNeeded) {
        this.model = {}
        if (!noEvent) {
          this.emitModelUpdated({ ...this.model }, { ...this.schema })
        }
      }
    },
    /**
     * Creates a model from the default values of the schema
     */
    defaultModel() {
      this.model = schema.createDefaultObject(this.schemaDef)
      this.modelDefaultSet = true
      this.$emit('reset')
    },
    /**
     * Performs the submit of the form data to the given endpoint.
     */
    submit(event, onSuccess) {
      if (this.isReadyForSend(this.model)) {
        if (this.beforeSubmit(this.model)) {
          if (this.saveOnSubmit) {
            return this.save(this.constructSaveData(this.model), onSuccess)
          } else {
            this.$emit('submit', this.model)
            this.saved = true
            return true
          }
        }
        return false
      }
      this.showNotReadyMessage()
      return false
    },
    /**
     * Saved data must be processed before send.
     * @return {Object} Data that will be sent to the server.
     */
    constructSaveData(model) {
      let saveData = Object.assign({}, model, this.extraData)
      Object.entries(this.schemaDef.fields).forEach(item => {
        let [field, schema] = item
        if (schema.getSaveValue != null) {
          saveData[field] = schema.getSaveValue(model[field])
        }
        if (schema.hasOwnProperty('default') && saveData[field] == null) {
          saveData[field] = schema.default
        }
      })

      return { ...saveData, ...this.getSaveData(model) }
    },
    /**
     * Hook method for customizing the data sent to the server. The returned data will
     * be assigned to the model, so the returned data can include only new attributes
     * or override an small subset of them.
     *
     * Notice JSON.stringify (used by axios) removes object properties which values are undefined, functions or symbols
     *
     * @param {Object} model
     * @return {Object} Dict to assign to the response data.
     */
    getSaveData(model) {
      return {}
    },
    isReadyForSend: function(obj) {
      if (this.checkAllRequired && !this.hasAllRequiredFields()) {
        this.showFillAllMessage('all_madatory')
        return false
      }
      return this.isValid(obj) && !this.hasNonGlobalErrors && !this.saving
    },
    showNotReadyMessage: function(obj) {
      this.$notify({
        group: 'iris',
        title: this.invalidSaveMsg,
        type: 'error',
        text: '',
      })
    },
    showFillAllMessage: function(obj) {
      this.$notify({
        group: 'iris',
        title: this.$t('all_madatory'),
        type: 'error',
        text: '',
      })
    },
    /**
     * Hook method for implementing custom or global validations over the data.
     */
    isValid(obj) {
      return true
    },
    /**
     * Saves the data edited in the form, by default it sends the information to the configured endpoint.
     */
    save(obj, onSuccess) {
      this.saving = true
      return this.sendRequest(obj)
        .then(res => {
          this.initialModel = this.model
          this.saved = true
          this.afterSave()
          if (onSuccess != undefined) {
            onSuccess(res, obj, this, res)
          } else {
            this.onSuccess(res, obj)
          }
          this.showSuccessMessage()
        })
        .catch(e => {
          this.processErrorResponse(e, obj)
        })
        .then(() => {
          this.saving = false
        })
    },
    /**
     * Hook method for performing data modification before sending to endpoint.
     */
    beforeSubmit(obj) {
      return true
    },
    /**
     * Hook called after server errors.
     */
    afterServerError() {},
    /**
     * Hook method called when the object is saved.
     */
    afterSave() {},
    beforeExit(to, from, next) {
      if (this.modelHasChanges) {
        this.showExitDialog(result => next(result))
      } else {
        next()
      }
    },
    /**
     * Process an error response for submit requests.
     */
    processErrorResponse(e, obj) {
      if (
        e.response &&
        e.response.status == 500 &&
        e.response.statusText.includes('URL Open')
      ) {
        this.$notify({
          group: 'iris',
          title: this.$t('form_error_timeout'),
          type: 'error',
          text: this.timeoutErrorText,
          duration: 100000000,
        })
      } else if (e.response && e.response.status == 409) {
        this.onInvalidState(e, obj)
      } else if (e.response && e.response.status == 403) {
        this.onUnauthorized(e)
      } else {
        this.onError(e, obj)
      }
    },
    /**
     * Handler called when the object is saved. By default it redirects to a success url, replacing the
     * current state.
     */
    onSuccess(response, sentObj) {
      if (this.successUrl) {
        this.$router.replace(this.getSuccessUrl(response.data))
      }
      this.$emit('form-saved', response, sentObj)
    },
    /**
     * Handles error responses and classifies the error messages, updating the interface according to them.
     */
    onError(error, sentObj) {
      let response = error.response
      this.$emit('form-save-error', error, sentObj)
      if (response) {
        let errors = Object.assign({}, this.normalizeErrorResponseData(error))
        errors = this.processErrors(errors)
        if (errors.detail) {
          this.errorMessage = errors.detail
        }
        this.globalErrors = errors[ALL_ERROR]
          ? Array.isArray(errors[ALL_ERROR])
            ? errors[ALL_ERROR]
            : [errors[ALL_ERROR]]
          : []
        delete errors[ALL_ERROR]
        this.errors = this.processExternalErrors(errors)
        this.afterServerError()
        this.$notify({
          group: 'iris',
          title: this.validationErrorTitle,
          type: 'error',
          position: 'top center',
          text: this.validationErrorMessage,
        })
      } else {
        this.$notify({
          group: 'iris',
          title: this.systemErrorTitle,
          type: 'error',
          text: this.systemErrorMessage,
        })
      }
    },
    /**
     * Method for handling incorrect state saves (409). A 409 Conflict is expected to be returned when the
     * state of the resource being modified does not allow the changes. This way, the system can control
     * transactions and return information to the client and check concurrency problems.
     */
    onInvalidState(e, obj) {
      this.$notify({
        group: 'iris',
        title: this.$t('form_save_error_state'),
        type: 'error',
        text: this.$t('form_save_error_state'),
      })
      this.globalErrors = [this.$t('form_save_error_state')]
    },
    /**
     * Hook to transform error keys on bulk updates
     */
    getElementDescriptionFromId(id) {
      return id
    },
    /**
     * Hook method for extra error processing.
     */
    processErrors(errors) {
      return errors
    },
    /**
     * Given an endpoint dict of errors in form of {modelField: arrayOfErrors}, adapts the error messages
     * to VueFormGenerator format.
     */
    processExternalErrors(errors) {
      let value = [].concat.apply(
        [],
        Object.keys(errors).map(key => {
          // Sometimes we add the field on the getSaveData method and it doesn't have an input to show the error into
          // This will add said error keys to the globalErrors
          // On bulk update operations, this will add those keys
          if (!this.schemaDef.fields[key]) {
            if (isPlainObject(errors[key])) {
              // Bulk update errors
              this.globalErrors.push({ [key]: errors[key] })
            } else {
              // Field-less errors
              this.globalErrors.push(errors[key])
            }
          }

          if (Array.isArray(errors[key])) {
            return errors[key].map(value => {
              return { error: value, field: this.schemaDef.fields[key] }
            })
          }

          return [{ error: errors[key], field: this.schemaDef.fields[key] }]
        })
      )

      return value
    },

    /**
     * Returns an url for redirecting after the success message.
     */
    getSuccessUrl(newObj) {
      if (isObject(this.successUrl)) {
        return this.localePath(this.successUrl)
      }
      return this.localePath({
        name: this.successUrl,
        query: { id: newObj.id },
      })
    },
    /**
     * Returns the endpoint URL for saving the object.
     */
    getRequestUrl(obj) {
      return this.url
    },
    /**
     * Sends the request for performing the save on the server.
     */
    sendRequest(obj) {
      let self = this
      return this.$axios({
        method: this.method,
        url: this.getRequestUrl(),
        data: obj,
        ...this.getExtraRequestConfig(),
      })
    },
    getExtraRequestConfig() {
      return {}
    },
    /**
     * Handle model updates for checking and removing errors received from server.
     */
    modelUpdated(newVal, schemaRef) {
      this.errors = this.errors.filter(
        error => error.field && error.field.model != schemaRef
      )
      if (this.errors.length == 0) {
        this.emitModelUpdated(
          {
            ...this.model,
            ...(this.updateWithSaveData ? this.getSaveData(this.model) : {}),
          },
          schemaRef
        )
      }
      if (this.model && this.schemaDef) {
        this.afterUpdate(schemaRef, newVal)
      }
    },
    /**
     * Hook method for performing additional actions on model change.
     */
    afterUpdate(schemaRef, newVal) {},
    validated(valid) {
      this.valid = valid
      this.$emit('validated', valid, this.model)
    },
    forceFormValidation() {
      if (this.$refs.form) {
        this.$refs.form.validate()
      }
    },
    hasAllRequiredFields(setErrors = true) {
      const required = this.getRequiredFormFields()
      const errors = []
      if (!this.model) {
        return required.length == 0
      }
      for (let field of required) {
        if (this.model[field] == null) {
          errors.push({
            field: this.schemaDef.fields[field],
            error: this.$t('required'),
          })
        }
      }
      if (setErrors) {
        this.errors = errors
      }
      return errors.length == 0
    },
    getRequiredFormFields() {
      return Object.values(this.schemaDef.fields)
        .filter(field => field.required)
        .map(field => field.model)
    },
    /**
     * @returns Initial data for form extracted from url params. For example, id of the object.
     */
    getUrlInitial() {
      return Object.assign({}, this.$route.query, this.$route.params)
    },
    /**
     * Saves and resets the form for creating a new one
     */
    saveAndAnother(event) {
      this.submit(event, () => {
        this.newModel()
      })
    },
    /**
     * Returns one page back
     */
    goBack(event) {
      if (this.backUrl != '') {
        this.$router.push(this.localePath(this.backUrl))
      } else {
        this.$router.go(-1)
      }
    },
    newModel() {
      if (this.isNewModel) {
        this.model = this.getInitial()
        this.initialModel = Object.assign({}, this.model)
      } else {
        this.goToAddAnother()
      }
    },
    /**
     * On Updates the user must be redirected to the add url.
     */
    goToAddAnother() {
      if (this.addNewUrl) {
        this.$router.replace(this.localePath(this.addNewUrl))
      } else {
        this.$router.replace(this.$route.fullPath)
      }
    },
    /**
     * Given an url name, expands it with additional params.
     * Override this methods for controlling the params on success and addNewUrls.
     */
    addRouterUrlParams(urlName) {
      return {
        name: urlName,
      }
    },
    /**
     * Displays a success message as feed
     */
    showSuccessMessage() {
      this.$notify({
        group: 'iris',
        title: this.successMessageTitle,
        type: 'success',
        text: this.successMessage,
      })
    },
    showExitDialog(next) {
      this.$refs.exitModal.open(next)
    },
    /**
     * Hook method for personalizing action buttons.
     */
    adjustButtons(buttons) {
      return buttons
    },
    getDefaultButtons() {
      let buttons = []

      if (this.backButton) {
        buttons.push({
          name: 'exit',
          text: this.$t(this.backButtonText),
          click: this.goBack,
          icon: 'backward',
          classes: `order-1 btn-light${
            this.resetDefaultButton ? ' mr-1' : ' mr-auto'
          }`,
        })
      }

      if (this.resetDefaultButton) {
        buttons.push({
          name: 'reset_default',
          text: this.$t('reset_default'),
          click: this.defaultModel,
          icon: 'undo',
          classes: 'btn-light mr-auto order-1',
        })
      }

      if (this.addNewUrl) {
        buttons.push({
          name: 'save_and_add',
          text: this.$t('form_save_and_add_another'),
          click: this.saveAndAnother,
          icon: 'plus',
          classes: 'btn-primary',
        })
      }

      return this.adjustButtons([
        ...buttons,
        {
          name: 'save',
          text: this.$t(this.saveButtonText),
          click: this.submit,
          icon: this.saveButtonIcon,
          classes: 'btn-primary',
        },
      ])
    },
  },
}
</script>

<style lang="scss">
.footer-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  .btn:not(:first-child) {
    margin-left: 0.25rem;
  }
  .btn {
    margin: 0.5rem 0;
    order: 2;
  }
  .order-1 {
    order: 1;
  }
  // .pull-left {
  //   margin-left: 0;
  //   order: 1;
  //   margin-right: auto;
  // }
  // .pull-right {
  //   margin-right: 0;
  //   order: 1;
  //   margin-left: auto;
  // }
}
</style>
