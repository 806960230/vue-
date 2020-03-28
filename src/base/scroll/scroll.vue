<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props:{
    probeType:{
       type:Number,
       default:1
    },
    click:{
      type:Boolean,
      default:true
    },
    data:{
      type:Array,
      default:null
    },
    listenScroll:{//用来监听滚动事件,监听滚动到哪里了，从而右边字母列表相应字母高亮
      type:Boolean,
      default:false
    },
    pullup:{//向下拉刷新
      type:Boolean,
      default:false
    }
  },
  data () {
    return {

    }
  },
  mounted(){
    setTimeout(()=>{
      this._initScroll()
    },20)
  },
  methods:{
    _initScroll(){
      if(!this.$refs.wrapper){
        return
      }
      this.scroll=new BScroll(this.$refs.wrapper,{
        probeType:this.probeType,
        click:this.click
      })
     if(this.listenScroll){
       let me=this
       this.scroll.on('scroll',(pos)=>{
         me.$emit('scroll',pos)
       })
     }
     if(this.pullup){//每次上拉刷新,内容向下滚动到还没更新出数据的底部时会触发scrollEnd事件
       this.scroll.on('scrollEnd',()=>{
          if(this.scroll.y<=(this.scroll.maxScrollY+50)){//如果小于这个值的话，说明快滚到底部了为什么是50？？
              this.$emit('scrollToEnd')
          }
       })
     }
    },
    enable(){
       this.scroll&&this.scroll.enable()
    },
    disable(){
       this.scroll&&this.scroll.disable()
    },
    refresh(){
       this.scroll&&this.scroll.refresh()
    },
    scrollTo(){
      this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)
    },
    scrollToElement(){
      this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments)
    }
  },
  components:{

  },
  watch:{
    data(){//data有变化就更新better-scroll
      setTimeout(()=>{
        this.refresh()
      },20)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">

</style>
