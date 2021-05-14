const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/users")
const Invite = require('../models/invites')
const Message = require('../models/messages')
const dayjs = require('dayjs')

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

router.post("/user/:recipient/markread/:sender", async (req, res, next) => {
  const { recipient, sender } = req.params
  try {
    await Message.updateMany({ 
      $and: [
        { recipient: recipient},
        { sender: sender}
      ]
    }, { read: true})
  } catch (err) {
    console.error(err.message)
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
    }).populate('sender').populate('recipient')
    res.json(messages)
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

router.post("/user/:id/searchemail", async (req, res, next) => {
  try {
    const { id } = req.params
    if (req.body.email) {
      const matches = await User.find({
        $and: [
          { email: { $regex: req.body.email }},
          { _id: { $ne: id}}
        ]
      })
      res.json(matches)
    } 
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

router.post("/user/:id/sendinvite", async (req, res, next) => {
  try {
    const { id } = req.params
    console.log(req.body.contactId)
    const invite = new Invite({
      sender: id,
      recipient: req.body.contactId,
      sendDate: dayjs(),
      status: "pending"
    })
    await invite.save()
    res.json(invite)
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

router.post("/user/:id/ignoreinvite", async (req, res, next) => {
  try {
    const { id } = req.params
    await Invite.updateOne({
      sender: req.body.contactId,
      recipient: id
    }, { status: "declined" })
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

router.post("/user/:id/acceptinvite", async (req, res, next) => {
  try {
    const { id } = req.params
    const invite = await Invite.find({
      sender: req.body.contactId,
      recipient: id
    })
    await Invite.updateOne({
      sender: req.body.contactId,
      recipient: id
    }, { status: "accepted" })
    await User.findByIdAndUpdate({
      _id : id
    }, { $addToSet: { friends: req.body.contactId }})
    await User.findByIdAndUpdate({
      _id: req.body.contactId
    }, { $addToSet: { friends: id }})
    const newFriend = await User.find({ _id: req.body.contactId })
    res.json(newFriend)
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})


module.exports = router;
