import * as types from './mutation-types'
import {playMode} from '../common/js/config'
import {shuffle} from '../common/js/util'
import {saveSearch,deleteSearch,clearSearch} from '../common/js/cache.js'
//对mutations封装
export const selectPlay=function({commit},{list,index,otherInfo}){
   commit(types.SET_SEQUENCE_LIST,list)
   commit(types.SET_PLAYLIST,list)
   commit(types.SET_CURRENT_INDEX,index)//指定index播放哪首歌
   commit(types.SET_FULL_SCREEN,true)
   commit(types.SET_PLAYING_STATE,true)
   commit(types.SET_CURRENT_SONG_OTHER_INFO,otherInfo)
}


export const randomPlay=function({commit},{list,index,otherInfo}){
   commit(types.SET_PLAY_MODE,playMode.random)
  //  commit(types.SET_SEQUENCE_LIST,list)
  //  let randomList=shuffle(list)
   commit(types.SET_PLAYLIST,list)
   commit(types.SET_CURRENT_INDEX,0)//重新排序后直接播放随机排序后的第一首歌
   commit(types.SET_FULL_SCREEN,true)
   commit(types.SET_PLAYING_STATE,true)
   commit(types.SET_CURRENT_SONG_OTHER_INFO,otherInfo)
}

export const insertSong=function({commit,state},{song,otherInfo}){
  let playlist=state.playlist.slice()//出现vuex外部修改报错问题因此需要slice才可
  console.log(arguments)
  let sequenceList=state.sequenceList.slice()
    // sequenceList.push(song)
    console.log(song)
  let currentIndex=state.currentIndex//只是值不会出现vuex外部修改报错问题
   console.log(otherInfo)
  //记录当前歌曲
  let currentSong=playlist[currentIndex]
  //查找当前列表中是否有待插入的歌曲并返回其索引
   console.log(song)
  let fpIndex=playlist.findIndex((item)=>{
    console.log(item)
    console.log(song)
    return item.songInfo.id==item.songInfo.id
  })
  //因为是插入歌曲,索引+1
  currentIndex++
  //插入这首歌到当前索引位置
  playlist.splice(currentIndex,0,song)
  if(fpIndex>-1){//如果已经包含这首歌
    //如果当前插入的序号大于列表中原本存在歌曲的序号
    if(currentIndex>fpIndex){
      playlist.splice(fpIndex,1)
      currentIndex--
    }else{
      playlist.splice(fpIndex+1,1)
    }
  }
  let currentSIndex=sequenceList.findIndex((item)=>{
     console.log(item)
     console.log(item.songInfo.id)
    return item.songInfo.id==item.songInfo.id
  })+1
  let fsIndex=sequenceList.findIndex((item)=>{
    return item.songInfo.id==item.songInfo.id
  })
  sequenceList.splice(currentSIndex,0,song,otherInfo)
  if(fsIndex>-1){
    if(currentSIndex>fsIndex){
      sequenceList.splice(fsIndex,1)
    }else{
      sequenceList.splice(fsIndex+1,1)
    }
  }
   console.log(sequenceList,playlist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_PLAYLIST,playlist)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
  commit(types.SET_CURRENT_SONG_OTHER_INFO,otherInfo)
}

export const saveSearchHistory=function({commit},query){//把搜索结果缓存到localstorage
    commit(types.SET_SEARCH_HISTORY,saveSearch(query))//相当于先拿了vuex里面的搜索列表的缓存数据
    //之后调用了saveSearch(query)函数
}

export const deleteSearchHistory=function({commit},query){
    commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}

export const clearSearchHistory=function({commit}){
   commit(types.SET_SEARCH_HISTORY,clearSearch())
}
