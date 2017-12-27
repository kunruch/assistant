
import blc from 'broken-link-checker'

let activeChecker = null
let pageLinks = []

export default {

  checkLinks (event, data) {
    var options = {}
    var customData = {}
    activeChecker = new blc.SiteChecker(options, {
      html: function (tree, robots, response, pageUrl) {
        sendPageData(data, pageUrl, event)
      },
      page: function (error, pageUrl) {
        if (error != null && !error.message.startsWith('Expected type "text/html"')) {
          let errorType = error.code !== 200 ? 'error' : 'warning'
          sendPageError(pageUrl, `${error.name} : ${error.message}`, errorType, event)
        }
      },
      junk: function (result, customData) {
        // sendLinkResult(result, event)
      },
      link: function (result, customData) {
        sendLinkResult(result, event)
      },
      end: function () {
        event.sender.send('end-linkcheck')
      }
    })
    activeChecker.enqueue(data.url, customData)
  },
  pauseCheckLinks (event, data) {
    if (activeChecker) {
      activeChecker.pause()
    }
  }
}

function sendPageData (data, pageUrl, event) {
  // reset page links
  pageLinks = []
  event.sender.send('append-linkcheck-page', pageUrl)
}

function sendPageError (pageUrl, error, errorType, event) {
  // reset page links
  pageLinks = []
  event.sender.send('append-linkcheck-page-error', pageUrl, error, errorType)
}

function sendLinkResult (result, event) {
  var url = result.url.resolved === null ? result.url.original : result.url.resolved
  var status = 'OK'
  if (pageLinks.indexOf(url) >= 0) {
    return
  }
  if (result.broken === true) {
    status = blc[result.brokenReason]
  } else if (result.http.cached) {
    // instead of excluding cached links, we have excluded duplicates
  } else if (result.excluded === true) {
    status = blc[result.excludedReason]
  }

  if (status === 'OK') {
    event.sender.send('append-linkcheck-link', url, status)
  } else {
    event.sender.send('append-linkcheck-error', url, status)
  }
  pageLinks.push(url)
}
