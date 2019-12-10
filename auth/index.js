const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const databaseRouter = require("../routes/db/connection");
const User = require("../db/users/index");

//stores the variables into the session
passport.serializeUser((user, done) => {
  //this is where you add the info to the session
  done(null, user.username);
});

//gets the id back as a variable from the session
passport.deserializeUser((username, done) => {
  User.findByUserName(username).then(({ username }) =>
    done(null, { username })
  );
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    //update this to grab the user_id as well
    databaseRouter
      .one(
        `SELECT * FROM users WHERE users.username = '${username}' AND users.password = '${password}'`
      )
      .then(results => {
        if (results.length == 0) {
          return done(null, false);
        } else {
          return done(null, { username: username });
        }
      })
      .catch(error => {
        console.log(error);
        return done(null, false);
      });
  })
);

module.exports = passport;
