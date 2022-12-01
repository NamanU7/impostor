const express = require('express');
const router = express.Router();

//Controller modules
const room_controller = require('../controllers/roomController.js');

//GET request for chatroom page sending message
router.get('/', room_controller.user_create_get);

//POST request for making a message
router.post('/', room_controller.user_create_post);

module.exports = router;
