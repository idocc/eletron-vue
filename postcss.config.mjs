import pxtorem from 'postcss-pxtorem';

export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-pxtorem': pxtorem({
      rootValue: 16,
      propList: ['*'],
      unitPrecision: 5,
      minPixelValue: 2,
      exclude: /node_modules/i,
    }),
  },
};
