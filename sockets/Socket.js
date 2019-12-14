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
    let newRoom;

    testNs = io.of("/-671352827");
    testNs.on("connection", socket => {
      console.log("test ns");
    });

    //create a new namespace for a new room when someone creates the room
    socket.on("createRoom", roomId => {
      console.log("creating new namespace " + roomId);
      newRoom = io.of("/" + roomId);
      newRoom.emit("test", "hello");

      newRoom.on("connection", socket => {
        console.log("someone connected to new room");
      });
    });

    //this needs alot of its responsibilities moved, but it's tricky with how io works
  });
};
