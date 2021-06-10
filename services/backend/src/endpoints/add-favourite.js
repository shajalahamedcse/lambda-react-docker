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

  const newFavEntry = JSON.parse(req.body);

  let validation = validate(newFavEntry);
  if (!validation || validation !== true) {
    return Responses._400({ message: validation });
  }

  const newEntry = await Dynamo.addNewFav(
    newFavEntry.ID,
    newFavEntry.movieId,
    tableName
  ).catch((error) => {
    console.log("error in db query: " + error);
    return null;
  });

  console.log(JSON.stringify(newEntry));

  if (!newEntry) {
    return Responses._400({ message: "Failed to add new favourite movie" });
  }

  return Responses._200({
    message: `Successfully added ${newFavEntry.movieId} to favourite list for user ${newFavEntry.ID}`,
  });
};

function validate(credentials) {
  if (!credentials.ID) {
    return "No ID";
  }

  if (!credentials.movieId) {
    return "No movieId";
  }

  return true;
}
