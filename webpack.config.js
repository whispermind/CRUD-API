const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports =  (env, argv) => {
  const mode = argv.mode || 'none';
    return {
      entry: './src/cluster.ts',
      output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
      },
      mode,
      module: {
        rules: [
          {
            test: /\.(ts|js)$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.ts'],
      },
      target: "node",
      plugins: [
        new ESLintPlugin(),
        new CleanWebpackPlugin()
      ],
  }
};