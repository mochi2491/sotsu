<template>
  <div>
    <sample></sample>
  </div>
</template>

<script>
import Sample from "../components/Sample";
export default {
  components: {
    Sample,
  },
  data() {
    return {
      studentData: {
        roomID: "",
        inputGraph: {
          nowString: "",
        },
        elapsedTime: {
          startTime: 0,
        },
        errorInfo: {},
        waitState: {},
      },
    };
  },
};

var ws = new WebSocket("ws://localhost:10005");

// 接続
ws.onopen = function () {
  console.log("onopen");
  ws.send("admin");
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
