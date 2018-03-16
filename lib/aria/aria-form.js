import Aria from './aria';
import ariaExtensions from '../aria-extensions';
import symbol from '../symbol';

export default class AriaForm extends Aria {
  get implicit() {
    return new ariaExtensions[symbol('AccessibleName')](this.node, { role: 'form' }).build()
      ? 'form'
      : null;
  }

  get allowedRoles() {
    return ['search', 'none', 'presentation'];
  }
}
