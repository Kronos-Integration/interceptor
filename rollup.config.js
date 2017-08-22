/* jslint node: true, esnext: true */
'use strict';

export default {
  plugins: [],
  external: ['model-attributes'],
  input: pkg.module,

  output: {
    format: 'cjs'
    file: pkg.main,
  }
};
