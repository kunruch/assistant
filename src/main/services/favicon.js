import fetchFavicon from '@meltwater/fetch-favicon'
import NodeCache from 'node-cache'

// cache for 24 hours, don't auto check for deletion
const faviconCache = new NodeCache({ stdTTL: 86400, checkperiod: 0 })

export default {
  fetch (event, url) {
    let favicon = faviconCache.get(url)
    if (!favicon) {
      fetchFavicon(url).then((favicon) => {
        console.log(favicon)
        faviconCache.set(url, favicon)
        event.sender.send('favicon-url', favicon, url)
      })
    }
  }
}
