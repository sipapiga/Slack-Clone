const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

module.exports = function (io, Users) {
    let router = express.Router()
    const users = new Users();
    // define routes
    router.get('/room', (req, res) => {
        console.log(req.user.username);
        res.render('chat', { title: 'home', user: req.user });
    });

    io.on('connection', socket => {
        console.log('User connected...');

        socket.on('join', (params, callback) => {
            users.addUser(socket.id, params.name);
            console.log(users);

            io.emit('new user', users);

            callback();
        });
        //Send Message
        socket.on('send message', data => {
            console.log(data);
            io.sockets.emit('new message', {
                msg: data.msg,
                from: data.username,
                time: Date(),
                profileimage: data.userProfileimage
            });
        });

    });

    return router;
}