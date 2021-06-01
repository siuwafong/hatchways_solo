const { isRef } = require("joi")
const { userSchema, messageSchema, inviteSchema } = require("./schemas.js")
const jwt = require("jsonwebtoken")

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body)
  if (error) {
    console.log(error)
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.validateMessage = (req, res, next) => {
  const { error } = messageSchema.validate(req.body)
  if (error) {
    console.log(error)
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.validateInvite = (req, res, next) => {
  const { error } = inviteSchema.validate(req.body)
  if (error) {
    console.log(error)
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.auth = (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if(!token) res.status(401).json({ msg: "No token. Authorization denied. "})
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    req.user = user
    next()
  })

}
