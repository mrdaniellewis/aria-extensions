import Aria from './aria';
import { firstChild } from './native-label';

export default class AriaFigure extends Aria {
  get implicit() {
    return 'figure';
  }

  get allowedRoles() {
    return ['group', 'none', 'presentation'];
  }

  get nativeLabel() {
    return firstChild(this.node, 'figcaption');
  }
}
