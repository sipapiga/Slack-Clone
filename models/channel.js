const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const channelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  privacy: {
    type: String,
    required: true
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
});

module.exports = mongoose.model("Channel", channelSchema);
