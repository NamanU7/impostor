const express = require('express');
const router = express.Router();
//import controller

const indexController = require('../controllers/indexController.js');

/* ROUTING */

//Notice how this is a middleware function (next param).
router.get('/', indexController.homepage_get);


//Export as a module for use in the app.js file
module.exports = router;