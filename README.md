# ARIA extension

Extensions to the element prototype chain allowing aria properties to be queried such as as elements role and accessible name to be queried.

This extends the prototype chain using symbols.  Therefore clashes, even between different versions of the same library, are not possible.

Supports the very latest versions of major browsers only.

## Usage

```js
const { symbols } = ariaExtensions;

// node = <input type="text" aria-label="foo" />
node[symbols.role] // = "textbox"
node[symbols.accessibleName] // = "foo"
```

First you will need to build the build the library.  Either include it in your project, or `npm run build` will build a UMD bundle to `build\index.js`.

## `ariaExtensions`

This is the object exported from `lib/index.js`.

### Properties

- **`symbols`** Holds the symbols used to extend the dom.  See examples.
- **`roles`** settings for aria roles. See [aria-config](https://github.com/mrdaniellewis/aria-config)
- **`attributes`** settings for aria attributes. See [aria-config](https://github.com/mrdaniellewis/aria-config)

`roles` and `attributes` can be modified before any lookups are made.
If they are modified at a later point an internal cache found on `ariaExtensions[symbols.cache]` will need to be cleared.

### Methods

- **`startCaching()`** Start caching all calculated values.
- **`stopCaching()`** Stop caching calculated values and discard cached values.

Useful where a very large number of calculations need to be made while the page is not changing.  For example, checking a page for all elements with insufficient contrast.

## `Element.prototype[symbols.accessibleName]`

Calculates the accessible name for the element according to the [alternative text computation](https://www.w3.org/TR/accname-aam-1.1/#mapping_additional_nd_te).  This is the name a screen reader will see.

```js
// node = <img alt="foo" />
node[symbols.accessibleName] // = 'foo'
```

## `Element.prototype[symbols.accessibleDescription]`

Calcuates the accessible description for the element according to the [alternative text computation](https://www.w3.org/TR/accname-aam-1.1/#mapping_additional_nd_te).  This is the description a screen reader will see.

```js
// node = <input aria-describedby="foo" /><div id="foo">Lorem ipsum</div>
node[symbols.accessibleDescription] // = 'Lorem ipsum'
```

## `Element.prototype[symbols.aria]`

Returns an object containing a description of the allowed aria roles and properties on an element.

Returned object properties:

- **`role`** - String - The calculated role.  Same as that found on `[symbols.role]`
- **`implicitRole`** - String - The implicit role the element will take if there is no `role` attribute.  This depends on the element context.
- **`allowedRoles`** - Array - The roles allowed in the `role` attribute.
- **`allowedAttributes`** - Array - The `aria-*` attributes that may be added to the element
- **`implicitAttributes`** - Array - The `aria-*` attributes that are implicit for this element.

```js
// node = <article />
node[symbols.aria]

// = {
//     role: 'article',
//     implicit: 'article',
//     allowedRoles: ['application', 'document', 'feed', 'main', 'none', 'presentation', 'region'],
//     allowedAttributes: [quite a long list of attibutes],
//     implicitAttributes: [],
//   }

```

### `ariaExtensions.expandWithChildRoles(names)`

Given a role name, or array of role names, add in all the child roles.

- **`names`** - *required* - string or array of strings - The roles to check against

```js
ariaExtensions.expandWithChildRoles('command')
// = [ 'button', 'command', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio' ]
```

### `ariaExtensions.roleAttributes(name)`

Return all attributes for a role.

- **`name`** - *required* - string  - The role to check against

```js
ariaExtensions.roleAttributes('command')
// = ['atomic', 'busy', 'controls', 'current', 'describedby', 'details', 'disabled', 'dropeffect', 'errormessage', 'flowto', 'grabbed', 'haspopup', 'hidden', 'invalid', 'keyshortcuts', 'label', 'labelledby', 'live', 'owns', 'relevant', 'roledescription']
```

### `ariaExtensions.roleMatches(names, againstNames, { exact: false})`

Give a role, or array of roles, check if they are included in another list, which will be expanded to include all child roles.

- **`names`** - *required* - string or array of strings - The roles to check
- **`againstNames`** - *required* - string or array of strings - The roles to check against
- **`exact`** - *optional* - boolean - if true only match against the exact role and not superclass roles.

```js
ariaExtensions.roleMatches('button', 'command') // = true
ariaExtensions.roleMatches('button', 'command', { exact: true }) // = false
```

### `ariaExtensions.globalAttributes`

A shortcut for `ariaExtensions.roleAttributes('roletype')`.  ie get the list of attributes allowed on all roles.

## `Element.prototype[symbols.ariaVisible]`

Is the element visible to a screen reader.  This is a combination of visible, focusable and whether `aria-hidden` has been applied.

```js
// node = <div aria-hidden="true" />
node[symbols.ariaVisible] // = false

// node = <button aria-hidden="true">foo</button>
node[symbols.ariaVisible] // = true as rendered focusable elements cannot be hidden from assistive technology
```

## `Element.prototype[symbols.closestRole](names, { exact = false })`

Returns the closest ancestor, including the element, with the specified role(s).

- **`names`** - *required* - string or array of strings - The roles to check against
- **`exact`** - *optional* - boolean - if true only match against the exact role and not superclass roles.

```js
// node = <button><span /></button>
node[symbols.closestRole]('button') // = <button />
node.querySelector('span')[symbols.closestRole]('button') // = <button />
node[symbols.closestRole](['command', 'link']) // = <button />
node[symbols.closestRole]('command', { exact: true }) // = null
```

## `Element.prototype[symbols.contrastRatio]`

Calculates the contract ratio of a node using [WCAG contrast ratio](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef) definition.

```js
// node = <div style="color: #000; background-color: #aaa">foo</div>
node[symbols.contrastRatio] // = 9.04
```

The calculation takes in account opacity and alpha transparency.
Due to differences in composition algorithms the calculated colours and, therefore, the contrast may differ very slightly from the browser's rendered colour.

### `ariaExtensions.contrast(foreground, background)`

Calculate the contract ratio between two colours.  The colours can be any CSS colour property the browser supports.

- **`foreground`** - *required* - string - The foreground colour
- **`background`** - *required* - string - The background colour


```js
ariaExtensions.contrast('#000', '#aaa') // = 9.04
```

## `Element.prototype[symbols.findRole](names, { exact = false })`

Find all descendant elements, including the element, with the specified calculated role(s).

- **`names`** - *required* - string or array of strings - The roles to check against
- **`exact`** - *optional* - boolean - if true only match against the exact role and not superclass roles.

```js
// node = <div><button /><a href="#" /></div>
node[symbols.findRole]('button') // = [<button />]
node[symbols.findRole](['button', 'link') // = [<button />, <a href="#" />]
node[symbols.findRole]('command', { exact: true }) // = []
```

## `Element.prototype[symbols.focusable]`

Is the element focusable according to the HTML 5 specification.

```js
// node = <div tabindex="-1" />
node[symbols.focusable] // = true
```

## `Element.prototype[symbols.hasRole](names, { exact = false })`

Does an element have a role.  Allows testing against a single role or an array of roles.

- **`names`** - *required* - string or array of strings - The roles to check against
- **`exact`** - *optional* - boolean - if true only match against the exact role and not superclass roles.

```js
// node = <button />
node[symbols.hasRole]('button') // = true
node[symbols.hasRole](['command', 'link']) // = true
node[symbols.hasRole]('command', { exact: true }) // = false
```

## `HTMLMapElement.prototype[symbols.images]`

An array of `<img>` elements referencing this `<map>` element.

```js
// node = <map name="foo" /><img usemap="#FOO" />
node[symbols.images] // = [<img usemap="#FOO" />
```

## `Element.prototype[symbols.role]`

Calculates the elements role.  This is either the provided role or the implicit role.  The implicit role can depend on elements context.

```js
// node = <div role="foo feed" />
node[symbols.role] // = 'feed'
```

## `Element.prototype[symbols.style](name, pseudo)`

This is sugar for `window.getComputedStyle(node, pseudo)[name]`.
It also takes part in the caching mechanism (see `startCaching()`).

- **`name`** - *required* - string - Name of the property to read
- **`pseudo`** - *optional* - string - Query a pseudo property.  The value should start with a `:`.

```js
// node = <div hidden />
node[symbols.style]('display') // = 'none'
```

## `Element.prototype[symbols.visible]`

Is the element displayed.  That is, is `style.display` not set to `none` and `style.visibility` not set to `hidden` or `collapsed`.

```js
// node = <div hidden />
node[symbols.visible] // = false
```