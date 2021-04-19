const express = require("express");
const router = express.Router();
const invitations = require("../utils/Invitations")

router.get("/welcome", function (req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
});

router.get("/user/:id/invitations", (req, res, next) => {
  
  const found = invitations.some(invitation => (invitation.recipient === req.params.id && invitation.reply === "none"))

  if (found) {
    res.json(invitations.filter(invitation => invitation.recipient === req.params.id).filter(invitation => invitation.reply === "none"))
    
  } else {
    res.status(400).json({ msg: `No invitations`})
  }
})

module.exports = router;
