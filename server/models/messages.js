const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MessageSchema = new Schema({
    sender: {
        type: { type: Schema.Types.ObjectId, ref: "User" },
        required: true
    },
    recipient: {
        type: { type: Schema.Types.ObjectId, ref: "User" },
        required: true
    },
    type: String,
    content: {
        type: String,
        required: true
    },
    sendDate: Date, 
    read: Boolean
}, { timestamps: true })

module.exports = mongoose.model('Message', MessageSchema)