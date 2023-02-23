const express = require("express");
const router = express.Router();
const authLocalController = require("../controllers/authLocalController");
const passport = require("passport");
/**
 * ----------- Login Screen (universal) ---------------
 */

router.get("/login", (req, res, next) => {
  res.render("login");
});

/**
 * ------------ Local JWT Auth ---------------
 */
//fulfill route here
router.post("/login", authLocalController.login_post);
// router.get("/login/", authLocalController.login_get);
router.post("/register", authLocalController.register_post);
router.get("/register", authLocalController.register_get);

module.exports = router;

/**
 * ----------- Logout functionality (universal) -------------
 */

//Sign out feature:
router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
});
