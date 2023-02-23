/**
 * This module will generate a public and private keypair and save them to the pwd.
 *
 * Private key will be saved elsewhere after generation.
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function genKeypair() {
  // Generates an object where the keys are stored in as props, privateKey, publicKey
  const keypair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: "pkcs1", // 'Public Key Cryptography Standard 1
      format: "pem", // Most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1", // 'Public Key Cryptography Standard 1
      format: "pem", // Most common formatting choice
    },
  });

  // Creates the pubKey file if it doesn't already exist and writes the publicKey to the file
  pubKeyPath = path.join(__dirname, "id_rsa_pub.pem");
  fs.writeFileSync(pubKeyPath, keypair.publicKey);

  // Creates the privKey file if it doesn't already exist and writes the privateKey to the file
  privKeyPath = path.join(__dirname, "id_rsa_priv.pem");
  fs.writeFileSync(privKeyPath, keypair.privateKey);
}

genKeypair();
