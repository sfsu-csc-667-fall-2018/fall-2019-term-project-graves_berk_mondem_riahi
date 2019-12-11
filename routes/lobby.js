const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");
const db = require("./db/connection");

/* GET lobby page. */
router.get("/", isLoggedIn, function(request, response) {
  let io = request.app.get("io");

  console.log("Hello " + request.user.id);

  //guess this doesnt work because of synchronization, will have to look into fetch or something
  // db.any("SELECT message_text,time_stamp FROM messages WHERE room_id = 0", [
  //   true
  // ])
  //   .then(function(data) {
  //     // for (let i = 0; i < data.length; i++) {
  //     //   io.emit("chat message", data[i].message_text);
  //     // }

  //     io.emit("join lobby", data[2]);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   });

  response.render("lobby");
});

router.post("/chatMessage", function(request, response) {
  let io = request.app.get("io");
  db.any(
    `INSERT INTO messages (message_text,room_id,user_id) VALUES ('${request.body.message}',0,'${request.user.id}')`
  )
    .then(_ => {
      io.emit("chat message", request.body.message);
    })
    .catch(error => {
      console.log(error);
    });

  return;
});

router.post("/createRoom", function(request, response) {
  let io = request.app.get("io");
  //room id should not be specified here, need to figure out a good way to grab it as it auto increments or something
  db.any(
    `INSERT INTO rooms (room_id,room_name,password) VALUES ('${request.body.roomId}','${request.body.roomName}','${request.body.roomPassword}')`
  )
    .then(_ => {
      io.emit(
        "create room",
        request.body.roomName,
        request.body.roomId
        // request.body.roomPassword
      );
    })
    .catch(error => {
      console.log(error);
    });

  return;
});

module.exports = router;
