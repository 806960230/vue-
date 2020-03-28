export function _getHotKey(params){
  let data;
  Axios('/vkey/cgi-bin/musicu.fcg',params).then(response=>{
    console.log(response.data.hotkey.data.vec_hotkey.slice(0,10))
     data=response.data.hotkey.data.vec_hotkey.slice(0,10)
     return data
  }).catch(error=>{
    console.log(error)
  })
}

export function search(params){
  let data;
  Axios('/api/soso/fcgi-bin/search_for_qq_cp',params).then(response=>{
    console.log(response)
    //  data=response.data.hotkey.data.vec_hotkey.slice(0,10)
    //  return data
  }).catch(error=>{
    console.log(error)
  })
}
