const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { check, validationResult } = require('express-validator');


router.get('/register', (req, res) => {
    res.render('register', { title: 'register' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'login' });
});

router.post('/register', upload.single('profileimage'), (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    if (req.file) {
        console.log('Uploading file...');
        let image = req.file.filename;
    } else {
        console.log('No file upload...');
        let image = 'noimage.jpg';
    }

});

module.exports = router;