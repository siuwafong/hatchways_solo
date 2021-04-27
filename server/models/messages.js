const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = newSchema({
    type: String,
    content: {
        type: String,
        required: true
    },
    sendDate: Date
}, { timestamps: true })

module.exports = mongoose.model('Message', MessageSchema)