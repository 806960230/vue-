import {getOneSongDetail,getSongLyric,getSongPlayAddress} from '../../api/config.js'
import Axios from 'axios'
import {Base64} from 'js-base64'
export default class Song {
  constructor ({id,mid,singer,name,album,duration,image,url}){
    this.id=id
    this.mid=mid
    this.singer=singer
    this.name=name
    this.album=album
    this.duration=duration
    this.url=url
  }
}

export function createSong(musicData){
  return new Song({
    id:musicData.songid,
    mid:musicData.songmid,
    singer:filterSinger(musicData.singer),
    name:musicData.songname,
    duration:musicData.interval,
    image:"",
    url:""
  })
}

export function filterSinger(singer){//可能是合唱团呢，所以要把相关人物都放进来,一般都是只有一个人
  let ret=[]
  if(!singer){
    return ''
  }
  singer.forEach((s)=>{
    ret.push(s.name)
  })
  return ret.join('/')
}

let SongOtherInfo;
export function getSong(item,index){//这种封装形式的函数里面的函数有axios请求的，是不能直接在别的组件中的created()或mounted()获得数据的
    SongOtherInfo=[];
  let OneSongDetail,songLyric,songPlayAddress;
     OneSongDetail=getOneSongDetail(item.songInfo.mid)//得到歌曲的唱片图片以及其他信息的请求参数
     songLyric=getSongLyric(item.songInfo.id)//得到歌曲歌词请求参数
     songPlayAddress=getSongPlayAddress(item.songInfo.mid)//得到歌曲的播放地址参数
     _getSingleSongDetail(OneSongDetail,item)//发送axios请求获得歌曲完整信息
     _getSongLyric(songLyric)
     _getSongPlayAddress(songPlayAddress)
    let otherInfo=SongOtherInfo
    // console.log(SongOtherInfo)
    return otherInfo


}

function _getSingleSongDetail(params,item){
  let data;
  Axios('/vkey/cgi-bin/musicu.fcg',params).then(response=>{
     data=response.data.mv.data.mvinfo[item.songInfo.mid]
     ||{
       duration:item.songInfo.duration,
       title:item.songInfo.singer,
     picurl:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584462868406&di=84cafb013b172e25c8f5626ae341758c&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F17%2F04%2F19%2Ff0657f5b68eb9d3c6e0076fbd897322a.jpg",
      singers:[{name:item.songInfo.name}]}
      SongOtherInfo[0]=data
}).catch(error=>{
  console.log(error)
})

}
function _getSongLyric(params){
   let Lyric;
   let goodLyric;
  Axios('/api/lyric/fcgi-bin/fcg_query_lyric_yqq.fcg',params).then(response=>{
      //  console.log(response.data.lyric)
      Lyric=response.data.lyric

      SongOtherInfo[1]=Base64.decode(Lyric)
}).catch(error=>{
  console.log(error)
})
}
function _getSongPlayAddress(params){
  let data,newData;
    Axios('/vkey/cgi-bin/musicu.fcg',params).then(response=>{
    data=""+response.data.req_0.data.sip[1]+response.data.req_0.data.midurlinfo[0].purl//获取播放地址数据
     SongOtherInfo[2]=data
}).catch(error=>{
  console.log(error)
})
}


function getLyric(data){
  let currentLyric;
  currentLyric=new Lyric(data,this.handleLyric)
  //查看lyric-parser插件文档这样使用的,第一个参数为歌词，第二个参数为回调函数
  // if(this.playing){
  //   this.currentLyric.play()//查看lyric-parser插件文档这样使用的
  // }
  console.log(this.currentLyric)
  return currentLyric
}

export function _getHotKey(params){
  let data;
  Axios('/vkey/cgi-bin/musicu.fcg',params).then(response=>{
     data=response.data.hotkey.data.vec_hotkey.slice(0,10)
     return data
  }).catch(error=>{
    console.log(error)
  })
}
