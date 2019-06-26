import { } from '@/apis/project'
import { } from '@/store/actions.type'
import { } from '@/store/mutations.type'

const state = {
  {{name}}: 
}
const getters = {
  {{name}} (state: any) {
    return state.{{name}}
  }
}
const actions = {
  [ ] ({ commit } : { commit: any}) {
    return api
      .then(data => {
        commit( , data)
      })
      .catch((error: any) => {
        throw new Error(error)
      })
  }
}
const mutations = {
  [ ] (state: any, {{name}}: any) {
    state.{{name}} = {{name}}
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
