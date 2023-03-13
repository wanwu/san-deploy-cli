# san-deploy-cli 

[san deploy](https://github.com/ecomfe/san-cli) 命令的 CLI，可独立安装使用

## 📦 安装

> Node.js 版本需要 14.0.0 及以上

```bash
# use npm
npm install -g san-deploy-cli
# or use yarn
yarn global add san-deploy-cli
```

查看帮助信息：

```bash
san-deploy -h
```

## 使用

工程中需要增加 san.deploy.config.js 用于配置远程部署的目录相关信息。

以 `san-deploy test` 命令为例，推送至 test指定的远程环境。san.deploy.config.js 文件示例如下:

```js

module.exports = {
    test: {
        root: 'output', //  默认 "."
        disableFsr: false, // 默认使用 fsr，普通脚本接收服务可置为true
        ignore: [/(^|[\/\\])\../, '**/node_modules/**'], // string or array 符合 anymatch 规范
        host: 'http://machine.com:8999', // fsr使用
        receiver: '', // 普通上传使用
        rule: [ // object or array
            {
                match: '**', // glob
                to: '/path/to/dest',
            },
            {
                match: ['output/**', 'template/**'],
                to: '/path/to/dest'
            }
        ],
        replace: { // object or array
            from: new RegExp('http://static.com', 'ig'), // string/reg
            to: 'http://dev.com:8888/'
        }
    }
};

```

相关库:
- 命令实现: [san-cli-deploy](https://github.com/ecomfe/san-cli)
- 上传: [deploy-files](https://github.com/wanwu/deploy-files)
