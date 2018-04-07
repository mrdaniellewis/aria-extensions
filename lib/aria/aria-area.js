import Aria from './aria';

export default class AriaArea extends Aria {
  get implicit() {
    return this.node.href ? 'link' : null;
  }

  get allowedRoles() {
    return [];
  }

  get nativeLabel() {
    return this.node.alt;
  }
}
