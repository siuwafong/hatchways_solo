const createError = require('http-errors');
const express = require('express');
const { join } = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('passport');
const cors = require('cors');

const connectDB = async () => {
  const conn = await mongoose.connect(
    `mongodb+srv://wf1234:${process.env.DB_PASS}@cluster0.ocsn5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  );
  console.log(`connected to db - ${conn.connection.host}`);
};

connectDB();

// connect to MongoDB
// mongoose
//   .connect(
//     `mongodb+srv://wf1234:${process.env.DB_PASS}@cluster0.fk4em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
//     {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//       useFindAndModify: false,
//     }
//   )
//   .then((res) => console.log('connected to db'))
//   .catch((err) => console.error(err));

// Set up router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const inviteRouter = require('./routes/invite');
const messageRouter = require('./routes/message');
const pingRouter = require('./routes/ping');

const { json, urlencoded } = express;

var app = express();
app.use(cookieParser());
// prevent CORS error
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/message', messageRouter);
app.use('/invite', inviteRouter);
app.use('/user', userRouter);
app.use('/ping', pingRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
