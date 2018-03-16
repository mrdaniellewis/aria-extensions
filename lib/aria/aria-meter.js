import Aria from './aria';
import { label } from './native-label';

export default class AriaMeter extends Aria {
  get allowedRoles() {
    return [];
  }

  get nativeLabel() {
    return label(this.node);
  }
}
