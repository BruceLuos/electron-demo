# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.


## 流程
1. npm install electron -D
2. 将vue移到devDependence中，因为electron生产包不需要用到，防止打包进去
3. 编写mainEntry主进程，devPlugin插件用于打包mainEntry并运行
注意
   ```
  let addressInfo = server.httpServer.address();
   console.log('addressInfo: ', addressInfo.address) // 拿到的地址无法使用
   直接先固定为localhost不然页面没有加载到electron中
   let httpAddress = `http://${'localhost'}:${addressInfo.port}`;
        let electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", httpAddress], {
          cwd: process.cwd(),
          stdio: "inherit",
        });
   ```
4. 渲染进程集成内置模块，设置vite模块别名和模块解析钩子getReplacer
5. 创建编译结束钩子函数，制作应用安装包，主进程生产环境加载本地文件
