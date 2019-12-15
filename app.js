const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const cors = require("cors");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const User = require("./models/user");
const Channel = require("./models/channel");

const app = express();

const MONGODB_URI =
  //Not work on my so i change to my db
  //"mongodb+srv://Barbara:K39jfpejCZhuPiQ@slack-qrlqu.mongodb.net/slack?retryWrites=true&w=majority";
  "mongodb+srv://sipr1901:sipr1901@patpra-2jv8s.mongodb.net/test?retryWrites=true&w=majority";
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});

app.set("view engine", "ejs");
app.set("views", "views");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const uuidv4 = require("uuid/v4");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true); //save the file
  } else {
    cb(null, false); // don't save the file
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  if (req.session.isLoggedIn === true) {
    res.locals.user = req.session.user;
  }
  next();
});

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      const channels = Channel.find();
      req.channels = channels;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.use(feedRoutes);
app.use(authRoutes);
app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => { })
  .catch(err => console.log(err));

const server = app.listen(3000);
const io = require("./socket").init(server);

io.on("connection", socket => {
  console.log("user connected");
  //console.log(socket.id)

});
