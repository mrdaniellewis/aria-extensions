import Aria from './aria';
import { label } from './native-label';

export default class AriaProgress extends Aria {
  get implicit() {
    return 'progressbar';
  }

  get allowedRoles() {
    return [];
  }

  get nativeLabel() {
    return label(this.node);
  }
}
