const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");

/* GET home page. */

router.get("/:id", isLoggedIn, function(request, response) {
  //id is just whatever it parses after /game_
  //params stores the id after game_
  //if we can get these we're golden
  const roomId = request.params["id"];
  const userId = request.user.id;

  console.log(userId + " joined " + roomId);

  response.render("game");
});

module.exports = router;
