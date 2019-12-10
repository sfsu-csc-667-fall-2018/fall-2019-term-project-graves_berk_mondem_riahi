const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");
const db = require("./db/connection");
const app = require("../app");

/* GET lobby page. */
router.get("/", isLoggedIn, function(request, response) {
  let io = request.app.get("io");
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

// router.post("/", function (request, response) {
//   db.any(
//     `INSERT INTO users (username,password) VALUES ('${request.body.username}','${request.body.password}')`
//   )
//     // .then(_ => db.any(`SELECT username,password FROM users`))
//     .then(results => response.render("login"))
//     .catch(error => {
//       console.log(error);
//       // response.json({ error });
//     });
// });

module.exports = router;
