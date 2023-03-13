#!/usr/bin/env node

/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file bin 文件入口
 * @author zttonly
 */

/* eslint-disable no-console */
import updateNotifier from 'update-notifier';
import semver from 'semver';
import * as color from 'colorette';

const {
    scriptName,
    engines: {node: requiredNodeVersion},
    name: pkgName,
    version: pkgVersion
} = require('../package.json');

// 1. set process
setProcess(scriptName);
// 2. 检测 node 版本
checkNodeVersion(requiredNodeVersion, pkgName);
// 3. 执行命令
execCommand();

function execCommand() {
    try {
        // load command
        const command = require('san-cli-deploy');
        if (command && command.handler) {
            const {name, version} = require('san-cli-deploy/package.json');
            console.log(`${pkgName}@${pkgVersion}/${name}@${version}`);
            // 检查子模块更新情况
            upNotifier(version, name);

        const args = require('yargs/yargs')(require('yargs/helpers').hideBin(process.argv))
            .usage('$0 <target>', command.description, command.builder)
            .alias('help', 'h')
            .alias('version', 'v')
            .argv

            command.handler(args);
        }   
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

function checkNodeVersion(wanted: any, id: any) {
    if (!semver.satisfies(process.version, wanted)) {
        console.error(
            // prettier-ignore
            // eslint-disable-next-line
            'You are using Node ' + process.version + ', but this version of ' + id +
            ' requires ' + color.yellow('Node ' + wanted) + '.\nPlease upgrade your Node version.'
        );
        process.exit(1);
    }
}

function upNotifier(version: any, name: any) {
    let notifier: any;
    if (version && name) {
        // 检测版本更新
        notifier = updateNotifier({
            pkg: {
                name,
                version
            },
            updateCheckInterval: 1000 * 60 * 60 * 24 * 7, // 1 week
            // isGlobal: true,
            // updateCheckInterval: 0,
            // npm script 也显示
            shouldNotifyInNpmScript: true
        });
    }
    ['SIGINT', 'SIGTERM'].forEach(signal => {
        process.on(signal as NodeJS.Signals, () => {
            notifier && notifier.notify();
            process.exit(0);
        });
    });
}

function setProcess(scriptName: any) {
    process.title = scriptName;
    process.on('uncaughtException', (error: any) => {
        console.error(error);
        process.exit(1);
    });

    process.on('unhandledRejection', (error: any) => {
        console.error(error);
        process.exit(1);
    });
}
