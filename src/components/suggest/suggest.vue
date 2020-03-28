<template>
  <scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" ref="suggest">
     <ul class="suggest-list">
       <li class="suggest-item" v-for="(item,index) in result" :key="index"
       @click="selectItem(item)">
           <div class="icon">
             <i :class="getIconCls(item)"></i>
           </div>
           <div class="name">
             <p class="text" v-html="getDisplayName(item)"></p>
           </div>
       </li>
       <loading v-show="hasMore"></loading>
     </ul>
  </scroll>
</template>

<script>
import {getSearchParams} from '../../api/config'
import {filterSinger,createSong,getSong} from '../../common/js/song'
import Scroll from '../../base/scroll/scroll'
import Axios from 'axios'
import Loading from '../../base/loading/loading'
import Singer from '../../common/js/singer'
import {mapMutations,mapActions} from 'vuex'
const TYPE_SINGER='singer'//用于判断你搜索的是歌手还是歌曲的
const PER_PAGE=20//搜索列表的东西在屏幕上每页展示20条数据,每超过20条,就需要滚动列表,出现下一页数据在屏幕上
export default {
  props:{
    query:{
      type:String,
      default:''
    },
  showSinger:{
        type:Boolean,
        default:true
    }
  },
  methods:{
     search(){
       let params=getSearchParams(this.query,this.page,this.showSinger,PER_PAGE)
        let data;
     Axios('/api/soso/fcgi-bin/search_for_qq_cp',params).then(response=>{
       console.log(response.data.data)
       this.result=this._getResult(response.data.data)//顺便把拿到的数据序列化成你想要的数据格式
       console.log(this._getResult(response.data.data))//如果是搜索歌手打印出[{...},Song,Song,Song等等许多Song]
       //而{...}里面存有type:'singer' //如果搜索不是歌手打印出[Song,Song,Song等等许多Song]
        this._checkMore(response.data.data)//检查是否搜索列表里面的数据内容超出了屏幕高度,也就是说还有没有数据
  }).catch(error=>{
    console.log(error)
  })
     },
     _getResult(data){
       let ret=[]
       if(data.zhida&&data.zhida.singerid){//zhida是显示歌曲的id,歌名以及专辑数据等等
         ret.push({...data.zhida,...{type:TYPE_SINGER}})//...{type:TYPE_SINGER}意思是指拿到一个对象(里面所有属性都存在)且该对象满足条件
         //有type属性且属性值为'singer'
         console.log(ret)
       }
       if(data.song){//搜索到的相关所有歌曲数据取进来
         ret=ret.concat(this._normalizeSongs(data.song.list))
       }
       return ret
     },
     getIconCls(item){
       if(item.type===TYPE_SINGER){//如果是歌手,则展现一种图标,如果不是则展示另一种图标
         return 'icon-mine'
       }else{
         return 'icon-music'
       }
     },
     getDisplayName(item){

         if(item.type===TYPE_SINGER){
           return item.singername
         }else{
           return `${item.name}-${item.singer}`
         }
     },
     _normalizeSongs(list){//序列化搜索到的相关所有歌曲
       let ret=[]
       list.forEach((musicData)=>{
         if(musicData.songid&&musicData.albumid){
           ret.push(createSong(musicData))//创建一个个歌曲数据形式(你想要的数据形式)并且放入数组中
         }
       })
       return ret
     },
     _checkMore(data){
       const song=data.song
       if(!song.list.length||(song.curnum+song.curpage*PER_PAGE)>song.totalnum){
           this.hasMore=false
       }
     },
     searchMore(){//向下滚动后还有内容的话,搜索的东西慢慢出现
       if(!this.hasMore){
         return
       }
       this.page++
         let params=getSearchParams(this.query,this.page,this.showSinger,PER_PAGE)
        let data;
     Axios('/api/soso/fcgi-bin/search_for_qq_cp',params).then(response=>{
       console.log(response.data.data)
       this.result=this.result.concat(this._getResult(response.data.data))//把之前的内容和新加载的内容拼接起来
       console.log(this.result)
      this._checkMore(response.data.data)
     }).catch(error=>{
    console.log(error)
  })
  },
  selectItem(item){
     console.log(item)
    if(item.type===TYPE_SINGER){
       console.log('singer了吗')
        const singer= new Singer({
        id:item.singermid,
        name:item.singername
      })
      this.$router.push({path:`/search/${singer.id}`})
    this.setSinger(singer)
    }else{//如果点击的是歌曲,那么就插入播放列表中，并且播放
      let newItem={};
      newItem.songInfo=item
      let otherInfo=getSong(newItem)
      setTimeout(()=>{
       this.insertSong({'song':newItem,'otherInfo':otherInfo})//如果要传入多个参数值，最好这样写一一对应
      },500)
       this.$emit('select')//交给父组件来保存历史
    }

  },
  refresh(){
    this.$refs.suggest.refresh()
  },
  ...mapMutations({
    setSinger:'SET_SINGER'
  }),
  ...mapActions([
    'insertSong'
  ])
  },
  watch:{
    query(newQuery){

     this.search(newQuery)
    }
  },
  data () {
    return {
     result:[],
     pullup:true,
     hasMore:true,
     page:1
    }
  },
  components:{
     Scroll,Loading
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
