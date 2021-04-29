const mongoose = require("mongoose")

const Schema = mongoose.Schema

const InviteSchema = new Schema({
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: "User" 
    },
    recipient: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    status: String,
    sendDate: Date
}, { timestamps: true })

module.exports = mongoose.model("Invite", InviteSchema)