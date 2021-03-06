var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const config = require("config");
const { default: mongoose } = require("mongoose");
const BodyParser = require("body-parser");
const fileUpload = require("express-fileupload");



var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var pictureRouter = require("./routes/api/picture");

var app = express();

const expressBusboy = require("express-busboy");
expressBusboy.extend(app);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload()); 
app.use(BodyParser.urlencoded({ extended: true }));
// app.use(BodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/picture", pictureRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose
  .connect(config.get("db"))
  .then(() => {
    console.log("Connection Established With MongoDb");
  })
  .catch((err) => {
    console.log(`Connection to Db Failed,${err}`);
  });
module.exports = app;
