const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Database schema
const Channel = require('../models/Channel');

module.exports = function () {
    // define routes
    router.get('/:name', (req, res) => {
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


    return router;
}