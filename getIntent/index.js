// cloud function to get natural language intent from text
if (!process.env.API_AI_KEY) {
  throw new Error ("API_AI_KEY environment variable not defined")
}

const rp = require('request-promise');
module.exports = function (context, req) {
  context.log("body: " + req.body);
  if (req.body && req.body.lang && req.body.query && req.body.sessionId) {
    try {
      const lang = req.body.lang;
      const query = req.body.query;
      const sessionId = req.body.sessionId;
      rp({
        method: "POST",
        uri: "https://api.dialogflow.com/v1/query",
        headers: {
          "Authorization": "Bearer " + process.env.API_AI_KEY,
          "content-type": "application/json"
        },

        body: JSON.stringify({
          query, lang, sessionId,
          v: "20150910" // api verison number
        })
      })
      .then((response) => JSON.parse(response))

      .then((data) => {
        if (
          data.result
          && data.result
          && data.result.action
        ) {
          context.res = {
            status: 200,
            body: data.result.action,
            headers: {
              "content-type": "text/plain"
            }
          };
        } else {
          context.log("api.ai didn't provide action for following request: " + req.body);
          context.res = {
            status: 500,
            body: "Something went wrong. Try again later."
          }
        }
        context.done();
      }).catch((error) => {
        context.log(`api.ai request failed with error: "${error}" and body: "${req.body}"`)
        context.res = {
          status: 500,
          body: "Something went wrong. Try again later."
        }
        context.done();
      })
    } catch (e) {
      context.log("request crashed with error:", e);
      context.res = {
        status: 400,
        body: "Body is invalid JSON. Please provide a JSON body with lang, query and sessionId"
      };
      context.done();
    }
  } else {
    context.res = {
      status: 400,
      body: "Please provide a JSON body with lang, query and sessionId"
    };
    context.done();
  }
};
