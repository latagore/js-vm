const checkGarbage = require('../../checkGarbage');
const expect = require('chai').expect;
const sinon = require('sinon');

function runFn(input, expected) {
  let context;
  return new Promise((resolve, reject) => {
    try {
      context = {
        log: () => {},
        done: resolve
      };
      checkGarbage(context, {
        body: input
      })
    } catch (e) {
      reject();
    }
  }).then(() => {
    expect(context.res.body).to.equal(JSON.parse(expected));
  })
}

describe('checkGarbage cloud function', () => {
  it('can identify english', () => {
    return runFn("my name is steven", false)
      .then(() => runFn("canada is the best country in the whole wide world", false))
      .then(() => runFn("cool", false))
      .then(() => runFn("Time for work!", false))
      .then(() => runFn("I think this is a great time to be alive...   ", false))
  })

  it('can identify garbage', () => {
    return runFn("ahuentoue", true)
      .then(() => runFn("kueueueue ueueue", true))
      .then(() => runFn("c3257", true))
      .then(() => runFn("blitherins", true))
      .then(() => runFn(" uheotuad 4:53P+uerub +}yGBUEnh aueh du+,b heUB HAEOTU    ", true))
      .then(() => runFn("potato1234", true))
  });
})
