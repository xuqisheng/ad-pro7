import {message} from 'antd'
import common from 'widget/common'
import {cookie} from 'xzs-util'

var cookiedomain = common.isProd?'.xianzaishi.com':'.xianzaishi.net'
var expiredays = null

export default {
  checkLogin(){
    const noLoginSign=[null,'null',''];
    return noLoginSign.indexOf(cookie.get('token'))===-1
  },
  login(userName,token){
    if(!userName){
      return message.info('无效的用户名')
    }
    if(!token){
      return message.info('无效的token')
    }
    cookie.set('token',token,expiredays,cookiedomain)
    cookie.set('userName',userName,expiredays,cookiedomain)
    window.location.href='#'
  },
  logout(){
    cookie.set('token','',expiredays,cookiedomain)
    cookie.set('userName','',expiredays,cookiedomain)
    window.location.href='#login';
  },
  getInfo(){
    return {
      token:cookie.get('token'),
      userName:cookie.get('userName')
    }
  }
}
