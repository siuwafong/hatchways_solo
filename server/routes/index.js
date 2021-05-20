const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/users")
const Invite = require('../models/invites')
const Message = require('../models/messages')
const dayjs = require("dayjs")
const multer = require("multer")
const {storage} = require('../cloudinary')
const upload = multer({ storage })
require("dotenv").config()
const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.get("/welcome", function (req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
});

router.get("/user/:id", async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    res.json(user)
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

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

router.post("/invite/:id/send", async (req, res, next) => {
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

router.post("/invite/:id/reject", async (req, res, next) => {
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

router.post("/invite/:id/approve", async (req, res, next) => {
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

router.post("/user/:id/updateprofile", async (req, res, next) => {
  console.log(req.body)
  try {
    const { id } = req.params
    if (req.body.password) {
      await User.updateOne({
        _id: id
      }, { password: req.body.password})
    }
    if (req.body.language) {
      await User.updateOne({
        _id: id
      }, { language: req.body.language})
    }
    const user = await User.find({_id: id})
    res.json(user)
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

router.post("/user/:id/updateprofileimg", upload.single("file"), async (req, res, next) => {
    try {
      const { id } = req.params
      await User.updateOne({
        _id: id
      }, { image: req.file.path })
      res.json(req.file)
    } catch (err) {
      console.error(err.message);
      res.status(404).send('404 Not Found');
    }
})

router.post("/invite/:id/email", async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findOne({_id: id})
    console.log(user.name)
    const msg = {
      to: req.body,
      from: "wilsonfong82@gmail.com",
      subject: `${user.name} invites you to join LangExchange!`,
      text: `${user.name} has sent you an invite. Sign up now for LangExchange and start chatting with other people in other languages!`,
      html: `<strong>
              ${user.name} has sent you an invite.
            </strong> 
            <p>
              Sign up now for LangExchange and start chatting with other people in other languages!
            <p>
            <a href=""> 
              <buttton> 
                Sign up 
              </button>
            </a>
            `
    }

    sgMail.send(msg)  
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => {
      console.error(error)
    })
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})


module.exports = router;

