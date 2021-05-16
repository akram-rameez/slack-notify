module.exports = {
  presets: [
    '@babel/env',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/transform-runtime',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
};
