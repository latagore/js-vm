require('dotenv').config();

const getIntent = require('../../getIntent');
const expect = require('chai').expect;
const sinon = require('sinon');
const nock = require('nock');


describe('getIntent cloud function', () => {
  it('integrates with Dialogflow', () => {
    return runGetIntent("hello")
    .then((intent) => {
      expect(intent).to.equal("smalltalk.greetings.hello")
    })

    .then(() => runGetIntent("123"))
    .then((intent) => {
      expect(intent).to.equal("entity.sys.number")
    })
  })
});

function runGetIntent(query, lang = 'en') {
  return new Promise(resolve => {
    const context = {
      log: () => {},
      done: () => {
        resolve(context.res.body);
      }
    };
    getIntent(context, {
      body: {
        lang,
        query,
        sessionId: getRandomInt()
      }
    })
  })
}

// taken from https://stackoverflow.com/a/1527820
function getRandomInt(min, max) {
  if (min === undefined && max === undefined) {
    min = 0;
    max = 100000000000;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
