const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

//routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
//const databaseRouter = require("./routes/db/connection");
// const testsRouter = require("./routes/tests/index");
const registrerRouter = require("./routes/register");
const lobbyRouter = require("./routes/lobby");
const gamesRouter = require("./routes/games");
//Had it here, and it was set to undefined
const app = express();
const db = require("./routes/db/connection");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let sessionMiddleWare = session({
  secret: process.env.COOKIE_SECRET,
  resave: true,
  //this makes it so that the user stays logged in when refreshed, see why?
  saveUninitialized: true
});
//session stuff

app.use(sessionMiddleWare);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
// app.use("/tests", testsRouter);
app.use("/login", loginRouter);
app.use("/register", registrerRouter);
app.use("/lobby", lobbyRouter);
app.use("/games", gamesRouter);

//todo : why is this not working
db.any("SELECT room_id FROM rooms")
  .then(function(data) {
    for (let i = 0; i < data.length; i++) {
      // app.get("/games" + data[i].room_id, function(request, response) {
      //   console.log("game" + data[i].room_id);
      //   response.render("game" + data[i].room_id);
      // });
      let gRoute = "/games" + data[i].room_id;
      app.use(gRoute, gamesRouter);
    }
  })
  .catch(function(error) {
    console.log("oh no");
  });

app.get("/games2", function(request, response) {
  response.render("game");
});

//get all the games from the list of game rooms, needs to be updated somehow (maybe via a socket?)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
//tes
