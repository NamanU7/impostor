//Importing the passport and passport-google dependencies
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
//import db after this:
const db = require("../config/db.js");
require("dotenv").config();

// //Confiugring the google strategy from passport:
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env["GOOGLE_CLIENT_ID"],
//       clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
//       callbackURL: "/oauth2/redirect/google",
//       scope: ["profile"],
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
    },
    function (issuer, profile, cb) {
      db.get(
        "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?",
        [issuer, profile.id],
        function (err, cred) {
          if (err) {
            return cb(err);
          }
          if (!cred) {
            // The Google account has not logged in to this app before.  Create a
            // new user record and link it to the Google account.
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
                      id: id.toString(),
                      name: profile.displayName,
                    };
                    return cb(null, user);
                  }
                );
              }
            );
          } else {
            // The Google account has previously logged in to the app.  Get the
            // user record linked to the Google account and log the user in.
            db.get(
              "SELECT * FROM users WHERE id = ?",
              [cred.user_id],
              function (err, user) {
                if (err) {
                  return cb(err);
                }
                if (!user) {
                  return cb(null, false);
                }
                return cb(null, user);
              }
            );
          }
        }
      );
    }
  )
);

//authenticated session persistence:
// passport.serializeUser(function (user, cb) {
//   process.nextTick(function () {
//     cb(null, { id: user.id, username: user.username, name: user.name });
//   });
// });

// passport.deserializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });

//Route handlers:

exports.login_get = function (req, res, next) {
  res.render("login");
};

exports.federatedAuth_get = passport.authenticate("google");

exports.redirect_get = passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/login",
});

// exports.logoutFeature_post = function (req, res, next) {
//   req.logout(function (err) {
//     if (err) return next(err);

//     res.redirect("/");
//   });
// };
