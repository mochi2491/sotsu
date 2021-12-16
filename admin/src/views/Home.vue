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
        :nowString="studentData.nowString"
        :changeAmount="studentData.changeAmount"
        :startTime="studentData.startTime"
        :errorInfo="studentData.errorInfo"
        :waitState="studentData.waitState"
      ></sample>
      <ul>
        <li v-for="student in studentList" :key="student.studentID">
          <sample
            :nowString="student.nowString"
            :changeAmount="student.changeAmount"
            :startTime="student.elapsedTime.startTime"
            :currentTime="student.elapsedTime.currentTime"
            :errorInfo="student.errorInfo"
            :waitState="student.waitState"
          ></sample>
        </li>
      </ul>
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
      studentList: {},
    };
  },
  watch: {
    receivedMessage: function (val) {
      if (val == "this id is admin") {
        this.overlay = false;
      } else if (val == "login") {
        console.log("aa");
      } else {
        let splitedMessage = this.receivedMessage.split(",");
        if (splitedMessage[0] == 0) {
          this.studentList[splitedMessage[1]] = {
            isOnline: true,
            studentID: splitedMessage[1],
            inputGraph: {
              nowString: splitedMessage[3],
              changeAmount: splitedMessage[7],
              codeLength: splitedMessage[4],
            },
            elapsedTime: {
              startTime: splitedMessage[8],
              currentTime: splitedMessage[2],
            },
            errorInfo: "",
            errorString: splitedMessage[6],
            waitState: splitedMessage[5],
          };
          if (splitedMessage[6] == "") {
            this.studentList[splitedMessage[1]]["errorInfo"] = "";
          } else {
            this.studentList[splitedMessage[1]]["errorInfo"] = "ERROR";
          }

          console.log(this.studentList);
        } else if (splitedMessage[0] == 1) {
          //quit
          this.studentList[splitedMessage[1]]["isOnline"] = false;
          console.log(splitedMessage[1] + "quited");
        }
      }
      this.studentList =Object.assign({},this.studentList)
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
