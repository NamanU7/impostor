const express = require("express");
const router = express.Router();
require("dotenv").config();
//Importing the passport and passport-google dependencies
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
//import db after this:
const db = require("../db");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env["GOOGLE_CLIENT_ID"],
//       clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
//       callbackURL: "/oauth2/redirect/google",
//       scope: ["profile", "email"],
//     },
//     function verify(issuer, profile, cb) {
//       let sql =
//         "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?";
//       let params = [issuer, profile.id];
//       db.get(sql, params, (err, row) => {
//         if (err) return cb(err);
//         if (!row) {
//           sql = "INSERT INTO users (name) VALUES (?)";
//           params = [profile.displayName];
//           db.run(sql, params, (err) => {
//             if (err) return cb(err);

//             let id = this.lastID;

//             sql =
//               "INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)";
//             params = [id, issuer, profile.id];
//             db.run(sql, params, (err) => {
//               if (err) return cb(err);

//               let user = {
//                 id: id,
//                 name: profile.displayName,
//               };
//               return cb(null, user);
//             });
//           });
//         } else {
//           sql = "SELECT * FROM users WHERE id = ?";
//           params = [row.user_id];
//           db.get(sql, params, (err, row) => {
//             if (err) return cb(err);
//             if (!row) {
//               return cb(null, false);
//             }
//             return cb(null, row);
//           });
//         }
//       });
//     }
//   )
// );

//their passport.use:
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile"],
    },
    function verify(issuer, profile, cb) {
      db.get(
        "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?",
        [issuer, profile.id],
        function (err, row) {
          if (err) {
            return cb(err);
          }
          if (!row) {
            db.run(
              "INSERT INTO users (name) VALUES (?)",
              [profile.displayName],
              function (err) {
                if (err) {
                  return cb(err);
                }

                var id = this.lastID;
                db.run(
                  "INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)",
                  [id, issuer, profile.id],
                  function (err) {
                    if (err) {
                      return cb(err);
                    }
                    var user = {
                      id: id,
                      name: profile.displayName,
                    };
                    return cb(null, user);
                  }
                );
              }
            );
          } else {
            db.get(
              "SELECT * FROM users WHERE id = ?",
              [row.user_id],
              function (err, row) {
                if (err) {
                  return cb(err);
                }
                if (!row) {
                  return cb(null, false);
                }
                return cb(null, row);
              }
            );
          }
        }
      );
    }
  )
);

//authenticated session persistence:
passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

//Sign out feature:
router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
