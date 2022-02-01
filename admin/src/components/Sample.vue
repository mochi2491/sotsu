<template>
  <div class="d-flex justify">
    {{ userID }}
    {{ sabotageScore }}
    <div class="codeDisplay">
      <v-btn @click="overlay = !overlay"> Show Code </v-btn>
      <v-overlay :value="overlay">
        <v-container fluid>
          <v-textarea
            solo
            auto-grow
            readonly
            :value="nowString"
            :color="colorName"
          ></v-textarea>
          <v-btn @click="overlay = !overlay" text>x</v-btn>
        </v-container>
      </v-overlay>
    </div>
    <v-card
      class="graph"
      max-width="500"
      height="330"
      outlined
      :color="colorName"
    >
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
      <v-card
        class="workTime"
        width="100"
        height="110"
        outlined
        :color="colorName"
      >
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
        :color="colorName"
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
        :color="colorName"
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
    userID: String,
    nowString: String,
    changeAmount: String,
    startTime: {
      type: String,
      default: "00:00:00",
    },
    currentTime: String,
    errorInfo: String,
    waitState: String,
    targetTime: String,
    targetCodeLength: String,
  },
  data() {
    return {
      minute: 0,
      second: 0,
      start: 0,
      now: 0,
      errorState: "",
      overlay: false,
      currentSec: 0,
      startErrorTime: 0,
      currentErrorTime: 0,
      accumlatedErrorTime: 0,
      sabotageScore: 0,
      writeAverage: 0,
      colorName: "white",
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
    errorInfo: function (val) {
      if (val == "ERROR") {
        this.startErrorTime = this.currentSec;
      }
    },
    currentTime: function (val) {
      var time = val.split(":");
      this.currentSec =
        parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);
      var sec = this.currentSec - this.startSec;

      this.processTime = Math.floor(sec / 60) + ":" + (sec % 60);

      const sum = (numbers, initialValue = 0) =>
        numbers.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          initialValue
        );
      const average = (numbers) => sum(numbers) / numbers.length;

      if (this.errorInfo == "ERROR") {
        this.currentErrorTime = 0;
        this.currentErrorTime =
          this.accumlatedErrorTime + (this.currentSec - this.startErrorTime);
      } else {
        this.accumlatedErrorTime = this.currentErrorTime;
      }

      var errorScore;
      if (this.currentErrorTime < 300) {
        errorScore = this.currentErrorTime;
      } else if (this.currentErrorTime >= 300 && this.currentErrorTime < 600) {
        errorScore = 100 + this.currentErrorTime;
      } else if (this.currentErrorTime >= 600) {
        errorScore = 200 + this.currentErrorTime;
      }

      var lengthScore;
      if (
        parseInt(this.targetCodeLength) * 0.5 < this.nowString.length &&
        this.nowString.length < parseInt(this.targetCodeLength) * 1.5
      ) {
        lengthScore = 1;
      } else {
        lengthScore = 1.1;
      }

      var timeScore;
      if (parseInt(this.targetTime) > sec) {
        timeScore = 1;
      } else {
        timeScore = 1.1;
      }

      var waitNum;
      if (this.waitState == "WAIT") {
        waitNum = 0;
      } else if (this.waitState == "WORK") {
        waitNum = 1;
      }

      if (this.changeAmount != -1) {
        this.series[0].data.shift();
        this.series[0].data.push(this.changeAmount);
        var line = this.series[0].data;
        this.series = [{ data: line }];
        this.writeAverage = average(this.series[0].data);
        this.sabotageScore =
          (this.writeAverage - errorScore * 0.1) *
          (lengthScore * timeScore) *
          waitNum; //評価値
        this.$parent.studentList[this.userID].sabotageScore =
          this.sabotageScore;
      }

      this.series[0].data.splice();
      console.log(
        "(" +
          this.writeAverage +
          "-" +
          errorScore * 0.1 +
          ")*(" +
          lengthScore +
          "+" +
          timeScore +
          ")*" +
          waitNum
      );
      //this.$refs.realtimeChart.updataSeries(this.series[0].data);
    },
  },
  methods: {
    updateSeriesLine() {
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