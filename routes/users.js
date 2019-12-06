const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


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
        res.location('/');
        res.redirect('/users/login');
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
    // }

});
//login user route
router.post('/login', async (req, res) => {
    //Validate 
    /*   const { error } = loginValidation(req.body);
      if (error) {
          res.render('login', {
              error: error.details[0].message
          });
      } else {
  
      } */

    const user = await User.findOne({ username: req.body.username });
    console.log(req.body.password);
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!user) {
        res.render('login', {
            error: 'Email is not found'
        });
    } else if (!validPass) {
        res.render('login', {
            error: 'Invalid password'
        });
    } else {
        res.redirect('/users/userprofile');
    }

});

module.exports = router;