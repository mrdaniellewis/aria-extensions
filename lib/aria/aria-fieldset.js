import Aria from './aria';
import { firstChild } from './native-label';

export default class AriaFieldset extends Aria {
  get allowedRoles() {
    return ['group', 'none', 'presentation'];
  }

  get nativeLabel() {
    return firstChild(this.node, 'legend');
  }
}
