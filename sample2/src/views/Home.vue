<template>
  <div>
    <div>
      <v-overlay :value="overlay">
        <v-card>
          <div class="loginForm">
            <v-row>
              <v-col>
                <v-text-field label="Room" solo v-model="roomName">
                </v-text-field>
              </v-col>
              <v-btn style="margin-top: 19px" v-on:click="login">log in</v-btn>
            </v-row>
          </div>
        </v-card>
      </v-overlay>
    </div>
    <div class="d-flex justify" style="height: 36px">
      <v-btn v-on:click="compile" outlined style="height: 36px">
        <v-icon>mdi-play-circle-outline</v-icon>
      </v-btn>
      <v-switch
        v-model="switch1"
        style="margin-top: 2px; height: 36px"
      ></v-switch>
    </div>
    <div style="height: 200px">
      <editor
        editor-id="editorA"
        content="content"
        v-on:change-content="changeContent"
      >
      </editor>
    </div>

    <div class="InputField">
      <v-row>
        <v-col cols="6" md="6">
          <v-textarea
            v-bind="InputText"
            solo
            name="inputData"
            background-color="white"
          ></v-textarea>
        </v-col>
      </v-row>
    </div>
    <div class="OutputField">{{ OutputText }}</div>
  </div>
</template>

<script>
import Editor from "../components/Editor";
export default {
  components: {
    Editor,
  },
  data() {
    return {
      roomName: "",
      content: "",
      InputText: "",
      OutputText: "",
      switch1: false,
      clock: new Date(),
      errDetail: "",
      codeEditAmount: -1,
      beforeString: "",
      absolute: true,
      overlay: true,
      connection: null,
      receivedMessage: "",
      startTime: 0,
    };
  },
  watch: {
    fusionString: function (val) {
      this.clock = new Date();
      this.connection.send(
        0 + "," + this.roomName + "," + this.now + val + ",-1," + this.startTime
      );
    },
    receivedMessage: function (val) {
      if (val == "this id is exist") {
        this.overlay = false;
      }
    },
  },
  computed: {
    now: function () {
      return (
        this.clock.getHours() +
        ":" +
        this.clock.getMinutes() +
        ":" +
        this.clock.getSeconds()
      );
    },
    contentLength: function () {
      return this.content.length;
    },
    waitStatus: function () {
      if (this.switch1) {
        return "WAIT";
      } else {
        return "WORK";
      }
    },
    fusionString: function () {
      return (
        "," +
        this.content +
        "," +
        this.contentLength +
        "," +
        this.waitStatus +
        "," +
        this.errDetail
      );
    },
  },
  created: function () {
    let that = this;
    console.log("Starting connection to WebSocket Server");
    this.connection = new WebSocket("ws://localhost:8000");
    this.connection.onopen = function () {
      console.log("Successfully connected to the echo websocket server...");
    };
    this.connection.onmessage = function (event) {
      console.log(event.data);
      that.receivedMessage = event.data;
    };
    this.connection.onclose = function () {
      console.log("onclose");
    };

    this.connection.onerror = function (e) {
      console.log("onerror");
      console.log(e);
    };
    this.startTime = this.now;
  },
  methods: {
    sleep: function (a) {
      var dt1 = new Date().getTime();
      var dt2 = new Date().getTime();
      while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
      }
      return;
    },
    compile: function () {
      let that = this;

      async function postData(url = "", data = {}) {
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(data),
        });
        return response.json();
      }
      async function getData(url) {
        const response = await fetch(url);
        return response.json();
      }
      async function getDetail(url) {
        const response = await fetch(url).then((response) => {
          return response;
        });
        return response.json();
      }

      async function main() {
        const url = "http://api.paiza.io:80/runners/create";
        const data = {
          source_code: that.content,
          language: "python3",
          input: "",
          api_key: "guest",
        };
        const res = await postData(url, data);
        let sessionId = res.id;
        const url2 = `http://api.paiza.io/runners/get_status?id=${sessionId}&api_key=guest`;

        that.sleep(2000);
        await getData(url2);
        const url3 = `http://api.paiza.io/runners/get_details?id=${sessionId}&api_key=guest`;
        const res3 = await getDetail(url3);
        that.OutputText = res3.stdout;
        that.errDetail = res3.stderr;
        console.log(res3.result);
      }

      main();
    },
    login: function () {
      if (this.roomName != "") {
        this.connection.send(this.roomName);
        setInterval(this.setString, 10000);
      }
    },
    changeContent(val) {
      if (this.content !== val) {
        this.content = val;
      }
    },
    setString: function () {
      let that = this;
      let currentString = that.content;
      let stringDefferent = that.getStringDifferent(
        that.beforeString,
        currentString
      );
      that.beforeString = currentString;
      that.clock = new Date();
      this.connection.send(
        0 +
          "," +
          that.roomName +
          "," +
          that.now +
          that.fusionString +
          "," +
          stringDefferent +
          "," +
          that.startTime
      );
    },
    getStringDifferent: function (str1, str2) {
      var x = str1.length;
      var y = str2.length;

      var d = [];
      var i = 0;
      var j = 1;
      for (i = 0; i <= x; i++) {
        d[i] = [];
        d[i][0] = i;
      }
      for (i = 0; i <= y; i++) {
        d[0][i] = i;
      }

      var cost = 0;
      for (i = 1; i <= x; i++) {
        for (j = 1; j <= y; j++) {
          cost = str1[i - 1] == str2[j - 1] ? 0 : 1;

          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            d[i][j - 1] + 1,
            d[i - 1][j - 1] + cost
          );
        }
      }
      return d[x][y];
    },
  },
};
</script>

<style scoped>
</style>