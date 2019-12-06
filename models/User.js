const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        default: true
    },
    profileimage: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);