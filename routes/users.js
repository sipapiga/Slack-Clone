const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { check, validationResult } = require('express-validator');

const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('register', { title: 'register' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'login' });
});

router.get('/userprofile', (req, res) => {
    res.render('userprofile', { title: 'userprofile' });
});

//Get user from database
router.get('/', async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
//register user route
router.post('/register', upload.single('profileimage'), async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    if (req.file) {
        console.log('Uploading file...');
        var profileimage = req.file.filename;
    } else {
        console.log('No file upload...');
        var profileimage = 'noimage.jpg';
    }

    const user = new User({
        name: name,
        email: email,
        username: username,
        password: password,
        profileimage: profileimage
    });
    console.log(user);
    try {
        const saveUser = await user.save();
        res.location('/');
        res.redirect('/users/login');
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});
//login user route
router.post('/login', (req, res) => {
    //test render
    res.render('userprofile', { title: 'userprofile' });
});

module.exports = router;