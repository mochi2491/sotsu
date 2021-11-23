<template>
  <div>
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
    <div class="loginForm">
      <v-row>
        <v-col cols="12" sm="4" md="2">
          <v-text-field label="Room" solo v-model="roomName"> </v-text-field>
        </v-col>
        <v-btn style="margin-top: 19px" v-on:click="login">log in</v-btn>
      </v-row>
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
    };
  },
  watch: {
    fusionString: function (val) {
      this.clock = new Date();
      ws.send(this.now + val);
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
        //let that=this;
        const response = await fetch(url).then((response) => {
          //that.OutputText=response.json().stdout;
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
      }

      main();
    },
    login: function () {
      ws.send(this.roomName);
    },
    changeContent(val) {
      if (this.content !== val) {
        this.content = val;
      }
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