const express = require("express");
const router = express.Router();
const db = require("./db/connection");

router.get("/", function(req, res) {
  res.render("register");
});

router.post("/", function(request, response) {
  db.any(
    `INSERT INTO users (username,password) VALUES ('${request.body.username}','${request.body.password}')`
  )
    .then(results => response.render("login"))
    .catch(error => {
      console.log(error);
    });
});
module.exports = router;
