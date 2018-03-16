import Aria from './aria';
import symbol from '../symbol';

export default class AriaTd extends Aria {
  get implicit() {
    const role = this.node.closest('table')[symbol('role')];
    switch (role) {
      case 'grid':
      case 'treegrid':
        return 'gridcell';
      default:
        return 'cell';
    }
  }
}
