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
const registrerRouter = require("./routes/register");
const lobbyRouter = require("./routes/lobby");
const gamesRouter = require("./routes/games");
const app = express();
const db = require("./routes/db/connection");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//session stuff
let sessionMiddleWare = session({
  secret: process.env.COOKIE_SECRET,
  resave: true,
  //this makes it so that the user stays logged in when refreshed, see why?
  saveUninitialized: true
});

app.use(sessionMiddleWare);

//initializing passport for auth
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/register", registrerRouter);
app.use("/lobby", lobbyRouter);
app.use("/games", gamesRouter);

//game room routing
// app.get("/game*", function (request, response) {
//   let roomNum = request.url.slice(5);
//   let query = "SELECT * FROM rooms WHERE room_id = " + roomNum;
//   db.one(query, [true])
//     .then(function (data) {
//       response.render("game");
//     })
//     .catch(function (error) {
//       response.render("lobby");
//     });
// });

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
