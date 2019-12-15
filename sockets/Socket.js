// const server = require("../bin/www");
const socketIO = require("socket.io");
const db = require("../routes/db/connection");
const app = require("../app");

module.exports = function(server) {
  //double check this is working later
  const io = socketIO(server);
  app.set("io", io);

  io.on("connection", socket => {
    //initialize the page with messages from chat

    //this should only be run if the room is the lobby
    //todo: figure out a way to get this in the route

    console.log("connected");

    //create a new namespace for a new room when someone creates the room
    socket.on("joinRoom", roomId => {
      socket.join(roomId, function() {
        console.log("user joined socket for room " + roomId);
        //socket.emit("test", roomId);
      });
    });

    socket.on("hostTest", host => {
      console.log("host test");
    });

    socket.on("hostJoin", hostInfo => {
      console.log("a host is joinging");
      let hostRoom = hostInfo["userId"] + hostInfo["roomId"];
      console.log(hostRoom);
      socket.join(hostRoom, function() {
        console.log(
          "host joined socket for room " +
            hostInfo["userId"] +
            " with userid " +
            hostInfo["roomId"]
        );
      });

      io.to(hostRoom).emit(
        "hostTest",
        "the host should get this not the guest"
      );
    });
  });
};
