<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li @click="selectItem(item)" class="search-item" v-for="(item,index) in searches" :key="index">
          <span class="text">{{item}}</span>
          <span class="icon" @click.stop="deleteOne(item)">
            <i class="icon-delete"></i>
          </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props:{
    searches:{
      type:Array,
      default:[]
    }
  },
  data () {
    return {

    }
  },
  components:{

  },
  methods:{
    selectItem(item){
      this.$emit('select',item)
    },
    deleteOne(item){
      this.$emit('delete',item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
 @import "../../common/stylus/variable"
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
