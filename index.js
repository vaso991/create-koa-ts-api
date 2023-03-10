#! /usr/bin/env node

const degit = require('degit');
const colors = require('colors/safe');
const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');

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
    clearAfterClone(appName, appDirectory);
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
    if (status !== 0) {
        return;
    }
    // Modify package.json
    resetPackageJson(appName, appDirectory);
    console.log(colors.cyan('Done!'));
    console.log('');
    console.log(colors.cyan('To get started:'));
    console.log(colors.inverse(`cd ${appName}`));
    console.log(colors.inverse(`${pkgManager} run dev`));
})

function resetPackageJson(appName, appDirectory) {
    spawn.sync('npm', ['pkg', 'set', `name=${appName}`], {
        stdio: 'inherit',
        cwd: appDirectory,
    });
    spawn.sync('npm', ['pkg', 'delete', 'author', 'homepage'], {
        stdio: 'inherit',
        cwd: appDirectory,
    });
}

function clearAfterClone(appName, appDirectory) {
    const gitDir = path.join(appDirectory, '.git');
    const githubDir = path.join(appDirectory, '.github');
    if (fs.existsSync(gitDir)) {
        fs.rmSync(gitDir, { force: true, recursive: true });
    }
    if (fs.existsSync(githubDir)) {
        fs.rmSync(githubDir, { force: true, recursive: true });
    }
}