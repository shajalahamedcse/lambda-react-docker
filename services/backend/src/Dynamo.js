/**
 *
 * DynamoDB client
 * @function
 *      - Handles CRUD operation on dynamoDB
 *
 */

const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
  //Operations

  async createNewUser(payload, TableName) {
    /**
     * @type post
     * @params {
     *              id,
     *              username,
     *              email,
     *              password
     *         }
     */
    if (!validate(payload)) {
      throw Error("Invalid information");
    }

    try {
      const existUser = await this.getUserByEmail(payload.email, TableName);

      if (existUser) {
        return { alreadyRegistered: true };
      }
    } catch (e) {
      console.log("No user found..");
    }

    const params = {
      TableName,
      Item: payload,
    };

    const res = await documentClient.put(params).promise();

    if (!res) {
      throw Error("Error in creating new user");
    }

    return res;
  },

  async getUserByEmail(email, TableName) {
    if (!email) {
      throw Error("Invalid information");
    }
    const params = {
      TableName,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
    };

    const userInfo = await documentClient.query(params).promise();
    console.log(userInfo);
    if (!userInfo || !userInfo.Items) {
      throw Error("Error in finding user");
    }
    console.log(userInfo.Items[0]);

    return userInfo.Items[0];
  },

  async getUserById(ID, TableName) {
    if (!ID) {
      throw Error("Invalid information");
    }
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    const userInfo = await documentClient.get(params).promise();

    if (!userInfo || !userInfo.Item) {
      throw Error("Error in finding user");
    }
    console.log("[Dynamo]====getUserById()=====userInfo: " + userInfo.Item);

    return userInfo.Item;
  },

  async addNewFav(ID, movieId, TableName) {
    if (!ID || !movieId) {
      throw Error("Invalid information");
    }

    const params = {
      TableName,
      Key: {
        ID,
      },
      ReturnValues: "ALL_NEW",
      UpdateExpression:
        "set #favourites = list_append(if_not_exists(#favourites, :empty_list), :movieId)",
      ExpressionAttributeNames: {
        "#favourites": "favourites",
      },
      ExpressionAttributeValues: {
        ":movieId": [movieId],
        ":empty_list": [],
      },
    };
    try {
      console.log("Adding new movie...");
      await documentClient.update(params).promise();
      console.log("Added successfully");
    } catch (e) {
      throw e;
    }

    return true;
  },

  async getFavList(ID, TableName) {
    if (!ID) {
      throw Error("Invalid information");
    }
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    const userInfo = await documentClient.get(params).promise();

    if (!userInfo || !userInfo.Item) {
      throw Error("Error in finding user");
    }
    if (!userInfo.Item.favourites) {
      return [];
    }
    console.log(
      "[Dynamo]====getFavList()=====favList: " + userInfo.Item.favourites
    );

    return userInfo.Item.favourites;
  },
};

function validate(payload) {
  return (
    payload.ID !== null &&
    payload.username !== null &&
    payload.email !== null &&
    payload.password !== null
  );
}

module.exports = Dynamo;
