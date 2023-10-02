
<script>
import { Doughnut } from 'vue-chartjs'

export default {
  name: 'StateDoughnut',
  extends: Doughnut,
  props: {
    stateCount: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chartdata: {
        datacollection: {
          labels: [
            this.$t('record_chart_pending'),
            this.$t('record_chart_progress'),
            this.$t('record_chart_closed'),
            this.$t('record_chart_cancel'),
            this.$t('record_chart_external'),
          ],
          datasets: [
            {
              data: [
                this.stateCount.pending_validation,
                this.stateCount.processing,
                this.stateCount.closed,
                this.stateCount.cancelled,
                this.stateCount.external_processing,
              ],
              backgroundColor: [
                'rgb(230, 159, 0)',
                'rgb( 86, 180, 233)',
                'rgb( 0, 158, 115)',
                'rgb(70, 70, 70)',
              ],
            },
          ],
        },
      },
      options: {
        showAllTooltips: true,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'top',
          align: 'start',
          labels: {
            fontSize: 12,
          },
        },
        tooltips: {
          position: 'custom',
          callbacks: {
            label: function(tooltipItem, data) {
              var allData = data.datasets[tooltipItem.datasetIndex].data
              var tooltipLabel = data.labels[tooltipItem.index]
              var tooltipData = allData[tooltipItem.index]
              var total = 0
              for (var i in allData) {
                total += parseFloat(allData[i])
              }
              var tooltipPercentage = Math.round((tooltipData / total) * 100)
              return ' ' + tooltipData + ' (' + tooltipPercentage + '%)'
            },
          },
        },
      },
    }
  },
  mounted() {
    this.addPlugin({
      beforeRender: function(chart) {
        if (chart.config.options.showAllTooltips) {
          // create an array of tooltips
          // we can't use the chart tooltip because there is only one tooltip per chart
          chart.pluginTooltips = []
          chart.config.data.datasets.forEach(function(dataset, i) {
            chart.getDatasetMeta(i).data.forEach(function(sector, j) {
              chart.pluginTooltips.push(
                new Chart.Tooltip(
                  {
                    _chart: chart.chart,
                    _chartInstance: chart,
                    _data: chart.data,
                    _options: chart.options.tooltips,
                    _active: [sector],
                  },
                  chart
                )
              )
            })
          })

          // turn off normal tooltips
          chart.options.tooltips.enabled = false
        }
      },
      afterDraw: function(chart, easing) {
        if (chart.config.options.showAllTooltips) {
          // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
          if (!chart.allTooltipsOnce) {
            if (easing !== 1) return
            chart.allTooltipsOnce = true
          }

          // turn on tooltips
          chart.options.tooltips.enabled = true
          Chart.helpers.each(chart.pluginTooltips, function(tooltip) {
            tooltip.initialize()
            tooltip.update()
            // we don't actually need this since we are not animating tooltips
            tooltip.pivot()
            tooltip.transition(easing).draw()
          })
          chart.options.tooltips.enabled = false
        }
      },
    })
    Chart.Tooltip.positioners.custom = function(elements, eventPosition) {
      /** @type {Chart.Tooltip} */
      var tooltip = this
      return Chart.Tooltip.positioners.average(elements, eventPosition)
    }
    this.renderChart(this.chartdata.datacollection, this.options)
  },
}
</script>
