const crypto = require("crypto");

function genPassword(password) {
  let salt = crypto.randomBytes(32).toString("hex");
  let genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { salt: salt, hashed_password: genHash };
}

function validPassword(password, hashed_password, salt) {
  let hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hashVerify === hashed_password;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
