import Aria from './aria';
import symbol from '../symbol';

export default class AriaTr extends Aria {
  get implicit() {
    return this.node.closest('table')[symbol('hasRole')]('table')
      ? 'row'
      : null;
  }
}
