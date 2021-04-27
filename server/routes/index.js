const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/users')

router.get("/welcome", function (req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
});

router.post('/user', async (req, res) => {
  const user = new User({name: "WFong", email: "wfong@outlook.com"})
  await user.save()
    .catch((err) => {
      console.log(err)
    })
  console.log("user saved")
  res.redirect('/welcome')
})

module.exports = router;
