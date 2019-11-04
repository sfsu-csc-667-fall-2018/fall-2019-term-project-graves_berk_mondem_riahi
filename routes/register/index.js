const express = require("express");
const router = express.Router();
const db = require("../db/index");

router.get("/", function(req, res) {
  res.render("register");
});

//not sure why this should be "/"
router.post("/", function(request, response) {
  console.log("registration request recieved");
  console.log(request.body.username);
  console.log(request.body.password);

  db.any(`INSERT INTO users ("username") VALUES ('${request.body.username}')`)
    .then(_ => db.any(`SELECT username FROM users`))
    .then(results => response.json(results))
    .catch(error => {
      console.log(error);
      response.json({ error });
    });
});
module.exports = router;
