import h from '../src/lhtml.js';
import { expect } from 'chai';
/** @jsx h */
/*global describe,it*/

describe('vhtml', () => {
  it('produces a string', () => {
    expect(
      <div class="foo"></div>.toString()
    ).to.equal('<div class="foo"></div>');
  });

  it('handles child elements', () => {
    expect(
      <div>
        <div>
          <div><p></p></div>
        </div>
      </div>.toString()
    ).to.equal('<div><div><div><p></p></div></div></div>');
  });

  it('supports attributes', () => {
    expect(
      <div data-attr="yes">
        <p good="true"></p>
        <div>
          <p bad="yes"></p>
        </div>
      </div>.toString()
    ).to.equal(
      '<div data-attr="yes"><p good="true"></p><div><p bad="yes"></p></div></div>',
    );
  });

  it('sanitizes hardcoded attributes', () => {
    expect(
      <div lol="&<>'"></div>.toString()
    ).to.equal('<div lol="&amp;&lt;&gt;&apos;"></div>');
  });

  it('sanitizes dynamic attributes', () => {
    expect(
      <div onclick={`&<>"'`}></div>.toString()
    ).to.equal(
      `<div onclick="&amp;&lt;&gt;&quot;&apos;"></div>`
    );
  });

  it('sanitizes dynamic children', () => {
    expect(
      <div>
        { `<strong>blocked</strong>` }
      </div>.toString()
    ).to.equal(
      `<div>&lt;strong&gt;blocked&lt;/strong&gt;</div>`
    );
  });

  it('injects html from "dangerouslySetInnerHTML.__html" w/o sanitization', () => {
    expect(
      <div dangerouslySetInnerHTML={{ __html: "<span>Injected HTML</span>" }} />.toString()
    ).to.equal(
      `<div><span>Injected HTML</span></div>`
    );
  });

  it('renders a list of items', () => {
    let items = ['one', 'two', 'three'];
    expect(
      <div class="foo">
        <h1>Hi!</h1>
        <p>Here is a list of {items.length} items:</p>
        <ul>
          { items.map( item => (
            <li>{ item }</li>
          )) }
        </ul>
      </div>.toString()
    ).to.equal(
      `<div class="foo"><h1>Hi!</h1><p>Here is a list of 3 items:</p>` +
      `<ul><li>one</li><li>two</li><li>three</li></ul></div>`,
    );
  });

  it('flattens children', () => {
    expect(
      <div>
        {[['a','b']]}
        <c>d</c>
        {['e',['f'],[['g']]]}
      </div>.toString()
    ).to.equal(
      `<div>ab<c>d</c>efg</div>`
    );
  });

  it('supports pseudo-components', () => {
    let items = ['one', 'two'];

    const Item = ({ item, index, children }) => (
      <li id={index}>
        <h4>{item}</h4>
      </li>
    );

    expect(
      <div class="foo">
        <h1>Hi!</h1>
        <ul>
          { items.map( (item, index) => (
            <Item {...{ item, index }}></Item>
          )) }
        </ul>
      </div>.toString()
    ).to.equal(
      `<div class="foo"><h1>Hi!</h1><ul><li id="0"><h4>one</h4></li>` +
      `<li id="1"><h4>two</h4></li></ul></div>`
    );
  });

  it('supports pseudo-components with no parameters', () => {
    let items = ['one', 'two'];

    const Item = () => (
      <li>
        <h4></h4>
      </li>
    );

    expect(
      <div class="foo">
        <h1>Hi!</h1>
        <ul>
          { items.map( (item, index) => (
            <Item>
              This is item {item}!
            </Item>
          )) }
        </ul>
      </div>.toString()
    ).to.equal(
      `<div class="foo"><h1>Hi!</h1><ul><li><h4></h4></li><li><h4></h4></li></ul></div>`
    );
  });

  it('supports interacting with the children of pseudo-components', () => {
    let items = ['one', 'two'];

    const Item = ({ children }) => (
      <li>
        <h4></h4>
        {children.reverse()}
      </li>
    )

    expect(
      <div class="foo">
        <h1>Hi!</h1>
        <ul>
          { items.map( (item, index) => (
            <Item>
              <div />
              <span>{item}!</span>
              <p />
            </Item>
          )) }
        </ul>
      </div>.toString()
    ).to.equal(
      `<div class="foo"><h1>Hi!</h1><ul><li><h4></h4><p></p><span>one!</span><div></div></li>` +
      `<li><h4></h4><p></p><span>two!</span><div></div></li></ul></div>`
    );
  });

  it('supports void tags', () => {
    expect(
      <div>
        <area />
        <base />
        <br />
        <col />
        <command />
        <embed />
        <hr />
        <img />
        <input />
        <keygen />
        <link />
        <meta />
        <param />
        <source />
        <track />
        <wbr />
      </div>.toString()
    ).to.equal(
      `<div><area><base><br><col><command><embed><hr><img><input><keygen>` +
      `<link><meta><param><source><track><wbr></div>`
    );
  });

  it('expands self closing tags', () => {
    expect(
      <div>
        <div />
        <span />
        <p />
      </div>.toString()
    ).to.equal(
      `<div><div></div><span></span><p></p></div>`
    )
  });

  it('handles special prop names', () => {
    expect(
      <div className="my-class" htmlFor="id" />.toString()
    ).to.equal(
      '<div class="my-class" for="id"></div>'
    );
  });

  it('supports string fragments', () => {
    expect(
      h(null, null, "foo", "bar", "baz").toString()
    ).to.equal(
      'foobarbaz'
    );
  });

  it('supports element fragments', () => {
    expect(
      h(null, null, <p>foo</p>, <em>bar</em>, <div class="qqqqqq">baz</div>).toString()
    ).to.equal(
      '<p>foo</p><em>bar</em><div class="qqqqqq">baz</div>'
    );
  });

  // regression test for https://github.com/developit/vhtml/issues/34
  it('does not allow cache-based html injection anymore', () => {
    const injectable = '<h1>test</h1>';

    const a = <div>{injectable}</div>;
    const b = <div><h1>test</h1></div>;
    const c = <div>{injectable}</div>;

    expect(a.toString()).to.equal('<div>&lt;h1&gt;test&lt;/h1&gt;</div>');
    expect(b.toString()).to.equal('<div><h1>test</h1></div>');
    expect(c.toString()).to.equal('<div>&lt;h1&gt;test&lt;/h1&gt;</div>');
  });
});
