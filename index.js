#! /usr/bin/env node

const degit = require('degit');
const colors = require('colors/safe');
const spawn = require('cross-spawn');
const fs = require('fs');

const appName = process.argv[2] || '';
const appDirectory = `${process.cwd()}/${appName}`;


if (!appName || appName.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
    console.error(colors.red(`Error: Missing or Invalid directory name: "${appName}"`));
    process.exit(-1);
  }

if (fs.existsSync(appDirectory)) {
    console.error(colors.red(`Error: Directory "${appDirectory}" already exists.`));
    process.exit(-1);
}

const repository = 'vaso991/koa-api-ts-starter';

const emitter = degit(repository, {
    force: true,
    verbose: true,
});

console.log(colors.cyan('Cloning...'));

function pkgFromUserAgent(userAgent) {
    if (!userAgent) return undefined;
    const pkgSpec = userAgent.split(' ')[0];
    const pkgSpecArr = pkgSpec.split('/');
    return {
        name: pkgSpecArr[0],
        version: pkgSpecArr[1],
    };
}

emitter.clone(appDirectory).then(() => {
    console.log('');
    console.log(colors.cyan('Installing Dependencies...'));
    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
    const pkgManager = pkgInfo ? pkgInfo.name : 'npm';
    const command = `${pkgManager} install`;
    console.log(command);
    const { status } = spawn.sync(pkgManager, ['install'], {
        stdio: 'inherit',
        cwd: appDirectory,
    });
    console.log(colors.cyan('Done!'));
    console.log('');
    console.log(colors.cyan('To get started:'));
    console.log(colors.inverse(`cd ${appName}`));
    console.log(colors.inverse(`${pkgManager} run dev`));
})