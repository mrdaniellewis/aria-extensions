/**
 * Common native label implementations
 */
const { symbols } = require('../aria-extensions');

exports.label = function label(node) {
  return Array.from(node.labels).filter(el => el[symbols.ariaVisible]);
};

exports.firstChild = function firstChild(node, childName) {
  const found = Array.from(node.children).find(el => el.nodeName.toLowerCase() === childName);
  return found && found[symbols.ariaVisible] ? found : null;
};
