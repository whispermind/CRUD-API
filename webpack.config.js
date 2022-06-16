import path from 'path';
import * as process from 'process';
import * as url from 'url';
import ESLintPlugin from 'eslint-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const mode = process.argv.mode | 'none';

export default (env, argv) => {
  const mode = argv.mode || 'none';
    return {
      entry: './src/index.ts',
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
        extensions: ['.ts', '.js']
      },
      plugins: [
        new ESLintPlugin(),
        new CleanWebpackPlugin()
      ],
  }
};