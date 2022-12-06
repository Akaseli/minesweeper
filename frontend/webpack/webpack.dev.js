const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { output } = require('./webpack.common')

module.exports = {
  mode: "development",
  devServer: {
    hot: true,
    open: true
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    
  },
  plugins : [
    new ReactRefreshWebpackPlugin()
  ],
  output:{
    publicPath: '/'
  }
}

/*
plugins : [
  new webpack.DefinePkugin({
    'process.enc.name': JSON.stringify('VAR')
  })
]
*/