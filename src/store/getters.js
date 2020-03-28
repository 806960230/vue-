export const singer=state=>state.singer  //此行代码相当于下面代码//

//singer:state.singer 差不多把state.singer赋值给singer

export const playing=state=>state.playing

export const fullScreen=state=>state.fullScreen

export const playlist=state=>state.playlist


export const sequenceList=state=>state.sequenceList

export const mode = state=>state.mode

export const currentIndex=state=>state.currentIndex

export const currentSongOtherInfo=state=>state.currentSongOtherInfo  //用于取得单首歌曲的歌词与歌图

export const currentSong =(state)=>{
  return state.playlist[state.currentIndex]||{}
}


export const searchHistory=state=>state.searchHistory
