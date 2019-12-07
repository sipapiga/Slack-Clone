const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
});


const Joi = require('@hapi/joi');

function validationError(data) {
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        repeat_password: Joi.ref('password'),
    };
    return schema.validate(data);
}

//Database schema
const User = require('../models/User');

router.get('/register', (req, res) => {
    res.render('register', { title: 'register' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'login' });
});

router.get('/dashboard', (req, res) => {
    console.log(req.user);
    res.render('dashboard', {
        title: 'home',
        data: req.user,
        file: `/uploads/${req.user.profileimage}`
    });
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
    let repeat_password = req.body.repeat_password;
    //Validate 
    // const { error } = validationError(req.body);

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    /*   if (error) {
            res.render('register', {
            error: error.details[0].message
        });
      } else { */
    if (req.file) {
        console.log(req.file);
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
        password: hashPass,
        profileimage: profileimage
    });
    console.log(user);
    try {
        const saveUser = await user.save();
        /*   res.location('/');
          res.redirect('/users/login' );*/
        req.flash('success_msg', 'You are now registered');
        res.status(200).redirect('/users/login');
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
    // }

});
//login user route
router.post('/loginuser', passport.authenticate('local', {
    successRedirect: '/api/users/dashboard',
    failureRedirect: '/api/users/login',
    failureFlash: true
}));

router.put('/users/edit', (req, res) => {


});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are now logout');
    res.redirect('/users/login');
})


module.exports = router;