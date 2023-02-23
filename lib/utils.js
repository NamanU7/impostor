const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const jsonwebtoken = require("jsonwebtoken");

// Returns an object which contain the hash and salt used for this particular password
function genPassword(password) {
  let salt = crypto.randomBytes(32).toString("hex");
  let genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { salt: salt, hashed_password: genHash };
}

// Returns true/false if the hash generated using the same salt matches the hash in the db
function validPassword(password, hashed_password, salt) {
  let hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hashVerify === hashed_password;
}

//retrieving the privKey:
const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

//Issueing the JWT with payload containg some data from a user object:
function issueJWT(user) {
  const id = user.id;

  const expiresIn = "1d";

  const payload = {
    sub: id,
    name: user.name,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return { token: signedToken, expires: expiresIn };
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
