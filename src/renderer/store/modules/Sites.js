import store from './../store'

const state = {
  all: [],
  siteMap: {}
}

const mutations = {
  setSites (state, sites) {
    state.all = []
    state.all.push(...sites)
  },
  setSiteMap (state, siteMap) {
    state.siteMap = siteMap
  },
  addSite (state, site) {
    state.all.push(site)
    state.siteMap[site.id] = site
  },
  deleteSite (state, index, id) {
    state.all.splice(index, 1)
    state.siteMap[id] = null
  }
}

const actions = {
  loadSites ({ commit }) {
    // store.set('sites', {})
    var sites = store.get('sites.all')
    if (sites) {
      commit('setSites', sites)
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
        // console.dir(store.get('sites.siteMap'))
        resolve(site)
      } else {
        // handle error
        reject(new Error('Site already exist for URL: ' + site.url))
      }
    })
  },
  deleteSite ({ commit }, id) {
    var index = -1
    for (var i = 0; i < state.all.length; i++) {
      if (state.all[i].id === id) {
        index = i
        break
      }
    }

    if (index >= 0) {
      commit('deleteSite', index, id)
      store.set('sites.all', state.all)
      store.delete(`sites.siteMap.${id}`)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
