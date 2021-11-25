<template></template>

<script>
import "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js";
import "https://unpkg.com/vue-chartjs/dist/vue-chartjs.min.js";
import { Bar } from 'vue-chartjs'

export default {
    extends:Bar,
    mounted(){
        
    }
}

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