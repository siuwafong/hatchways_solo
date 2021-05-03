const Joi = require('joi')

module.exports.userSchema = Joi.object({
    user: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        joinDate: Joi.date().less('now'),
        friends: Joi.array().items(Joi.string())
    }).required()
})

module.exports.messageSchema = Joi.object({
    message: Joi.object({
        sender: Joi.string().required(),
        recipient: Joi.string().required(),
        type: Joi.string(),
        content: Joi.string().required(),
        sendDate: Joi.date().less('now'),
        read: Joi.boolean()
    }).required()
})  

module.exports.inviteSchema = Joi.object({
    invite: Joi.object({
        sender: Joi.string(),
        recipient: Joi.string(),
        status: Joi.string(),
        sendDate: Joi.date()
    }).required()
})