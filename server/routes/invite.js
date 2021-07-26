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

// @route GET /invite/:id/all
// @desc get all invitations for a user given their id
// access Private
router.get('/:id/invitations', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.userInfo.id === id) {
      const receivedInvites = await Invite.find({ recipient: id }).populate(
        'sender'
      );
      const sentInvites = await Invite.find({ sender: id }).populate(
        'recipient'
      );
      const allInvites = receivedInvites.concat(sentInvites);
      res.json(allInvites);
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

// @route POST /invite/:id/send
// @desc send an invite to an existing user
// access Private
router.post('/:id/send', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.userInfo.id === id) {
      const { contactId } = req.body;
      const existingInvite = await Invite.find({
        $and: [{ sender: id }, { recipient: contactId }],
      });
      if (existingInvite.length === 0) {
        const invite = new Invite({
          sender: id,
          recipient: contactId,
          sendDate: dayjs(),
          status: 'pending',
        });
        await invite.save();
        res.json(invite);
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

// @route POST /invite/:id/reject
// @desc reject an invite sent by another user
// access Private
router.post('/:id/reject', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.userInfo.id === id) {
      const { contactId } = req.body;
      await Invite.updateOne(
        {
          sender: contactId,
          recipient: id,
        },
        { status: 'declined' }
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

// @route POST /invite/:id/approve
// @desc accept an invitation from another user
// access Private
router.post('/:id/approve', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.userInfo.id === id) {
      const { contactId } = req.body;
      await Invite.updateOne(
        {
          sender: contactId,
          recipient: id,
        },
        { status: 'accepted' }
      );
      await User.findByIdAndUpdate(
        {
          _id: id,
        },
        { $addToSet: { friends: contactId } }
      );
      await User.findByIdAndUpdate(
        {
          _id: contactId,
        },
        { $addToSet: { friends: id } }
      );
      const newFriend = await User.find({ _id: contactId });
      res.json(newFriend);
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

// @route POST /invite/:id/email
// @desc invite someone who is not a user to sign up
// acccess Private
router.post('/:id/email', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.userInfo.id === id) {
      const user = await User.findOne({ _id: id });
      const msg = {
        to: req.body,
        from: 'wilsonfong1002@outlook.com',
        subject: `${user.name} invites you to join LangExchange!`,
        text: `${user.name} has sent you an invite. Sign up now for LangExchange and start chatting with other people in other languages!`,
        html: `<strong>
              ${user.name} has sent you an invite.
            </strong> 
            <p>
              Sign up now for LangExchange and start chatting with other people in other languages!
            <p>
            <a href="http://${URL}/login/${user._id}> 
                Sign up 
            </a>
            `,
      };
      sgMail.send(msg).catch((error) => {
        console.error(error);
      });
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

module.exports = router;
