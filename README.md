# ARIA extension

Extensions to the element prototype chain allowing aria properties to be queried.

This extends the prototype chain using symbols.  Therefore clashes, even between different versions of the same library are not possible.

## Todo

* Contrast extensions
  * Add in opacity
* Use automated caching mechanisum
* Role extensions

## Example

```
// extend the prototype chain
const extensions = new AriaExtensions();

// Run one of the methods
document.body[extensions.symbols.role] // "document"

```

## Constructor

```js
const ariaExtensions = new AriaExtensions(options);
```

Extend the prototype chain.  This extends the prototype chain with a new set of symbols.  The property `symbols` on the instance will contain the newly generated symbols.

### Options

* `options.roles` - A list of all aria roles, and the configuration for those roles.
* `options.attributes` - A list of all aria attributes and the configuration for those attributes.

## Properties

* `symbols` - An object containing the symbols used to extend the prototype chain.  See `extensions` below.
* `roles` - The configuration used for the aria roles.
* `attributes` - The configuration used for the aria attributes.

## Methods

* `destroy()` - Remove the extensions from the prototype chain.
* `startCaching()` - Start caching all returned values.  All computed values on each element will be calculated once and cached.
* `endCaching()` - End caching.  Caching will no longer take place and all cached values will be discarded.

## Extensions

The symbol used can be found on the `symbols` property of the `AriaExtensions` instance.

* `Element.prototype[symbols.style](name, [pseudo])` - Find a calculated style of the current element.
* `Element.prototype[symbols.visible]` - Is the current element visible.
* `Element.prototype[symbols.role]` - The current calculated role of the element.
* `Element.prototype[symbols.allowedAria]` - The roles and aria attributes allowed on the element.
* `Element.prototype[symbols.hasRole](role)` - Does the element have a role.
* `Element.prototype[symbols.closestRole](role)` - The closest ancestor role to the current element.
* `Element.prototype[symbols.findRoles](role)` - Find all elements with a role that are descendants of the element.
* `Element.prototype[symbols.accessibleName]` - The accessible name for the current element.
* `Element.prototype[symbols.accessibleDescription]` - The accessible description for the current element.
* `Element.prototype[symbols.contrastRatio]` - The contrast ratio of the `color` and `backgroundColor` of the current element.
* `HTMLMapElement.prototype[symbols.images]` - The list of images the image map is currently in use on.
