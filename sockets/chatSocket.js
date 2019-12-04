const db = require("../routes/db/index");

module.exports = function(socket, io) {
  socket.on("chat message", function(msg) {
    db.any(
      `INSERT INTO messages (message_text,room_id,user_id,time_stamp) VALUES ('${msg}',0,18,'NOW()')`
    ).catch(error => {
      console.log(error);
    });
    io.emit("chat message", msg);
  });
};
