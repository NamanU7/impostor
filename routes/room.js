const express = require("express");
const router = express.Router();
const passport = require("passport");
//Controller modules
const room_controller = require("../controllers/roomController.js");

//GET request for chatroom page sending message
router.get(
  "/",
  passport.authenticate("jwt", { sessions: false }),
  room_controller.user_room_get
);

module.exports = router;
