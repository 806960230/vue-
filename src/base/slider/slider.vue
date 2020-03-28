<template>
 <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
       <span class="dot" v-for="(item,index) in dots" :key="index"
       :class="{active:currentPageIndex===index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from '../../common/js/dom'
export default {
  props:{
    loop:{
      type:Boolean,
      default:true
    },
    autoPlay:{
      type:Boolean,
      default:true
    },
    interval:{
      type:Number,
      default:3000
    }
  },
  data () {
    return {
      listWidth:[],
      dots:[],
      children:[],
      currentPageIndex:0
    }
  },
  mounted(){
    setTimeout(()=>{
      this._setSliderWidth();//注意执行顺序
      this._initDots();
      this._initSlider();
      if(this.autoplay){//自动播放
        this._play();
      }
    },20)
  },
  components:{

  },
  methods:{
    //计算宽度
    _setSliderWidth(){
        this.children=this.$refs.sliderGroup.children
        console.log(this.children);
        let width=0
        let sliderWidth=this.$refs.slider.clientWidth//容器元素宽度
        console.log(sliderWidth)
        for(let i=0;i<this.children.length;i++){
           let child=this.children[i]
             addClass(child,'slider-item')
             child.style.width=sliderWidth+'px'//为每张轮播的元素宽度是容器宽度
        }
        if(this.loop){//如果循环播放,宽度增至两倍的宽度
          width=(this.children.length-2)*sliderWidth
        }
        this.$refs.sliderGroup.style.width=width+"px"
    },
    //初始化
    _initSlider(){
       this.slider=new BScroll(this.$refs.slider,{
         click:true,
         scrollX:true,//允许横向播放
         scrollY:false,//不允许竖直播放
         momentum:false,
   //当快速滑动时是否开启滑动惯性
         snap:{//该属性是给 slider 组件使用的，普通的列表滚动不需要配置
          loop:this.loop,//无缝循环轮播
          threshold:0.3,//用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
          speed:400//轮播图切换的动画时间
         }



       })
       this.slider.on('scrollEnd',()=>{//每当切换到下一张图片时，发生scrollend事件

         let pageIndex=this.slider.getCurrentPage().pageX;//获取轮播中第几个的子元素
         console.log(pageIndex);
        //  if(this.loop){

        //  }
        this.currentPageIndex=pageIndex
         if(this.autoplay){
           clearTimeout(this.timer)
           this._play()
         }
       })
    },
    _initDots(){
    this.dots=new Array(this.children.length)//新版本的better-scroll,由于你有10张图片
    //需要被轮播,在新版本的better-scroll中会自动给你变成12张，2张用来空白页，因此要减掉
  },
     _play(){
       this.timer=setTimeout(()=>{
         this.slider.next()
       },this.interval)
     }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
     @import "../../common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      height:200px
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
