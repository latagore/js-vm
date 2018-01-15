// cloud function to check if the text is garbage or a real engilsh answer

const rp = require('request-promise');
const englishDictPromise = rp({
  method: "GET",
  uri: "https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json",
  json: true
})
const THRESHOLD = 0.4;

module.exports = function (context, req) {
  context.log("body: " + JSON.stringify(req.body));
  if (req.body && typeof req.body === 'string') {
    const tokens = req.body.trim().replace(/[^-A-Za-z\s]/g, "").split(/\s+/);
    console.log(tokens);
    englishDictPromise.then((dict) => {
      const englishWordCount = tokens.reduce((count, word) => {
        console.log(word + ": " + dict[word])
        if (dict[word]) {
          return count + 1;
        }
        return count;
      }, 0)
      console.log(englishWordCount / tokens.length);
      if (englishWordCount / tokens.length < THRESHOLD) {
        context.res = {
          body: true
        }
      } else {
        context.res = {
          body: false
        }
      }
      context.done();
    })
  } else {
    context.res = {
      status: 400,
      body: "Please provide a string body"
    };
    context.done();
  }
};
