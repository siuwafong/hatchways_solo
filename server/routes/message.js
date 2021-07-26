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

router.post('/:recipient/markread/:sender', auth, async (req, res, next) => {
  const { recipient, sender } = req.params;
  try {
    if (req.userInfo.id === recipient) {
      await Message.updateMany(
        {
          $and: [{ recipient: recipient }, { sender: sender }],
        },
        { read: true }
      );
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

// @route GET /message/:id/conversations/all
// @desc fetch all conversations for a given user id
// access Private
router.get('/:id/conversations/all', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
});

module.exports = router;
