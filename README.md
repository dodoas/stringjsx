# stringjsx

## Render JSX to HTML

This library allows you to write jsx syntax but transform it into a string at
runtime. It also sanitizes any interpolated strings, unlike using template
strings, where you would need to do so manually.

## Installation

Put in your `package.json` `"dependencies"`:
```json
{
  // ...
  "stringjsx": "^3.0.0",
  // ...
}
```

Or use npm:

`npm install --save stringjsx`

Or yarn:

`yarn add stringjsx`

Or pnpm:

`pnpm install stringjsx`

## Usage

### Configuration

In order for stringjsx to work you need a compiler supporting jsx, which comes with
some options.

If, for example, you have a `tsconfig.json`, it should contain:

```json
{
  // ...
  "compilerOptions": {
    // ...
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "h.Fragment",
    // ...
  },
  // ...
}
```

What matters is that `h` is the default export from the stringjsx
package and that your compiler knows to use that name for all your jsx code.

The `FragmentFactory` should in some way be set to `<default export>.Fragment`.

You may also be able to configure your compiler to inject the import line.

### Writing jsx

Now you can render jsx to strings in your code:

```jsx
document.body.innerHTML = <div>
  <p>this is my dom</p>
  <p>haha</p>
</div>
```

If you configured your fragment factory correctly you should also be able to
do fragments:

```jsx
function f1() {
  return (<>
    <div>three</div>
    <div>root</div>
    <div>elements</div>
  </>)
}

document.body.innerHTML = <div>
  {f1()}
  <p>success!</p>
</div>
```

### tsx

Since the package comes with types you should be able to just use it as is.
[Note that the type checking may not be perfect](https://github.com/developit/vhtml/issues/19#issuecomment-757658538).

```tsx
const coolDOMString: string = <div>my div</div>;
```

### "Component" rendering

`stringjsx` serializes JSX directly to HTML.
However, it's still possible to create a basic kind of Pure Functional Components as a sort of "template partial".

When `stringjsx` is given a Function as the JSX tag name, it will invoke that function and pass it `{ children, ...props }`.
This is the same signature as a Pure Functional Component in react/preact, except `children` is an Array of already-serialized HTML strings.

This actually means it's possible to build compositional template modifiers with these simple Components, or even higher-order components.

Here's a more complex example that uses a component to encapsulate iteration items:

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

### Sanitization

stringjsx sanitizes html for you:

```jsx
const username = '<script>alert("hacked");</script>'

const html = <div><span>{username}</span></div>;
```

becomes:

```html
<div><span>&lt;script&gt;alert(&quot;hacked&quot;);&lt;/script&gt;</span></div>
```

#### Skipping sanitization

To skip sanitization you have two options:

##### dangerouslySetInnerHTML

```jsx
const username = '<script>alert("hacked");</script>'

const html = <div>
  <span dangerouslySetInnerHTML={{__html: username}}>this will be overwritten</span>
</div>;
```

This will also overwrite any content you put in that element normally.

##### `_stringjsx_sanitized`

```jsx
const username = new String('<script>alert("hacked");</script>');
username._stringjsx_sanitized = true;

const html = <div><span>{username}</span></div>;
```

Note: [you must use the String constructor to do this](./misc/typescript_string.md#what-is-a-string-and-why-is-it-not-a-string).

## Credits

- [Jason Miller](https://github.com/developit) (original creator of [vhtml](https://github.com/developit/vhtml))
- [Odin](https://github.com/odinhb) (created stringjsx from vhtml, rewrote the code for readability, pulling in improvements from other forks)

## Setting up for development

Contribution/maintenance instructions follow.

- `$ asdf install` (Use nodejs version as specified in `.tool-versions`)
- `$ npm install`
- `$ npm test`

### Contributing

- [ ] Fork
- [ ] Add tests
- [ ] Make your changes
- [ ] Add or change any documentation
- [ ] Add an unreleased entry to the changelog
- [ ] Make sure the benchmark compares favourably to vhtml
- [ ] Submit your pull request

### Benchmarking

- `$ npm run bench`
- `$ node tmp/bench.node.js`
- OR open `bench.html` in browser

### Version bumping

- Update the changelog
- `$ npm version patch|minor|major`
- `$ npm run prepare` (make sure the tests are passing!)
- `$ npm publish`
