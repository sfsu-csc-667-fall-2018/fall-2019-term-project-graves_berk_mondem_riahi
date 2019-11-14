const express = require("express");
const router = express.Router();
const server = require("http").Server(express);
const io = require("socket.io")(server);

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

io.on("connection", function(socket) {
  console.log("a user connected");
});

module.exports = router;
