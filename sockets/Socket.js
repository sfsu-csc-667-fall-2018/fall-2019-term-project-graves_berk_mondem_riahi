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
    socket.on("createRoom", roomId => {
      socket.join(roomId, function() {
        console.log("user joined socket for room " + roomId);
        //socket.emit("test", roomId);
      });
    });

    socket.on("hostJoin", hostInfo => {
      socket.join(hostInfo["userId"] + hostInfo["roomId"], function() {
        console.log(
          "host joined socket for room " +
            hostInfo["roomId"] +
            " with userid " +
            hostInfo["playerId"]
        );
      });
    });

    // socket.on("deal", roomId => {
    //   console.log("dealing cards to some room " + roomId);
    // });
  });
};
