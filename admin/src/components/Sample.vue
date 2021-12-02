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
        <div class="d-flex-column">
          <div>作業時間</div>
          <div>
            {{ processTime }}
          </div>
        </div>
      </v-card>
      <v-card class="errorInfo" width="100" height="110" outlined>
        <div class="d-flex-column">
          <div v-if="errorInfo === 'YET'">
            <v-icon> mdi-minus-circle-outline </v-icon>
          </div>
          <div v-else-if="errorInfo === 'ERROR'">
            <v-icon> mdi-close-circle-outline </v-icon>
          </div>
          <div v-else-if="errorInfo === 'SUCCESS'">
            <v-icon> mdi-check-circle-outline </v-icon>
          </div>
        </div>
      </v-card>
      <v-card class="waitInfo" width="100" height="110" outlined>
        <div v-if="waitState === 'WORKING'">
          <v-icon> mdi-draw </v-icon>
        </div>
        <div v-if="waitState === 'WAITING'">
          <v-icon> mdi-hand-front-left-outline </v-icon>
        </div>
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
  data() {
    return {
      minute: 0,
      second: 0,
      errorInfo: "YET",
      waitState: "WORKING",
      chartOptions: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 35, 50, 49, 60, 70, 91],
        },
      ],
    };
  },
  computed: {
    processTime: function () {
      return this.minute + ":" + this.second;
    },
  },
};

var ws = new WebSocket("ws://localhost:10005");

// 接続
ws.onopen = function () {
  console.log("onopen");
};

ws.onmessage = function (e) {
  // e.data contains received string.
  console.log("onmessage: " + e.data);
};

ws.onclose = function () {
  console.log("onclose");
};

ws.onerror = function (e) {
  console.log("onerror");
  console.log(e);
};
</script>

<style scoped>
</style>