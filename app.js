const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const session = require("express-session");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

//routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const databaseRouter = require("./routes/db/connection");
// const testsRouter = require("./routes/tests/index");
const registrerRouter = require("./routes/register");
const lobbyRouter = require("./routes/lobby");
//Had it here, and it was set to undefined
const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//session stuff
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
// app.use("/tests", testsRouter);
app.use("/login", loginRouter);
app.use("/register", registrerRouter);
app.use("/lobby", lobbyRouter);

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

//passport stuff
//passport

//todo: look at managing a logged in state for the user
// passport.serializeUser(function(username, done) {
//   done(null, username);
// });

module.exports = app;
//tes
