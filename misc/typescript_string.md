# string, String and Typescript

## TL;DR

Inspect your code to make sure you don't assign your rendered html to anything
that doesn't coerce it to a string automatically. If you want to be accurate
there is a type you can import in typescript, but this is impractical:

```tsx
import h, {StringJSXString} from 'stringjsx';

const s = (<p>sanitized!</p> as unknown as StringJSXString);

// some time later

element.innerHTML = String(s); // you'll need to coerce it back
element.innerHTML = s as unknown as string; // or soothe Typescript
```

## Introduction

For fixing vhtml's sanitization issues, the solution I chose to go for involved
changing the return value from a `string` to a `String`.
In practice, this is fine, because the most likely usage of the library is
to dump the generated html into `.innerHTML =`, but Typescript has a different
idea of how 'fine' it is.

## What is a `String` and why is it not a `string`?

```js
let primitive = 'foo'; // string (normal string primitive)
let wrapped = new String('foo'); // String (wrapped string object)

typeof(primitive) // 'string'
typeof(wrapped) // 'object'

// Note: the new keyword is required, as these just return a primitive string
let coerced1 = String('foo'); // string
let coerced2 = String(69); // string
```

A `String` can have arbitrary properties:

```js
const s = new String('bang')
s.exploded = true
s.exploded // true

s.weirdNumber = 39
s.cool_number // undefined
s.weirdNumber // 39
```

This is a fact we are able to exploit in order to fix vhtml's sanitization.

A string wrapper object is actually created (and promptly discarded to the
garbage collector) whenever you invoke any of the `String` methods on a
primitive `string`. This is what allows you to invoke all the String methods
listed on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) without ever instantiating a wrapper yourself:

```js
'test'.padEnd(8) // returns 'test    ' (a primitive string)
new String('test').padEnd(8) // returns 'test    ' (a primitive string)
```

This magic wrapping also makes it possible to assign arbitrary properties to a
primitive string, even though they are immediately lost:

```js
const s = 'foo';
s.exploded = true;
s.weirdNumber = 39;

s.exploded // undefined
s.weirdNumber // undefined
```

## The DOM APIs

The two kinds of string are generally equally accepted by DOM API methods and
setters:

```js
// these have the same effect
el.innerHTML = 'foo';
el.innerHTML = new String('foo');

el.textContent = 'foo';
el.textContent = new String('foo');

el.after('foo');
el.after(new String('foo'));

el.insertAdjacentHTML('afterbegin', 'foo');
el.insertAdjacentHTML('afterbegin', new String('foo'));
```

When passing wrapped strings or other objects to these methods, they get coerced
according to the rules described [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion), meaning that in
practice you may pass almost anything to these functions, even though it might
lead to "undefined" showing up in your user interface.

## Javascript

String objects are not strictly equal to primitive strings.

```js
'foo' == new String('foo'); // true
'foo' === new String('foo'); // false

new String('foo') == 'foo'; // true
new String('foo') === 'foo'; // false

'foo' == 'foo'; // true
'foo' === 'foo'; // true
// and in true javascript fashion:
new String('foo') == new String('foo'); // false
new String('foo') === new String('foo'); // false
```

String objects are easily coerced back into primitive strings (this is what the
DOM API does implicitly)

```js
const s = new String('foo');
s // String {'foo'}

s.toString(); // 'foo'
String(s); // 'foo'
s.valueOf(); // 'foo'
''+s // 'foo'
s+'' // 'foo'
`${s}` // 'foo'
```

The MDN warns that you should not use the string constructor:

> Warning: You should rarely find yourself using String as a constructor.

## Typescript

The `string` type refers to the primitive and is the one you want 99% of the
time. The `String` type refers to the wrapper object, [and is usually not
something you want to use](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#number-string-boolean-symbol-and-object).

```ts
let primitive: string = 'foo';
let wrapped: String = new String('foo');

primitive = new String('foo'); // error
wrapped = 'foo'; // not an error for some reason
```

The DOM APIs are not typed correctly in the standard library of Typescript.
The most significant of these for the stringjsx library is innerHTML, which is typed
like this:

```ts
interface InnerHTML {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/innerHTML) */
    innerHTML: string;
}
```

However, in the browsers this is actually implemented as a getter/setter pair
with different type signatures. The getter always returns a `string` but the
setter accepts and coerces `string | String | number | boolean <...>`.
Typescript refuses to allow us to express this:

```ts
interface CorrectHTML {
  readonly innerHTML: string; // Error: Duplicate identifier 'innerHTML'.
  innerHTML: string | String | number; // Error: Subsequent property declarations must have the same type.  Property 'innerHTML' must be of type 'string', but here has type 'string | number | String'.
}
```

## Conclusion

- Typescript is not interested in allowing innerHTML to be typed to accept wrapped strings.
- Don't use `new String('')` lightly, Typescript will get in your way.
- stringjsx needs to lie about its exported type definitions in order to be compatible with existing `.innerHTML` assignments.

- Ignore Typescript when working with the DOM APIs, it doesn't know what's going
on and you'll go faster ignoring it.
