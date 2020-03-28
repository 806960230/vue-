<template>
  <div class="player" v-if="playlist.length>0&&currentSongOtherInfo"><!--playlist.length>0不用v-show不然报错-->
    <transition name="normal"
         @enter="enter"
         @after-enter="afterEnter"
         @leave="leave"
         @after-leave="afterLeave"><!--钩子函数-->
     <div class="normal-player" v-show="fullScreen">
        <div class="background"  >
          <img width="100%" height="100%" v-lazy="currentSongOtherInfo[0].picurl">
        </div>
        <div class="top">
            <div class="back" @click="back">
               <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSongOtherInfo[0].title[0].title||currentSongOtherInfo[0].title"></h1>
            <h2 class="subtitle" v-html="currentSongOtherInfo[0].singers[0].name"></h2>
        </div>
        <div class="middle" @touchstart="middleTouchStart"
        @touchend="middleTouchEnd"
        @touchmove="middleTouchMove">
            <div class="middle-l" ref="middleL">
                 <div class="cd-wrapper" ref="cdWrapper">
                     <div class="cd" :class="cdCls">
                         <img class="image" v-lazy="currentSongOtherInfo[0].picurl">
                     </div>
                 </div>
                 <div class="playing-lyric-wrapper">
                     <div class="playing-lyric">{{playingLyric}}</div>
                 </div>
            </div>
            <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p ref="lyricLine"
              class="text" :class="{'current':currentLineNum===index}" v-for="(line,index) in currentLyric.lines" :key="index">
               {{line.txt}}
              </p>
            </div>
          </div>
        </scroll>
        </div>

        <div class="bottom">
          <div class="dot-wrapper"><!--这是展示页面的页脚点，相当于轮播图的下面小点点,
          只展现两个页面，一个页面是歌词列表，一个页面是唱片图片-->
             <span class="dot" :class="{'active':currentShow=='cd'}"></span>
             <span class="dot" :class="{'active':currentShow=='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
             <span class="time time-l">{{format(currentTime)}}</span>
             <div class="progress-bar-wrapper">
                <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
             </div>
             <span class="time time-r">{{format(currentSongOtherInfo[0].duration)}}</span>
          </div>
            <div class="operators">
               <div class="icon i-left" @click="changeMode">
                  <i :class="iconMode"></i>
               </div>
               <div class="icon i-left" :class="disableCls">
                  <i class="icon-prev" @click="prev"></i>
               </div>
               <div class="icon i-center" :class="disableCls">
                  <i :class="playIcon" @click="togglePlaying"></i>
               </div>
               <div class="icon i-right" :class="disableCls">
                  <i class="icon-next" @click="next"></i>
               </div>
               <div class="icon i-right">
                  <i class="icon-not-favorite"></i>
               </div>
            </div>
        </div>
     </div>
    </transition>
    <transition name="mini">
     <div class="mini-player"  @click="open" v-show="!fullScreen"><!--少了v-show="!fullScreen"-->
       <div class="icon">
         <img width="40" height="40" v-lazy="currentSongOtherInfo[0].picurl" :class="cdCls" >
       </div>
       <div class="text">
           <h2 class="name" v-html="currentSongOtherInfo[0].title"></h2>
           <p class="desc" v-html="currentSongOtherInfo[0].singers[0].name"></p>
       </div>
       <div class="control">
           <i :class="miniIcon" @click.stop="togglePlaying"></i><!--阻止冒泡到父元素的click点击事件open-->
       </div>
       <div class="control">
          <i class="icon-playlist"></i>
       </div>
     </div>
    </transition>
    <audio :src="currentSongOtherInfo[2]" ref="audio" @canplay="ready" @error="error"
    @timeupdate="updateTime" @ended="end"></audio><!--
      @canplay="ready" @error="error" ready和error是为了防止点很多次上一首下一首歌的按钮
      @timeupadate是audio自带的事件，播放进行时，自动触发告诉播放了多长时间也就是时间进度
      @ended事件是在播放完一首歌后就触发@ended="end"-->
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import Axios from 'axios'
import {getOneSongDetail,getSongLyric} from '../../api/config.js'
import {getSong} from '../../common/js/song.js'
import animations from 'create-keyframe-animation'
import ProgressBar from '../../base/progress-bar/progress-bar'
import {playMode} from '../../common/js/config.js'
import {shuffle} from '../../common/js/util'
import Lyric from 'lyric-parser'
import Scroll  from '../../base/scroll/scroll'
export default {
  data () {
    return {
     songReady:false,
     currentTime:0,
     currentLyric:null,//设置null为好,因为利于:data="currentLyric&&currentLyric.lines"的判断不要写""
     currentLineNum:0,
     currentShow:'cd',
     playingLyric:''
    }
  },
  created(){
    this.touch={}
  },
  updated(){
      console.log(this.$refs.audio.networkState)
      if(this.playing==true){//为什么写在updated,当歌曲在切换的时候下一首是在播放状态而不是暂停状态,当然可以写在watch
      //watch观察歌曲变化来改变播放状态,但是我这里会报错所以用updated
         this.$refs.audio.play()
      }else{
        this.$refs.audio.pause()
      }

  },
  components:{
     ProgressBar,Scroll
  },
   computed:{
     iconMode(){//播放模式
       return this.mode===playMode.sequence?'icon-sequence':this.mode===playMode.loop?'icon-loop':'icon-random'
     },
     percent(){//计算已走进度条占整个进度条的百分比
       return this.currentTime/this.currentSongOtherInfo[0].duration
     },
     cdCls(){
       return this.playing?"play":"play pause"
     },
     playIcon(){
       return this.playing?'icon-pause':'icon-play'
     },
      miniIcon(){
       return this.playing?'icon-pause-mini':'icon-play-mini'
     },
     disableCls(){//当网络很卡时,连续点击播放器的按钮，按钮就会变灰，
        return this.songReady?'':'disable'
     },
    ...mapGetters([//最新获取数据，一定要理解最新时刻
      'fullScreen',
      'playlist',
      'currentSong',
      'currentIndex',
      'currentSongOtherInfo',
      'playing',
      'mode',
      'sequenceList'
    ])
  },
  methods:{
    middleTouchStart(e){//歌词列表滑动
        this.touch.initiated=true
        const touch=e.touches[0]

        this.touch.startX=touch.pageX
        this.touch.startY=touch.pageY

    },
    middleTouchEnd(e){
       let offsetWidth;
       let opacity;
       if(this.currentShow==="cd"){//当页脚点是第一个点时，即是唱片画面
          if(this.touch.percent>0.1){//当我们向左滑动的距离超过屏幕宽度的十分之一的距离时,自动切换到歌词列表画面
            offsetWidth=-window.innerWidth
            opacity=0//唱片画面彻底消失
            this.currentShow="lyric"
          }else{
            offsetWidth=0
            opacity=1//唱片画面仍然显现
          }
       }else{//当页脚点是第二个点是,即是歌词列表画面
           if(this.touch.percent<0.9){//往右滑动超过屏幕宽度的十分之一时,自动切换到唱片画面
            offsetWidth=0
            this.currentShow="cd"
            opacity=1
          }else{
            offsetWidth=-window.innerWidth
            opacity=0
          }
       }
       const time=300
      this.$refs.lyricList.$el.style.transform=`translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style.webkitTransform=`translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style.transitionDuration=`${time}ms`
      this.$refs.middleL.style.opacity=opacity
      this.$refs.middleL.style.transitionDuration=`${time}ms`
    },
    middleTouchMove(e){
        if(!this.touch.initiated){
           return
       }
      const touch=e.touches[0]
      const deltaX=touch.pageX-this.touch.startX
      const deltaY=touch.pageY-this.touch.startY
      if(Math.abs(deltaY)>Math.abs(deltaX)){//只支持横向滚动
          return
      }
      //第一种情况
      const left=this.currentShow==='cd'?0:-window.innerWidth
      //如果是唱片,本身唱片元素原来位置是距离屏幕左边是0px,如果是歌词列表元素则切换后的横向位置是-window.innerWidth
      const offsetWidth=Math.min(0,Math.max(-window.innerWidth,left+deltaX))//左滑deltaX为负值,向右滑动deltaX为正值
      //如果是唱片向歌词列表切换,则你是向左滑动的，因此deltaX是负值,Math.max取得的是left+deltaX而left是0,因此是deltaX,
      //然后是Math.min最后取得还是deltaX值,也就是说offsetWidth取得的是你向左滑动的距离,这个数是负数

      //第二种情况就是如果本身是歌词列表在屏幕上，left则为-window.innerWidth,要切换到唱片画面需要向右滑动,left+deltaX则
      //大于-window.innerWidth,在Math.min取得的值还是left+deltaX,也就是说offsetWidth取得的是屏幕宽度减掉你向右滑动的距离
      //且这个数是个负数

      this.touch.percent=Math.abs(offsetWidth/window.innerWidth)
      this.$refs.lyricList.$el.style.transform=`translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style.webkitTransform=`translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style.transitionDuration=`0ms`
      this.$refs.middleL.style.opacity=1-this.touch.percent//滑动的时候准备被切换走的唱片画面有渐渐消失的效果
      this.$refs.middleL.style.transitionDuration=0

    },
    getLyric(){
      // console.log(this.currentSongOtherInfo[1])
      this.currentLyric=new Lyric(this.currentSongOtherInfo[1],this.handleLyric)
      //查看lyric-parser插件文档这样使用的,第一个参数为歌词，第二个参数为回调函数
      if(this.playing){
        this.currentLyric.play()//查看lyric-parser插件文档这样使用的
      }
    },
    handleLyric({lineNum,txt}){//这个回调函数会不断被调用，因为lyric-parse插件,因此lineNum与txt不断在变
       this.currentLineNum=lineNum
       if(lineNum>5){//如果自动滚动歌词5行之外,则会歌词列表开始一行一行的向上滚,内容向下展示
         let lineEl=this.$refs.lyricLine[lineNum-5]
         this.$refs.lyricList.scrollToElement(lineEl,1000)
       }else{//自动滚动5行歌词,歌词列表都不会滚动
         this.$refs.lyricList.scrollTo(0,0,1000 )
       }
       this.playingLyric=txt
    },
    changeMode(){//改变播放模式
      const mode=(this.mode+1)%3
      this.setPlayMode(mode)
      let list=null
      if(mode===playMode.random){
        list=shuffle(this.sequenceList)
      }else{
        list=this.sequenceList

      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list){//当播放列表被重新排序时,当前播放歌曲的index要改变使得播放的歌曲还是之前播放的歌曲
       let index=list.findIndex((item)=>{//es6新函数findIndex找到对应索引值的item后就返回该item的索引
        return item.songInfo.id===this.currentSong.songInfo.id
       })
       this.setCurrentIndex(index)//这样于是就引发watch的currentSong因此去看下面watch我写的笔记
    },
    onProgressBarChange(percent){
      const currentTime=this.currentSongOtherInfo[0].duration*percent
      this.$refs.audio.currentTime=currentTime
    this.$refs.audio.currentTime=this.currentSongOtherInfo[0].duration*percent
    if(!this.playing){//就是你在拖动完的时候，如果音乐播放器是播放图标(三角形图标)就立即转变为||图标并且让播放器继续播放音乐
      this.togglePlaying()
    }
    if(this.currentLyric){//当我拖动进度条时,歌词列表也会跳转
       this.currentLyric.seek(currentTime*1000)
    }
    },
    format(interval){
      interval=interval|0
      const minute=interval/60|0
      const second=this._pad(interval%60)
      return `${minute}:${second}`
    },
    _pad(num,n=2){//对时间数字补零操作
    let len=num.toString().length
    while(len<2){
      num='0'+num
      len++
    }
    return num
    },
    end(){
      if(this.mode===playMode.loop){
        this.loop()//继续循环播放
      }else{
        this.next()//播放下一首歌
      }
    },
    loop(){
      this.$refs.audio.currentTime=0
      this.$refs.audio.play()
      if(this.currentLyric){//当歌曲是循环播放时,歌词列表退回第一行高亮
        this.currentLyric.seek(0)
      }
    },
    updateTime(e){
      this.currentTime=e.target.currentTime//表示当前播放时间
    },
    error(){
       this.songReady=true //当播放地址有误时,触发error函数而不触发ready函数，因此你就改不了songready的值,
       //因此需要error函数帮你改songReady的值
    },
    ready(){
      if(this.$refs.audio.networkState===undefined){
         return
      }
      this.songReady=true
    },
    next(){
       let index;
      if(!this.songReady){//下一首的请求还没准备好时阻止进行下一首歌的播放
        console.log('不能切换了吗')
         return
      }
      if(this.playlist.length===1){//如果这名歌手只有一首歌曲,那么播放完该歌曲自动循环播放
        this.loop()
      }else{
       index=this.currentIndex+1
      if(index===this.playlist.length){
        index=0
      }
    }

      let otherInfo;
      this.setCurrentIndex(index)
      otherInfo=getSong(this.currentSong)

       setTimeout(()=>{
        this.setCurrentSongOtherInfo(otherInfo)
       },500)
        if(!this.playing){
          this.togglePlaying()
        }
      this.songReady=false//当成功可以播放下一首歌时,把ready状态返回为false


    },
    prev(){
        if(!this.songReady){//下一首的请求还没准备好时阻止进行下一首歌的播放
         return
      }
      if(this.playlist.length===1){
         this.loop()
      }else{
          let index=this.currentIndex-1
      if(index===-1){
        index=this.playlist.length-1
      }
      }

      let otherInfo;
      this.setCurrentIndex(index)
       otherInfo=getSong(this.currentSong)
      setTimeout(()=>{
          this.setCurrentSongOtherInfo(otherInfo)
       },500)
       this.songReady=false//当成功可以播放下一首歌时,把ready状态返回为false
    },
    back(){
      //this.fullScreen=false//记得一点是你要改vuex里面存起来的公共值时，不能没有mapmutations来操作,否则不起效果,因此这行代码不起作用
      this.setFullScreen(false)
    },
    open(){
       this.setFullScreen(true)
    },
    //使用第三方插件create-keyframe-animation写css3动画,因此记得要下载
    enter(el,done){//el是作用于的Dom元素,done是回调函数自动跳到afterEnter函数执行,这里的动画是小图片移动到大图片中去
        const {x,y,scale}=this._getPosAndScale()
        let animation={
          0:{
            transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60:{
            transform:`translate3d(0px,0px,0) scale(1.1)`
          },
          100:{
            transform:`translate3d(0px,0px,0) scale(1)`
          }
        }
        animations.registerAnimation({
          name:'move',
          animation,
          presets:{
            duration:400,
            easing:'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper,'move',done)//执行完就跳到afterEnter
    },
    afterEnter(){
         animations.unregisterAnimation('move')
         this.$refs.cdWrapper.style.animation=''//清空样式
    },
    leave(el,done){//el是作用于的Dom元素,done是回调函数自动跳到afterLeave函数执行
         const {x,y,scale}=this._getPosAndScale()
        let animation={
          0:{
            transform:`translate3d(0px,0px,0) scale(1)`
          },
          60:{
            transform:`translate3d(0px,0px,0) scale(1.1)`
          },
          100:{
            transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
          }
        }
        animations.registerAnimation({
          name:'move',
          animation,
          presets:{
            duration:400,
            easing:'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper,'move',done)//执行完就跳到afterLeave
    },
    afterLeave(){
        animations.unregisterAnimation('move')
         this.$refs.cdWrapper.style.animation=''//清空样式
    },
    togglePlaying(){
        if(!this.songReady){//下一首的请求还没准备好时阻止进行下一首歌的播放
         return
      }
       this.setPlayingState(!this.playing)
       if(this.currentLyric){//当我们点击暂停按钮时,歌词列表还在动,这个bug,因此需要判断歌词是否还在动,在动的话
       //调用Lyric插件自带的togglePlay方法,切换成歌词不允许动
         this.currentLyric.togglePlay()
       }
    },
    _getPosAndScale(){
     const targetWidth=40//底部小播放器的图片宽度40
     const paddingLeft=40//底部小播放器的图片以中心作为坐标的话，离屏幕左边边界40px
     const paddingBottom=30//底部小播放器的图片以中心作为坐标的话，离屏幕底边边界40px
     const paddingTop=80//大播放器里面唱片图片圆形图的顶部到屏幕顶部边界80px
     const width=window.innerWidth*0.8//大播放器的唱片图占整个屏幕宽度是80%,自己css上设置了
     const scale=targetWidth/width
     const x=-(window.innerWidth/2-paddingLeft)
     const y=window.innerHeight-paddingTop-width/2-paddingBottom
     return{
       x,y,scale
     }
    },
    ...mapMutations({
      setFullScreen:'SET_FULL_SCREEN',
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setCurrentSongOtherInfo:'SET_CURRENT_SONG_OTHER_INFO',
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST'
    })
  },
  watch:{
    currentSong(){
      if(this.currentLyric){//每次切换歌曲时，我们都会实例化一个Lyric出来，造成一个bug就是
      //歌词列表展现时,歌词高亮的那几行字会来回跳动
        this.currentLyric.stop()//因此每次切换歌曲时，都要检查当前也就是前一首歌曲是否有new实例化了一个实例,
        //如果有，就清除上一首歌的Lyric的实例
      }
       this.$nextTick(()=>{
         this.getLyric()
       })
    },
    playing(newPlaying){
       const audio=this.$refs.audio
        setTimeout(()=>{
          newPlaying?this.$refs.audio.play():this.$refs.audio.pause()
      },1000)


     }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused//暂停动画这是css3的属性
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
