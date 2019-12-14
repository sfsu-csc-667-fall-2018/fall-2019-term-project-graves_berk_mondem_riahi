// const server = require("../bin/www");
const socketIO = require("socket.io");
const db = require("../routes/db/connection");
const app = require("../app");

module.exports = function(server) {
  //double check this is working later
  const io = socketIO(server);
  app.set("io", io);

  io.on("test", blarf => {
    console.log("global io recieved test");
  });

  io.on("connection", socket => {
    //initialize the page with messages from chat

    //this should only be run if the room is the lobby
    //todo: figure out a way to get this in the route

    console.log("connected");
    let newRoom;

    //create a new namespace for a new room when someone creates the room
    socket.on("createRoom", roomId => {
      // newRoom = io.of("/" + roomId);

      //newRoom.emit("test", "hello");

      socket.join(roomId, function() {
        console.log("joined room " + roomId);
        socket.emit("test", roomId);
      });

      // socket.on("connection", socket => {
      //   console.log("someone connected to new room");
      // });

      //figure out how to join this dynamically

      // testNs = io.of("/" + roomId);

      // testNs.on("connection", socket => {
      //   console.log("test ns");
      //   //socket.emit("test", "dumb room");
      // });
    });

    //this needs alot of its responsibilities moved, but it's tricky with how io works
  });
};
