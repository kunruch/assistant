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
  deleteSite (state, payload) {
    state.all.splice(payload.index, 1)
    state.siteMap[payload.id] = null
  },
  updateProperty (state, payload) {
    let site = state.siteMap[payload.id]
    site[payload.property] = payload.value
    console.log(payload)
    state.siteMap[payload.id] = site
    state.all[payload.index] = site
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
    site.favicon = ''

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
      commit('deleteSite', { index, id })
      store.set('sites.all', state.all)
      store.delete(`sites.siteMap.${id}`)
    }
  },
  updateProperty ({ commit }, payload) {
    var index = -1
    for (var i = 0; i < state.all.length; i++) {
      if (state.all[i].id === payload.id) {
        index = i
        break
      }
    }

    if (index >= 0) {
      commit('updateProperty', { index, id: payload.id, property: payload.property, value: payload.value })
      store.set('sites.all', state.all)
      store.set(`sites.siteMap.${payload.id}.${payload.property}`, payload.value)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
