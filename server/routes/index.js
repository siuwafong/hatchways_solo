const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/users")

router.get("/welcome", function (req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
});

router.get("/user/:id/invitations", async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await User.findById(id).populate('friends')
    res.json(user.friends)
  } catch(err) {
    console.error(err.message);
    res.status(404).send('404 Not Found');
  }
})

module.exports = router;
