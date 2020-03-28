import {playMode} from '../common/js/config'
import {loadSearch} from '../common/js/cache'
const state={
   singer:{},
   playing:false,
   fullScreen:false,  //全屏
   playlist:[],
   sequenceList:[],//顺序播放
   mode:playMode.sequence,
   currentIndex:-1,
   currentSongOtherInfo:[],
   searchHistory:loadSearch()
}

export default state
