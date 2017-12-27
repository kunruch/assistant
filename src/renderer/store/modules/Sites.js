import store from './../store'

const state = {
  all: [],
  siteMap: {}
}

const mutations = {
  addSites (state, sites) {
    state.all.push(...sites)
  },
  setSiteMap (state, siteMap) {
    state.siteMap = siteMap
  },
  addSite (state, site) {
    state.all.push(site)
    state.siteMap[site.id] = site
  }
}

const actions = {
  loadSites ({ commit }) {
    // store.set('sites', {})
    var sites = store.get('sites.all')
    if (sites) {
      commit('addSites', sites)
    }

    var siteMap = store.get('sites.siteMap')
    if (siteMap) {
      commit('setSiteMap', siteMap)
    }
  },
  addSite ({ commit }, site) {
    let id = (site.url).replace(/\./g, '_')
    // id is url based to detect duplicates
    // we replace '.' with '_' as it interferes with JSON objects fetching from store
    // which is why we cannot allow editing of URLs once added
    site.id = id
    site.to = `/sites/view/${encodeURIComponent(id)}`

    return new Promise((resolve, reject) => {
      if (!store.has(`sites.siteMap.${id}`)) {
        // add to our local store and then save a copy to file store
        commit('addSite', site)
        store.set('sites.all', state.all)
        store.set(`sites.siteMap.${id}`, site)
        console.dir(store.get('sites.siteMap'))
        resolve()
      } else {
        // handle error
        reject(new Error('Site already exist for URL: ' + site.url))
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
