<template>
  <div>
    <vue-apex-charts
      width="500"
      type="line"
      :options="chartOptions"
      :series="series"
    >
    </vue-apex-charts>
    <v-card class="workTime" max-width="344" outlined>
      {{ processTime }}
    </v-card>
    <v-card class="errorInfo" max-width="344" outlined>
      <v-icon>
        
      </v-icon>
    </v-card>
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
      minute:0,
      second:0,

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
  computed:{
    processTime:function(){
      return this.minute+":"+this.second
    }
  }
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