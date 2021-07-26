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

// @route GET /user/:id
// @desc fetch user data
// @access Public
router.get('/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.userInfo.id === id) {
      const user = await User.findById(id);
      res.json(user);
    } else {
      res
        .status(401)
        .json({ msg: "You are not authorized to access this user's data" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
});

// @route GET /user/:id/contacts
// @desc get all the contacts for a given user's id
// access Private
router.get('/:id/contacts', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.userInfo.id === id) {
      const contacts = await User.find({ _id: id }).populate('friends');
      res.json(contacts);
    } else {
      res
        .status(401)
        .json({ msg: "You are not authorized to access this user's data" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
});

// @route GET /message/:id/conversations
// @desc fetch all conversations for a given user id
// access Private
router.get('/:id/conversations', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.userInfo.id === id) {
      const messages = await Message.find({
        $or: [{ sender: id }, { recipient: id }],
      })
        .populate('sender')
        .populate('recipient');
      res.json(messages);
    } else {
      res
        .status(401)
        .json({ msg: "You are not authorized to access this user's data" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
});

// @route POST /user/:id/searchemail
// @desc find users based on their email address
// access Private
router.post('/:id/searchemail', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.userInfo.id === id) {
      const { email } = req.body;
      if (email) {
        const matches = await User.find({
          $and: [{ email: { $regex: email } }, { _id: { $ne: id } }],
        });
        res.json(matches);
      }
    } else {
      res
        .status(401)
        .json({ msg: "You are not authorized to access this user's data" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
});

// @ /user/:id/updateprofile
// @desc update the user's profile
// access Private
router.post('/:id/updateprofile', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.userInfo.id === id) {
      const { password, language } = req.body;
      if (password !== '') {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.findOneAndUpdate(
          { _id: id },
          { password: hashedPassword, language },
          { new: true }
        );
        res.json(user);
      } else {
        const user = await User.findOneAndUpdate(
          { _id: id },
          { language },
          { new: true }
        );
        res.json(user);
      }
    } else {
      res
        .status(401)
        .json({ msg: "You are not authorized to access this user's data" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
});

// @route POST /user/:id/updateProfileImg
// @desc update the user's profile image
// access Private
router.post(
  '/:id/updateprofileimg',
  upload.single('file'),
  auth,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      if (req.userInfo.id === id) {
        await User.updateOne(
          {
            _id: id,
          },
          { image: req.file.path }
        );
        res.json(req.file);
      } else {
        res
          .status(401)
          .json({ msg: "You are not authorized to access this user's data" });
      }
    } catch (err) {
      console.error(err.message);
      res.status(404).send('404 Not Found');
    }
  }
);

module.exports = router;
