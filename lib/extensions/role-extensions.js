/**
 * Role extensions
 */

const ariaExtensions = require('../aria-extensions');
const Aria = require('../aria');
const implicit = require('../aria/implicit.json');
const symbol = require('../symbol');

ariaExtensions[symbol('extend')](Element.prototype, 'role', {
  get() {
    return Aria.create(this).role;
  },
});

ariaExtensions[symbol('extend')](Element.prototype, 'aria', {
  get() {
    return Aria.create(this);
  },
});

ariaExtensions[symbol('extend')](Element.prototype, 'hasRole', {
  value(roles, options) {
    const actualRole = this[symbol('role')];
    if (!actualRole) {
      return false;
    }
    return ariaExtensions.roleMatches(actualRole, roles, options);
  },
});

ariaExtensions[symbol('extend')](Element.prototype, 'closestRole', {
  value(roles, options) {
    if (ariaExtensions.roleMatches(this[symbol('role')], roles, options)) {
      return this;
    }
    return this.parentElement && this.parentElement[symbol('closestRole')](roles, options);
  },
});

ariaExtensions[symbol('extend')](Element.prototype, 'findRole', {
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
    return elements.filter(el => el[symbol('hasRole')](roles, { exact }));
  },
});

ariaExtensions[symbol('cache')] = new Map();
ariaExtensions.expandWithChildRoles = function expandWithChildRoles(names) {
  names = [].concat(names);

  const cacheKey = `child-${names.sort().join()}`;
  if (this[symbol('cache')].has(cacheKey)) {
    return [...this[symbol('cache')].get(cacheKey)];
  }
  // [...new Set()] gives a unique array
  const found = [...new Set(names.concat(...names.map(name => (
    this.expandWithChildRoles(Object.entries(this.roles)
      .filter(([, role]) => role.superclass.includes(name))
      .map(([roleName]) => roleName))
  ))))].sort();

  this[symbol('cache')].set(cacheKey, found);
  return found;
};

ariaExtensions.roleAttributes = function roleAttributes(name) {
  const key = `attributes-${name}`;
  if (this[symbol('cache')].has(key)) {
    return this[symbol('cache')].get(key);
  }
  let attributes = new Set();
  [name].forEach(function iterate(role) {
    (this.roles[role].attributes || []).forEach(attribute => attributes.add(attribute));
    this.roles[role].superclass.forEach(iterate, this);
  }, this);

  attributes = [...attributes].sort();

  this[symbol('cache')].set(key, attributes);
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
