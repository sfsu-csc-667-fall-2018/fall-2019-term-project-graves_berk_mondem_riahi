// const server = require("../bin/www");
const socketIO = require("socket.io");
const db = require("../routes/db/connection");
var session = require("express-session");
const app = require("../app");
const gamesRouter = require("../routes/games");

let sessionMiddleWare = session({
  secret: process.env.COOKIE_SECRET,
  resave: true,
  //this makes it so that the user stays logged in when refreshed, see why?
  saveUninitialized: true
});

module.exports = function (server) {
  const io = socketIO(server);
  app.set("io", io);

  // io.use(function(socket, next) {
  //   sessionMiddleWare(socket.request, socket.request.res, next);
  // });

  io.on("connection", socket => {
    //initialize the page with messages from chat

    db.any("SELECT message_text,time_stamp FROM messages WHERE room_id = 0", [
      true
    ])
      .then(function (data) {
        for (let i = 0; i < data.length; i++) {
          io.emit("chat message", data[i].message_text, data[i].time_stamp);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    //this should only be run if the room is the lobby
    //todo: figure out a way to get this in the routes
    db.any("SELECT room_name,password FROM rooms")
      .then(function (data) {
        for (let i = 0; i < data.length; i++) {
          io.emit("create room", data[i].room_name, data[i].password);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    require("./chatSocket")(socket, io);
    require("./roomsSocket")(socket, io);
    //this needs alot of its responsibilities moved, but it's tricky with how io works
  });
};
