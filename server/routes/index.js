const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/users")

router.get("/welcome", function (req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
});

router.get("/user/:id/invitations", (req, res, next) => {
  // TODO
  
})

module.exports = router;
