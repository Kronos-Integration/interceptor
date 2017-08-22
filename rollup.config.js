import pkg from './package.json';

export default {
  plugins: [],
  external: ['model-attributes'],
  input: pkg.module,

  output: {
    file: pkg.main,
    format: 'cjs'
  }
};
