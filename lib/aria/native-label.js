/**
 * Common native label implementations
 */
import symbol from '../symbol';

export function label(node) {
  return Array.from(node.labels).filter(el => el[symbol('ariaVisible')]);
}

export function firstChild(node, childName) {
  const found = Array.from(node.children).find(el => el.nodeName.toLowerCase() === childName);
  return found && found[symbol('ariaVisible')] ? found : null;
}
