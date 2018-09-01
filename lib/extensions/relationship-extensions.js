/**
 *  Relationship extensions
 */

import config from 'aria-config';
import ariaExtensions from '../aria-extensions';
import symbol from '../symbol';

Object.entries(config.attributes)
  .filter(([, { value }]) => value === 'id')
  .forEach(([name]) => {
    ariaExtensions[symbol('extend')](Element.prototype, name, {
      get() {
        const id = this.getAttribute(`aria-${name}`);
        if (!id || !id.trim()) {
          return null;
        }
        return document.getElementById(id.trim());
      },
    });
  });

Object.entries(config.attributes)
  .filter(([, { value }]) => value === 'idlist')
  .forEach(([name]) => {
    ariaExtensions[symbol('extend')](Element.prototype, name, {
      get() {
        const ids = this.getAttribute(`aria-${name}`);
        if (!ids || !ids.trim()) {
          return [];
        }
        return ids
          .split(/\s+/)
          .filter(Boolean)
          .map(id => document.getElementById(id))
          .filter(Boolean);
      },
    });
  });
