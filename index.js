#! /usr/bin/env node

const degit = require('degit');
const colors = require('colors/safe');
const fs = require('fs')

const appName = process.argv[2]
const appDirectory = `${process.cwd()}/${appName}`

if (fs.existsSync(appDirectory)) {
    console.error(colors.red.bgBlack(`Error: Directory "${appDirectory}" already exists.`));
    process.exit(-1);
}

const repository = 'vaso991/koa-api-ts-starter';

const emitter = degit(repository, {
    force: true,
    verbose: true,
});

console.log(colors.bgBlack.cyan('Cloning...'));

emitter.clone(appDirectory).then(() => {
    console.log('');
    console.log(colors.bgBlack.cyan('Done!'));
    console.log('');
    console.log(colors.bgBlack.cyan('To get started:'));
    console.log(colors.inverse(`cd ${appName}`));
    console.log(`${colors.inverse('npm install')} or ${colors.inverse('yarn install')} or ${colors.inverse('pnpm install')}`);
    console.log(`${colors.inverse('npm run dev')} or ${colors.inverse('yarn run dev')} or ${colors.inverse('pnpm run dev')}`);
})