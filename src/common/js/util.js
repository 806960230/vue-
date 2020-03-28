function getRandomInt(min,max){
  return Math.floor(Math.random()*(max-min+1)+min)//取得从max-min的整数包括max与min
}

export function shuffle(arr){//对播放歌曲的列表进行乱序排序
   for(let i=0;i<arr.length;i++){
      let j=getRandomInt(0,i)
      let t=arr[i]
      arr[i]=arr[j]
      arr[j]=t
   }
   return arr
}

export function debounce(func,delay){//节流函数,在搜索框打字时，只有一定时间过后才能发送请求找数据
  //而不是边打字的时候发送请求,节流后会减少流量
  let timer;
  return function(...args){
   if(timer){
     clearTimeout(timer)
   }
   timer=setTimeout(()=>{
     func.apply(this,args)
   },delay)
  }
}
//如果debounce被反复调用时,其实结果是只调用了一次func函数,达到了节流的目的
