// const server = require("../bin/www");
const socketIO = require("socket.io");
const db = require("../routes/db/connection");
module.exports = function(server) {
  const io = socketIO(server);
  io.on("connection", socket => {
    //console.log("connected");

    //initialize the page with messages from chat
    db.any("SELECT message_text,time_stamp FROM messages WHERE room_id = 0", [
      true
    ])
      .then(function(data) {
        for (let i = 0; i < data.length; i++) {
          io.emit("chat message", data[i].message_text, data[i].time_stamp);
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    //this should only be run if the room is the lobby
    //todo: figure out a way to get this in the routes
    db.any("SELECT room_name,password FROM rooms")
      .then(function(data) {
        for (let i = 0; i < data.length; i++) {
          io.emit("create room", data[i].room_name, data[i].password);
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    require("./chatSocket")(socket, io);
    require("./roomsSocket")(socket, io);
    //this needs alot of its responsibilities moved, but it's tricky with how io works
  });
};
