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
// router.get('/user/:id', auth, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (req.userInfo.id === id) {
//       const user = await User.findById(id);
//       res.json(user);
//     } else {
//       res
//         .status(401)
//         .json({ msg: "You are not authorized to access this user's data" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route GET /invite/:id/all
// @desc get all invitations for a user given their id
// access Private
// router.get('/user/:id/invitations', auth, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (req.userInfo.id === id) {
//       const receivedInvites = await Invite.find({ recipient: id }).populate(
//         'sender'
//       );
//       const sentInvites = await Invite.find({ sender: id }).populate(
//         'recipient'
//       );
//       const allInvites = receivedInvites.concat(sentInvites);
//       res.json(allInvites);
//     } else {
//       res
//         .status(401)
//         .json({ msg: "You are not authorized to access this user's data" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route GET /user/:id/contacts
// @desc get all the contacts for a given user's id
// access Private
// router.get('/user/:id/contacts', auth, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (req.userInfo.id === id) {
//       const contacts = await User.find({ _id: id }).populate('friends');
//       res.json(contacts);
//     } else {
//       res
//         .status(401)
//         .json({ msg: "You are not authorized to access this user's data" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route POST /message/:recipient/markread/:sender
// @desc mark a message as read
// access Private
// router.post(
//   '/user/:recipient/markread/:sender',
//   auth,
//   async (req, res, next) => {
//     const { recipient, sender } = req.params;
//     try {
//       if (req.userInfo.id === recipient) {
//         await Message.updateMany(
//           {
//             $and: [{ recipient: recipient }, { sender: sender }],
//           },
//           { read: true }
//         );
//       } else {
//         res
//           .status(401)
//           .json({ msg: "You are not authorized to access this user's data" });
//       }
//     } catch (err) {
//       console.error(err.message);
//       res.status(404).send('404 Not Found');
//     }
//   }
// );

// @route GET /message/:id/conversations
// @desc fetch all conversations for a given user id
// access Private
// router.get('/user/:id/conversations', auth, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (req.userInfo.id === id) {
//       const messages = await Message.find({
//         $or: [{ sender: id }, { recipient: id }],
//       })
//         .populate('sender')
//         .populate('recipient');
//       res.json(messages);
//     } else {
//       res
//         .status(401)
//         .json({ msg: "You are not authorized to access this user's data" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route POST /user/:id/searchemail
// @desc find users based on their email address
// access Private
// router.post('/user/:id/searchemail', auth, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (req.userInfo.id === id) {
//       const { email } = req.body;
//       if (email) {
//         const matches = await User.find({
//           $and: [{ email: { $regex: email } }, { _id: { $ne: id } }],
//         });
//         res.json(matches);
//       }
//     } else {
//       res
//         .status(401)
//         .json({ msg: "You are not authorized to access this user's data" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route POST /invite/:id/send
// @desc send an invite to an existing user
// access Private
// router.post('/invite/:id/send', auth, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (req.userInfo.id === id) {
//       const { contactId } = req.body;
//       const existingInvite = await Invite.find({
//         $and: [{ sender: id }, { recipient: contactId }],
//       });
//       if (existingInvite.length === 0) {
//         const invite = new Invite({
//           sender: id,
//           recipient: contactId,
//           sendDate: dayjs(),
//           status: 'pending',
//         });
//         await invite.save();
//         res.json(invite);
//       }
//     } else {
//       res
//         .status(401)
//         .json({ msg: "You are not authorized to access this user's data" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route POST /invite/:id/reject
// @desc reject an invite sent by another user
// access Private
// router.post('/invite/:id/reject', auth, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (req.userInfo.id === id) {
//       const { contactId } = req.body;
//       await Invite.updateOne(
//         {
//           sender: contactId,
//           recipient: id,
//         },
//         { status: 'declined' }
//       );
//     } else {
//       res
//         .status(401)
//         .json({ msg: "You are not authorized to access this user's data" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route POST /invite/:id/approve
// @desc accept an invitation from another user
// access Private
// router.post('/invite/:id/approve', auth, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (req.userInfo.id === id) {
//       const { contactId } = req.body;
//       await Invite.updateOne(
//         {
//           sender: contactId,
//           recipient: id,
//         },
//         { status: 'accepted' }
//       );
//       await User.findByIdAndUpdate(
//         {
//           _id: id,
//         },
//         { $addToSet: { friends: contactId } }
//       );
//       await User.findByIdAndUpdate(
//         {
//           _id: contactId,
//         },
//         { $addToSet: { friends: id } }
//       );
//       const newFriend = await User.find({ _id: contactId });
//       res.json(newFriend);
//     } else {
//       res
//         .status(401)
//         .json({ msg: "You are not authorized to access this user's data" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @ /user/:id/updateprofile
// @desc update the user's profile
// access Private
// router.post('/user/:id/updateprofile', auth, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (req.userInfo.id === id) {
//       const { password, language } = req.body;
//       if (password !== '') {
//         const hashedPassword = await bcrypt.hash(password, 12);
//         const user = await User.findOneAndUpdate(
//           { _id: id },
//           { password: hashedPassword, language },
//           { new: true }
//         );
//         res.json(user);
//       } else {
//         const user = await User.findOneAndUpdate(
//           { _id: id },
//           { language },
//           { new: true }
//         );
//         res.json(user);
//       }
//     } else {
//       res
//         .status(401)
//         .json({ msg: "You are not authorized to access this user's data" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route POST /user/:id/updateProfileImg
// @desc update the user's profile image
// access Private
// router.post(
//   '/user/:id/updateprofileimg',
//   upload.single('file'),
//   auth,
//   async (req, res, next) => {
//     const { id } = req.params;
//     try {
//       if (req.userInfo.id === id) {
//         await User.updateOne(
//           {
//             _id: id,
//           },
//           { image: req.file.path }
//         );
//         res.json(req.file);
//       } else {
//         res
//           .status(401)
//           .json({ msg: "You are not authorized to access this user's data" });
//       }
//     } catch (err) {
//       console.error(err.message);
//       res.status(404).send('404 Not Found');
//     }
//   }
// );

// @route POST /invite/:id/email
// @desc invite someone who is not a user to sign up
// acccess Private
// router.post('/invite/:id/email', auth, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (req.userInfo.id === id) {
//       const user = await User.findOne({ _id: id });
//       const msg = {
//         to: req.body,
//         from: 'wilsonfong1002@outlook.com',
//         subject: `${user.name} invites you to join LangExchange!`,
//         text: `${user.name} has sent you an invite. Sign up now for LangExchange and start chatting with other people in other languages!`,
//         html: `<strong>
//               ${user.name} has sent you an invite.
//             </strong>
//             <p>
//               Sign up now for LangExchange and start chatting with other people in other languages!
//             <p>
//             <a href="http://${URL}/login/${user._id}>
//                 Sign up
//             </a>
//             `,
//       };
//       sgMail.send(msg).catch((error) => {
//         console.error(error);
//       });
//     } else {
//       res
//         .status(401)
//         .json({ msg: "You are not authorized to access this user's data" });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route /auth/createaccount
// @desc create a new account
// access public
// router.post('/createaccount', validateUser, async (req, res, next) => {
//   try {
//     const { name, email, password, referral } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const existingUsers = await User.find({
//       $or: [{ name: name }, { email: email }],
//     });
//     if (existingUsers.length === 0) {
//       const newUser = await new User({
//         name,
//         email,
//         password: hashedPassword,
//         status: 'Online',
//         language: 'English',
//         image:
//           'https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620268656/hatchways/dummy_z3twvc.png',
//       });
//       await newUser.save();
//       const newUserData = {
//         _id: newUser._id,
//         referral: referral,
//         newUser: true,
//       };
//       jwt.sign(
//         { id: newUser._id },
//         process.env.JWT_SECRET,
//         { expiresIn: 3600 },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token, newUserData });
//         }
//       );
//     } else {
//       if (existingUsers.length === 2) {
//         res.json({
//           errorMsg: 'There are already users with the same email and username',
//         });
//       } else if (
//         existingUsers[0].email === email &&
//         existingUsers[0].name === name
//       ) {
//         res.json({
//           errorMsg:
//             'There already exists a user with the same email and username',
//         });
//       } else if (existingUsers[0].email === email) {
//         res.json({
//           errorMsg: 'There already exists a user with the same email',
//         });
//       } else if (existingUsers[0].name === name) {
//         res.json({
//           errorMsg: 'There already exists a user with the same username',
//         });
//       }
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route /auth/login
// @desc login an existing user
// access Public
// router.post('/login', async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     console.log(email, password);
//     const user = await User.findOne({ email });
//     const validUser = await bcrypt.compare(password, user.password);
//     if (validUser) {
//       await generateToken(res, user._id);
//       res.json({
//         _id: user._id,
//         newUser: false,
//       });
//     } else {
//       res.json({ errorMsg: 'Incorrect username or password' });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route /auth/logout
// @desc logout an existing user
// access Public
// router.post('/logout', async (req, res, next) => {
//   try {
//     res.clearCookie('token', { path: '/' });
//     res.json({ logout: true });
//   } catch {
//     console.log('error');
//   }
// });

// router.post('/invite/:id/email', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findOne({ _id: id });
//     console.log(user.name);
//     const msg = {
//       to: req.body,
//       from: 'wilsonfong82@gmail.com',
//       subject: `${user.name} invites you to join LangExchange!`,
//       text: `${user.name} has sent you an invite. Sign up now for LangExchange and start chatting with other people in other languages!`,
//       html: `<strong>
//               ${user.name} has sent you an invite.
//             </strong>
//             <p>
//               Sign up now for LangExchange and start chatting with other people in other languages!
//             <p>
//             <a href="www.google.ca">
//                 Sign up
//             </a>
//             `,
//     };

//     sgMail
//       .send(msg)
//       .then((response) => {
//         console.log(response[0].statusCode);
//         console.log(response[0].headers);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   } catch (err) {
//     console.error(err.message);
//     res.status(404).send('404 Not Found');
//   }
// });

// @route /auth/notauthed
// @desc error message for accessing unauthorized routes
// access Public
// router.post('/notauthed', (req, res, next) => {
//   console.log('not authorized!');
//   res.status(403).send('Not Authorized. Please log in first');
// });

module.exports = router;
