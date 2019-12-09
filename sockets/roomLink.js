const db = require("../routes/db/connection");

module.exports = function(socket, io) {
  // let clients = io.sockets.clients();
  // console.log(clients);

  db.any("SELECT room_name FROM rooms")
    .then(function(data) {
      for (let i = 0; i < data.length; i++) {
        //io.emit("create room", data[i].room_name, data[i].password);
        app.use("/game" + data[i].room_name, gamesRouter);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
};
