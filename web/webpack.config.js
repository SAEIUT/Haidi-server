module.exports = {
  module: {
      rules: [
          {
              test: /\.css$/,
              use: [
                  'style-loader', // Injecte les styles dans le DOM
                  'css-loader',   // Interprète `@import` et `url()`
                  'postcss-loader', // Applique les transformations PostCSS
              ],
          },
          {
              test: /\.scss$/,
              use: [
                  'style-loader',
                  'css-loader',
                  'postcss-loader',
                  'resolve-url-loader', // Résout les URLs dans les fichiers SCSS
                  {
                      loader: 'sass-loader',
                      options: {
                          sourceMap: true, // Active les source maps pour le débogage
                      },
                  },
              ],
          },
      ],
  },
};