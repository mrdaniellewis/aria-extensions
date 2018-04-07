import Aria from './aria';
import { label } from './native-label';

export default class AriaSelect extends Aria {
  get implicit() {
    return this.node.size > 1 || this.node.multiple
      ? 'listbox'
      : 'combobox';
  }

  get allowedRoles() {
    return this.node.size > 1 || this.node.multiple
      ? []
      : ['menu'];
  }

  get implicitAttributes() {
    return ['disabled', 'required'];
  }

  get nativeLabel() {
    return label(this.node);
  }
}
