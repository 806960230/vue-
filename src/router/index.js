import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '../components/recommend/recommend'
import Rank from '../components/rank/rank'
import Singer from '../components/singer/singer'
import Search from '../components/search/search'
import SingerDetail from '../components/singer-detail/singer-detail'
// import Player from '../components/player/player'
Vue.use(VueRouter)

export default new VueRouter({
  // mode:'history',
  routes:[
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path:'/recommend',
      component:Recommend
    },
    {
      path:'/singer',
      component:Singer,
      children:[{
        path:':id',
        component:SingerDetail
      }
      ]
    },
    {
      path:'/rank',
      component:Rank
    },
    {
      path:'/search',
      component:Search,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    // {
    //   path:'/player',
    //   component:Player
    // }
  ]
})
