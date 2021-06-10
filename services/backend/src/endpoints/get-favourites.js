const Dynamo = require("../Dynamo");
const JWT = require("../JWT");
const Responses = require("../Responses");

const tableName = process.env.tableName;

exports.handler = async (req) => {
  console.log(req);

  // Authenticate
  var token = req.headers["Authorization"];

  if (!token) return Responses._401();

  const isAuthenticated = await JWT.authenticateToken(token);
  if (!isAuthenticated) {
    return Responses._401();
  }

  if (!req.pathParameters || !req.pathParameters.ID) {
    // failed without an ID
    return Responses._400({ message: "missing ID from the path" });
  }

  const ID = req.pathParameters.ID;

  const favList = await Dynamo.getFavList(ID, tableName);

  if (!favList) {
    return Responses._400({ message: "Failed to get favourite list" });
  }

  return Responses._200(favList);
};
