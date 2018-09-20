const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// require("regenerator-runtime/runtime");
// const { CheckerPlugin } = require("awesome-typescript-loader");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

const createSrcPath = pathname => path.resolve(__dirname, "src", pathname);

const config = {
  entry: {
    config: "./src/config/index.js",
    video_overlay: "./src/video_overlay/index.tsx",
    widget: "./src/widget/index.tsx"
    // widget: ["babel-polyfill", "./src/widget/index.tsx"]
    // widget: "./src/widget/index.js"
  },

  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js",
    // publicPath: "/static/",
    libraryTarget: "umd"
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      config: createSrcPath("config"),
      videooverlay: createSrcPath("video_overlay"),
      widget: createSrcPath("widget")
    }
  },

  // prettier-ignore
  externals: {
    "react": {
      root: "React",
      commonjs: "react",
      commonjs2: "react",
    },
    "prop-types": {
      root: "PropTypes",
      commonjs: "prop-types",
      commonjs2: "prop-types"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs: "react-dom",
      commonjs2: "react-dom"
    },
    "styled-components": {
      root: "styled",
      commonjs: "styled-components",
      commonjs2: "styled-components"
    },
    "mobx": {
      root: "mobx",
      commonjs: "mobx",
      commonjs2: "mobx"
    },
    "mobx-react": {
      root: "mobxReact",
      commonjs: "mobx-react",
      commonjs2: "mobx-react"
    },
    "lottie-web": {
      root: "lottie",
      commonjs: "lottie",
      commonjs2: "lottie"
    },
    "axios": {
      root: "axios",
      commonjs: "axios",
      commonjs2: "axios"
    },
    "socket.io-client": {
      root: "io",
      commonjs: "socket.io-client",
      commonjs2: "socket.io-client"
    },
    "soundManager": {
      root: "soundManager",
      commonjs: "soundManager",
      commonjs2: "soundManager"
    }
  },

  plugins: [
    // new CopyWebpackPlugin([{ from: "src/images", to: "images" }])
    new CopyWebpackPlugin([{ from: "src/**/*.html", to: "./", flatten: true }]),
    new CopyWebpackPlugin([{ from: "src/external_libs", to: "./libs" }]),
    new webpack.ProvidePlugin({
      regeneratorRuntime: "regenerator-runtime/runtime"
    })
  ],

  module: {
    // noParse: ["react"],
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.(ts|tsx)$/,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader?name=img/[name].[ext]"
            // options: { useRelativePath: "false" }
          }
        ]
      },
      {
        test: /\.(mp3)$/,
        use: [
          {
            loader: "file-loader?name=audio/[name].[ext]"
          }
        ]
      },
      // { test: /\.css$/, loader: "style-loader!css-loader" },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        // loader: "url-loader",
        loader: "file-loader",
        options: {
          limit: 65000,
          // mimetype: "application/font-woff",
          name: "fonts/[name].[ext]"
          // publicPath: "fonts/",
          // outputPath: "fonts/"
          // publicPath: "../"
        }
      }
    ]
  },

  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    historyApiFallback: true,
    inline: true,
    open: true,
    https: true,
    port: 8080
  }
};

module.exports = config;
