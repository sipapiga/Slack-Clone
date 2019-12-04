const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const socket = require('socket.io');
const path = require('path');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })


const usersRouter = require('./routes/user');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/user', usersRouter);

app.use('/', (req, res) => {
    res.render('index');
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on ${port}`));

