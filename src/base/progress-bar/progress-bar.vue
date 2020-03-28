<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick"><!--全部进度条-->
    <div class="bar-inner"><!--已走进度条-->
       <div class="progress" ref="progress">

       </div>
       <div class="progress-btn-wrapper" ref="progressBtn"
       @touchstart.prevent="progressTouchStart"
       @touchmove.prevent="progressTouchMove"
       @touchend="progressTouchEnd"><!--进度条中的小球移动-->
         <div class="progress-btn"></div>
       </div>
    </div>

  </div>
</template>

<script>
const progressBtnWidth=16

export default {
  props:{
    percent:{
      type:Number,
      default:0
    }
  },
  data () {
    return {

    }
  },
  created(){
    this.touch={}
  },
  watch:{
    percent(newPercent){
      if(newPercent>0&&!this.touch.initiated){//只有当我们没有拖动时，才给进度条计算百分比
        const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
    //因为是小球先到达整个进度条结束点的(即命名为已走进度条的极限宽度),因此要得出已走进度条的极限宽度则需要整个进度条减掉小球宽度
        const offsetWidth=newPercent*barWidth//得出已走进度条宽度
        this.$refs.progress.style.width=`${offsetWidth}px`
        this.$refs.progressBtn.style.transform=`translate3d(${offsetWidth}px,0,0)`
      }
    }
  },
  methods:{
    progressTouchStart(e){
       console.log('拖动开始')
       this.touch.initiated=true
       this.touch.startX=e.touches[0].pageX//第一次点击进度条的点击点的横向坐标
       this.touch.left=this.$refs.progress.clientWidth//第一次点击进度条时,当时已走进度条还没被拖动的是时候是多长
    },
    progressTouchMove(e){
      console.log('拖动中')
      if(!this.touch.initiated){
        return
      }
      const deltaX=e.touches[0].pageX-this.touch.startX//计算拖动后的横向坐标(距离屏幕的左边界的距离)与拖动前横向坐标的差距
      const offsetWidth=Math.min(Math.max(0,this.touch.left+deltaX),this.$refs.progressBar.clientWidth-progressBtnWidth)
      //计算已走进度条宽度且设定好了该宽度不能大于原则上已走进度条的极限宽度
      this._offset(offsetWidth)
    },
    _offset(offsetWidth){//对已走进度条的样式修改,使得进度条真的在走动
     this.$refs.progress.style.width=`${offsetWidth}px`
     this.$refs.progressBtn.style.transform=`translate3d(${offsetWidth}px,0,0)`
    },
    progressTouchEnd(){
      console.log('拖动结束')
      this.touch.initiated=false
      //然后告诉播放器你要到哪个时间点开始播放
      this._triggerPercent()
    },
    _triggerPercent(){//告诉播放器你要到哪个时间点开始播放
       const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
       const percent=this.$refs.progress.clientWidth/barWidth
       console.log(percent)
       this.$emit('percentChange',percent)
    },
    progressClick(e){
        // this._offset(e.offsetX) //获取鼠标指针位置相对于触发事件的对象的 x 坐标,这里获取不对，导致了点击按钮出现进度条迅速滚回0点
        const rect=this.$refs.progressBar.getBoundingClientRect()//返回元素的大小以及相对于视口的位置
        const offsetWidth=e.pageX-rect.left
        console.log(offsetWidth)
        this._offset(offsetWidth)
        this._triggerPercent()
    }

  },
  components:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
   @import "../../common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
