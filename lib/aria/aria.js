import ariaExtensions from '../aria-extensions';
import customRoles from './custom-roles';
import elements from './elements.json';
import symbol from '../symbol';

const element = symbol('element');
const ignoreRole = symbol('ignoreRole');
const inheritedPresentation = symbol('inheritedPresentation');

export default class Aria {
  constructor(node) {
    this.node = node;
  }

  get [element]() {
    return elements[this.node.nodeName.toLowerCase()] || {};
  }

  [ignoreRole](role) {
    if (!role || !['none', 'presentation'].includes(role)) {
      return false;
    }
    if (this.disallowNone) {
      return true;
    }
    return ariaExtensions.globalAttributes.some(name => this.node.hasAttribute(`aria-${name}`));
  }

  get [inheritedPresentation]() {
    const parentAria = Aria.create(this.node.parentNode);
    if (!parentAria.implicit) {
      return null;
    }

    const ownedRoles = (ariaExtensions.roles[parentAria.implicit].requiredOwnedElements || [])
      .map(([role]) => role);

    if (!ariaExtensions.roleMatches(this.implicit, ownedRoles)) {
      return null;
    }

    const parentRole = parentAria.role;
    if (!['none', 'presentation'].includes(parentRole)) {
      return null;
    }

    return parentRole;
  }

  get role() {
    let role = null;
    const roles = (this.node.getAttribute('role') || '').split(/\s+/).filter(Boolean);
    // Use the first valid, non-abstract role
    for (const name of roles) {
      const roleDescription = ariaExtensions.roles[name];
      if (roleDescription && !roleDescription.abstract) {
        role = name;
        break;
      }
    }
    return (!this[ignoreRole](role) && role)
      || this[inheritedPresentation]
      || this.implicit;
  }

  get implicit() {
    return this[element].implicit || null;
  }

  get allowedRoles() {
    // All roles that are not the implicit role
    const { roles } = ariaExtensions;
    const { implicit } = this;
    return this[element].allowedRoles
      || Object.keys(roles).filter(name => !roles[name].abstract && name !== implicit);
  }

  get allowedAttributes() {
    const { role } = this;

    if (customRoles[role] && customRoles[role].allowedAttributes) {
      return customRoles[role].allowedAttributes.call(this);
    }

    if (this[element].attributes === false) {
      return [];
    }
    const implicit = this.implicitAttributes;
    return ariaExtensions.roleAttributes(role || 'roletype').filter(name => !implicit.includes(name));
  }

  get implicitAttributes() {
    const { role } = this;

    if (customRoles[role] && customRoles[role].implicitAttributes) {
      return customRoles[role].implicitAttributes.call(this);
    }

    return this[element].implicitAttributes || [];
  }

  get nativeLabel() {
    return this[element].nativeLabel || null;
  }
}
