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
            {{ processTime }}
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
              {{ errorInfo }}
              <div v-if="errorInfo === ''">
                <v-icon x-large> mdi-minus-circle-outline </v-icon>
              </div>
              <div v-else-if="errorInfo === 'ERROR'">
                <v-icon x-large> mdi-close-circle-outline </v-icon>
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
      processTime: "",
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
            "-0:30",
            "-0:20",
            "-0:10",
            "0:00",
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
    startSec: function () {
      var time = this.startTime.split(":");
      return (
        parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2])
      );
    },
  },
  watch: {
    currentTime: function (val) {
      var time = val.split(":");
      var currentSec =
        parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);
      var sec = currentSec - this.startSec;

      this.processTime = Math.floor(sec / 60) + ":" + (sec % 60);

      if (this.changeAmount != -1) {
        this.series[0].data.shift();
        this.series[0].data.push(this.changeAmount);
        var line = this.series[0].data;
        console.log(this.series[0].data);
        this.series = [{ data: line }];
      }

      //this.$refs.realtimeChart.updataSeries(this.series[0].data);
    },
  },
};
</script>

<style scoped>
</style>