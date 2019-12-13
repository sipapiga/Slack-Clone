const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const feedController = require("../controllers/feed");

router.get("/", isAuth, feedController.getHome);
router.get("/chat/:channelId", isAuth, feedController.getChannel);
router.post("/messages", isAuth, feedController.postMessage);
router.get("/DM/:userId", isAuth, feedController.getDM);

router.get("/add-channel", isAuth, feedController.getAddChannel);
router.post("/add-channel", isAuth, feedController.postAddChannel);

module.exports = router;
