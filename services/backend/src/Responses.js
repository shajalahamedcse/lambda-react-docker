const Responses = {
  _200(data = {}) {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "Accept": "*/*",
        "X-Requested-With": "*",
      },
      statusCode: 200,
      body: JSON.stringify(data),
    };
  },

  _400(data = {}) {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "Accept": "*/*",
        "X-Requested-With": "*",
      },
      statusCode: 400,
      body: JSON.stringify(data),
    };
  },

  _401() {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "Accept": "*/*",
        "X-Requested-With": "*",
      },
      statusCode: 401,
      body: JSON.stringify({
        message: "Unauthorized user",
        auth: false,
        token: null,
      }),
    };
  },
};

module.exports = Responses;
