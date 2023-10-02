<template>
  <div>
    <template
      v-if="data.item.status === map.get(constants.success)"
    >
      {{ $t('files_success') }}
    </template>

    <template
      v-else-if="data.item.status === map.get(constants.uploading)"
    >
      {{ $t('files_uploading') }}
    </template>

    <span
      v-else-if="data.item.status === map.get(constants.error)"
    >
      {{ errorMessage() }}
      <div
        v-html="tooltipContent()"
      />
    </span>

    <template
      v-else-if="data.item.status === map.get(constants.initial)"
    >
      -
    </template>
  </div>
</template>

<script>
import { get, isString, isPlainObject } from 'lodash'

export default {
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
  },
  computed: {
    constants() {
      return this.data.item.statusMapping.constants
    },
    map() {
      return this.data.item.statusMapping.map
    },
  },
  methods: {
    errorMessage() {
      const error = isString(this.data.item.error)
        ? this.data.item.error
        : this.data.item.error.type

      let errorMsg = this.$t('error') // Generic error

      switch (error) {
        case 'chunk':
          // Error while chunking
          break
        case 'server':
        // Error on first or last request
        case 'upload':
          // Error while uploading chunks
          errorMsg = this.$t('files_error_upload')
          break
        case 'extension':
          // Extension not allowed
          errorMsg = this.$t('files_error_extension')
          break
        case 'size':
          // Size exceeds limit
          errorMsg = this.$t('files_error_size')
          break
      }

      return errorMsg
    },
    tooltipContent() {
      if (
        get(this, 'data.item.error.content') &&
        isPlainObject(this.data.item.error.content)
      ) {
        const reducer = (accumulator, currentValue) => {
          const [, value] = currentValue
          if (isString(value)) {
            accumulator.push(`<small>- ${value}</small>`)
          } else if (isPlainObject(value)) {
            accumulator.push(...Object.entries(value).reduce(reducer, []))
          }

          return accumulator
        }

        return Object.entries(this.data.item.error.content)
          .reduce(reducer, [])
          .join('')
      } else {
        return ''
      }
    },
  },
}
</script>
