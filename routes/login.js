const express = require("express");
const router = express.Router();
const db = require("./db/index");

router.get("/", function (req, res) {
  res.render("login");
});

router.post("/", function (request, response) {
  db.any(
    `SELECT * FROM users WHERE users.username = '${request.body.username}' AND users.password = '${request.body.password}'`
  )
    .then(results => {
      if (results.length == 0) {
        response.json("REEE");
      } else {
        response.render("");
      }
    })
    .catch(error => {
      console.log(error);
      response.json({ error });
    });
});

module.exports = router;
