import Vue from 'vue'

import SchemaForm from './schemaForm.vue'
import { shallowMount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import mockRouter from 'mock-vue-router'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)

export let nuxtMock = {
  $loading: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = true
    },
  },
}

describe('schemaForm component', () => {
  const url = '/test/save/url/'
  const successUrl = 'test-url-name'
  const title = 'Test tile'
  const concreteForm = {
    extends: SchemaForm,
    data: () => {
      return {
        beforeSubmited: false,
        notified: false,
      }
    },
    methods: {
      beforeSubmit: function(obj) {
        this.beforeSubmited = obj
        return true
      },
      /**
       * Mock locale path for returning correct URL.
       * @param {Object} url
       */
      localePath: function(url) {
        return url
      },
      /**
       * mock notify
       */
      $notify(params) {
        this.notified = params
      },
    },
  }
  const definition = new FormDefinition(
    {
      description_ca: {
        type: 'input',
        inputType: 'text',
        maxlength: 40,
        min: 3,
        id: 'description_ca',
        label: 'Descripció (CA)',
        model: 'description_ca',
        required: true,
      },
    },
    { fields: ['description_ca'] }
  )

  const axiosMock = new MockAdapter(axios)
  const { $route, $router } = mockRouter([
    { path: '/add' },
    { path: '/', name: successUrl },
  ])

  function factory(extraProps) {
    extraProps = extraProps || {}
    return shallowMount(concreteForm, {
      propsData: {
        url: url,
        title: title,
        definition: definition,
        successUrl: successUrl,
        addNewUrl: 'test-url',
        ...extraProps,
      },
      mocks: {
        $axios: axios,
        $route: $route,
        $router: $router,
        $t: value => value,
        $nuxt: nuxtMock,
      },
    })
  }

  describe('component props', () => {
    const wrapper = factory()
    it('should render title', () => {
      expect(wrapper.find('h1').text()).toBe(title)
    })

    it('global validation should be valid', () => {
      expect(wrapper.vm.isValid()).toBeTruthy()
    })

    it('should use definition schema', () => {
      expect(wrapper.vm.schema).toEqual(definition.getFormSchema())
    })
  })

  describe('has error', () => {
    const wrapper = factory()
    it('should return true if has global', () => {
      wrapper.setData({ errorMessage: 'test', errors: [] })
      expect(wrapper.vm.hasError).toBeTruthy()
    })
    it('should return true if has field error', () => {
      wrapper.setData({ errorMessage: 'test', errors: [{ model: 'test' }] })
      expect(wrapper.vm.hasError).toBeTruthy()
    })
    it('should be false when there are not errors', () => {
      wrapper.setData({ errors: [], errorMessage: '' })
      expect(wrapper.vm.hasError).toBeFalsy()
    })
  })

  describe('has global error', () => {
    const wrapper = factory()
    it('should return true if has error message', () => {
      wrapper.setData({ errorMessage: 'test', globalErrors: [] })
      expect(wrapper.vm.hasError).toBeTruthy()
    })
    it('should return true if has global errors', () => {
      wrapper.setData({
        errorMessage: '',
        globalErrors: [{ model: 'test' }],
      })
      expect(wrapper.vm.hasError).toBeTruthy()
    })
    it('should be false when there are not errors', () => {
      wrapper.setData({ globalErrors: [], errorMessage: '' })
      expect(wrapper.vm.hasError).toBeFalsy()
    })
  })

  describe('submit form', () => {
    describe('prevent submit when has errors', () => {
      const wrapper = factory()
      it('should not submit if is not valid', () => {
        wrapper.setData({ errors: [{}] })
        expect(wrapper.vm.submit()).toBeFalsy()
      })
    })

    describe('save when all fields are ready', () => {
      describe('successfully saved', () => {
        const wrapper = factory()
        jest.spyOn(wrapper.vm, 'onSuccess')
        expect(wrapper.vm.submit()).toBeTruthy()
        axiosMock.onPost(url).reply(200, {})
        it('should execute beforeSubmit method before saving', () => {
          expect(wrapper.beforeSubmited).toEqual(wrapper.model)
        })

        it('should send save request using axios', () => {
          expect(wrapper.vm.errors.length).toBe(0)
          expect(wrapper.vm.errorMessage.length).toBe(0)
          expect(wrapper.vm.globalErrors.length).toBe(0)
        })

        it('should call onSuccess when is saved', () => {
          expect(wrapper.vm.onSuccess).toHaveBeenCalled()
        })

        it('should show success message when is saved', () => {
          expect(wrapper.vm.notified).toBeTruthy()
          expect(wrapper.vm.notified.title).toBe(wrapper.vm.successMessageTitle)
          expect(wrapper.vm.notified.text).toBe(wrapper.vm.successMessage)
          expect(wrapper.vm.notified.type).toBe('success')
        })
      })
      describe('custom onSuccess method', () => {
        const wrapper = factory()
        jest.spyOn(wrapper.vm, 'onSuccess')
        const spy = jest.spyOn({ onSuccess: () => {} }, 'onSuccess')
        expect(wrapper.vm.submit({}, spy)).toBeTruthy()
        axiosMock.onPost(url).reply(200, {})
        it('should call custom success on save', () => {
          expect(wrapper.vm.notified).toBeTruthy()
          expect(wrapper.vm.onSuccess).toBeCalledTimes(0)
          expect(spy).toHaveBeenCalled()
        })
      })
      describe('external error processing', () => {
        const errorMsg = 'Invalid desc'
        const errorMsg2 = 'Should be correct'
        const error = {
          description_ca: [errorMsg, errorMsg2],
        }
        const wrapper = factory()
        wrapper.vm.submit()
        it('should update errors when data is invalid', () => {
          axiosMock.reset()
          axiosMock.onPost(url).reply(500, error)
          expect(wrapper.vm.errors).toBeTruthy()
        })

        it('should convert field errors from server to iris-form-generator component format', () => {
          const results = wrapper.vm.processExternalErrors(error)
          expect(results).toEqual([
            {
              error: errorMsg,
              field: definition.fields.description_ca,
            },
            {
              error: errorMsg2,
              field: definition.fields.description_ca,
            },
          ])
        })
      })
    })

    describe('obtain endpoint url with getRequestUrl', () => {
      const wrapper = factory()
      it('should return url for saving', () => {
        expect(wrapper.vm.getRequestUrl()).toBe(url)
      })
    })
  })

  describe('redirect to success url if object is submitted', () => {
    const wrapper = factory()
    const obj = { id: 22 }
    describe('getSuccessUrl', () => {
      it('should return url for name in prop successUrl', () => {
        const result = wrapper.vm.getSuccessUrl(obj)
        expect(result.name).toBe(successUrl)
        expect(result.query.id).toEqual(obj.id)
      })
    })

    it('should redirect to success url', () => {
      wrapper.vm.onSuccess({ data: obj }, obj)
    })
  })

  describe('default form buttons', () => {
    const wrapper = factory()
    jest.spyOn(wrapper.vm, 'saveAndAnother')
    jest.spyOn(wrapper.vm, 'goBack')
    let buttons = {}
    wrapper.vm.getDefaultButtons().forEach(btn => {
      buttons[btn.name] = btn
    })

    it('should have save button on right', () => {
      expect(buttons.save).toBeTruthy()
      expect(buttons.save.classes).not.toContain('pull-left')
    })
    it('should have save and another button on right', () => {
      expect(buttons.save_and_add).toBeTruthy()
      expect(buttons.save_and_add.classes).not.toContain('pull-left')
    })
    it('should reset form when save and another button is clicked', () => {
      const self = buttons.save_and_add.click()
      expect(wrapper.vm.saveAndAnother).toHaveBeenCalled()
    })
    it('should have back button on left', () => {
      expect(buttons.exit).toBeTruthy()
      expect(buttons.exit.classes).toContain('pull-left')
    })
    it('should go back when back button is clicked', () => {
      const self = buttons.exit.click()
      expect(wrapper.vm.goBack).toHaveBeenCalled()
    })
  })
})
