import * as types from './mutation-types'

const mutations={
  [types.SET_SINGER](state,singer){
     // 1、state.playlist = JSON.parse(JSON.stringify(list))
    // 2、state.playlist = Object.assign([], list)
    state.singer=singer
  },
  [types.SET_PLAYING_STATE](state,flag){
    state.playing=flag
  },
  [types.SET_FULL_SCREEN](state,flag){
    state.fullScreen=flag
  },
  [types.SET_PLAYLIST](state,list){

      // state.playlist = JSON.parse(JSON.stringify(list))//这两行代码类似下面的两行代码这样写,为了防止出现vuex外部修改值出现报错
        // console.log(state.playlist)
      // state.playlist = Object.assign([], list)
      // console.log(state.playlist)
    state.playlist=list
  },
  [types.SET_SEQUENCE_LIST](state,list){
    //  state.sequenceList = JSON.parse(JSON.stringify(list))
    // state.sequenceList = Object.assign([], list)
    state.sequenceList=list
  },
  [types.SET_PLAY_MODE](state,mode){
    state.mode=mode
  },
  [types.SET_CURRENT_INDEX](state,index){
    state.currentIndex=index
  },
  [types.SET_CURRENT_SONG_OTHER_INFO](state,otherInfo){
     console.log(otherInfo)
    // state.currentSongOtherInfo = JSON.parse(JSON.stringify(otherInfo))
    // console.log(state.currentSongOtherInfo)

    // console.log(Object.assign({}, otherInfo))
    state.currentSongOtherInfo=otherInfo
    // state.currentSongOtherInfo=otherInfo
    // console.log(state.currentSongOtherInfo)
  },
  [types.SET_SEARCH_HISTORY](state,history){
     state.searchHistory=history
  }
}
//mutations里面都存储定义的函数方法
//由上面代码可知我们拿到了SET_SINGER该函数
// SET_SINGER(state,singer){
//   state.singer=singer
// }
export default mutations
