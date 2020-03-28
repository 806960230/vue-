<template>
    <scroll class="listview" :data="data" ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"><!--只有probeType为3时，才能得出pos.y的值-->
       <ul>
         <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
           <h2 class="list-group-title">
              {{group.title}}
           </h2>
           <ul>
             <li v-for="(item,key) in group.items" :key="key"
             class="list-group-item"
             @click="selectItem(item)">
                <img v-lazy="item.pic" class="avatar">
                <span class="name">{{item.name}}</span>
             </li>
           </ul>
         </li>
       </ul>
       <div class="list-shortcut" @touchstart="onShortcutTouchStart"
       @touchmove.stop.prevent="onShortcutTouchMove">
         <ul>
           <li v-for="(item,index) in shortcutList" :key="index" class="item"
           :data-index="index"
           :class="{'current':currentIndex===index}">
             {{item}}
           </li>
         </ul>
       </div>
    </scroll>
</template>

<script>
//fixedTitle模块没有做,当作课外作业吧!!!!!!!!!!!!!!!!!!!!!!!!!!
import Scroll from '../scroll/scroll'
import {getData} from '../../common/js/dom'
const ANCHOR_HEIGHT=18//从样式里面找到右边字母列表每一个字母格子高度是18
export default {
  props:{
   data:{
     type:Array,
     default:[]
   }
  },
  created(){
    this.touch={}//定义一个touch
    this.listenScroll=true
    this.listHeight=[]
  },
  data () {
    return {
      scrollY:-1,
      currentIndex:0,//是哪个字母方块的话就哪个高亮
      probeType:3
    }
  },
  computed:{
    shortcutList(){
      return this.data.map((group)=>{
          return group.title.substr(0,1)
      })
    }
  },
  components:{
    Scroll
  },
  methods:{
    onShortcutTouchStart(e){
    let anchorIndex=getData(e.target,'index')//拿到data-index属性对应的值,注意这里得到是字符串,而不是数字
    let firstTouch=e.touches[0]//第一次点击的记录
    this.touch.y1=firstTouch.pageY//获取点击的点的对于整个页面(意思是指包括了滑动的距离,如果页面
    //没有滚动那么该值相当于clientY,clientY是对于窗口的纵坐标)而非窗口的纵坐标
    this.touch.anchorIndex=anchorIndex//记录点击的锚点
    // this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],0)
    this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e){
       let SecondTouch=e.touches[0]
       this.touch.y2=SecondTouch.pageY//第二次点击的记录
       let delta=Math.floor(this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT //后面写了个|0是当只是两次点击的相差距离是0.几几时,直接结果为0
      let anchorIndex=parseInt(this.touch.anchorIndex)+delta//原先第一次被点击的锚点加上差距就得到第二次被点击的锚点的index
       this._scrollTo(anchorIndex)
    },
    _scrollTo(index){
      //---------------------------用于判断右边列表是否被点击的是字母或者热门格子,如果没点击到则不要启用scrollto方法
      if(!index&&index!==0){//没点击到格子的情况
        return
      }
      if(index<0){
        index=0
      }else if(index>this.listHeight.length-1){
        index=this.listHeight.length-1
      }
      this.scrollY=-this.listHeight[index]//实时更新scrollY值
      //---------------------------
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)//第二个参数表示滚动到目的地的时间,我设置为0则瞬间滚动到目的地
    },
    scroll(pos){
     this.scrollY=pos.y
    },
    refresh(){
      this.$refs.listview.refresh()
    },
    _calculateHeight(){
      this.listHeight=[]
      const list=this.$refs.listGroup
      let height=0
        for(let i=0;i<list.length;i++){
          height+=list[i].clientHeight
          this.listHeight.push(height)
        }

    },
    selectItem(item){
     this.$emit('select',item)
    }
  },
  watch:{
    data(){
      setTimeout(()=>{//数据变化到dom变化有点延迟所以异步操作
      this._calculateHeight()
      },20)
    },
    scrollY(newY){
      const listHeight=this.listHeight
      //  console.log(-newY)
      //第一种情况:当我们一直滚动顶部向下拉的时候newY是大于0的,
      if(-newY<0||(-newY<listHeight[0])){
        console.log(0)
        this.currentIndex=0
        return
      }
      //第二种情况:当我们滚动在中间部分,也就是newY是<0的
      for(let i=0;i<listHeight.length-1;i++){
        let height1=listHeight[i]
        let height2=listHeight[i+1]
        if((-newY)>=height1&&(-newY)<height2){//向下滚动是负值在增加，所以要改为正值
            this.currentIndex=i+1
            console.log(i+1)
            return
        }
      }
      //第三种情况:当我们滚动在底部部分一直向上拉时,-newY已经超过listHeight最后一个值了
         this.currentIndex=listHeight.length-1
            return
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
 @import "../../common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
