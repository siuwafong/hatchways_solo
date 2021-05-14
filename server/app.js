const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const multer = require('multer')

const { userSchema, messageSchema, inviteSchema } = require('./schemas.js')
require("dotenv").config()

mongoose.connect(`mongodb+srv://wf1234:${process.env.DB_PASS}@cluster0.fk4em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
.then((res) => console.log("connected to db"))
.catch((err) => console.log(err))


const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");

const { json, urlencoded } = express;

var app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

// prevent CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
  next();
})

app.use("/", indexRouter);
app.use("/ping", pingRouter);



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
  res.json({ error: err });
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body)
  if (error) {
      console.log(error)
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next()
  }
}

const validateMessage = (req, res, next) => {
  const { error } = messageSchema.validate(req.body)
  if (error) {
      console.log(error)
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next()
  }
}

const validateInvite = (req, res, next) => {
  const { error } = inviteSchema.validate(req.body)
  if (error) {
      console.log(error)
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next()
  }
}


module.exports = app;
