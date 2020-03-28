import jsonp from '../common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'
export function getRecommend(){
    const url='/api/getLunbo'
    const data=Object.assign({},commonParams,{
      // platform: 'yqq', // 加引号
      // hostUin: 0,
      // sin: 0,
      // ein: 29,
      // sortId: 5,
      // needNewCode: 0,
      // categoryId: 10000000,
      // rnd: Math.random(),
      // format: 'json',
      // data:{"comm":{"g_tk":1907010866,"uin":806960230,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1},"MusicHallHomePage":{"module":"music.musicHall.MusicHallPlatform","method":"MobileWebHome","param":{"ShelfId":[101,102,161]}},"hotkey":{"module":"tencent_musicsoso_hotkey.HotkeyService","method":"GetHotkeyForQQMusicMobile","param":{"remoteplace":"txt.miniapp.wxada7aab80ba27074","searchid":"1559616839293"}}}
    })
    return axios.get(url,{
      params:''
    }).then((res)=>{
      return Promise.resolve(res.data)
    })
}
