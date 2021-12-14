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
    <div>
      <sample
        v-bind:nowString="studentData.nowString"
        :changeAmount="studentData.changeAmount"
        :startTime="studentData.startTime"
        :errorInfo="studentData.errorInfo"
        :waitState="studentData.waitState"
      ></sample>
    </div>
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
      overlay: true,
      roomName: "",
      connection: null,
      receivedMessage: "",
      studentData: {
        studentID: "",
        inputGraph: {
          nowString: "",
          changeAmount: 0,
        },
        elapsedTime: {
          startTime: 0,
        },
        errorInfo: "YET",
        waitState: "WORKING",
      },
      studentList: {},
    };
  },
  watch: {
    receivedMessage: function (val) {
      if (val == "this id is admin") {
        this.overlay = false;
      }
      else if(val == "login"){
        console.log("aa")
      } 
      else if(val== "2017e29"){
        console.log("goodbye")
      }
      else {
        let splitedMessage = this.receivedMessage.split(",");
        console.log(splitedMessage[0]);
        this.studentList[splitedMessage[0]] = {
          studentData: {
            studentID: splitedMessage[0],
            inputGraph: {
              nowString: "",
              changeAmount: 0,
            },
            elapsedTime: {
              startTime: splitedMessage[1],
            },
            errorInfo: "YET",
            waitState: splitedMessage[4],
          }
        };
        console.log(this.studentList)
      }
    },
  },
  created: function () {
    let that = this;
    console.log("Starting connection to WebSocket Server");
    this.connection = new WebSocket("ws://localhost:10005");
    this.connection.onopen = function () {
      console.log("Successfully connected to the echo websocket server...");
    };
    this.connection.onmessage = function (event) {
      that.receivedMessage = event.data;
    };
    this.connection.onclose = function () {
      console.log("onclose");
    };

    this.connection.onerror = function (e) {
      console.log("onerror");
      console.log(e);
    };
  },
  methods: {
    login: function () {
      if (this.roomName != "") {
        this.connection.send(this.roomName);
      }
    },
  },
};
</script>
