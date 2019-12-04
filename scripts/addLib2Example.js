'use strict';
/**
 * 将当前material-js安装到example中去
 */
const path = require('path');
const exec = require('child_process').execSync;
const fs = require('fs-extra');
const mkdirp = require('mkdirp');

const SCRIPT_NAME = 'addLib2Example';
console.log(`${SCRIPT_NAME} start.`);

const libPath = path.resolve(__dirname, '..', 'lib');
const examplePath = path.resolve(__dirname, '..', 'example');

const libPackage = path.resolve(libPath, 'package.json');
const libDependencies = require(libPackage).dependencies;
// 在example中安装material-js所需的依赖
for (let key in libDependencies) {
    const outputInstall = exec(`npm i ${key}@${libDependencies[key]}`, {
        cwd: examplePath,
        encoding: 'utf8'
    });
    console.log(outputInstall);
}
// 构建material-js
const libDist = path.resolve(libPath, 'dist');
if (fs.existsSync(libDist)) {
    exec(`rm -rf ${libDist}`, {
        encoding: 'utf8'
    });
}
const outputBuild = exec('npm run build', {
    cwd: libPath,
    encoding: 'utf8'
});
console.log(outputBuild);
// 复制代码
const exampleModule = path.resolve(examplePath, 'node_modules', '@sdp.nd', 'material-js');
if (fs.existsSync(exampleModule)) {
    exec(`rm -rf ${exampleModule}`, {
        encoding: 'utf8'
    });
}
mkdirp.sync(exampleModule);
fs.readdirSync(libDist).forEach(file => {
    const fileInDist = path.resolve(libDist, file);
    const outputCopy = exec(`cp -r ${fileInDist} ${exampleModule}`, {
        encoding: 'utf8'
    });
    console.log(outputCopy);
});
console.log(`${SCRIPT_NAME} done.`);

