import Aria from './aria';
import { label } from './native-label';

export default class AriaOutput extends Aria {
  get implicit() {
    return 'status';
  }

  get nativeLabel() {
    return label(this.node);
  }
}
