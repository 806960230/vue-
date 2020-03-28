export function addClass(el,className){
    if(hasClass(el,className)){
      return
    }
    let newClass=el.className.split('');
    newClass.push(className)
    el.className=newClass.join('')
}

export function hasClass(el,className){
  let reg=new RegExp('(^|\\s)'+className+'(\\s|$)')//其中\\s代表空白字符
  return reg.test(el.className)
}


export function getData(el,name,val){
  const prefix="data-"
  name=prefix+name
  if(val){
    return el.setAttribute(name,val)
  }else{
    return el.getAttribute(name)
  }
}


