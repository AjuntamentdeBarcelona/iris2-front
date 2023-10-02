<script lang="js">
import ProfileMonthActivity from './ProfileMonthActivity'

export default {
  name: 'AmbitMonthActivity',
  extends: ProfileMonthActivity,
  methods: {
    getRequestUrl() {
      const today = new Date(),
        month = today.getUTCMonth() + 1,
        year = today.getFullYear()

      return `/api/record_cards/record_cards/month-summary/ambit/${
        this.date.year
      }/${this.date.month}/`
    },
  },
}
</script>
