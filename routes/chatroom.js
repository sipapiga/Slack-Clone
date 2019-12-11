const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

module.exports = function (io, Users) {
    //create new object from user class
    const users = new Users();
    io.on('connection', socket => {
        console.log('User connected...');

        socket.on('join', (params, callback) => {

            socket.join(params.room);
            users.addUser(socket.id, params.name, params.room);
            console.log(users);

            io.to(params.room).emit('new user', users.getUsersList(params.room));

            callback();
        });
        //Send Message
        socket.on('send message', data => {
            console.log(data);
            io.to(data.room).emit('new message', {
                msg: data.msg,
                room: data.room,
                from: data.username,
                time: Date(),
                profileimage: data.userProfileimage
            });
        });

        socket.on('disconnect', () => {
            let user = users.removeUser(socket.id);

            if (user) {
                socket.broadcast.to(user.room).emit('send message', {
                    from: 'Admin',
                    msg: `${user.name} left the room`,
                    time: new Date().getTime()
                });
                io.to(user.room).emit('new user', users.getUsersList(user.room));
            }

        })

    });

    return router;
}