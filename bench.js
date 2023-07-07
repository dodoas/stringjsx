import microBenchmark from 'micro-benchmark';
import stringjsx from './src/stringjsx.js';
import vhtml from './misc/vhtml.js';

const runningInBrowser = !!globalThis.document;
console.log('runningInBrowser:', runningInBrowser, '\n');

if (runningInBrowser) {
  document.body.innerHTML = '' +
    '<div id="results"></div>' +
    '<div id="state">ready</div>' +
    '<button id="start">run benchmark</button>'
  ;
  document.body
    .querySelector('#start')
    .addEventListener('click', () => {
      document.querySelector('#start').style.display = "none";
      document.querySelector('#state').textContent = 'benchmarking...';
      setTimeout(() => { doBenchmarking(); });
    });
} else {
  doBenchmarking();
}

function variableName(object) {
  Object.keys({object})[0]
}

function doBenchmarking() {
  const specs = Array([stringjsx, 'stringjsx'], [vhtml, 'vhtml'])
    .flatMap(([h, rendererName]) => {
      return [
        {
          name: rendererName + ' - render a p tag (not compiled)',
          fn: function() {
            return h('p', {class: 'text'}, 'lol');
          },
        },
        {
          name: rendererName + ' - render a p tag',
          fn: function() {
            return (<p class="text">lol</p>);
          },
        },
        {
          name: rendererName + ' - render a 1 child structure',
          fn: function() {
            return (<div>
              <p class="f-text r-text">lolem ipsum</p>
            </div>);
          },
        },
        {
          name: rendererName + ' - render a complex structure',
          fn: function() {
            return (<div class="container">
              <h3>lorem</h3>
              <p class="description">ipsum</p>
              <table>
                <tbody>
                  <tr>
                    <div class="realdata">
                      <span class="make-it-pretty">data</span>
                    </div>
                  </tr>
                </tbody>
              </table>
            </div>);
          },
        },
        {
          name: rendererName + ' - render a complex structure w/ pseudo-components',
          fn: function() {
            const Item = ({item, index, children}) => (
              <tr>
                <li id={index}>
                  <h4>{item}</h4>
                  {children}
                </li>
              </tr>
            );

            const MyTable = ({children}) => (
              <table class="mytable">
                <tbody>
                  {children}
                </tbody>
              </table>
            );

            return (<div class="my-page">
              <MyTable>
                <Item item="1">stuff</Item>
                <Item item="2">things</Item>
                <Item item="3">lols</Item>
              </MyTable>
            </div>)
          },
        },
      ]
    });

  const result = microBenchmark.suite({
    duration: 500,
    maxOperations: 100000,
    specs,
  });

  const report = microBenchmark.report(result);
  console.log(report);

  if (runningInBrowser) {
    const reportTag = document.createElement('pre');
    reportTag.textContent = report;
    document.body
      .querySelector('#results')
      .appendChild(reportTag)
    ;

    document.querySelector('#start').style.display = "block";
    document.querySelector('#state').textContent = 'ready';
  }
}
