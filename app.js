const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const socket = require('socket.io');

const usersRouter = require('./routes/user');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/user', usersRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on ${port}`));

