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
    state.siteMap[site.url] = site
  }
}

const actions = {
  loadSites ({ commit }) {
    cleanStore()
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
    return new Promise((resolve, reject) => {
      if (site.url != null && !store.has(`sites.siteMap.${site.url}`)) {
        // add to our local store and then save a copy to file store
        commit('addSite', site)
        store.set('sites.all', state.all)
        store.set(`sites.siteMap.${site.url}`, site)
        resolve()
      } else {
        // handle error
        console.log('Site already exist for URL: ' + site.url)
        reject(new Error('Site already exist for URL: ' + site.url))
      }
    })
  }
}

// only for debug purpose
function cleanStore () {
  store.set('sites', {})
}

export default {
  state,
  mutations,
  actions
}
