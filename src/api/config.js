export const CommonParams={
    params:{
       _: 1583240672243,
            g_tk:1907010866,
            uin:0,
            format:"json",
            inCharset:"utf-8",
            outCharset:"utf-8",
            notice:0,
            platform:"h5",
            needNewCode:1,
            data:`{"MusicHallHomePage":{"module":"music.musicHall.MusicHallPlatform","method":"MobileWebHome","param":{"ShelfId":[101,102,161]}},"hotkey":{"module":"tencent_musicsoso_hotkey.HotkeyService","method":"GetHotkeyForQQMusicMobile","param":{"remoteplace":"txt.miniapp.wxada7aab80ba27074","searchid":"1559616839293"}}}`
  },
  headers:{
    'content-type':'text/plain;charset=UTF-8'
  }
}
export const SongsParams={
  params:{
    picmid: 1,
rnd: 0.4643283327034782,
g_tk: 1163134301,
loginUin: 806960230,
hostUin: 0,
format: "json",
inCharset: "utf8",
outCharset: "utf-8",
notice: 0,
platform:"yqq.json",
needNewCode: 0,
categoryId: 10000000,
sortId: 5,
sin: 0,
ein: 19
  },
  headers:{
    'content-type':'text/plain;charset=UTF-8'
  }
}
export const SingersParams={
   params:{
    "-": "getUCGI7529179752388817",
    g_tk: 748517608,
    loginUin: 806960230,
    hostUin: 0,
    format: "json",
    inCharset: "utf8",
    outCharset: "utf-8",
    notice: 0,
    platform: "yqq.json",
    needNewCode: 0,
    data: {"comm":{"ct":24,"cv":0},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}
   },
   headers:{
    'content-type':'text/plain;charset=UTF-8'
  }
}
export const options={
  param:'jsonpCallback'
}

export const ERR_OK=0//因为网址上找到response里面code:0

export function getSingerDetail(singerId){
   //这里我把singerId套入了decodeURIComponent的括号里面了，仔细查找一下
  var decodedData=decodeURIComponent(`%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A0%7D%2C%22singerSongList%22%3A%7B%22method%22%3A%22GetSingerSongList%22%2C%22param%22%3A%7B%22order%22%3A1%2C%22singerMid%22%3A%22${singerId}%22%2C%22begin%22%3A0%2C%22num%22%3A10%7D%2C%22module%22%3A%22musichall.song_list_server%22%7D%7D`)
  const SingerDetail={
      params:{
        data:decodedData,
        format:"json",
        g_tk:5381,
        hostUin:0,
        inCharset:"utf8",
        loginUin:0,
        needNewCode:0,
        notice:0,
        outCharset:"utf-8",
        platform:"yqq.json"
      }

    }
    return SingerDetail
}
//{"comm":{"g_tk":1907010866,"uin":806960230,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1}
// ADTAG=newyqq.singer&source=ydetail&singermid=001fNHEf1SFEFN
// ADTAG=newyqq.singer&source=ydetail&singermid=0025NhlN2yWrP4


export function getOneSongDetail(mid){

     const SingleSongDetail={
       params:{
         data:{"comm":{"ct":24,"cv":0},"mv":{"module":"MvService.MvInfoProServer","method":"GetMvBySongid","param":{"mids":[mid]}}},
         format:"json",
         g_tk:5381,
         hostUin:0,
         inCharset:"utf8",
         loginUin:0,
         needNewCode:0,
         notice:0,
         outCharset:"utf-8",
         platform:"yqq.json"
       }
     }
    return SingleSongDetail
}

//`%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A0%7D%2C%22mv%22%3A%7B%22module%22%3A%22MvService.MvInfoProServer%22%2C%22method%22%3A%22GetMvBySongid%22%2C%22param%22%3A%7B%22mids%22%3A%5B%22001QJyJ32zybEe%22%5D%7D%7D%7D`


export function getSongLyric(id){
    const songLyric={
      params:{
      "-": "jsonp1",
      format:"json",
      g_tk:5381,
      hostUin:0,
      inCharset:"utf8",
      loginUin:0,
      needNewCode:0,
      notice:0,
      outCharset:"utf-8",
      platform:"yqq.json",
      nobase64:0,//设置为0拿到的歌词数据都是乱码，需要用base64第三方工具来解码
      musicid:id
      },
      headers:{
        'content-type':'text/plain;charset=UTF-8'
      }
    }
    return songLyric
}

export function getSongPlayAddress(mid){
  const songPlayAddress={
    params:{
    format:"json",
    g_tk:5381,
    hostUin:0,
    inCharset:"utf8",
    loginUin:806960230,
    needNewCode:0,
    notice:0,
    outCharset:"utf-8",
    platform:"yqq.json",
    data:{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"4778812806","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"4778812806","songmid":[mid],"songtype":[0],"uin":"806960230","loginflag":1,"platform":"20"}},"comm":{"uin":806960230,"format":"json","ct":24,"cv":0}}
    },
    headers:{
      'content-type':'text/plain;charset=UTF-8'
    }
  }
  return songPlayAddress
}


export const hotKeyParams={
    params:{
      cgiKey:"GetHomePage",
      _: 1584330882344,
      data:{"comm":{"g_tk":1187176139,"uin":806960230,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1},"MusicHallHomePage":{"module":"music.musicHall.MusicHallPlatform","method":"MobileWebHome","param":{"ShelfId":[101,102,161]}},"hotkey":{"module":"tencent_musicsoso_hotkey.HotkeyService","method":"GetHotkeyForQQMusicMobile","param":{"remoteplace":"txt.miniapp.wxada7aab80ba27074","searchid":"1559616839293"}}}
      },
      headers:{
        'content-type':'text/plain;charset=UTF-8'
      }
 }


 export function getSearchParams(query,page,zhida,perpage){
  const searchParams={
    params:{
     _: 1584348549933,
     g_tk: 1187176139,
     uin: 806960230,
     format: "json",
     inCharset: "utf-8",
     outCharset: "utf-8",
     notice: 0,
     platform: 'h5',
     needNewCode: 1,
     w:query,//该参数为歌手人名或者歌曲名
     zhidaqu: 1,
     catZhida: zhida?1:0,//该参数为歌手的相关数据是否可以展现
     t: 0,
     flag: 1,
     ie: "utf-8",
     sem: 1,
     aggr: 0,
     perpage:perpage?perpage:20,//每页展示多少条数据
     n: perpage?perpage:20,//每页展示多少条数据
     p: page?page:1,//该参数为搜索列表向下滚动第几页了
     remoteplace: 'txt.mqq.all'
    },
    headers:{
     'content-type':'text/plain;charset=UTF-8'
   }
  }
  return searchParams
}


