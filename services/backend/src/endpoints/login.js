const bcrypt = require("bcrypt");
const Dynamo = require("../Dynamo");
const Responses = require("../Responses");
const JWT = require("../JWT");

const tableName = process.env.tableName;

exports.handler = async (req) => {
  console.log(req);
  const userCred = JSON.parse(req.body);

  console.log(JSON.stringify(userCred));

  const user = await Dynamo.getUserByEmail(userCred.email, tableName).catch(
    (err) => {
      console.log("error in Dynamo Get", err);
      return null;
    }
  );

  var isValid = bcrypt.compareSync(userCred.password, user.password);

  if (!isValid) return Responses._401();

  // Generate new token for user
  var token = await JWT.generateToken(user.ID);
  console.log("Token: " + token);
  return Responses._200({
    message: "User authenticated",
    id: user.ID,
    token: token,
  });
};
