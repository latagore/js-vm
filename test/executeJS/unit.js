const executeJS = require('../../executeJS');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('executeJS cloud function', () => {
  it('evaluates strings', () => {
    const doneSpy = sinon.spy();
    const context = {
      log: () => {},
      done: doneSpy
    };
    const str = '"hello"';
    executeJS(context, {
      query: {},
      body: str
    })

    expect(context.res.body).to.equal(JSON.parse(str));
    expect(doneSpy.calledOnce).to.be.true;
  })

  it('evaluates simple scripts', () => {
    const doneSpy = sinon.spy();
    const context = {
      log: () => {},
      done: doneSpy
    };
    const str = '(function () { const x = "hello"; return x; })()';
    const result = "hello";
    executeJS(context, {
      query: {},
      body: str
    })

    expect(context.res.body).to.equal(result);
    expect(doneSpy.calledOnce).to.be.true;
  })

  it('evaluates promises and returns resolution with async flag', () => {
    const context = {
      log: () => {},
      done: () => {
        // test when done
        expect(context.res.body).to.equal(result);
      }
    };
    const str = 'Promise.resolve("hello")';
    const result = "hello";
    executeJS(context, {
      body: str,
      query: {
        async: "true"
      }
    })
  });
})
