import { Configuration } from 'webpack';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';

const devEnv = 'development';
const env = process.env.NODE_ENV || devEnv;
const isDev = env === devEnv;

console.log('isDev', isDev);

const config: Configuration = {
  mode: 'production',
  devtool: 'inline-source-map',
  entry: {
    content_scripts: path.resolve(__dirname, 'src/content_scripts.ts'),
    background: path.resolve(__dirname, 'src/background.ts'),
    options: path.resolve(__dirname, 'src/options.ts'),
    popup: path.resolve(__dirname, 'src/popup.ts'),
    style: path.resolve(__dirname, 'src/css/style.scss'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    //filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.scss/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: '.' }],
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].css',
    }),
  ],
};

export default config;
