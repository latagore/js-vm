const executeJS = require('../../executeJS');
const expect = require('chai').expect;
const sinon = require('sinon');
const nock = require('nock');

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
    return new Promise((resolve) => {
      const context = {
        log: () => {},
        done: () => {
          // test when done
          expect(context.res.body).to.equal(result);
          resolve();
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
  });

  it('allows use of request-promise library', () => {
    // wait for callback to be executed
    return new Promise((resolve) => {
      const html = "<html></html>";
      nock('https://www.yahoo.com')
      .get('/')
      .reply(200, html);

      const context = {
        log: () => {},
        done: () => {
          // test when done
          expect(context.res.body).to.equal(html);
          resolve();
        }
      };
      const str = 'rp("https://www.yahoo.com/")'
      executeJS(context, {
        body: str,
        query: {
          async: "true"
        }
      })
    });
    })

})
