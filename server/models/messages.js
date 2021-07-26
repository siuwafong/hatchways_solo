const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['msg', 'img'],
    },
    content: {
      type: String,
      required: true,
    },
    read: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
