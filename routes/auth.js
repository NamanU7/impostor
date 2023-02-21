const express = require("express");
const router = express.Router();
//Importing the passport and passport-google dependencies
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
//import db after this:
const db = require("../db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile", "email"],
    },
    function verify(issuer, profile, cb) {
      let sql =
        "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?";
      let params = [issuer, profile.id];
      db.get(sql, params, (err, row) => {
        if (err) return cb(err);
        if (!row) {
          sql = "INSERT INTO users (name) VALUES (?)";
          params = [profile.displayName];
          db.run(sql, params, (err) => {
            if (err) return cb(err);

            let id = this.lastID;

            sql =
              "INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)";
            params = [id, issuer, profile.id];
            db.run(sql, params, (err) => {
              if (err) return cb(err);

              let user = {
                id: id,
                name: profile.displayName,
              };
              return cb(null, user);
            });
          });
        } else {
          sql = "SELECT * FROM users WHERE id = ?";
          params = [row.user_id];
          db.get(sql, params, (err, row) => {
            if (err) return cb(err);
            if (!row) {
              return cb(null, false);
            }
            return cb(null, row);
          });
        }
      });
    }
  )
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/login/federated/google", passport.authenticate("google"));

module.exports = router;
