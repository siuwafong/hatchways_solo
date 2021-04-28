const mongoose = require('mongoose')

const Schema = mongoose.Schema

const InviteSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    senderEmail: { type: Schema.Types.ObjectId, ref: "User" },
    recipient: { 
        type: { type: Schema.Types.ObjectId, ref: "User" },
        // required: true
    },
    accepted: Boolean,
    responded: Boolean,
    sendDate: Date
}, { timestamps: true })

module.exports = mongoose.model("Invite", InviteSchema)