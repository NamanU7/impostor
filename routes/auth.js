const express = require("express");
const router = express.Router();
const authGoogleController = require("../controllers/authGoogleController");
const authLocalController = require("../controllers/authLocalController");
const passport = require("passport");
/**
 * ----------- Login Screen (universal) ---------------
 */

router.get("/login", (req, res, next) => {
  res.render("login");
});

/**
 * ----------- Google OAuth ---------------
 */

router.get("/login/google", authGoogleController.login_get);

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
// router.get("/oauth2/redirect/google", authGoogleController.redirect_get);

/**
 * ------------ Local Auth ---------------
 */
//fulfill route here
router.post(
  "/login/local",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);
router.get("/login/local", authLocalController.login_get);
router.post("/local/register", authLocalController.register_post);
router.get("/local/register", authLocalController.register_get);

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
