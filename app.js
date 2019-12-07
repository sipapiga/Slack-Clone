const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const seesion = require('express-session');
const flash = require('express-flash');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })


const usersRouter = require('./routes/users');

const app = express();

const initiallizePassport = require('./config/passport');
initiallizePassport(passport);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(seesion({
    secret: 'secret',
    resave: false,
    saveUninitialized: false

}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', usersRouter);

app.use('/', (req, res) => {
    res.render('login', { title: 'login' });
})

dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true }, () => console.log('connected to DB'));


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on ${port}`));

