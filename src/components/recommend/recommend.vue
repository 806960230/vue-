<template>

  <div class="recommend" ref="recommend">
     <scroll class="recommend-content" :data="allSongs" ref="scroll" >
       <!--这里面写:data="allSongs"为了给予scroll组件中实时观察你的全部歌曲的数据获取变化动态
       一旦发生动态变化，就调用我自己在scroll写的refresh功能,确保整个推荐页面得到正确的高度计算值
       better-scroll这样才不会出错-->
     <div id="split"> <!--这里多加个div是为了让swiper组件与better-scroll组件分开来，
       如果没有这个div，是无法连带轮播图被滑动走-->
        <div class="swiper-container" v-if="lunbo.length">
             <!--一定要有v-if，要等lunbo数据拿到才能渲染然后才能计算宽度值-->
           <swiper class="swiper-wrapper" :options="swiperOption" ref="mySwiper">
                <!-- slides -->
             <swiper-slide v-for="(item,index) in lunbo" :key="index"
             class="swiper-slide">
               <a :href="item.id">
               <img :src="item.cover" class="picture needsclick" @load="getHeightNow">
      <!--needsclick的使用是在,当fastclick与betterscroll中设置的click属性值为true发生冲突而导致我们这里
      的图片被点击后没有反应（即不能跳转页面）,因此在图片上添加needsclick类名即可解决该问题-->
               </a>
             </swiper-slide>
             <!-- Optional controls -->
      <div class="swiper-pagination "  slot="pagination"></div>
      <div class="swiper-button-prev swiper-button-black" slot="button-prev"></div>
      <div class="swiper-button-next swiper-button-black" slot="button-next"></div>
           </swiper>
        </div>
        <div class="recommend-list">
           <h1 class="list-title">热门歌单推荐</h1>
           <ul>
             <li v-for="(item,index) in allSongs" :key="index" class="item">
                <div class="icon">
                   <img v-lazy="item.imgurl" width="60" height="60">
                </div>
                <div class="text">
                   <h2 class="name" v-html="item.creator.name">
                     <!--v-html="item.creator.name"这个creator是帮助转义字符的东西,我们这边
                     获取的数据暂时是没有什么非中文英文的其他字符,因此这里用这个方法没什么效果的
                     主要是告知你有这个方法而已-->
                   </h2>
                   <p class="desc" v-html="item.dissname"></p>
                </div>
             </li>
           </ul>
        </div>
       </div>
       <div class="loading-container" v-show="!allSongs.length">
         <loading></loading>
       </div>
     </scroll>
  </div>

</template>

<script>
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import {ERR_OK} from '../../api/config'
import {swiper,swiperSlide} from 'vue-awesome-swiper'
import Axios from "axios"
import {CommonParams,SongsParams} from '../../api/config.js'
import {playlistMixin} from '../../common/js/mixin'
export default {
  mixins:[playlistMixin],
  created(){
    // setTimeout(()=>{//此三行代码用作测试你的better-scroll是否得到正确计算整个页面
    //     this._getRecommend()
    // },3000)
    this._getRecommend()
    this._getAllSongs()
  },
   data () {
    return {
      lunbo:[],
      swiperOption:{
        notNextTick:true,
      //是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper
        loop:true,
        autoplay:{
          delay:1000,//延迟1秒切换下一张图片
          stopOnLastSlide:false,
          disableOnInteraction:false,//当用户操作例如点击分页点或者左右按钮时,还是会自动轮播
        },
        // effect : 'flip',//翻页效果
        direction : 'horizontal',//水平切换
        on: {//滑动之后回调函数
              slideChangeTransitionEnd: function(){
                console.log(this.activeIndex);//切换结束时，告诉我现在是第几个slide
              },
          },
         //左右点击
        navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
          },
        pagination: {
              el: '.swiper-pagination',
              clickable :true
          }

      },
      swiperSlides:[1,2,3,4,5,6,7,8,9,10],
      allSongs:[],
      checkLoaded:false//检测轮播图里面的图片是否加载完
    }
  },
  computed:{

  },
  methods:{
     handlePlaylist(playlist){
        const bottom=playlist.length>0?'60px':''//如果存在播放列表,则需要空出高度60px位置给迷你小播放器
        this.$refs.recommend.style.bottom=bottom
        this.$refs.scroll.refresh()
     },
    _getRecommend(){
     let data;
     //--------------
    Axios('/vkey/cgi-bin/musicu.fcg',CommonParams).then(response=>{
      data=response.data.MusicHallHomePage.data.v_shelf[2].v_niche[0].v_card
       this.lunbo=data;
    }).catch(error=>{
      console.log(error)
    })

    },
    _getAllSongs(){
      let data;
      Axios('/api/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',SongsParams).then(response=>{
         data=response.data.data.list
         this.allSongs=data
         console.log(data)
    }).catch(error=>{
      console.log(error)
    })
    },
    getHeightNow(){//为了当得到图片时，才能算出高度，算出高度才给予_getRecommend计算高度,
    //当_getRecommend计算完高度后又才能给整个推荐页面的better-scroll插件计算整个页面高度,
    //因此这样才能精准的使用better-scroll插件。
      if(!this.checkLoaded){
        this.$refs.scroll.refresh()//调用scroll组件里面我写好的refresh方法
        this.checkLoaded=true
      }
    }

  },
  components:{
    swiper,
    swiperSlide,
    Scroll,
    Loading

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
 @import "../../common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .swiper-container
         .swiper-slide
            .picture
               width:100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
