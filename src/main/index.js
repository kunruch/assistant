'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import googleAccount from './services/google/google-account'
import linkChecker from './services/link-checker'
import favicon from './services/favicon'

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

function initalizeApp () {
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

  // load any sotred auth token
  googleAccount.laodAuthtokens()
}

app.on('ready', initalizeApp)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    initalizeApp()
  }
})

ipcMain.on('check-links', (event, data) => {
  linkChecker.checkLinks(event, data)
})

ipcMain.on('pause-check-links', (event, data) => {
  linkChecker.pauseCheckLinks(event, data)
})

ipcMain.on('google-auth', (event, data) => {
  googleAccount.googleAuth(mainWindow, event)
})

ipcMain.on('google-signout', (event, data) => {
  googleAccount.signOut(event)
})

ipcMain.on('fetch-favicon', (event, url) => {
  favicon.fetch(event, url)
})

ipcMain.on('find-analytics-properties', (event, siteID) => {
  googleAccount.findAnalyticsProperties(siteID, event)
})

ipcMain.on('get-analytics-page-views', (event, site, startdate, enddate) => {
  googleAccount.getPageViews(site, startdate, enddate, event)
})

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
