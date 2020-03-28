<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" v-for="(song,index) in songs" class="item" :key="index">
        <div class="content">
          <h2 class="name">{{song.songInfo.name}}</h2>
          <p class="desc">{{getDesc(song.songInfo)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapActions,mapMutations} from 'vuex'
import {getOneSongDetail,getSongLyric,getSongPlayAddress} from '../../api/config.js'
import {getSong} from '../../common/js/song.js'
import Axios from 'axios'
export default {
  props:{
    songs:{
      type:Array,
      default:[]
    }
  },
  data () {
    return {
     SongOtherInfo:[]
    }
  },
  methods:{
    getDesc(info){
      return `${info.singer[0].name}-${info.album.name}`
    },
    selectItem(item,index){
      let otherInfo;
       otherInfo=getSong(item,index)
    //   let OneSongDetail,songLyric,songPlayAddress;
    //  OneSongDetail=getOneSongDetail(item.songInfo.mid)//得到歌曲的唱片图片以及其他信息的请求参数
    //  songLyric=getSongLyric(item.songInfo.id)//得到歌曲歌词请求参数
    //  songPlayAddress=getSongPlayAddress(item.songInfo.mid)//得到歌曲的播放地址参数
    //  this._getSingleSongDetail(OneSongDetail,item)//发送axios请求获得歌曲完整信息
    //  this._getSongLyric(songLyric)
    //  this._getSongPlayAddress(songPlayAddress)
    //   let otherInfo=this.SongOtherInfo
    //   console.log(this.SongOtherInfo)
      setTimeout(()=>{
        this.$emit('select',item,index,otherInfo)
      },500)
      // this.$nextTick(()=>{
      //    this.$emit('select',item,index,otherInfo)
      // })
      // this.$emit('select',item,index,otherInfo)
    },
      _getSingleSongDetail(params,item){
      let data;
      Axios('/vkey/cgi-bin/musicu.fcg',params).then(response=>{
         data=response.data.mv.data.mvinfo[item.songInfo.mid]
          this.SongOtherInfo[0]=data
        //  this.DetailSong=data
        //  console.log(this.currentSong.songInfo.id)
        //  this.DetailSong.id=this.currentSong.songInfo.id
        // console.log(response.data)
        // console.log(data)
    }).catch(error=>{
      console.log(error)
    })

    },
    _getSongLyric(params){
       let Lyric;
      Axios('/api/lyric/fcgi-bin/fcg_query_lyric_yqq.fcg',params).then(response=>{
          //  console.log(response.data.lyric)
          Lyric=response.data.lyric
           this.SongOtherInfo[1]=Lyric
    }).catch(error=>{
      console.log(error)
    })
    },
    _getSongPlayAddress(params){
      let data,newData;
        Axios('/vkey/cgi-bin/musicu.fcg',params).then(response=>{
           console.log(response.data)
        data=""+response.data.req.data.sip[0]+response.data.req.data.keepalivefile//获取播放地址数据
        // newData="http:\/\/ws.stream.qqmusic.qq.com\/"+response.data.req.data.keepalivefile
        newData="http:\/\/ws.stream.qqmusic.qq.com\/C400003mAan70zUy5O.m4a?guid=4778812806&vkey=6ABEBC54598ACBC32B99946BF23A3E77BCA0EA219FCA22A6480F38AC392F1A1AAAE18FFA1ED8D0FA23D98EF5C1B3A89EB578524C0EC4283B&uin=&fromtag=3"
          console.log(newData)
         this.SongOtherInfo[2]=newData
    }).catch(error=>{
      console.log(error)
    })
   }
  },
  components:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"
  .song-list
    height:100%

    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height:64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
