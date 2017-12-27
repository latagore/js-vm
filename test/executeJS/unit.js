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
      body: str
    })

    expect(context.res.body).to.equal(JSON.parse(str));
    expect(doneSpy.calledOnce).to.be.true;
  })
})
