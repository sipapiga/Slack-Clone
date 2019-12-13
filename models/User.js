const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  channels: [
    {
      type: Schema.Types.ObjectId,
      ref: "Channel"
    }
  ],
  resetToken: String,
  resetTokenExpiration: Date
});

module.exports = mongoose.model("User", userSchema);
