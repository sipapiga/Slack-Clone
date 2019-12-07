const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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


const User = mongoose.model('User', userSchema);

module.exports = User;