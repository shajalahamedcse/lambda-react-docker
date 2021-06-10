const bcrypt = require("bcrypt");
const Dynamo = require("../Dynamo");
const Responses = require("../Responses");
const JWT = require("../JWT");

const tableName = process.env.tableName;

exports.handler = async (req) => {
  // Authenticate
  var token = req.headers["Authorization"];

  if (!token) return Responses._401();

  const isAuthenticated = await JWT.authenticateToken(token);
  if (!isAuthenticated) {
    return Responses._401();
  }

  return Responses._200({ message: "User authenticated" });
};
