const genPassword = require("../lib/utils").genPassword;
const validPassword = require("../lib/utils").validPassword;
const issueJWT = require("../lib/utils").issueJWT;
const passport = require("passport");
const db = require("../config/db");

/**
 * ---------- POST Routes --------------
 */
//The authentication is handles in the router as the code is very minimal.
exports.login_post = function (req, res, next) {
  db.get(
    "SELECT * FROM users WHERE email = ?",
    [req.body.email],
    function (err, user) {
      if (err) {
        next(err);
      }

      if (!user) {
        res.json({ success: false, message: "could not find user" });
      }

      const isValid = validPassword(
        req.body.password,
        user.hashed_password,
        user.salt
      );

      if (isValid) {
        const jwt = issueJWT(user);
        // res.json({
        //   success: true,
        //   token: jwt.token,
        //   expiresIn: jwt.expires,
        // });

        res.cookie("token", jwt.token).json({
          success: true,
          token: jwt.token,
          expiresIn: jwt.expires,
        });
      } else {
        res.status(401).json({ success: false, message: "incorrect password" });
      }
    }
  );
};

//Create a new record in db with the data.
exports.register_post = function (req, res, next) {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hashed_password = saltHash.hashed_password;

  const newUser = {
    email: req.body.email,
    salt: salt,
    hashed_password: hashed_password,
    name: req.body.name,
  };

  db.run(
    "INSERT INTO users (email, hashed_password, salt, name) VALUES (?, ?, ?, ?)",
    [newUser.email, newUser.hashed_password, newUser.salt, newUser.name],
    function (err) {
      if (err) {
        return res.json({ success: false, message: "email already in use" });
      }
    }
  );

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [newUser.email],
    function (err, user) {
      if (err) {
        return res.json({ succes: false, message: "unrelated db erro" });
      }
      if (!user) {
        res.json({
          success: false,
          message: "couldnt find matching user in db (weird)",
        });
      }

      // Generate a JWT token and returns an object with the token and expire date props
      const jwt = issueJWT(user);

      return res.json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    }
  );

  // res.redirect("/login");
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
