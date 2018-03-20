/**
 *  Focusable extensions
 */
import ariaExtensions from '../aria-extensions';
import symbol from '../symbol';

const rInt = /^\s*[+-]?\d+$/;
const focusableSelector = 'a[href],button,input:not([hidden]),select,textarea,audio[controls],video[controls]';

function isContentEditableContext(el) {
  if (el.contentEditable !== 'true') {
    return false;
  }
  const closestEditable = el.parentElement.closest('[contenteditable]');
  return !closestEditable || closestEditable.contentEditable !== 'true';
}

ariaExtensions[symbol('extend')](Element.prototype, 'focusable', {
  get() {
    const maybeFocusable = rInt.test(this.getAttribute('tabindex') || '')
      || this.getAttribute('draggable') === 'true'
      || this.matches(focusableSelector)
      || isContentEditableContext(this);

    return maybeFocusable && !this.matches(':disabled') && this[symbol('visible')];
  },
});

ariaExtensions[symbol('extend')](HTMLAreaElement.prototype, 'focusable', {
  get() {
    return this[symbol('visible')];
  },
});

const findFocusableDescriptor = {
  value() {
    const found = Array.from(this.querySelectorAll(`${focusableSelector},area,[tabindex],[draggable],[contenteditable]`));
    if (this instanceof Element) {
      found.unshift(this);
    }
    return found.filter(el => el[symbol('focusable')]);
  },
};

ariaExtensions[symbol('extend')](Element.prototype, 'findFocusable', findFocusableDescriptor);
ariaExtensions[symbol('extend')](HTMLDocument.prototype, 'findFocusable', findFocusableDescriptor);
