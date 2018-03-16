import Aria from './aria';
import { firstChild } from './native-label';

export default class AriaDetails extends Aria {
  get implicit() {
    return 'group';
  }

  get allowedRoles() {
    return [];
  }

  get nativeLabel() {
    return firstChild(this.node, 'summary');
  }
}
