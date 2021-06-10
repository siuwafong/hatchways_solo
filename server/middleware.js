const { isRef } = require("joi")
const { userSchema, messageSchema, inviteSchema } = require("./schemas.js")
const jwt = require("jsonwebtoken")

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.validateMessage = (req, res, next) => {
  const { error } = messageSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.validateInvite = (req, res, next) => {
  const { error } = inviteSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.auth = (req, res, next) => {
  const token = req.cookies.token || "";
  console.log(token)
  try { 
    if(!token) res.status(401).json({ msg: "No token. Authorization denied. "})
    const decrypt = jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
      if(err) return res.sendStatus(403)
      req.userInfo = userInfo
      next()
    })
  } catch (err) {
    return res.status(500).json(err.toString())
  }
}

module.exports.generateToken = (res, id) => {
  const token = jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
  return res.cookie("token", token, {
    expires: new Date(Date.now() + 1000 * 3600 * 24 * 7),
    secure: false,
    httpOnly: true,
  })
}
