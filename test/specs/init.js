// Helpful shortcut
window.symbols = ariaExtensions.symbols;

// Remove any created DOM nodes
clean();

// Stop caching if caching has been started
afterEach(() => ariaExtensions.stopCaching());
