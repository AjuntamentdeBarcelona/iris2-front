<script>
import Table from '~/components/pages/list/table.vue'
import moment from 'moment'
import TracebilityIcon from '~/components/tables/columns/TraceabilityIcon'
import TraceabilityDetail from '~/components/tables/columns/TraceabilityDetail'

/**
 * created_at   icon   event_detail
 * +----------+ +----+ +-------+ +----------+
 * |          | |    | |user_id| |group_name|
 * |created_at| |icon| +-------+ +----------+
 * |          | |    | +--------------------+
 * |          | |    | |event_detail.text   |
 * +----------+ +----+ +--------------------+
 */
export default {
  name: 'TraceabilityTable',
  extends: Table,
  props: {
    itemsPerPage: {
      type: [Number, undefined],
      default: 10,
    },
  },
  data() {
    return {
      columns: ['created_at', 'icon', 'event_detail'],
      options: {
        skin: 'table table-borderless table-sm no-header',
        perPage: this.itemsPerPage,
        headings: {
          created_at: null,
          icon: null,
          event_detail: null,
        },
        columnsClasses: {
          created_at: 'date-col',
          icon: 'icon-col align-middle',
          event_detail: 'event-col',
        },
        templates: {
          created_at: function(h, row, index) {
            return row.created_at
              ? moment(row.created_at).format('DD/MM/YY HH:mm:ss')
              : ' '
          },
          icon: TracebilityIcon,
          event_detail: TraceabilityDetail,
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped>
svg {
  color: $secondary;
}

.table-list {
  width: 100%;
  .VueTables {
    &.VueTables--server {
      padding: 0;
      border-width: 0;
      /deep/ td {
        padding-top: 15px;
        padding-bottom: 15px;
      }
      /deep/ .date-col {
        width: 8ch;
      }
      /deep/ .icon-col {
        width: 1.5rem;
        padding: 0;
        background: linear-gradient($gray-600, $gray-600) no-repeat center/2px
          100%;
      }

      /deep/ table.no-header {
        thead {
          display: none;
        }
      }
    }
  }
}
</style>
