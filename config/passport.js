const passport = require("passport");
const validPassword = require("../lib/passwordUtils").validPassword;
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db");

const customFields = {
  usernameField: "uname",
  passwordField: "pw",
};

//done is a function that will recieve the results of the auth
verifyCallback = (username, password, done) => {
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    function (err, user) {
      //db error:
      if (err) {
        return done(err);
      }
      //checking for user, user is js obj from sql query from db:
      if (!user) {
        return done(null, false, {
          message: "Incorrect username or password. (username DNE)",
        });
      }

      //password validation:
      const isValid = validPassword(password, user.hashed_password, user.salt);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: "Incorrect username or password. (wrong password)",
        });
      }
    }
  );
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

/**
 * ----------- Serialiaion + Deserialization of user to and from session -----------
 */

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      return done(err);
    }
    return done(null, user);
  });
});
