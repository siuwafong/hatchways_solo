const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const arrayLimit = (val) => {
  return val.length <= 2;
};

const ConversationSchema = new Schema({
  participants: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    ],
    validate: [arrayLimit, 'Participants exceed the limit of 2'],
  },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }],
  mostRecentMsg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message',
    default: '',
  },
  deleted: [
    {
      type: Boolean,
      default: false,
    },
  ],
  unreadMsgs: [
    {
      type: Number,
      default: 0,
    },
  ],
  pinned: [
    {
      type: Boolean,
      default: false,
    },
  ],
});

module.exports = Conversation = mongoose.model(
  'conversation',
  ConversationSchema
);
