const Message = require("../models/message");
const Channel = require("../models/channel");
const User = require("../models/user");
const io = require("../socket");

const getPrivateChannels = async req => {
  try {
    const channels = await User.findById(req.user._id)
      .populate("channels")
      .select("channels");

    privateChannels = [];
    if (channels.channels.length > 0) {
      let name;
      for (channel of channels.channels) {
        if (channel.users[0].toString() === req.user._id.toString()) {
          const user = await User.findById(channel.users[1]);
          name = user.name;
        } else {
          const user = await User.findById(channel.users[0]);
          name = user.name;
        }
        privateChannels.push({ name: name, _id: channel._id });
      }
    }

    return privateChannels;
  } catch (err) {
    console.log(err);
  }
};

exports.getHome = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("name");
    const publicChannels = await Channel.find({ privacy: "public" });
    const privateChannels = await getPrivateChannels(req);
    res.render("feed/index", {
      pageTitle: "Home",
      path: "/",
      users: users,
      channels: publicChannels,
      privateChannels: privateChannels
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getChannel = async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select("name");
  const channelId = req.params.channelId;
  try {
    const publicChannels = await Channel.find({ privacy: "public" });
    const privateChannels = await getPrivateChannels(req);
    let channelName = "test";
    for (c of privateChannels) {
      if (c._id.toString() === channelId.toString()) {
        channelName = c.name;
      }
    }
    const channel = await Channel.findById(channelId);
    const messages = await Message.find({ channel: channelId }).populate(
      "creator"
    );
    res.render("feed/chat", {
      pageTitle: "channel",
      path: "/",
      channel: {
        name: channelName,
        id: channelId
      },
      messages: messages,
      users: users,
      channels: publicChannels,
      privateChannels: privateChannels
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postMessage = async (req, res, next) => {
  try {
    //get message form body
    const text = req.body.msg;
    const user = req.user._id;
    const channelId = req.body.channelId;

    //make a new message with given info
    const message = new Message({
      text: text,
      creator: user,
      channel: channelId
    });
    await message.save();

    const channel = await Channel.findById(channelId);
    const updatedMessages = [...channel.messages];
    updatedMessages.push(message);

    channel.messages = updatedMessages;
    await channel.save();

    //console.log(message);
    io.getIO().emit("message", message, req.user.name);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.getAddChannel = async (req, res, next) => {
  res.render("feed/add-channel", {
    pageTitle: "New Channel",
    path: "/"
  });
};

exports.postAddChannel = async (req, res, next) => {
  const name = req.body.name;
  const privacy = "public";
  const channel = new Channel({
    name: name,
    privacy: privacy
  });

  try {
    const result = await channel.save();
    res.redirect("/chat/" + channel._id);
  } catch (err) {
    console.log(err);
  }
};

exports.getDM = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const exists = await Channel.find({ privacy: "private" });
    for (c of exists) {
      if (
        (c.users[0].toString() === user._id.toString() ||
          c.users[0].toString() === req.user._id.toString()) &&
        (c.users[1].toString() === user._id.toString() ||
          c.users[1].toString() == req.user._id.toString())
      ) {
        return res.redirect("/chat/" + c._id);
      }
    }

    const name = "Direct Message";
    const privacy = "private";
    const users = [];
    users.push(user._id);
    users.push(req.user._id);

    const channel = new Channel({
      name: name,
      privacy: privacy,
      users: users
    });

    User.findByIdAndUpdate(
      { _id: userId },
      { $push: { channels: channel } },
      err => {
        console.log(err);
      }
    );
    User.findByIdAndUpdate(
      { _id: req.user._id },
      { $push: { channels: channel } },
      err => {
        console.log(err);
      }
    );
    await channel.save();
    res.redirect("/chat/" + channel._id);
  } catch (err) {
    console.log(err);
  }
};
