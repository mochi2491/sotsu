<template>
  <div class="d-flex justify">
    <v-card class="graph" max-width="500" height="330" outlined>
      <vue-apex-charts
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
            {{elapsedTime}}
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
    changeAmount: Number,
    startTime: String,
    currentTime: String,
    errorInfo: String,
    waitState: String,
  },
  data() {
    return {
      minute: 0,
      second: 0,
      start: 0,
      now:0,
      chartOptions: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [
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
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    };
  },
  computed: {
    processTime: function () {
      return this.minute + ":" + this.second;
    },
    elapsedTime: function () {
      let a = this.now - this.start;
      let minute = a / 60;
      let second = a - minute * 6;
      return minute + ":" + second; 
    },
  },
  watch: {
    changeAmount: function (val) {
      this.series.data.push(val);
    },
    startTime: function (val) {
      let time = val.split(":");
      this.start = parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 +parseInt(time[2]);
    },
    currentTime: function (val) {
      let time = val.split(":");
      this.now = parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 +parseInt(time[2]);
      console.log(this.now)
    },
  },
};
</script>

<style scoped>
</style>