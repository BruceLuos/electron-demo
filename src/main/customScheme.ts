import { protocol } from "electron";
import fs from "fs";
import path from "path";

// 需要为应用提供特权
// 这是因为应用程序的主进程还在通过 `process.argv[2]` 加载首页。显然用户通过安装包安装的应用程序没有这个参数。
// 让应用程序在没有这个参数的时候，也能加载我们的静态页面**。



//为自定义的app协议提供特权
let schemeConfig = { standard: true, supportFetchAPI: true, bypassCSP: true, corsEnabled: true, stream: true };
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: schemeConfig }]);

export class CustomScheme {
  //根据文件扩展名获取mime-type
  private static getMimeType(extension: string) {
    let mimeType = "";
    if (extension === ".js") {
      mimeType = "text/javascript";
    } else if (extension === ".html") {
      mimeType = "text/html";
    } else if (extension === ".css") {
      mimeType = "text/css";
    } else if (extension === ".svg") {
      mimeType = "image/svg+xml";
    } else if (extension === ".json") {
      mimeType = "application/json";
    }
    return mimeType;
  }
  //注册自定义app协议
  static registerScheme() {
    protocol.registerStreamProtocol("app", (request, callback) => {
      let pathName = new URL(request.url).pathname;
      let extension = path.extname(pathName).toLowerCase();
      if (extension == "") {
        pathName = "index.html";
        extension = ".html";
      }
      let tarFile = path.join(__dirname, pathName);
      callback({
        statusCode: 200,
        headers: { "content-type": this.getMimeType(extension) },
        data: fs.createReadStream(tarFile),
        /**
         * **响应的 data 属性为目标文件的可读数据流。这也是为什么我们用 `registerStreamProtocol` 方法注册自定义协议的原因。
         * 当你的静态文件比较大时，不必读出整个文件再给出响应。**
         */
      });
    });
  }
}