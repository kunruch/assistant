'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import blc from 'broken-link-checker'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('check-links', (event, data) => {
  var options = {}
  var customData = {}
  var siteChecker = new blc.SiteChecker(options, {
    junk: function (result, customData) {
      // sendLinkResult(result, event)
    },
    link: function (result, customData) {
      sendLinkResult(result, event)
    },
    end: function () {

    }
  })
  siteChecker.enqueue(data.url, customData)
})

function sendLinkResult (result, event) {
  var url = result.url.resolved === null ? result.url.original : result.url.resolved
  var status = 'OK'
  if (result.broken === true) {
    status = result.brokenReason
  } else if (result.excluded === true) {
    status = result.excludedReason
  }
  event.sender.send('append-linkcheck-result', url + ' -- ' + status)
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
