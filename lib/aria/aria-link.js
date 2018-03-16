import Aria from './aria';

export default class AriaLink extends Aria {
  get implicit() {
    return this.node.href ? 'link' : null;
  }

  get allowedRoles() {
    return [];
  }

  get allowedAttributes() {
    return [];
  }
}
