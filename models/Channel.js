const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
});


const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;