<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
        <div class="play-wrapper">
          <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
            <i class="icon-play"></i>
            <span class="text">随机播放全部</span>
          </div>
        </div>
        <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div><!--bg-layer本身位置不需要css设置，因为上面有个div所以下面div-->
    <scroll :data="songs" class="list" ref="list"
    :probeType="probeType"
    :listen-scroll="listenScroll"
    @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
//还有js的前缀模块没做，可不做,js前缀模块就是帮助少写css的webkit之类的样式
import Scroll from '../../base/scroll/scroll'
import SongList from '../../base/songList/songList'
import Loading from "../../base/loading/loading"
import {mapActions,mapMutations,mapGetters} from 'vuex'
import {getSong} from '../../common/js/song.js'
import {shuffle} from '../../common/js/util'
import {playlistMixin} from '../../common/js/mixin'
// import {getOneSongDetail,getSongLyric} from '../../api/config.js'
import Axios from 'axios'
const RESERVED_HEIGHT=40//预留顶部高度
export default {
  mixins:[playlistMixin],//把你建立的东西掺入这里面中
  props:{
    bgImage:{
      type:String,
      default:''
    },
    songs:{
      type:Array,
      default:[]
    },
    title:{
      type:String,
      default:''
    }
  },
  created(){
     this.probeType=3,
     this.listenScroll=true
  },
  data () {
    return {
    scrollY:0,
    SongOtherInfo:[]
    }
  },
  mounted(){
    this._getListPosition()
    this.minTranslateY=-this.ImageHeight+RESERVED_HEIGHT//bg-layer设置最大滚动距离

  },
  components:{
  Scroll,SongList,Loading
  },
  computed:{
    bgStyle(){
      return `background-image:url(${this.bgImage})`
    },
    // ...mapGetters([
    //    'currentSong'
    // ])
  },
  methods:{
     handlePlaylist(playlist){
        const bottom=playlist.length>0?'60px':''//如果存在播放列表,则需要空出高度60px位置给迷你小播放器
        this.$refs.list.$el.style.bottom=bottom
        this.$refs.list.refresh()
     },
     random(){//随机播放
      console.log('改变顺序了吗')

      // //  this.randomPlay({
      // //    list:this.songs
      // //  })
        let newArr = shuffle(this.songs)
        console.log(newArr[0])
      // //  console.log(this.currentSong)
    let otherInfo=getSong(newArr[0],0)//获取随机序列的歌单的第一首歌的其他信息(包括歌图,歌曲播放地址以及歌词等等)

      setTimeout(()=>{
       this.randomPlay({
        list:newArr,
        index:0,
        otherInfo:otherInfo
      })
      },500)






     },
     _getListPosition(){
        this.ImageHeight=this.$refs.bgImage.clientHeight
        // console.log(ImageHeight)
       this.$refs.list.$el.style.top=this.ImageHeight+"px"//记得这里要有个$el相当于它的dom,为什么要用$el
       //因为<scroll></scroll>是这个组件不是标签，因此需要改为dom
     },
     scroll(pos){
       this.scrollY=pos.y
     },
     back(){
       this.$router.back()
     },
     selectItem(item,index,info){

        this.selectPlay({
          list:this.songs,
          index:index,
          otherInfo:info
        })
        console.log(111)
     },
     ...mapActions([
       'selectPlay',
       'randomPlay'
     ]),
     ...mapMutations({ //相当于拿了mutations里面所有定义的方法,写上去的就是拿出来使用的方法
      setSongOtherInfo:'SET_CURRENT_SONG_OTHER_INFO'
    })
  },
  watch:{
    scrollY(newY){
      let translateY=Math.max(this.minTranslateY,newY)//设置最大滚动量,如果很多歌的话，你把歌列表
      //划上去的时候,歌手图片又出现了因此需要设置最大滚动量
      let zIndex=1
      let scale=1

      this.$refs.layer.style['transform']=`translate3d(0,${translateY}px,0)`
      this.$refs.layer.style['webkitTransform']=`translate3d(0,${translateY}px,0)`
      const percent=Math.abs(newY/this.ImageHeight)//当我们向下拉动内容往上展示时,image图片按比例放大

     if(newY>0){//如果是往下拉动内容向上展示时
         scale=1+percent
        // this.$refs.layer.style.zIndex=0
        // this.$refs.bgImage.style.zIndex=-1
         this.$refs.bgImage.style.zIndex=1
        this.$refs.bgImage.style['transform']=`scale(${scale})`
        this.$refs.bgImage.style['webkitTransform']=`scale(${scale})`
      }
      if(newY<this.minTranslateY){//滑动到预留顶部高度或大于该高度时，改变样式
        zIndex=10
        this.$refs.bgImage.style.paddingTop=0
        this.$refs.bgImage.style.height=`${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display="none"
        this.$refs.bgImage.style.zIndex=1

      }else if(newY<0){//恢复默认样式,即当我们往上拉动，内容向下展示时且我们拉动的距离还没到预留顶部时,这之间的距离样式是这样的

        this.$refs.bgImage.style.zIndex=-1
        this.$refs.bgImage.style.paddingTop='70%'
        this.$refs.bgImage.style.height=0
        this.$refs.playBtn.style.display=""
      }
        //  this.$refs.bgImage.style.zIndex=1


    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      // z-index:100
      // overflow:hidden
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
        box-sizing:border-box
        // overflow:hidden
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
