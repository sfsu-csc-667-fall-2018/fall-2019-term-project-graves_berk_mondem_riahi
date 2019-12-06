const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");

/* GET home page. */
router.get("/", isLoggedIn, function(_, response) {
  response.render("lobby", { title: "Gin Rummy" });
});

module.exports = router;
