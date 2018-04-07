import Aria from './aria';
import { label } from './native-label';

export default class AriaTextarea extends Aria {
  get implicit() {
    return 'textbox';
  }

  get allowedRoles() {
    return [];
  }

  get implicitAttributes() {
    return ['disabled', 'placeholder', 'required', 'readonly'];
  }

  get nativeLabel() {
    return label(this.node);
  }
}
