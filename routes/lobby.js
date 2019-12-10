const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");
const db = require("./db/connection")
const app = require("../app")

/* GET lobby page. */
router.get("/", isLoggedIn, function (request, response) {
  response.render("lobby");
  db.any("SELECT message_text,time_stamp FROM messages WHERE room_id = 0", [
    true
  ])
    .then(function (data) {

      //console.log(request.app.get("io"));
      for (let i = 0; i < data.length; i++) {
        console.log("io emit")
        request.app.get("io").emit("chat message", data[i].message_text, data[i].time_stamp);
      }
    })

    .catch(function (error) {
      console.log(error);
    });
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
