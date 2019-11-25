const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("lobby");
});

//not sure why this should be "/"

//todo : pickup here
router.post("", function (request, response) {
  console.log("inserting into db");
  db.any(
    `INSERT INTO messages VALUES (0,0,0,0)`
  )
    .then($('#messages').append($('<li>').text(request.body.message)))
    .catch(error => {
      console.log(error);
      response.json({ error });
    });
});


module.exports = router;
