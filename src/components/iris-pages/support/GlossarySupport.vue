<template>
  <div>
    <alphabet
      v-if="!propData"
      custom-alphabet="abcdefghijklmnopqrstuvwxyz"
      class="col-12"
      @character-selected="onCharacterSelected"
      @reset-selection="onResetSelection"
    />

    <glossary-support-table
      ref="glossarySupportTable"
      :query-params="tableQueryParams"
      :prop-data="propData"
      :admin-features="adminFeatures"
      class="col-12"
    >
      <template
        v-if="adminFeatures"
        slot="external-actions"
        slot-scope="props"
      >
        <edit-delete-buttons
          :model="props.row"
          @edit-model="onEditModel"
          @delete-model="onDeleteModel"
        />
      </template>
    </glossary-support-table>
  </div>
</template>

<script>
import Alphabet from '~/components/iris-pages/support/Alphabet'
import GlossarySupportTable from '~/components/iris-pages/support/GlossarySupportTable'
import EditDeleteButtons from '~/components/forms/buttons/EditDeleteButtons'
import { supportInfoType } from '~/assets/js/iris2/constants'

const defaultQueryParams = { type: supportInfoType().glossary.id }

export default {
  name: 'GlossarySupportList',
  components: {
    Alphabet,
    GlossarySupportTable,
    EditDeleteButtons,
  },
  props: {
    propData: {
      type: Array,
      default: () => undefined,
    },
    adminFeatures: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableQueryParams: { ...defaultQueryParams },
    }
  },
  methods: {
    onCharacterSelected(character) {
      this.tableQueryParams = { ...defaultQueryParams, title: character }
    },
    onResetSelection() {
      this.tableQueryParams = { ...defaultQueryParams }
    },
    onEditModel(model) {
      this.$emit('edit-model', model)
    },
    onDeleteModel(model) {
      this.$emit('delete-model', model)
    },
    refresh() {
      this.$refs.glossarySupportTable.refresh()
    },
  },
}
</script>
