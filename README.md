# named-slots

A polygap (partial polyfill) for the Shadow DOM Named Slot API using SkateJS.



## Why

- You want to expose a named-slot style public API to your web component consumers
- You don't want to resort to massive, or outdated polyfills
- You don't want to wait for browser adoption
- You don't need allthethings in the [Shadow DOM spec](http://w3c.github.io/webcomponents/spec/shadow/)
- You want interopaberability with React, jQuery and other libraries that don't care about your implementation details
- You want something that is performant



## How

Instead of polyfilling everything, we polyfill only the bare minimum that is required to supply the consumers of your custom elements with an API where they can distribute content to / from your element.

Your consuemrs may use it like so:

```html
<my-component id="example">
  <p>paragraph 1</p>
  <p>paragraph 2</p>
</my-component>
```

Your shadow root may be templated out like:

```html
<div class="wrapper">
  <slot />
</div>
```

Which would result in:

```html
<my-component id="example">
  <div class="wrapper">
    <slot>
      <p>paragraph 1</p>
      <p>paragraph 2</p>
    </slot>
  </div>
</my-component>
```

We support the usage of the `<slot />` element as specified in the Shadow DOM spec as well as any element that has a `slot-name` attribute. Using the `slot-name` attribute is non-standard, but we support it because a there is no clear path right now in how you would distribute list items into a `<ul />` or rows into a `<tbody />` if they don't accept a `<slot />` element to distribute to. This is an implementation detail that your consumers do not need to worry about. They still only have to worry about putting the `slot` attribute on whatever element they want to be slotted. Most of the time you'll be using `<slot>`, but for the edge-cases, you have `slot-name`.



## Usage

To render a shadow root and distribute initial content, the simplest way is to use the `render` function:

```js
import { render } from 'skatejs-named-slots';

const div = document.createElement('div'):
const template = render(function (elem, shadowRoot) {
  shadowRoot.innerHTML = '<div class="wrapper"><slot></slot></div>';
});

// Set initial light DOM.
div.innerHTML = '<p>paragraph 1</p>';

// Render shadow root template and distribute initial light DOM.
template(div);

// Add more content.
div.innerHTML += '<p>paragraph 2</p>';
```

A more streamlined approach would be to use it with a library like [Skate](https://github.com/skatejs/skatejs).



### With Skate (vanilla)

Using with [Skate](https://github.com/skatejs/skatejs) makes things a lot simpler.

```js
import { render } from 'skatejs-named-slots';

skate('my-component', {
  render: render(function (elem, shadowRoot) {
    shadoRoot.innerHTML = '<div class="wrapper"><slot></slot></div>';
  })
});
```



### With Kickflip (Skate + Named Slots + Incremental DOM)

And if you like writing in a more functional way, [Kickflip](https://github.com/skatejs/kickflip) blends this polygap with Skate.

```js
import { div, slot } from 'kickflip/src/vdom';
import kickflip from 'kickflip';

kickflip('my-component', {
  render (elem) {
    div({ class: 'wrapper' }, function () {
      slot();
    });
  }
});
```



## Performance

Obviously, performance is a concern when polyfilling anything and the past has shown Shadow DOM polyfills to be slow. Since we're not polyfilling everything, and don't ever aim to, we strive to keep an acceptable level of performance.

We've written some simple perf tests to show overhead against native. These vary depending on the browser you run them, so if you're concerned about performance, it's best to run these yourself. You can do so by:

1. Clone the repo
2. `npm install`
3. `gulp perf`

For most purposes, the performance should be acceptable. That said, we're always looking at ways to imporove.



## Support

The following lists are an exhaustive representation of what this polygap supports and why for the following interfaces:

- [ChildNode](https://developer.mozilla.org/en/docs/Web/API/ChildNode)
- [Element](https://developer.mozilla.org/en/docs/Web/API/Element)
- [EventTarget](https://developer.mozilla.org/en/docs/Web/API/EventTarget)
- [Node](https://developer.mozilla.org/en/docs/Web/API/Node)
- [NonDocumentTypeChildNode](https://developer.mozilla.org/en/docs/Web/API/NonDocumentTypeChildNode)
- [ParentNode](https://developer.mozilla.org/en/docs/Web/API/ParentNode)

Note:

- `HTMLElement` and any prototypes more specific are not polyfilled for simplicity.
- All members which are not standardised or are listed as experimental are not included in these lists.
- Members are only polyfilled on the specific web component unless otherwise noted.
- Members must be overridden on the instance rather than prototype because WebKit has a bug that prevents correct descritpors from being returned using [`Object.getOwnPropertyDescriptor()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) See https://bugs.webkit.org/show_bug.cgi?id=49739 for more info.



## Polyfilled

These are members which are already polyfilled.

### Properties

- `Element.innerHTML`
- `Element.outerHTML` - Only the getter is polyfilled.
- `Node.childNodes`
- `Node.firstChild`
- `Node.lastChild`
- `Node.nextSibling`
- `Node.nodeValue` - Doesn't need polyfilling because its return value is `null` for all element nodes.
- `Node.parentElement`
- `Node.parentNode`
- `Node.previousSibling`
- `Node.textContent`
- `NonDocumentTypeChildNode.nextElementSibling`
- `NonDocumentTypeChildNode.previousElementSibling`
- `ParentNode.childElementCount`
- `ParentNode.children`
- `ParentNode.firstElementChild`
- `ParentNode.lastElementChild`

### Methods

- `Node.appendChild()`
- `Node.hasChildNodes()`
- `Node.insertBefore()`
- `Node.removeChild()`
- `Node.replaceChild()`

## Maybe

These are members which are not yet polyfilled for a few reasons:

- They'd probably have to be polyfilled for all elements, not just the host.
- They may not behave as expected causing confusion.
- If only part of the finding methods are polyfilled, not polyfilling some may cause confusion.

### Properties

- `Element.id`

### Methods

- `Document.getElementById()`
- `Element.getElementsByClassName()`
- `Element.getElementsByTagName()`
- `Element.getElementsByTagNameNS()`
- `Element.querySelector()`
- `Element.querySelectorAll()`
- `Node.compareDocumentPosition()`
- `Node.contains()`

## Unlikely

These are members which are not polyfilled because it's likely not necessary.

### Properties

- `Element.accessKey`
- `Element.attributes`
- `Element.classList`
- `Element.className`
- `Element.namespaceURI`
- `Element.tagName`
- `Node.baseURI`
- `Node.nodeName`
- `Node.nodeType`
- `Node.ownerDocument`

### Methods

- `Element.getAttribute()`
- `Element.getAttributeNS()`
- `Element.getBoundingClientRect()`
- `Element.getClientRects()`
- `Element.hasAttribute()`
- `Element.hasAttributeNS()`
- `Element.hasAttributes()`
- `Element.releasePointerCapture()`
- `Element.removeAttribute()`
- `Element.removeAttributeNS()`
- `Element.setAttribute()`
- `Element.setAttributeNS()`
- `Element.setPointerCapture()`
- `EventTarget.addEventListener()`
- `EventTarget.dispatchEvent()`
- `EventTarget.removeEventListener()`
- `Node.cloneNode()`
- `Node.isDefaultNamespace()`
- `Node.isEqualNode()`
- `Node.lookupNamespaceURI()`
- `Node.lookupPrefix()`
- `Node.normalize()`
