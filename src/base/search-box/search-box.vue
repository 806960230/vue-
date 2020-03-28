<template>
  <div class="search-box">
     <i class="icon-search"></i>
     <input class="box" :placeholder="placeholder" v-model="query">
     <!--v-model双向绑定,就是我们输入什么,data里面的query就是什么,而data里面的query是什么,那输入框内容就是什么-->
     <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import {debounce} from '../../common/js/util.js'
export default {
  props:{
    placeholder:{
      type:String,
      default:'搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query:''
    }
  },
  components:{

  },
  methods:{
    clear(){
      this.query=''
    },
    setQuery(query){
      this.query=query
    }
  },
  created(){
    this.$watch('query',debounce((newQuery)=>{
       this.$emit('query',newQuery)
    },200))//200毫秒内如果又被触发query,debounce里面的func函数是不会被调用的,如果超过200毫秒才可以调用func
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
     @import "../../common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
