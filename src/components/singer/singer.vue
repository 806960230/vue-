<template>
  <div class="singer" ref="singer">
    <list-view :data="organizedSingers" @select="selectSinger" ref="organizedSingers"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import Axios from "axios"
import {SingersParams} from '../../api/config.js'
import ListView from '../../base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from '../../common/js/mixin'
const HOT_NAME="热门"
const HOT_SINGER_LEN=10
export default {
  mixins:[playlistMixin],//把你建立的东西掺入这里面中
  data () {
    return {
      singers:[],//拿所有歌手的数据
      singerIndex:[],//拿所有歌手的名字的拼音首字母数据
      organizedSingers:[]//已经被序列化而得出的歌手数据
    }
  },
  components:{
     ListView
  },
  created(){
   this._getAllSingers();
   setTimeout(()=>{//需要等上面代码获取完数据才能再进行这个序列化函数,否则map拿到空
     this._normalizeSinger(this.singers);
   },500)
  },
  methods:{
    handlePlaylist(playlist){
        const bottom=playlist.length>0?'60px':''
        this.$refs.singer.style.bottom=bottom
         this.$refs.organizedSingers.refresh()
    },
    selectSinger(singer){
      this.$router.push({path:`/singer/${singer.id}`})
      this.setSinger(singer)//实现对mutations的提交
    },
   _getAllSingers(){
     let allData;
     let singerNames;
      Axios('/vkey/cgi-bin/musicu.fcg',SingersParams).then(response=>{
        allData=response.data.singerList.data.singerlist//得来的数据都是热门歌手的数据
        // tagData=response.data.singerList.data.tags
        this.singers=allData
    singerNames=["dèng zǐ qí ", "zhōu jié lún ", "chéng xiǎng ", "lǐ róng hào ", "lín jun4 jié ", "xuē zhī qiān ", "wèi xīn yǔ ", "yīn què shī tīng ", "yáng qiān huà ", "máo bú yì ", "Alan Walker (ài lán ·wò kè )", "rèn rán ", "chén yì xùn ", "chén xuě níng ", "xǔ sōng ", "cài jiàn yǎ ", "wáng lì hóng ", "Vicetone", "wāng sū lóng ", "zhāng sháo hán ", "zhāng jié ", "zhōu shēn ", "lǐ yǔ chūn ", "BEYOND", "zhuāng xīn yán ", "qǔ xiāo bīng ", "BLACKPINK", "mǎ jiàn tāo ", "huá chén yǔ ", "sūn yàn zī ", "zhāng yì xìng ", "yú wén wén ", "The Chainsmokers", "chén lì ", "zhāng liàng yǐng ", "sòng dōng yě ", "yáng zōng wěi ", "lín yòu jiā ", "zhāng xué yǒu ", "fèng huáng chuán qí ", "zhào léi ", "er gē ", "BIGBANG (빅뱅)", "yì yáng qiān xǐ ", "zhāng yǔ ", "jīn mín qí ", "bái xiǎo bái ", "mài xiǎo dōu ", "wǔ bǎi  & China Blue", "shèng yǔ ", "xiāo zhàn ", "jiǎng xuě ér ", "hú yàn bīn ", "mǐ jīn xuán shī  (よねづ けんし)", "wǔ yuè tiān ", "hú 66", "zhōu chuán xióng ", "nán zhēng běi zhàn NZBZ", "wú yì fán ", "zhāng xìn zhé ", "tián fù zhēn ", "zhāng bì chén ", "nà yīng ", "mò wén wèi ", "yǒng bīn Ryan.B", "zhāng jìng xuān ", "xǔ wēi ", "hú xià ", "Maroon 5 (mó lì hóng )", "Taylor Swift (tài lè ·sī wēi fū tè )", "ai chén ", "fáng dōng de māo ", "liú dé huá ", "hè yī háng ", "lǐ kè qín ", "shuāng shēng ", "yuán yà wéi ", "jiàng yāng zhuó mǎ ", "táo pǎo jì huá ", "yáng shuò "]
    singerNames.forEach((item,index)=>{ //为每个歌手的数据增添一项索引数据即名字拼音首字母
            var i=index;
       this.singers[i].singerIndex=item[0]
     })
    //  console.log(allData)
    //  console.log(this.singers)
    }).catch(error=>{
      console.log(error)
    })
   },
   _normalizeSinger(list){//序列化一下你拿到的歌手数据,放入的数据假设是singers

      let map={//存储前10最热门歌手
        hotest:{
          title:HOT_NAME,
          items:[]
        }
      };
  //-------------------
     list.forEach((item,index)=>{//获取前10热门歌手
         if(index<HOT_SINGER_LEN){
          var obj={
              id:item.singer_mid,
              name:item.singer_name,
              pic:item.singer_pic
           }
         map.hotest.items.push(obj)
         };
        const key=item.singerIndex.toUpperCase()
         if(!map[key]){//如果map没有该属性就创建该属性
          map[key]={
            title:key,
            items:[]
          }
         }
         var newobj={
              id:item.singer_mid,
              name:item.singer_name,
              pic:item.singer_pic
         }
         map[key].items.push(newobj)//不管是不是热门歌手,都给我放进去这里面
     });
  //-----------------------
    //为了得到有序列表,我们需要处理map
    let hot=[]
    let ret=[]
    for(let key in map){
      let val=map[key]
      if(val.title.match(/[a-zA-Z]/)){
        ret.push(val)//字母序列放入一队中
      }else if(val.title===HOT_NAME){
        hot.push(val)//热门序列放入一队中
      }
    }
    ret.sort((a,b)=>{//按A到Z的顺序排列,就是从小到大排列
      return a.title.charCodeAt(0)-b.title.charCodeAt(0)
    })
      ret.unshift(hot[0]);
     this.organizedSingers=ret;
   },
    ...mapMutations({ //相当于拿了mutations里面所有定义的方法,写上去的就是拿出来使用的方法
      setSinger:'SET_SINGER'//如果直接写'SET_SINGER'也行就是拿到了SET_SINGER函数
    })
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
   .singer
      position:fixed
      top:88px
      bottom:0
      width:100%
</style>
