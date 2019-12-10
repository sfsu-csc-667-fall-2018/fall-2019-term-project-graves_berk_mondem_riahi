const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");
const db = require("./db/connection");

/* GET home page. */

router.get("/:id", isLoggedIn, function(request, response) {
  //id is just whatever it parses after /game_
  //params stores the id after game_
  //if we can get these we're golden
  const roomId = request.params["id"];
  const userId = request.user.id;

  //check if the user is supposed to be in the lobby, or if it has two users already
  db.one("SELECT * FROM rooms WHERE room_id = $1", request.params["id"])
    .then(_ => {
      console.log(userId + " joined " + roomId);
      response.render("game");
    })
    .catch(error => {
      response.render("lobby");
    });
});

module.exports = router;
