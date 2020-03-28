// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import './common/stylus/index.styl'
import VueSwiper from 'vue-awesome-swiper'
import "swiper/dist/css/swiper.css"
import VueLazyLoad from 'vue-lazyload'
import store from './store'

Vue.use(VueLazyLoad)
Vue.use(VueSwiper)
fastclick.attach(document.body)//是的整个页面有被点击的元素的话，点击效果都不会出现300毫秒延迟
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({//作者这里有另外一个写法就是render 什么h的 可去看2-3项目介绍图标字体和
  el: '#app',
  components: { App },
  template: '<App/>',
  router,//记得注册
  store//记得注册
})
