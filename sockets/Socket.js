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

    socket.on("joinRoom", roomId => {
      console.log("joining this room " + roomId);
      socket.join(roomId);
    });

    //this needs alot of its responsibilities moved, but it's tricky with how io works
  });
};
