import storage from 'good-storage'//记得要下载该第三方模块
const SEARCH_KEY='__search__'
const SEARCH_MAX_LENGTH=15//最大存储量15

function insertArray(arr,val,compare,maxLen){
   const index=arr.findIndex(compare)
   if(index==0){//如果是第一条数据即原来历史列表是空的,而这里是第一次存储
    return
   }
   if(index>0){//如果本身历史列表有你搜索的歌曲
     arr.splice(index,1)//删掉

   }
   arr.unshift(val)
   if(maxLen&&arr.length>maxLen){//超过存储量
     arr.pop()
   }
}
function deleteFromArray(arr,compare){
  const index=arr.findIndex(compare)
  if(index>-1){
    arr.splice(index,1)
  }
}
export function saveSearch(query){
   let searches=storage.get(SEARCH_KEY,[])
   insertArray(searches,query,(item)=>{
     return item === query
   },SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY,searches)//把searches存到SEARCH_KEY变量中
  return searches
}

export function loadSearch(){
  return storage.get(SEARCH_KEY,[])//第二个参数为默认值
}
export function deleteSearch(query){
   let searches=storage.get(SEARCH_KEY,[])
   deleteFromArray(searches,(item)=>{
     return item===query
   })
   //一定要记得保存数组
   storage.set(SEARCH_KEY,searches)
   return searches
}

export function clearSearch(){
  storage.remove(SEARCH_KEY)
  return []
}


