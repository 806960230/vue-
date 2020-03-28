<template>
  <div class="search">
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper"><!--当搜索框内没有文字时展示热门搜索以及搜索历史记录-->
        <scroll class="shortcut" ref="shortcuts" :data="shortcut"><!--scroll组件只能包含一个div-->
          <div>
           <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li class="item" v-for="(item,index) in hotKey"
                :key="index"
                @click="addQuery(item.title)">
                   <span>{{item.title}}</span>
                </li>
              </ul>
           </div>
           <div class="search-history" v-show="searchHistory.length>0">
             <h1 class="title">
               <span class="text">搜索历史</span>
               <span class="clear" @click="deleteAll">
                 <i class="icon-clear"></i>
               </span>
             </h1>
             <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></search-list>
           </div>
          </div>
        </scroll>
      </div>
      <div class="search-result" v-show="query" ref="searchResult"><!--当搜索框内有文字时展示搜索结果列表-->
        <suggest :query="query" @select="saveSearch" ref="suggestScroll"></suggest>
      </div>
      <router-view></router-view>
  </div>
</template>

<script>
import searchBox from '../../base/search-box/search-box'
import {hotKeyParams} from '../../api/config'
import {_getHotKey} from '../../common/js/search'
import Axios from 'axios'
import Suggest from '../suggest/suggest'
import searchList from '../../base/search-list/search-list'
import {mapActions,mapGetters} from 'vuex'
import {playlistMixin} from '../../common/js/mixin'
import Scroll from '../../base/scroll/scroll'
export default {
  mixins:[playlistMixin],
  created(){
     this._getHotKey()
  },
  data () {
    return {
      hotKey:[],
      query:''
    }
  },
  computed:{
    shortcut(){
     return this.hotKey.concat(this.searchHistory)
    //这里concat只是为了看见hotkey或者searchHistory其中一个有变化的话，
    //scroll组件会重新计算高度值,我们根本不会使用return回来的东西
    //
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  watch:{
       query(newQuery){
       if(!newQuery){//当搜索框内没有新搜索文字时,重新计算
         setTimeout(()=>{
          this.$refs.shortcuts.refresh()
         },20)
       }
    }
  },
  components:{
     searchBox,Suggest,searchList,Scroll
  },
  methods:{
    handlePlaylist(playlist){
      const bottom=playlist.length>0?'60px':''
      this.$refs.shortcutWrapper.style.bottom=bottom
      this.$refs.searchResult.style.bottom=bottom
      this.$refs.shortcuts.refresh()
      this.$refs.suggestScroll.refresh()

    },
    _getHotKey(params){
      let data;
  Axios('/vkey/cgi-bin/musicu.fcg',hotKeyParams).then(response=>{

     data=response.data.hotkey.data.vec_hotkey.slice(0,10)
     this.hotKey=data

  }).catch(error=>{
    console.log(error)
  })
     },
     addQuery(query){
       this.$refs.searchBox.setQuery(query)
     },
     onQueryChange(query){
        this.query=query
     },
     saveSearch(){
       this.saveSearchHistory(this.query)
     },
     deleteOne(item){
       this.deleteSearchHistory(item)
     },
     deleteAll(){
       this.clearSearchHistory()
     },
     ...mapActions([
       'saveSearchHistory',
       'deleteSearchHistory',
       'clearSearchHistory'
     ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
