/**
 * Common native label implementations
 */
const symbol = require('../symbol');

exports.label = function label(node) {
  return Array.from(node.labels).filter(el => el[symbol('ariaVisible')]);
};

exports.firstChild = function firstChild(node, childName) {
  const found = Array.from(node.children).find(el => el.nodeName.toLowerCase() === childName);
  return found && found[symbol('ariaVisible')] ? found : null;
};
