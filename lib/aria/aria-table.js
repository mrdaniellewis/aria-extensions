import Aria from './aria';
import symbol from '../symbol';

export default class AriaTable extends Aria {
  get implicit() {
    return 'table';
  }

  get nativeLabel() {
    return [this.node.caption].filter(Boolean).filter(node => node[symbol('ariaVisible')]);
  }
}
