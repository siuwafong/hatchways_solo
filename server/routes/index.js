const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = require("../models/users")
const Invite = require("../models/invites")
const Message = require("../models/messages")
const dayjs = require("dayjs")
const multer = require("multer")
const { storage } = require("../cloudinary")
const upload = multer({ storage })
const { validateUser, validateMessage, validateInvite, testObject, requireLogin, auth } = require("../middleware")
require("dotenv").config()
const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const URL = "localhost:3000"
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.get("/welcome", function (req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" })
})

// get user based on id
router.get("/user/:id", auth, async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(404).send("404 Not Found")
  }
})

router.get("/user/:id/invitations", auth, async (req, res, next) => {
  const { id } = req.params
  try {
    const receivedInvites = await Invite.find({ recipient: id }).populate(
      "sender"
    )
    const sentInvites = await Invite.find({ sender: id }).populate("recipient")
    const allInvites = receivedInvites.concat(sentInvites)
    res.json(allInvites)
  } catch (err) {
    console.error(err.message)
    res.status(404).send("404 Not Found")
  }
})

router.get("/user/:id/contacts", auth, async (req, res, next) => {
  const { id } = req.params
  try {
    const contacts = await User.find({ _id: id }).populate("friends")
    res.json(contacts)
  } catch (err) {
    console.error(err.message)
    res.status(404).send("404 Not Found")
  }
})

router.post("/user/:recipient/markread/:sender", auth, async (req, res, next) => {
  const { recipient, sender } = req.params
  try {
    await Message.updateMany(
      {
        $and: [{ recipient: recipient }, { sender: sender }],
      },
      { read: true }
    )
  } catch (err) {
    console.error(err.message)
    res.status(404).send("404 Not Found")
  }
})

router.get("/user/:id/conversations", auth, async (req, res, next) => {
  const { id } = req.params
  try {
    const messages = await Message.find({
      $or: [{ sender: id }, { recipient: id }],
    })
      .populate("sender")
      .populate("recipient")
    res.json(messages)
  } catch (err) {
    console.error(err.message)
    res.status(404).send("404 Not Found")
  }
})

router.post("/user/:id/searchemail", auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { email } = req.body
    if (email) {
      const matches = await User.find({
        $and: [{ email: { $regex: email } }, { _id: { $ne: id } }],
      })
      res.json(matches)
    }
  } catch (err) {
    console.error(err.message)
    res.status(404).send("404 Not Found")
  }
})

router.post("/invite/:id/send", auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { contactId } = req.body
    const existingInvite = await Invite.find({
      $and: [
        {sender: id},
        {recipient: contactId}
      ]
    })
    if (existingInvite.length === 0) {
      const invite = new Invite({
        sender: id,
        recipient: contactId,
        sendDate: dayjs(),
        status: "pending",
      })
      await invite.save()
      res.json(invite)
    }
  } catch (err) {
    console.error(err.message)
    res.status(404).send("404 Not Found")
  }
})

router.post("/invite/:id/reject", auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { contactId } = req.body
    await Invite.updateOne(
      {
        sender: contactId,
        recipient: id,
      },
      { status: "declined" }
    )
  } catch (err) {
    console.error(err.message)
    res.status(404).send("404 Not Found")
  }
})

router.post("/invite/:id/approve", auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { contactId } = req.body
    await Invite.updateOne(
      {
        sender: contactId,
        recipient: id,
      },
      { status: "accepted" }
    )
    await User.findByIdAndUpdate(
      {
        _id: id,
      },
      { $addToSet: { friends: contactId } }
    )
    await User.findByIdAndUpdate(
      {
        _id: contactId,
      },
      { $addToSet: { friends: id } }
    )
    const newFriend = await User.find({ _id: contactId })
    res.json(newFriend)
  } catch (err) {
    console.error(err.message)
    res.status(404).send("404 Not Found")
  }
})

router.post("/user/:id/updateprofile", auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { password, language } = req.body
    if (password !== "") {
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = await User.findOneAndUpdate({ _id: id }, { password: hashedPassword, language}, { new: true})
      res.json(user)
    } else {
      const user = await User.findOneAndUpdate({ _id: id }, {language}, { new: true})
      res.json(user)
    }
  } catch (err) {
    console.error(err.message)
    res.status(404).send("404 Not Found")
  }
})

router.post(
  "/user/:id/updateprofileimg",
  upload.single("file"),
  auth, 
  async (req, res, next) => {
    try {
      const { id } = req.params
      await User.updateOne(
        {
          _id: id,
        },
        { image: req.file.path }
      )
      res.json(req.file)
    } catch (err) {
      console.error(err.message)
      res.status(404).send("404 Not Found")
    }
  }
)

router.post("/invite/:id/email", auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findOne({_id: id})
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
            <a href="http://${URL}/login/${user._id}> 
                Sign up 
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

router.post("/createaccount", validateUser, async (req, res, next) => {
  try {
    const { name, email, password, referral } = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    const existingUsers = await User.find({
      $or: [
        { name: name},
        { email: email}
      ]
    })
    if (existingUsers.length === 0) {
      const newUser = await new User ({
        name,
        email,
        password: hashedPassword,
        status: "Online",
        language: "English",
        image: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620268656/hatchways/dummy_z3twvc.png"
      })
      await newUser.save()
      const newUserData = {
        _id: newUser._id,
        referral: referral,
        newUser: true
      }      
      jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token, newUserData })
        }
      )
      // res.json({ newUserData })
    } else {
      if (existingUsers.length === 2) {
        res.json({errorMsg: "There are already users with the same email and username"})
      } else if (existingUsers[0].email === email && existingUsers[0].name === name) {
        res.json({errorMsg: "There already exists a user with the same email and username"})
      } else if (existingUsers[0].email === email) {
        res.json({errorMsg: "There already exists a user with the same email"})
      } else if (existingUsers[0].name === name) {
        res.json({errorMsg: "There already exists a user with the same username"})
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    const validUser = await bcrypt.compare(password, user.password)

    if (validUser) {
      jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: 3600 * 24 * 7 },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            _id: user._id,
            newUser: false,
            token
           })
        }
      )
      
    } else {
      res.json({errorMsg: "Incorrect username or password"})
    }
  } catch (err) {    
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

router.post("/logout", async (req, res, next) => {
  try {
    res.json({ logout: true })
  } catch (err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

router.post("/notauthed",  (req, res, next) => {
  console.log("not authorized!")
  res.status(403).send("Not Authorized. Please log in first")
})
module.exports = router
