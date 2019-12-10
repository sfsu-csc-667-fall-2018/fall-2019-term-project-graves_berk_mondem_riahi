const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");

/* GET home page. */
router.get("/", isLoggedIn, function (request, response) {


  response.render("lobby", { username: request.user.password });
});

module.exports = router;
