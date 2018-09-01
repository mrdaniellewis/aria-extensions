import Aria from './aria';
import { label } from './native-label';

const knownTypes = ['hidden', 'text', 'search', 'url', 'tel', 'email', 'password', 'date', 'datetime', 'datetime-local', 'month', 'week', 'time', 'number', 'range', 'color', 'checkbox', 'radio', 'file', 'submit', 'image', 'reset', 'button'];

function getType(node) {
  const type = node.getAttribute('type');
  return knownTypes.includes(type) ? type : 'text';
}

export default class AriaInput extends Aria {
  get implicit() {
    switch (this.node.getAttribute('type')) {
      case 'button':
      case 'image':
      case 'reset':
      case 'submit':
        return 'button';
      case 'checkbox':
        return 'checkbox';
      case 'color':
      case 'date':
      case 'datetime':
      case 'month':
      case 'week':
      case 'time':
      case 'datetime-local':
      case 'file':
      case 'hidden':
      case 'password':
        return null;
      case 'number':
        return 'spinbutton';
      case 'radio':
        return 'radio';
      case 'range':
        return 'slider';
      case 'search':
        if (this.node.list) {
          return 'combobox';
        }
        return 'searchbox';
      default:
        if (this.node.list) {
          return 'combobox';
        }
        return 'textbox';
    }
  }

  get allowedRoles() {
    switch (this.node.getAttribute('type')) {
      case 'button':
        return ['link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'tab'];
      case 'checkbox':
        return ['button', 'menuitemcheckbox', 'option', 'switch'];
      case 'image':
        return ['link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'radio', 'switch'];
      case 'radio':
        return ['menuitemradio'];
      default:
        return [];
    }
  }

  get allowedAttributes() {
    switch (this.node.getAttribute('type')) {
      case 'hidden':
        return [];
      default:
        return super.allowedAttributes;
    }
  }

  get implicitAttributes() {
    const attributes = [];
    const type = getType(this.node);

    if (['text', 'search', 'url', 'tel', 'email', 'password'].includes(type) && !this.node.list) {
      attributes.push('placeholder');
    }
    if (!['hidden', 'range', 'color', 'button', 'submit', 'reset', 'image', 'radio'].includes(type)) {
      attributes.push('required');
    }
    if (!['hidden', 'range', 'color', 'checkbox', 'radio', 'file', 'button', 'submit', 'reset', 'image'].includes(type)) {
      attributes.push('readonly');
    }
    if (['checkbox', 'radio'].includes(type)) {
      attributes.push('checked');
    }
    if (type !== 'hidden') {
      attributes.push('disabled');
    }
    return attributes;
  }

  get nativeLabel() {
    if (this.node.type === 'hidden') {
      return null;
    }

    if (this.node.type === 'image') {
      return this.node.alt || this.node.value || 'Submit Query';
    }

    if (this.node.type === 'submit') {
      return this.node.value || 'Submit';
    }

    if (this.node.type === 'reset') {
      return this.node.value || 'Reset';
    }

    if (this.node.type === 'button') {
      return this.node.value;
    }

    return label(this.node);
  }
}
