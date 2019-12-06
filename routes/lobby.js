const express = require("express");
const router = express.Router();
const db = require("./db/connection");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("lobby");
});

module.exports = router;
