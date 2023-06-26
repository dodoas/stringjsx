# vhtml

# This is a fork of [devlopit/vhtml](https://github.com/developit/vhtml)

#### Changes from developit's version:

 - none so far

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
