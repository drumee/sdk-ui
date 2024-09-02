const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { join } = require('path');
const Resolve = require('./webpack/resolve');
const Module = require('./webpack/module');
const Plugins = require('./webpack/plugins');

const {
  ENDPOINT_NAME,
  USER,
  UI_BUILD_PATH,
  BUILD_MODE,
  BUILD_TARGET,
  UI_SRC_PATH,
  OUTPUT_FILENAME
} = process.env;

/**
 * 
 * @param {*} entry 
 * @param {*} opt 
 * @returns 
 */
function makeOptions(entry, opt) {

  let output = {
    path: opt.bundle_path,
    publicPath: opt.public_path,
    filename: OUTPUT_FILENAME || "[name]-[fullhash].js",
  };

  console.group(`BUNDLING target **${opt.target}**`);
  console.log(`::::: WITH :::: `, { entry, output, opt });

  const res = {
    mode: opt.mode || 'development',
    entry,
    output,
    resolve: Resolve(__dirname),
    plugins: Plugins(webpack, opt),
    module: Module(__dirname, opt.mode),
    node: {
      __filename: true
    },
    stats: {
      assets: true,
      modules: true,
      orphanModules: true,
    },
    context: __dirname,
    optimization: {
    }
  };

  if (['production'].includes(opt.mode)) {
    res.optimization.minimize = true;
    res.optimization.minimizer = [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Do not change
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: true,
          keep_fnames: true,
          safari10: false,
        },
      })
    ]
  }
  return res;
}

/**
 * 
 * @returns 
 */
function normalize() {

  let bundle_base = UI_BUILD_PATH;
  if (!bundle_base) {
    bundle_base = UI_RUNTIME_PATH;
  }

  if (!bundle_base) {
    throw "Either UI_RUNTIME_PATH or UI_BUILD_PATH must be set";
  }

  let endpointName = ENDPOINT_NAME || USER;
  let target = BUILD_TARGET || 'app';
  let public_path = `/-/${endpointName}/${target}/`;
  if (ENDPOINT_NAME == 'main') {
    public_path = `/-/${target}/`;
  }

  const mode = BUILD_MODE || 'development';
  let bundle_path = join(bundle_base, target);
  let opt = {
    bundle_base,
    bundle_path,
    public_path,
    target,
    mode,
    sync_templates: 1
  };
  if (OUTPUT_FILENAME == "[name].js") {
    opt.no_hash = 1;
  }
  return opt;
}


module.exports = function () {
  const opt = normalize();
  let main, core, api;
  let pdfworker;
  switch (BUILD_TARGET) {
    // case 'custom':
    // Custom build goes here
    // return makeOptions({ custom, core }, opt);
    case 'app':
      main = join(UI_SRC_PATH, 'main');
      let dom = join(UI_SRC_PATH, 'dom');
      return makeOptions({ main, dom }, opt);
    default:
      console.log(`Unexpect target ${BUILD_TARGET}`)
  }
}
