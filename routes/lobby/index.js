const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("lobby");
});

router.post("/", function(request, response) {
  console.log(request.body.message);
});

module.exports = router;
