<template>
<div>
    <Chart></Chart>
    
    <router-link to="/">Home</router-link>

</div>

</template>

<script>
import Chart from '../components/LineChart';

export default {
  components: {
    Chart,
  },
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