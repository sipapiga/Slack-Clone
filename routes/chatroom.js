const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

module.exports = function (io) {
    let router = express.Router()

    // define routes
    router.get('/room', (req, res) => {
        console.log(req.user.username);
        res.render('chat', { title: 'home', user: req.user });
    });

    io.on('connection', socket => {
        console.log('User connected...');

        //Send Message
        socket.on('send message', data => {
            console.log(data);
            io.sockets.emit('new message', {
                msg: data.msg,
                from: data.username,
                time: Date()
            });
        });
    });

    return router;
}