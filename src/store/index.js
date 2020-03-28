import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'//vuex的插件会帮你打印出mutations修改之前的state与
//mutations修改之后的state数据
Vue.use(Vuex)

const debug =process.env.NODE_ENV!=='production'


export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  // strict:debug, // 严格模式，是否能在mutation外修改state值，true → 不能修改，false → 可以修改
  plugins:debug?[createLogger()]:[]
})


//export加default与不加default的区别
// export function Func () { }
//     import { Func } from 'func'

//     export default function Func () { }
//     import Func from 'func'
