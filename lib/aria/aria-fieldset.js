import Aria from './aria';
import { firstChild } from './native-label';

export default class AriaFieldset extends Aria {
  get implicit() {
    return 'group';
  }

  get allowedRoles() {
    return ['none', 'presentation'];
  }

  get nativeLabel() {
    return firstChild(this.node, 'legend');
  }
}
