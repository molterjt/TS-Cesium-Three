// const cesiumSource = 'node_modules/cesium/Source';
// const cesiumWorkers = '../Build/Cesium/Workers';
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        app: './src/index.tsx'
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        sourcePrefix: ''
    },
    amd: {
        // Enable webpack-friendly use of require in Cesium
        toUrlUndefined: true
    },
    resolve: {
        // alias: {
        //     cesium: path.resolve(__dirname, cesiumSource)
        // },
        // mainFiles: ['index', 'Cesium'],
        mainFiles: ['index'],
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
          }, 
          // {
          //   test: /\.(gif|png|jpe?g|svg|xml)$/i,
          //   use: "file-loader"
          // },
          {
            test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
            use: [ 'url-loader' ]
          },
          // {
          //   test: /\.jpg/,
          //   type: 'asset/resource',
          // },
          {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader'
          },
          // {
          //   test: /\.(png|jpg|jpeg|gif|svg)$/i,
          //   loader: 'file-loader',
          //   options: {
          //     outputPath: 'assets'
          //   }
          // },
          // Rule for textures (images)
          // {
          //   test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
          //   type: "javascript/auto",
          //   loader: "file-loader",
          //   options: {
          //       // publicPath: "/textures",
          //       name: "textures/[name].[ext]",
          //       context: path.resolve(__dirname, "src/textures"),
          //       // emitFile: false,
          //   },
          // },
        

      ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
        //         { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
        //         { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
        //     ]
        // }),
        // new webpack.DefinePlugin({
        //     // Define relative base path in cesium for loading assets
        //     CESIUM_BASE_URL: JSON.stringify('')
        // })
    ],
    mode: 'development',
    devtool: 'eval',
};