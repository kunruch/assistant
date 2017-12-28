import store from './../../store'
import google from 'googleapis'
import {BrowserWindow} from 'electron'
require('dotenv').config()

var plus = google.plus('v1')
var analytics = google.analytics('v3')

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
  googleAuth (mainWindow, event) {
    let self = this
    if (store.has('auth.tokens')) {
      self.laodAuthtokens(event)
    } else {
      authorizeApp(mainWindow).then((code) => {
        oauth2Client.getToken(code, function (err, tokens) {
          // Now tokens contains an access_token and an optional refresh_token. Save them.
          if (!err) {
            store.set('auth.tokens', tokens)
            self.laodAuthtokens(event)
          }
        })
      })
    }
  },
  signOut (event) {
    // reset saved tokens and remove user profile data
    store.delete('auth.tokens')
    store.delete('user')
    event.sender.send('user-profile-refresh', null)
  },
  laodAuthtokens (event) {
    let tokens = store.get('auth.tokens')

    if (!tokens) {
      console.error('No Auth tokens are stored')
      return
    }

    oauth2Client.credentials = tokens

    // load user profile after every token update
    plus.people.get({
      userId: 'me',
      auth: oauth2Client
    }, function (err, response) {
      if (!err) {
        store.set('user', response)
        if (event) {
          event.sender.send('user-profile-refresh', response)
        }
      } else {
        console.error(err)
      }
    })
  },
  findAnalyticsProperties (siteID, event) {
    let site = store.get(`sites.siteMap.${siteID}`)

    if (site) {
      analytics.management.accounts.list({
        auth: oauth2Client
      }, function (err, response) {
        // Handles the response from the accounts list method.
        if (!err && response.items && response.items.length) {
          // Get analytics properties
          for (var i = 0; i < response.items.length; i++) {
            queryProperties(response.items[i].id, site, event)
          }
        } else {
          console.log('No accounts found for this user. ' + err)
        }
      })
    }
  },
  getPageViews (site, startdate, enddate, event) {
    analytics.data.ga.get({
      auth: oauth2Client,
      'ids': 'ga:' + site.analytics.profileId,
      'start-date': startdate,
      'end-date': enddate,
      'dimensions': 'ga:pagePath, ga:pageTitle',
      'metrics': 'ga:pageviews',
      'sort': '-ga:pageviews'
    }, function (err, response) {
      if (!err) {
        var result = {
          totalViews: 0,
          data: []
        }
        // var formattedJson = JSON.stringify(response, null, 2)
        // console.log(formattedJson)
        result.totalViews = response.totalsForAllResults['ga:pageviews']

        var rowsCount = response.rows ? response.rows.length : 0

        for (var i = 0; i < rowsCount; i++) {
          var row = response.rows[i]
          var item = {
            url: site.url + '' + row[0],
            title: row[1],
            pageViews: row[2]
          }
          result.data.push(item)
        }
        if (event) {
          event.sender.send('site-analytics-pageviews', result)
        }
      } else {
        // Log any errors.
        console.log(err)
      }
    })
  }
}

function queryProperties (accountID, site, event) {
  // Get a list of all the properties for the account.
  analytics.management.webproperties.list({
    'accountId': accountID
  }, function (err, response) {
    let found = false
    // Handles the response from the accounts list method.
    if (!err && response.items && response.items.length) {
      // get account properties
      for (var i = 0; i < response.items.length; i++) {
        if (response.items[i].websiteUrl === site.url) {
          found = true
          queryProfiles(accountID, response.items[i].id, site, event)
          break
        }
      }
    }

    if (!found) {
      console.log('No properties found for site ' + site.url + 'in account ' + accountID)
    }
  })
}

function queryProfiles (accountID, propertyId, site, event) {
  // Get a list of all Views (Profiles) for the property
  analytics.management.profiles.list({
    'accountId': accountID,
    'webPropertyId': propertyId
  }, function (err, response) {
    // Handles the response from the profiles list method.
    if (!err && response.items && response.items.length) {
    // Get the first View (Profile) ID.
      var profileId = response.items[0].id
      let analytics = {
        accountId: accountID,
        webPropertyId: propertyId,
        profileId: profileId
      }
      console.log(JSON.stringify(analytics))
      if (event) {
        event.sender.send('site-analytics-properties', analytics)
      }
    } else {
      console.log('No views (profiles) found for property. ' + propertyId)
    }
  })
}
