import store from './../../store'
import google from 'googleapis'
import {BrowserWindow} from 'electron'

var plus = google.plus('v1')

const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
)

// generate a url that asks permissions for Google+ and Google Analytics scopes
var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/analytics.readonly'
]

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes // If you only need one scope you can pass it as string
})

const browserWindowParams = {
  'use-content-size': true,
  center: true,
  show: false,
  resizable: false,
  'always-on-top': true,
  'standard-window': true,
  'auto-hide-menu-bar': true,
  'node-integration': false
}

// set auth as a global default
google.options({
  auth: oauth2Client
})

function authorizeApp (mainWindow) {
  return new Promise((resolve, reject) => {
    browserWindowParams.parent = mainWindow
    const win = new BrowserWindow(browserWindowParams)
    win.show()
    console.log(url)
    win.loadURL(url)

    win.on('closed', () => {
      reject(new Error('User closed the window'))
    })

    win.on('page-title-updated', () => {
      setImmediate(() => {
        const title = win.getTitle()
        if (title.startsWith('Denied')) {
          reject(new Error(title.split(/[ =]/)[2]))
          win.removeAllListeners('closed')
          win.close()
        } else if (title.startsWith('Success')) {
          resolve(title.split(/[ =]/)[2])
          win.removeAllListeners('closed')
          win.close()
        }
      })
    })
  })
}

export default {
  googleAuth (mainWindow) {
    let self = this
    if (store.has('auth.tokens')) {
      self.saveAuthtokens(store.get('auth.tokens'))
    } else {
      authorizeApp(mainWindow).then((code) => {
        oauth2Client.getToken(code, function (err, tokens) {
          // Now tokens contains an access_token and an optional refresh_token. Save them.
          if (!err) {
            store.set('auth.tokens', tokens)
            self.saveAuthtokens(tokens)
          }
        })
      })
    }
  },
  saveAuthtokens (tokens) {
    oauth2Client.credentials = tokens

    // load user profile after every token update
    plus.people.get({
      userId: 'me',
      auth: oauth2Client
    }, function (err, response) {
      if (!err) {
        console.log(response)
        store.set('user', response)
      }
    })
  }
}
