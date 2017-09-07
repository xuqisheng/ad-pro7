export default {
  // date -> 2017-10-20 10:10:10
  parseDateToStr(date){
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+
    ' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
  },
  // (begin,end) -> {beginTime:"2017-2-14 0:0:0",endTime:"2017-2-16 23:59:59"}
  parseRange(begin,end){
    return {
      beginTime:begin.getFullYear()+'-'+(begin.getMonth()+1)+'-'+begin.getDate()+' 00:00:00',
      endTime:end.getFullYear()+'-'+(end.getMonth()+1)+'-'+end.getDate()+' 23:59:59'
    }
  }
}
