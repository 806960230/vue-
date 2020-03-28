<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from './components/m-header/m-header'
import Tab from  './components/tab/tab'
import Player from './components/player/player'

export default {//default后面还有空格键
  name:'',
  data(){
    return{

    }
  },
 components:{
     MHeader,Tab,Player
   }
}


</script>

<style scoped lang="stylus">
  @import "./common/stylus/variable"//我没有写~在common前面而作者是这样做的
//好像要有eslint才能用~

</style>
