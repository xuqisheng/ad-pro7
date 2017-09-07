import $ from 'jquery'
import common from 'widget/common'
import login from 'widget/login'
import {message} from 'antd'

const domainMap={
  'wms':{
    'dev':'//wmsop.xianzaishi.net',
    'prod':'//wmsop.xianzaishi.com'
  },
  'purchase':{
    'dev':'//purchaseop.xianzaishi.net/purchaseadmin',
    'prod':'//purchaseop.xianzaishi.com'
  },
  'supplier':{
    'dev':'//purchaseop.xianzaishi.net/purchaseadmin',
    'prod':'//purchaseop.xianzaishi.com'
  }
}

export default function request(){
  var url='/'
  var options={}

  if(arguments.length>1){
    url=arguments[0]
    options=arguments[1]
  }else if(typeof(arguments[0]) === 'string'){
    url=arguments[0]
  }else{
    url=arguments[0].url
    delete arguments[0].url
    options=arguments[0]
  }

  options.contentType='application/x-www-form-urlencoded'

  var domainName=options.domain||'supplier'
  var domain=domainMap[domainName]
  if(common.isDev||common.isQa){
    url=domain.dev+url
  }
  if(common.isProd){
    url=domain.prod+url
  }
  options.xhrFields={
    withCredentials: true
  }
  if('data' in options){
    if(domainName==='wms'){
      options.data={request:JSON.stringify({data:options.data})}
    }else{
      options.data={data:JSON.stringify(options.data)}
    }
  }
  var promise = $.ajax(url,options)
  promise.done(result=>{
    if(result.success===false){
      message.info(result.errorMsg)
    }
    if(result.resultCode === -7){
      return window.location.href='#/login'
    }
  })
  return promise
}
