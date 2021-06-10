const jwt = require("jsonwebtoken");
var fs = require("fs");
const Dynamo = require("./Dynamo");
const tableName = process.env.tableName;

// TODO: private key not generated
var privateKey = fs.readFileSync("private.key");

const JWT = {
  async generateToken(id) {
    var token = await jwt.sign({ id }, privateKey, {
      expiresIn: 86400, // expires in 24 hours
    });

    return token;
  },

  async authenticateToken(token) {
    try {
      var decoded = jwt.verify(token, privateKey);

      console.log(
        "Verifying if user exists for info: " + JSON.stringify(decoded)
      );
      const user = await Dynamo.getUserById(decoded.id, tableName).catch(
        (err) => {
          console.log("error in Dynamo Get", err);
          return null;
        }
      );

      if (!user) {
        return false;
      }
      console.log("User found");

      return true;
    } catch (err) {
      return false;
    }
  },
};

module.exports = JWT;
