import Vue  from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// @ts-ignore
export default new Vuex.Store({
    state:     {
        audioList: {}
    },
    getters:   {
        getAudioList: (state : { audioList : Array<any> }) => state.audioList
    },
    mutations: {
        ADD_TO_AUDIO_LIST(state, {name, audio}) {
            // @ts-ignore
            state.audioList = {...state.audioList, name: audio}
        },
        REMOVE_TO_AUDIO_LIST(state, {name}) {
            // @ts-ignore
            delete state[name]
        }
    },
    actions:   {
        addToAudioList({commit}, {name, audio}) {
            commit('ADD_TO_AUDIO_LIST', {name, audio})
        },
        removeFromAudioList({commit}, {name}) {
            commit('REMOVE_AUDIO_LIST', {name})
        }
    },
    modules:   {}
})
