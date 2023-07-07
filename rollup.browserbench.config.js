import path from 'path';
import fs from 'fs';
import babel from 'rollup-plugin-babel';
import es3 from 'rollup-plugin-es3';

let pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
  entry: 'bench.js',
  dest: 'tmp/bench.browser.js',
  sourceMap: 'inline',
  format: 'iife',
  globals: {
    'micro-benchmark': 'microBenchmark',
  },
  plugins: [
    babel({
      babelrc: false,
      comments: false,
      presets: [
        ['es2015', { loose:true, modules:false }]
      ].concat(pkg.babel.presets.slice(1)),
      plugins: pkg.babel.plugins
    }),
    es3()
  ]
};
