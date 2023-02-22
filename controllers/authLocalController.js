const genPassword = require("../lib/passwordUtils").genPassword;
const passport = require("passport");
const db = require("../config/db");

/**
 * ---------- POST Routes --------------
 */
//The authentication is handles in the router as the code is very minimal.

//Create a new record in db with the data.
exports.register_post = function (req, res, next) {
  const saltHash = genPassword(req.body.pw);

  const salt = saltHash.salt;
  const hashed_password = saltHash.hashed_password;

  const newUser = {
    username: req.body.uname,
    salt: salt,
    hashed_password: hashed_password,
  };

  db.get(
    "INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
    [newUser.username, newUser.hashed_password, newUser.salt],
    function (err) {
      if (err) {
        return next(err);
      }
      console.log(newUser);
    }
  );

  res.redirect("/login");
};

/**
 * ---------- GET Routes --------------
 */

exports.register_get = function (req, res, next) {
  res.render("register");
};

exports.login_get = function (req, res, next) {
  res.render("loginLocal");
};
