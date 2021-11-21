<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" class="py-2">
        <v-btn v-on:click="compile" outlined>
          <v-icon>mdi-play-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div style="height: 200px">
      <editor
        editor-id="editorA"
        content="contentA"
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
            solo
            name="inputData"
            background-color="white"
          ></v-textarea>
        </v-col>
      </v-row>
    </div>
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
    };
  },
  computed: {
    clock: function () {
      return new Date();
    },
    now: function () {
      return (
        this.clock.getHours() +
        ":" +
        this.clock.getMinutes() +
        ":" +
        this.clock.getSeconds()
      );
    },
    fusionString: function () {
      return this.content + ":" + this.now;
    },
  },
  methods: {
    compile: function () {
      
    },
    login: function () {
      ws.send(this.roomName);
    },
    changeContent(val) {
      if (this.content !== val) {
        this.content = val;
        ws.send(this.fusionString);
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