const fs = require("fs");
const path = require("path");
const db = require("./db");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const cookieExtracter = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }

  return token;
};

// Options to pass into JwtStrategy constructor - this is the verify piece of the auth
const options = {
  jwtFromRequest: cookieExtracter, //Extract JWT from cookie
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

// This is not used for the login POST method, as it is not issuing a JWT, this is meant for authorization
const strategy = new JwtStrategy(options, function (payload, done) {
  const id = payload.sub;

  // At this point, the JwtStrategy has already validated the JWT under the hood.
  // All we must do is ensure there is such a user in the db and retrieve said user.
  db.get("SELECT * FROM users WHERE id = ?", [id], function (err, user) {
    if (err) {
      return done(err, null);
    }
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  });

  //Passport will attach this user to the express req object (req.user)
});

// Configuring the global passport object to use the JwtStrategy
module.exports = (passport) => {
  passport.use(strategy);
};
