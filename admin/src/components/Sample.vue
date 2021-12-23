<template>
  <div class="d-flex justify">
    <v-card class="graph" max-width="500" height="330" outlined>
      <vue-apex-charts
        ref="realtimeChart"
        width="500"
        type="line"
        :options="chartOptions"
        :series="series"
      >
      </vue-apex-charts>
    </v-card>
    <div>
      <v-card class="workTime" width="100" height="110" outlined>
        <div align="center">
          <div align="center">作業時間</div>
          <div align="center">
            {{ elapsedTime }}
          </div>
        </div>
      </v-card>
      <v-card
        class="d-flex justifiy-content-center"
        width="100"
        height="110"
        outlined
      >
        <v-row align="center">
          <v-col align="center">
            <div class="d-flex-column">
              <div v-if="errorInfo === ''">
                <v-icon x-large> mdi-minus-circle-outline </v-icon>
              </div>
              <div v-else-if="errorInfo === 'ERROR'">
                <v-icon x-large> mdi-close-circle-outline </v-icon>
              </div>
              <div v-else-if="errorInfo === 'SUCCESS'">
                <v-icon x-large> mdi-check-circle-outline </v-icon>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
      <v-card
        class="d-flex justifiy-content-center"
        width="100"
        height="110"
        outlined
      >
        <v-row align="center">
          <v-col align="center">
            <div v-if="waitState === 'WORK'">
              <v-icon x-large> mdi-draw </v-icon>
            </div>
            <div v-if="waitState === 'WAIT'">
              <v-icon x-large> mdi-hand-front-left-outline </v-icon>
            </div>
          </v-col>
        </v-row>
      </v-card>
      {{ series[0].data }}
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
export default {
  components: {
    VueApexCharts,
  },
  props: {
    nowString: String,
    changeAmount: String,
    startTime: {
      type: String,
      default: "00:00:00",
    },
    currentTime: String,
    errorInfo: String,
    waitState: String,
  },
  data() {
    return {
      minute: 0,
      second: 0,
      start: 0,
      now: 0,
      errorState: "",
      chartOptions: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [
            "-1:40",
            "-1:30",
            "-1:20",
            "-1:10",
            "-1:00",
            "-0:50",
            "-0:40",
            "-0:20",
            "-0:10",
            "-0:00",
          ],
        },
      },
      series: [
        {
          name: "series-1",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    };
  },
  computed: {
    processTime: function () {
      return this.minute + ":" + this.second;
    },
    elapsedTime: function () {
      let a = this.now - this.first;
      let minute = a / 60;
      minute = parseInt(minute);
      let second = a % 60;
      second = parseInt(second);
      return minute + ":" + second;
    },
    first: function () {
      let time = this.startTime.split(":");
      return (
        parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2])
      );
    },
  },
  watch: {
    currentTime: function (val) {
      let time = val.split(":");
      this.now =
        parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);
      let amount = parseInt(this.changeAmount);
      if (amount >= 0) {
        this.series[0].data.push(amount);
        this.series[0].data.shift();
        this.updaeSeriesLine();
      } else if (amount == -1) {
        console.log("amount=1");
      } else {
        console.log("unexpected number")
      }
    },
  },
  methods: {
    updaeSeriesLine() {
      this.$refs.realtimeChart.updateSeries(
        [
          {
            data: this.series[0].data,
          },
        ],
        false,
        true
      );
    },
  },
};
</script>

<style scoped>
</style>