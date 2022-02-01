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
      <v-row>
        <v-col cols="8" md="2" sm="4">
          目標時間
          <v-textarea
            solo
            type="number"
            v-model="targetTime"
            label="目標時間"
            height="11pt"
          >
          </v-textarea>
        </v-col>
        <v-col cols="8" md="2" sm="4">
          コード長目安
          <v-textarea
            solo
            type="number"
            v-model="targetCodeLength"
            label="コード長目安"
            height="11pt"
          >
          </v-textarea>
        </v-col>
      </v-row>
    </div>
    <div>
      <ul id="progressList">
        <li v-for="student in result" :key="student.studentID">
          <sample
            :userID="student.studentID"
            :nowString="student.inputGraph.nowString"
            :changeAmount="student.inputGraph.changeAmount"
            :startTime="student.elapsedTime.startTime"
            :currentTime="student.elapsedTime.nowTime"
            :errorInfo="student.errorInfo"
            :waitState="student.waitState"
            :targetTime="targetTime"
            :targetCodeLength="targetCodeLength"
          >
          </sample>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Sample from "../components/Sample";
import ReconnectingWebSocket from "reconnecting-websocket";
export default {
  components: {
    Sample,
  },
  data() {
    return {
      targetTime: 1,
      targetCodeLength: 0,
      overlay: true,
      roomName: "",
      result: [],
      connection: null,
      receivedMessage: "",
      scoreArray: [],
      studentData: {
        isOnline: true,
        studentID: "",
        inputGraph: {
          nowString: "",
          changeAmount: 0,
          codeLength: 0,
        },
        elapsedTime: {
          startTime: 0,
        },
        errorInfo: "",
        errorString: "",
        waitState: "WORKING",
      },
      studentList: [],
    };
  },
  watch: {
    receivedMessage: function (val) {
      if (val == "this id is admin") {
        this.overlay = false;
      } else if (val == "login") {
        console.log("aa");
      } else {
        let splitedMessage = this.receivedMessage.split(",,");
        if (splitedMessage[1] in this.studentList) {
          if (splitedMessage[0] == 0) {
            this.studentList[splitedMessage[1]] = {
              isOnline: true,
              studentID: splitedMessage[1],
              inputGraph: {
                nowString: splitedMessage[3],
                changeAmount: parseInt(splitedMessage[7]),
                codeLength: splitedMessage[4],
              },
              elapsedTime: {
                startTime: splitedMessage[8],
                nowTime: splitedMessage[2],
              },
              errorInfo: "",
              errorString: splitedMessage[6],
              waitState: splitedMessage[5],
              sabotageScore: this.studentList[splitedMessage[1]].sabotageScore,
            };
            if (splitedMessage[6] == "" || splitedMessage[6] == "undefined") {
              this.studentList[splitedMessage[1]]["errorInfo"] = "";
            } else {
              this.studentList[splitedMessage[1]]["errorInfo"] = "ERROR";
            }
            var array = Object.keys(this.studentList).map((k) => ({
              key: k,
              value: this.studentList[k].sabotageScore,
            }));
            array.sort((a, b) => a.value - b.value);
            this.result = [];
            array.forEach((element) => {
              this.result.push(this.studentList[element.key]);
            });
            console.log(this.result);

            this.studentList = Object.assign({}, this.studentList, {});
            //console.log(this.studentList);
          } else if (splitedMessage[0] == 1) {
            //quit
            this.studentList[splitedMessage[1]]["isOnline"] = false;
            console.log(splitedMessage[1] + "quited");
          }
        } else {
          if (splitedMessage[0] == 0) {
            this.studentList[splitedMessage[1]] = {
              isOnline: true,
              studentID: splitedMessage[1],
              inputGraph: {
                nowString: splitedMessage[3],
                changeAmount: parseInt(splitedMessage[7]),
                codeLength: splitedMessage[4],
              },
              elapsedTime: {
                startTime: splitedMessage[8],
                nowTime: splitedMessage[2],
              },
              errorInfo: "",
              errorString: splitedMessage[6],
              waitState: splitedMessage[5],
              sabotageScore: 0,
            };
            if (splitedMessage[6] == "") {
              this.studentList[splitedMessage[1]]["errorInfo"] = "";
            } else {
              this.studentList[splitedMessage[1]]["errorInfo"] = "ERROR";
            }

            this.studentList = Object.assign({}, this.studentList, {});
            console.log(this.studentList);
          } else if (splitedMessage[0] == 1) {
            //quit
            this.studentList[splitedMessage[1]]["isOnline"] = false;
            console.log(splitedMessage[1] + "quited");
          }
        }
        console.log(splitedMessage[1]);
      }
    },
  },
  created: function () {
    let that = this;
    let pingPongTimer = null;
    console.log("Starting connection to WebSocket Server");
    this.connection = new ReconnectingWebSocket(
      "wss://cpmserver.herokuapp.com/:8000"
    );
    const checkConnection = () => {
      setTimeout(() => {
        this.connection.send("ping");
        pingPongTimer = setTimeout(() => {
          console.log("再接続を試みます");
          pingPongTimer = null;
          this.connection.reconnect();
          this.connection.send(this.roomName);
        }, 1000);
      }, 30000);
    };

    this.connection.onopen = function () {
      console.log("Successfully connected to the echo websocket server...");
    };
    this.connection.onmessage = function (event) {
      //console.log(event.data);
      if (event.data == "pong") {
        if (pingPongTimer) {
          clearTimeout(pingPongTimer);
        }
        return checkConnection();
      }
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
