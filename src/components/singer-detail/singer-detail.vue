<template>

<transition name="slide">
  <div class="singer-detail">
   <music-list :title="title" :bg-image="bgImage" :songs="singerSongs"></music-list>
  </div>
</transition>

</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from '../../api/config.js'
import {createSong} from '../../common/js/song'
import Axios from 'axios'
import musicList from '../music-list/music-list'
export default {
  computed:{
     title(){
       return this.singer.name
     },
     bgImage(){
       return this.singer.pic
     },
    ...mapGetters([//得到了state里面所有定义的数据而只收取了一个名为singer的数据
      'singer'
    ])
  },
  created(){
    this.singerTag=getSingerDetail(this.singer.id);//输入相应的歌手的id值得到该歌手详情页请求地址上参数
    setTimeout(()=>{
     this._getSingerDetailNow(this.singerTag)
    },500)
  },
  data () {
    return {
      singerTag:{},
      singerSongs:[]
    }
  },
  components:{
    musicList
  },
  methods:{
    _getSingerDetailNow(tag){//把歌手详情页的参数放进去
       Axios('/vkey/cgi-bin/musicu.fcg',tag).then(response=>{
        this.singerSongs=response.data.singerSongList.data.songList
    }).catch(error=>{
      console.log(error)
    })
    },
    _normalizeSongs(list){
      let ret=[]
      list.forEach((item)=>{

      })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
   @import "../../common/stylus/variable"
     .singer-detail
        position:fixed
        z-index:100
        top:0
        left:0
        right:0
        bottom:0
        background:$color-background
        &.slide-enter-active
           transition:all 1s
        &.slide-leave-active
           transition:all 1s
        &.slide-enter
           transform:translate3d(100%,0,0)
        &.slide-leave-to
           transform:translate3d(100%,0,0)


</style>
