import Axios from "axios";

export function getRecommend(callback){
    Axios('/vkey/cgi-bin/musicu.fcg',{
    //链接如此写是因为你登上qq音乐网站后去看一下url地址,不懂可去看我写的vue音乐web文档
   //为什么是/vkey呢,因为你在config文件夹下的index.js中的proxyTable中设置了
   //相当于是Axios请求了https://u.y.qq.com/cgi-bin/musicu.fcg,为什么
   // 不是/api/cgi-bin/musicu.fcg呢,因为你去看看qq音乐网站的url地址，可知是
   //https://u.y.qq.com/cgi-bin/musicu.fcg因此,又由于proxyTable中设置了
   //把https://u.y.qq.com改写成/vkey,因此这里写Axios('/vkey/cgi-bin/musicu.fcg'
    //   params:{
    //      _: 1583240672243,
    //           g_tk:1907010866,
    //           uin:806960230,
    //           format:"json",
    //           inCharset:"utf-8",
    //           outCharset:"utf-8",
    //           notice:0,
    //           platform:"h5",
    //           needNewCode:1,
    //           data:`{"MusicHallHomePage":{"module":"music.musicHall.MusicHallPlatform","method":"MobileWebHome","param":{"ShelfId":[101,102,161]}},"hotkey":{"module":"tencent_musicsoso_hotkey.HotkeyService","method":"GetHotkeyForQQMusicMobile","param":{"remoteplace":"txt.miniapp.wxada7aab80ba27074","searchid":"1559616839293"}}}`
    // },
    headers:{
      'content-type':'text/plain;charset=UTF-8'
    }

    }).then(response=>{
      return response.data.MusicHallHomePage.data.v_shelf[2].v_niche[0].v_card;
      // callback(response.data.MusicHallHomePage.data.v_shelf[2].v_niche[0].v_card)
    }).catch(error=>{
      console.log(error)
    })

}
