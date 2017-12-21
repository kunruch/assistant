
import blc from 'broken-link-checker'

let activeChecker = null

export default {

  checkLinks (event, data) {
    var options = {}
    var customData = {}
    activeChecker = new blc.SiteChecker(options, {
      html: function (tree, robots, response, pageUrl) {
        sendPageData(data, pageUrl, event)
      },
      page: function (error, pageUrl) {
        if (error != null) {
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
  event.sender.send('append-linkcheck-page', pageUrl)
}

function sendLinkResult (result, event) {
  var url = result.url.resolved === null ? result.url.original : result.url.resolved
  var status = 'OK'
  if (result.broken === true) {
    status = blc[result.brokenReason]
  } else if (result.http.cached) {
    return // exlude cached links
  } else if (result.excluded === true) {
    status = blc[result.excludedReason]
  }

  if (status === 'OK') {
    event.sender.send('append-linkcheck-link', url, status)
  } else {
    event.sender.send('append-linkcheck-error', url, status)
  }
}

function sendPageError (pageUrl, error, errorType, event) {
  event.sender.send('append-linkcheck-page-error', pageUrl, error, errorType)
}
