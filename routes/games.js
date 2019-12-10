const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");

/* GET home page. */
router.get("/:id", isLoggedIn, function (request, response) {
  //id is just whatever it parses after /game_
  //params stores the id after game_
  const { id: roomId } = request.params;
  const { id: userId } = request.user;

  response.render("game");
});

module.exports = router;
