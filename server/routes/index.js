const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/users")
const Invite = require('../models/invites')
const Message = require('../models/messages')

router.get("/welcome", function (req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
});


router.get("/user/:id/invitations", async (req, res, next) => {
  const { id } = req.params
  try {
    const receivedInvites = await Invite.find({recipient: id}).populate('sender')
    const sentInvites = await Invite.find({sender: id}).populate('recipient')
    const allInvites = receivedInvites.concat(sentInvites)
    res.json(allInvites)
  } catch(err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

router.get("/user/:id/contacts", async (req, res, next) => {
  const { id } = req.params
  try {
    const contacts = await User.find({_id: id}).populate('friends')
    res.json(contacts)
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

router.get("/user/:id/conversations", async (req, res, next) => {
  const { id } = req.params
  try {
    const messages = await Message.find({
      $or: [
        { sender: id},
        { recipient: id }
      ]
    })
    res.json(messages)
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

module.exports = router;
