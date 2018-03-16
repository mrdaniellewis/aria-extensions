import Aria from './aria';

export default class AriaTh extends Aria {
  get implicit() {
    if (['row', 'rowgroup'].includes(this.node.scope)) {
      return 'rowheader';
    }
    return 'columnheader';
  }
}
