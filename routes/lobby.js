const express = require("express");
const router = express.Router();
const db = require("./db/index");


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("lobby");
});

//not sure why this should be "/"

//todo : pickup here
// router.post("", function (request, response) {
//   console.log("inserting into db");

// });


module.exports = router;
