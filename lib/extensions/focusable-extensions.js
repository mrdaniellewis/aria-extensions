/**
 *  Focusable extensions
 */
const { extend } = require('../constants');
const ariaExtensions = require('../aria-extensions');

const { symbols } = ariaExtensions;

const rInt = /^\s*[+-]?\d+$/;
const focusableSelector = 'a[href],button,input:not([hidden]),select,textarea,audio[controls],video[controls]';

function isContentEditableContext(el) {
  if (el.contentEditable !== 'true') {
    return false;
  }
  const closestEditable = el.parentElement.closest('[contenteditable]');
  return !closestEditable || closestEditable.contentEditable !== 'true';
}

ariaExtensions[extend](Element.prototype, 'focusable', { get() {
  const maybeFocusable = rInt.test(this.getAttribute('tabindex') || '')
    || this.getAttribute('draggable') === 'true'
    || this.matches(focusableSelector)
    || isContentEditableContext(this);

  return maybeFocusable && !this.matches(':disabled') && this[symbols.visible];
} });

ariaExtensions[extend](HTMLAreaElement.prototype, 'focusable', { get() {
  return this[symbols.visible];
} });
