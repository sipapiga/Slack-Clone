const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    text: {
      type: String,
      require: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
