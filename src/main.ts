import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// 处理 Windows 安装/卸载时的快捷方式。
if (started) {
  app.quit();
}

const createWindow = () => {
  // 创建主窗口。
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // 加载应用页面。
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // 打开开发者工具。
  // mainWindow.webContents.openDevTools();
};

// Electron 初始化完成后创建窗口，部分 API 只能在 ready 后使用。
app.on('ready', createWindow);

// 非 macOS 平台关闭全部窗口后退出应用。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS 点击 Dock 图标且没有窗口时重新创建窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 其他主进程代码可以继续写在这里，或拆分到单独文件后引入。
