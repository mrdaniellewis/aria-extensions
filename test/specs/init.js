let extensions;

clean();

beforeEach(() => {
  extensions = new AriaExtensions();
});

afterEach(() => {
  extensions.destroy();
  extensions = null;
});
