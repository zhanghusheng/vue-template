require('./check-versions')();

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const fs = require('fs');

let webpackConfig;

const target = process.env.target;

function remove(_path) {
  return new Promise((resolve, reject) => {
    rm(_path, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function build(_config, type) {
  const spinner = ora(`building for ${target}...`);
  spinner.start();
  return new Promise(((resolve, reject) => {
    webpack(_config, (err, stats) => {
      spinner.stop();
      if (err) {
        return reject(err);
      }
      process.stdout.write(`${stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      })}\n\n`);

      console.log(chalk.cyan('  Build complete.\n'));
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n',
      ));
      return resolve();
    });
  }));
}

function description() {
  // 目的是为了一个仓库里放置多个项目,
  let { name } = path.parse(process.env.LOCATION); // 根文件夹名
  let relative = path.relative(process.env.LOCATION, process.cwd()); // 项目文件夹与根文件夹的相对路径
  let location = path.join(name, relative); // 项目的路径

  let { assetsRoot, assetsSubDirectory } = config.build;

  let filename = 'README.md';
  let filepath = path.join(assetsRoot, assetsSubDirectory, filename)
  let info = {
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
    time: new Date().toLocaleString(),
    location,
    domain: '',
  };
  fs.writeFileSync(filepath, JSON.stringify(info, null, 2), 'utf-8');
}

Promise.resolve()
  .then(() => {
    if (target == 'vendor') {
      webpackConfig = require('./webpack.vendor.conf');
      return remove(path.join(config.build.assetsRoot));
    } else if (target == 'server') {
      webpackConfig = require('./webpack.server.conf');
    } else if (target == 'client') {
      webpackConfig = require('./webpack.client.conf');
      return remove(path.join(config.build.assetsRoot, config.build.assetsSubDirectory));
    } else {
      console.info(
        '请输入要打包的类型: \n' +
        '  服务器渲染打包:  npm run build:server\n' +
        '  浏览器渲染打包:  npm run build:client\n' +
        '  服务器 + 浏览器: npm run build\n' +
        '  提取依赖库打包:  npm run build:vendor\n',
      );
    }
  })
  .then(() => {
    if (webpackConfig) {
      return build(webpackConfig);
    }
  })
  .then(() => {
    if (target == 'client') {
      description();
    }
  })
  .catch((err) => {
    throw err;
  });
