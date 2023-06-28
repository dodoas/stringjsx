# This is a fork of [devlopit/vhtml](https://github.com/developit/vhtml)

#### Changes from developit's version:

 - Returns a [wrapped](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_primitives_and_string_objects) instance of a String instead
 - Stateless ([no sanitize cache](https://github.com/developit/vhtml/issues/34), [no memory leaks](https://github.com/developit/vhtml/issues/20))
 - Allows you to pass a String (object!) with `_vvhtml_safe = true` to skip sanitization for that child (Thank you to [remziatay](https://github.com/remziatay) for the `new String()` idea!)

The wrapped string is not a breaking change if you assign the return value to something like `.innerHTML` or `.textContent`:

```jsx
  document.body.innerHTML = <div><p>this works the same!</p></div>
```

However if you were reliant on typeof or simliar, it might break your code. In
that case you can add `.toString()` or `.valueOf()` to retrieve the primitive
string and keep your code working.

---

# vhtml

### **Render JSX to HTML strings, without VDOM**

> Need to use HTML strings (angular?) but want to use JSX? vhtml's got your back.
>
> Building components? do yourself a favor and use a component framework

---


## Installation

Via npm:

`npm install --save vhtml`


---


## Usage

```jsx
// import the library:
import h from 'vhtml';

// tell babel to transpile JSX to h() calls:
/** @jsx h */

// now render JSX to an HTML string!
let items = ['one', 'two', 'three'];

document.body.innerHTML = (
  <div class="foo">
    <h1>Hi!</h1>
    <p>Here is a list of {items.length} items:</p>
    <ul>
      { items.map( item => (
        <li>{ item }</li>
      )) }
    </ul>
  </div>
);
```

### Functional component rendering!

`vhtml` intentionally does not transform JSX to a Virtual DOM, instead serializing it directly to HTML.
However, it's still possible to make use of basic Pure Functional Components as a sort of "template partial".

When `vhtml` is given a Function as the JSX tag name, it will invoke that function and pass it `{ children, ...props }`.
This is the same signature as a Pure Functional Component in react/preact, except `children` is an Array of already-serialized HTML strings.

This actually means it's possible to build compositional template modifiers with these simple Components, or even higher-order components.

Here's a more complex version of the previous example that uses a component to encapsulate iteration items:

```jsx
let items = ['one', 'two'];

const Item = ({ item, index, children }) => (
  <li id={index}>
    <h4>{item}</h4>
    {children}
  </li>
);

console.log(
  <div class="foo">
    <h1>Hi!</h1>
    <ul>
      { items.map( (item, index) => (
        <Item {...{ item, index }}>
          This is item {item}!
        </Item>
      )) }
    </ul>
  </div>
);
```

The above outputs the following HTML:

```html
<div class="foo">
  <h1>Hi!</h1>
  <ul>
    <li id="0">
      <h4>one</h4>This is item one!
    </li>
    <li id="1">
      <h4>two</h4>This is item two!
    </li>
  </ul>
</div>
```

## Config

### Typescript

Put this in your `compilerOptions`:

```json
  "jsx": "react",
  "jsxFactory": "h",
  "jsxFragmentFactory": "h.Fragment",
```

Also install [@types/vhtml](https://www.npmjs.com/package/@types/vhtml)

## Development

- Use nodejs 12.
- `$ npm install`
- `$ npm test`
