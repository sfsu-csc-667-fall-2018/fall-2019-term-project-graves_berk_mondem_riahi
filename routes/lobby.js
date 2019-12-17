const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");
const db = require("./db/connection");

//get all the active games for fetching

router.get("/getMessages", isLoggedIn, function(request, response) {
  db.any("SELECT message_text,time_stamp FROM messages WHERE room_id = 0", [
    true
  ])
    .then(function(data) {
      response.json(data);
    })
    .catch(function(error) {
      console.log(error);
    });
});

router.get("/getRooms", isLoggedIn, function(request, response) {
  db.any("SELECT * FROM rooms WHERE room_id $= 0")
    .then(function(data) {
      response.json(data);
    })
    .catch(function(error) {
      console.log(error);
    });
});

/* GET lobby page. */
router.get("/", isLoggedIn, function(request, response) {
  let io = request.app.get("io");

  response.render("lobby", { test: "tes" });
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

  // hash the room name and password to build a room ID.
  // this is the javascript implementation of the javas string hashcode method
  let hashString = request.body.roomName + request.body.roomPassword;
  let hash = 0,
    index,
    chr;
  if (!(hashString.length === 0)) {
    for (index = 0; index < hashString.length; index++) {
      chr = hashString.charCodeAt(index);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // convert to 32 bit int because that's what postgres can store
    }
    hash = Math.abs(hash);
  }
  db.any(
    `INSERT INTO rooms (room_id,room_name,password) VALUES ('${hash}','${request.body.roomName}','${request.body.roomPassword}')`
  )
    .then(_ => {
      io.emit(
        "create room",
        request.body.roomName,
        hash
        // request.body.roomPassword
      );

      response.redirect("/games/" + hash);
    })
    .catch(error => {
      console.log(error);
    });

  return;
});

module.exports = router;
