const mongoose = require('mongoose')

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
    friends: [ { type: Schema.Types.ObjectId, ref: "User" } ]
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)