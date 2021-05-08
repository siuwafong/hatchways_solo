const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    joinDate: Date,
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Online", "Away"],
        required: true
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    invites: [{ type: Schema.Types.ObjectId, ref: 'Invite'}]
}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema)