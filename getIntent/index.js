// cloud function
const rp = require('request-promise');
rp.debug = true
module.exports = function (context, req) {
  if (req.body) {
    try {
      const body = JSON.parse(req.body);
      const lang = body.lang;
      const query = body.query;
      const sessionId = body.sessionId;
      rp({
        method: "POST",
        uri: "https://api.api.ai/v1/query",
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
        console.log(data);
        if (
          data.result
          && data.result
          && data.result.action
        ) {
          context.res = {
            status: 200,
            body: data.result.action
          };
        } else {
          console.error("api.ai didn't provide action for following request: " + req.body);
          context.res = {
            status: 500,
            body: "Something went wrong. Try again later."
          }
        }
        context.done();
      }).catch((error) => {
        console.error(`api.ai request failed with error: "${error}" and body: "${req.body}"`)
        context.res = {
          status: 500,
          body: "Something went wrong. Try again later."
        }
        context.done();
      })
    } catch (e) {
      context.res = {
        status: 400,
        body: "Please provide a JSON body with lang, query and sessionId"
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
