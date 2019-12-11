const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
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
const Channel = require('../models/Channel');

router.get('/register', (req, res) => {
    res.render('register', { title: 'register' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'login' });
});

router.get('/home', (req, res) => {
    res.render('home', { title: 'login' });
});

router.get('/dashboard', async (req, res) => {
    console.log(req.user);
    const room = await Channel.find();
    console.log(room);
    res.render('dashboard', {
        title: 'home',
        data: req.user,
        file: `/uploads/${req.user.profileimage}`,
        room: room
    });
});

//Get user from database
router.get('/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('The user with the given ID was not found');
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

//edit user
router.post('/edit/:id', upload.single('profileimage'), async (req, res) => {

    //const user = await User.find(c => c.id === Number(req.params.id));
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found');
    console.log(user);
    if (req.body.name != null) {
        user.name = req.body.name;
    }
    if (req.body.email != null) {
        user.email = req.body.email;
    }
    if (req.body.username != null) {
        user.username = req.body.username;
    }
    if (req.body.password != null) {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password, salt);
        user.password = hashPass;
    }

    if (req.file) {
        console.log(req.file);
        console.log('Uploading file...');
        user.profileimage = req.file.filename;
    } else {
        console.log('No file upload...');
        user.profileimage = 'noimage.jpg';
    }

    try {
        const updateUser = await user.save();
        res.status(200).redirect('/api/users/dashboard');
    } catch (err) {
        res.statu(400).send({ message: err.message });
    }


    /*  try {
         const saveUser = await user.save();
         res.status(200).redirect('/users/dashboard');
     } catch (err) {
         res.status(400).send(error.details[0].message);
     } */
});

//delete user
router.delete('/delete/:id', async (req, res) => {
    try {
        const removeUser = await User.deleteOne({ _id: req.params.id })
        res.send(removeUser);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});


router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are now logout');
    res.redirect('/api/users/login');
})


module.exports = router;