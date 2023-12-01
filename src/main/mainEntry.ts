import { app, BrowserWindow } from "electron";
import { CustomScheme } from "./customScheme";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"; // 用于设置渲染进程开发者调试工具的警告
let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  let config = {
    webPreferences: {
      nodeIntegration: true, // 把 Node.js 环境集成到渲染进程
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  };
  mainWindow = new BrowserWindow(config);
  mainWindow.webContents.openDevTools({ mode: "undocked" }); // 打开开发工具
  if (process.argv[2]) {
    mainWindow.loadURL(process.argv[2]);
  } else {
    // 注册特权
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
  }
});
