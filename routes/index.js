const express = require('express');
const router = express.Router();

/* ROUTING */

//Notice how this is a middleware function (next param).
router.get('/', (req, res, next) => {
    res.render('index.pug', { title: 'Impostor' });
});


//Export as a module for use in the app.js file
module.exports = router;