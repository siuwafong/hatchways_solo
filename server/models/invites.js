const mongoose = require('mongoose')

const Schema = mongoose.Schema

const InviteSchema = new Schema({
    sender: String,
    recipient: { 
        type: String,
        required: true
    },
    sendDate: Date
}, { timestamps: true })

module.exports = mongoose.model("Invite", InviteSchema)