const db = require("../routes/db/index");

module.exports = function(socket, io) {
  socket.on("create room", function(room, password) {
    db.any(
      `INSERT INTO rooms (room_name,password) VALUES ('${room}','${password}')`
    ).catch(error => {
      console.log(error);
    });
    io.emit("create room", room, password);
  });
};
