const crypto = require("crypto");
const Dynamo = require("../Dynamo");
const Responses = require("../Responses");
const bcrypt = require("bcrypt");
const JWT = require("../JWT");

const tableName = process.env.tableName;

exports.handler = async (req) => {
  console.log(req);

  let newUserCred = JSON.parse(req.body);

  // Validation
  let validation = validate(newUserCred);
  if (validation !== true) {
    return Responses._400({ message: validation });
  }

  // Hashing password
  var hashedPassword = bcrypt.hashSync(newUserCred.password, 8);
  newUserCred.password = hashedPassword;

  // Generating id for new user
  newUserCred.ID = await generateRandomId();
  newUserCred.favourites = [];

  // db query
  const newUser = await Dynamo.createNewUser(newUserCred, tableName).catch(
    (error) => {
      console.log("error in creating new user: " + error);
      return null;
    }
  );
  console.log("[signup.js]===new user info: " + JSON.stringify(newUser));

  if (!newUser) {
    return Responses._400({ message: "Failed to create new User" });
  }

  if (newUser.alreadyRegistered) {
    return Responses._400({ message: "Email already registered" });
  }

  // Generate new token for user
  var token = await JWT.generateToken(newUserCred.ID);

  return Responses._200({
    message: "Succesfully created new User",
    id: newUserCred.ID,
    token: token,
  });
};

async function generateRandomId() {
  const id = await crypto.randomBytes(16).toString("hex");
  return id;
}

function validate(credentials) {
  if (!credentials.username) {
    return "No username";
  }

  if (!credentials.password) {
    return "No password";
  }

  if (!credentials.email) {
    return "No email";
  }

  return true;
}
