const express = require("express");
const router = express.Router();
const passport = require("../auth");

router.get("/", function (req, res) {
  res.render("login");
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/lobby"
  })
);

module.exports = router;
