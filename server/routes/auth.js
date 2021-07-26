const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Invite = require('../models/invites');
const Message = require('../models/messages');
const dayjs = require('dayjs');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const {
  validateUser,
  validateMessage,
  validateInvite,
  testObject,
  requireLogin,
  auth,
  generateToken,
} = require('../middleware');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const URL = 'localhost:3000';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @route /auth/createaccount
// @desc create a new account
// access public
router.post('/createaccount', validateUser, async (req, res, next) => {
  try {
    const { name, email, password, referral } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const existingUsers = await User.find({
      $or: [{ name: name }, { email: email }],
    });
    if (existingUsers.length === 0) {
      const newUser = await new User({
        name,
        email,
        password: hashedPassword,
        status: 'Online',
        language: 'English',
        image:
          'https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620268656/hatchways/dummy_z3twvc.png',
      });
      await newUser.save();
      const newUserData = {
        _id: newUser._id,
        referral: referral,
        newUser: true,
      };
      jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token, newUserData });
        }
      );
    } else {
      if (existingUsers.length === 2) {
        res.json({
          errorMsg: 'There are already users with the same email and username',
        });
      } else if (
        existingUsers[0].email === email &&
        existingUsers[0].name === name
      ) {
        res.json({
          errorMsg:
            'There already exists a user with the same email and username',
        });
      } else if (existingUsers[0].email === email) {
        res.json({
          errorMsg: 'There already exists a user with the same email',
        });
      } else if (existingUsers[0].name === name) {
        res.json({
          errorMsg: 'There already exists a user with the same username',
        });
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
});

// @route /auth/login
// @desc login an existing user
// access Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    const validUser = await bcrypt.compare(password, user.password);
    if (validUser) {
      await generateToken(res, user._id);
      res.json({
        _id: user._id,
        newUser: false,
      });
    } else {
      res.json({ errorMsg: 'Incorrect username or password' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
});

// @route /auth/logout
// @desc logout an existing user
// access Public
router.post('/logout', async (req, res, next) => {
  try {
    res.clearCookie('token', { path: '/' });
    res.json({ logout: true });
  } catch {
    console.log('error');
  }
});

// @route /auth/notauthed
// @desc error message for accessing unauthorized routes
// access Public
router.post('/notauthed', (req, res, next) => {
  console.log('not authorized!');
  res.status(403).send('Not Authorized. Please log in first');
});

module.exports = router;
