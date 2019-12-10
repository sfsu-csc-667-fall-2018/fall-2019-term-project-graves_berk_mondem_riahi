const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");
const db = require("./db/connection");
const app = require("../app");

/* GET lobby page. */
router.get("/", isLoggedIn, function(request, response) {
  let io = request.app.get("io");

  console.log("Hello " + request.user.id);

  //no fucking idea why this wont work, tried alot of stuff

  // messages = db
  //   .any("SELECT * FROM messages WHERE room_id = 0", [true])
  //   .then(function(data) {
  //
  //     //console.log(request.app.get("io"));
  //     // let messages = [];
  //     for (let i = 0; i < data.length; i++) {
  //       //console.log(data[i].message_text);
  //       //io.emit("chat message", data[i].message_text);
  //       //messages.push(data[i].message_text);
  //     }
  //     //response.json(messages);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   });

  // db.any("SELECT * FROM rooms").then(rooms =>
  //   io.emit("create room", rooms, rooms[1].password)
  // );

  response.render("lobby");
});

router.post("/chatMessage", function(request, response) {
  let io = request.app.get("io");
  db.any(
    `INSERT INTO messages (message_text,room_id,user_id) VALUES ('${request.body.message}',0,'${request.user.id}')`
  ).catch(error => {
    console.log(error);
  });
  io.emit("chat message", request.body.message);
  return;
});

router.post("/createRoom", function(request, response) {
  let io = request.app.get("io");
  db.any(
    `INSERT INTO rooms (room_name,password) VALUES ('${request.body.roomName}','${request.body.roomPassword}')`
  ).catch(error => {
    console.log(error);
  });
  io.emit("create room", request.body.roomName, request.body.roomPassword);

  return;
});

module.exports = router;
