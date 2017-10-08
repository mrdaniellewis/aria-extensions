/**
 * Role extensions
 */

const ariaExtensions = require('../aria-extensions');
const { extend, namespace } = require('../constants');
const Aria = require('../aria');
const implicit = require('../aria/implicit.json');

const cache = Symbol(`${namespace}-cache`);
const { symbols } = ariaExtensions;

ariaExtensions[extend](Element.prototype, 'role', {
  get() {
    return Aria.create(this).role;
  },
});

ariaExtensions[extend](Element.prototype, 'aria', {
  get() {
    return Aria.create(this);
  },
});

ariaExtensions[extend](Element.prototype, 'hasRole', {
  value(roles, options) {
    const actualRole = this[symbols.role];
    if (!actualRole) {
      return false;
    }
    return ariaExtensions.roleMatches(actualRole, roles, options);
  },
});

ariaExtensions[extend](Element.prototype, 'closestRole', {
  value(roles, options) {
    if (ariaExtensions.roleMatches(this[symbols.role], roles, options)) {
      return this;
    }
    return this.parentElement && this.parentElement[symbols.closestRole](roles, options);
  },
});

ariaExtensions[extend](Element.prototype, 'findRole', {
  value(roles, { exact = false } = {}) {
    if (exact) {
      roles = [].concat(roles);
    } else {
      roles = ariaExtensions.expandWithChildRoles(roles);
    }

    const selector = roles.map(name => `[role~="${name}"]`);

    roles.forEach((name) => {
      if (implicit[name]) {
        selector.push(...implicit[name]);
      }
    });

    const elements = Array.from(this.querySelectorAll(selector.join(',')));
    if (this.matches(selector)) {
      elements.unshift(this);
    }
    return elements.filter(el => el[symbols.hasRole](roles, { exact }));
  },
});

ariaExtensions[cache] = new Map();
ariaExtensions.expandWithChildRoles = function expandWithChildRoles(names) {
  names = [].concat(names);

  const cacheKey = `child-${names.sort().join()}`;
  if (this[cache].has(cacheKey)) {
    return [...this[cache].get(cacheKey)];
  }
  // [...new Set()] gives a unique array
  const found = [...new Set(names.concat(...names.map(name => (
    this.expandWithChildRoles(Object.entries(this.roles)
      .filter(([, role]) => role.superclass.includes(name))
      .map(([roleName]) => roleName))
  ))))].sort();

  this[cache].set(cacheKey, found);
  return found;
};

ariaExtensions.roleAttributes = function roleAttributes(name) {
  const key = `attributes-${name}`;
  if (this[cache].has(key)) {
    return this[cache].get(key);
  }
  let attributes = new Set();
  [name].forEach(function iterate(role) {
    (this.roles[role].attributes || []).forEach(attribute => attributes.add(attribute));
    this.roles[role].superclass.forEach(iterate, this);
  }, this);

  attributes = [...attributes].sort();

  this[cache].set(key, attributes);
  return attributes;
};

ariaExtensions.roleMatches = function roleMatches(names, againstNames, { exact = false } = {}) {
  if (exact) {
    againstNames = [].concat(againstNames);
  } else {
    againstNames = this.expandWithChildRoles(againstNames);
  }
  return [].concat(names).some(name => againstNames.includes(name));
};

Object.defineProperty(ariaExtensions, 'globalAttributes', {
  enumerable: true,
  get() {
    return this.roleAttributes('roletype');
  },
});
