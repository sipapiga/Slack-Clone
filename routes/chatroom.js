const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
//Database schema
const Channel = require('../models/Channel');

module.exports = function (io, Users) {
    let router = express.Router()
    const users = new Users();
    // define routes
    router.get('/room/:name', (req, res) => {
        console.log(req.user.username);
        res.render('chat', { title: 'home', user: req.user, room: req.params.name });
    });
    //create room
    router.post('/createroom', async (req, res) => {
        let name = req.body.room;
        const room = new Channel({
            name: name,
        });
        try {
            const saveRoom = await room.save();
            res.status(200).redirect('/api/users/dashboard');
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
        // res.render('chat', { title: 'home', user: req.user, room: req.params.name });
    });

    //delete room 
    router.delete('/delete/:room', async (req, res) => {
        try {
            const removeRoom = await User.deleteOne({ name: req.params.room })
            res.send(removeRoom);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
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