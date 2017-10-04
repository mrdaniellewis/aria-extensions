(function () {
  // -------------------------------------
  // Make before/after names more explicit
  // -------------------------------------
  window.beforeAll = before;
  window.afterAll = after;
  window.before = () => { throw new Error('use `beforeAll`'); };
  window.after = () => { throw new Error('use `afterAll`'); };

  // -------------------------------------
  // Somewhere to dump data shared between tests
  // -------------------------------------
  window.testData = {};

  // -------------------------------------
  // Custom assertions
  // -------------------------------------

  expect.extend({
    // Like toEqual, but tells you what is wrong
    toMatchArray(array) {
      try {
        expect(this.actual.sort()).toEqual(array.sort());
      } catch (e) {
        const missing = array.filter(item => !this.actual.includes(item));
        const additional = this.actual.filter(item => !array.includes(item));
        const parts = [
          missing.length ? `to include ${JSON.stringify(missing)}` : null,
          additional.length ? `not to include ${JSON.stringify(additional)}` : null,
        ].filter(Boolean);
        throw new Error(`Expected array ${parts.join(' and ')}`);
      }
      return this;
    },

    // Matches the arguments in each call made to a spy
    toHaveHadCalls() {
      expect(this.actual.calls.map(call => call.arguments)).toEqual(Array.from(arguments));
      return this;
    },

    toIncludeProperties(ob) {
      Object.entries(ob).forEach(([name, entry]) => {
        try {
          if (Array.isArray(ob[name])) {
            expect(entry).toMatchArray(this.actual[name]);
          } else {
            expect(entry).toEqual(this.actual[name]);
          }
        } catch (e) {
          e.message += ` on ${name}`;
          throw e;
        }
      });
      return this;
    },
  });

  // -------------------------------------
  // Turn a timeout into a promise
  // -------------------------------------
  window.afterTimeout = fn => new Promise(resolve => resolve(fn()));

  // -------------------------------------
  // Ensure each test has assertions
  // -------------------------------------
  let hasAssertions = false;
  const originalExpect = expect;
  Object.defineProperty(window, 'expect', {
    get() {
      hasAssertions = true;
      return originalExpect;
    },
    enumerable: true,
  });

  beforeEach(() => {
    hasAssertions = false;
  });

  afterEach(function () {
    if (!hasAssertions) {
      this.test.error(new Error('test has no assertions'));
    }
  });

  // -------------------------------------
  // Clean up spies
  // -------------------------------------
  afterEach(() => {
    expect.restoreSpies();
  });

  // -------------------------------------
  // Clean up created elements between tests
  // -------------------------------------
  window.whenDomUpdates = null;
  window.clean = (context = () => window) => {
    let cleaner, pause;

    beforeAll(() => {
      cleaner = context().domCleaner({ exclude: '#mocha *' });
    });

    beforeEach(() => {
      pause = false;
      window.whenDomUpdates = function (fn) {
        return new Promise(resolve => cleaner.onUpdate(resolve))
          .then(fn);
      };
    });

    afterEach(() => {
      window.whenDomUpdates = null;
      if (pause) {
        cleaner.clear();
        return undefined;
      }
      return Promise.resolve().then(() => cleaner.clean());
    });

    afterAll(() => {
      cleaner.stop();
    });

    return {
      pause() {
        pause = true;
      },
    };
  };

  // -------------------------------------
  // Asynchronously load scripts and tests
  // -------------------------------------
  window.requireScript = function (url) {
    return fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error(`${url} returned ${response.status}`);
      });
  };

  window.requireModule = function (url) {
    const module = { exports: {} };
    return requireScript(url)
      .then((content) => {
        // eslint-disable-next-line no-new-func
        new Function('module', 'exports', content)(module, module.exports);
        return module.exports;
      });
  };

  window.loadingTests = [];
  Mocha.Suite.prototype.requireTests = function requireTests(url, run) {
    run = run || (content => new Function(content)()); // eslint-disable-line no-new-func

    const loading = requireScript(url)
      .then((content) => {
        const stack = [this];
        const hooks = ['beforeAll', 'beforeEach', 'afterAll', 'afterEach', 'describe', 'context', 'it'];
        const oldHooks = {};
        hooks.forEach(name => (oldHooks[name] = window[name]));

        window.describe = window.context = (title, fn) => {
          const block = new Mocha.Suite(title);
          stack[0].addSuite(block);
          stack.unshift(block);
          fn();
          stack.shift();
        };

        window.it = (title, fn) => {
          stack[0].addTest(new Mocha.Test(title, fn));
        };

        ['beforeAll', 'beforeEach', 'afterAll', 'afterEach'].forEach((name) => {
          window[name] = fn => stack[0][name](fn);
        });

        run(content);

        hooks.forEach(name => (oldHooks[name] = oldHooks[name]));
      })
      .catch((e) => {
        this.beforeAll(() => {
          throw new Error(`cannot load ${url}: ${e}`);
        });
      });

    window.loadingTests.push(loading);
  };
}());
