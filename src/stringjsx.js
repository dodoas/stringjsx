const HTML_ESCAPE_MAP = {
  '&':'amp',
  '<':'lt',
  '>':'gt',
  '"':'quot',
  "'":'apos',
};

function sanitize(str) {
  return String(str)
    .replace(/[&<>"']/g, s => `&${HTML_ESCAPE_MAP[s]};`);
}

let setInnerHTMLAttr = 'dangerouslySetInnerHTML';
let DOMAttributeNames = {
  className: 'class',
  htmlFor: 'for'
};

// Void tags or self closing tags don't require having content.
// They are often written as <tag />.
// https://developer.mozilla.org/en-US/docs/Glossary/Void_element
const VOID_TAGS = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

function extractChildrenReversed(args) {
  const stack = [];

  for (let i = args.length; i-- > 2; ) {
    stack.push(args[i]);
  }

  return stack;
}

function extractChildren(args) {
  const stack = [];

  for (let i = 2; i < args.length; i++) {
    stack.push(args[i]);
  }

  return stack;
}

function renderAttributes(attributes) {
  let result = '';

  for(const property in attributes) {
    const value = attributes[property];

    if (property === setInnerHTMLAttr) continue;
    if (value === false) continue;
    if (value == null) continue;

    result += ' ';
    if (DOMAttributeNames[property]) {
      result += DOMAttributeNames[property];
    } else {
      result += `${sanitize(property)}`;
    }
    result += `="${sanitize(value)}"`;
  }

  return result;
}

function render(tagName, attributes) {
  attributes = attributes || {};

  if (typeof tagName === 'function') {
    const pseudoComponent = tagName;
    attributes.children = extractChildren(arguments);
    return pseudoComponent(attributes);
  }

  const children = extractChildrenReversed(arguments);
  let result = '';

  if (tagName) { // null is passed when rendering a fragment
    result += '<';

    result += tagName;

    result += renderAttributes(attributes);

    result += '>';
  }

  if (!VOID_TAGS.includes(tagName)) {
    if (attributes[setInnerHTMLAttr]) {
      result += attributes[setInnerHTMLAttr].__html;
    } else while(children.length) {
      const child = children.pop();
      if (child) {
        if (child.pop) {
          for (let i = child.length - 1; i >= 0; i--) {
            children.push(child[i]);
          }
        } else {
          if (child._stringjsx_sanitized) {
            result += child;
          } else {
            result += sanitize(child);
          }
        }
      }
    }

    if (tagName) result += `</${tagName}>`;
  }

  // Read about the fun world of javascript strings
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_primitives_and_string_objects
  const s = new String(result);
  s._stringjsx_sanitized = true;
  return s;
}

export default render;
