new Vue({
  el: '#loginInput',
  data: {
      roomName: ""
  },
  data: {

  },
  methods: {
      login: function (ws) {
          ws.send(roomName)
          console.log("adfas")
      }
  }
})