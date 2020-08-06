const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  mode:"development",
  entry: "./src/app/index.js",
  output: {
    path: `${__dirname}/public/js/webpack`,
    filename: "bundle.js"
  },
  /*  mode:"development",
  entry: "./src/app/login.js",
  output: {
    path: `${__dirname}/public/js/webpack`,
    filename: "bundleLogin.js"
  },  */
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
