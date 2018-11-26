function timeFormat(date,type){
  let str = ''
  switch(type){
    case 'date':
      Y = date.getFullYear() + '-'
      M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
      D = date.getDate()
      str = Y+M+D;
      break;
    case 'datetime':
      Y = date.getFullYear() + '-'
      M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
      D = date.getDate()
      h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':'
      m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':'
      s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds())
      str = Y+M+D+' '+h+m+s
      break;
    case 'time':
      h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':'
      m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':'
      s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds())
      str = h+m+s
      break;
  }
  return str
}

export {
  timeFormats
}