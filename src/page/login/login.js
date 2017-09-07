import React from 'react'
import styles from './login.less'
import request from 'widget/request'
import md5 from 'blueimp-md5'
import {message} from 'antd'
import $ from 'jquery'
import login from 'widget/login'

export default React.createClass({
  getInitialState(){
    return {
      userName:'',
      password:''
    }
  },
  onSubmit(e){
    e.preventDefault();
    var {userName,password}=this.state;
    if(userName===''){
      return message.info('请填写用户名')
    }
    if(password===''){
      return message.info('请填写密码')
    }
    const equipmentId=md5(window.navigator.userAgent)
    const sysTime=+new Date
    const sign=md5(`${md5(password)}_${sysTime}_${equipmentId}`)

    var req=request('/supplier/login',{
      method:'post',
      data:{
        userName,
        equipmentId,
        sysTime,
        sign
      }
    });
    req.done(result=>{
      if(result.module){
        login.login(result.module.name,result.module.token)
      }else{
        message.info(result.errorMsg)
      }
    })
    req.fail(e=>{
      message.info('登录失败')
    })
  },
  render(){
    return (
      <div className={styles.content}>
        <form className={styles.login}>
          <div className={styles.logo}>鲜在时供应商管理</div>
          <div className={styles.layer}>
            <div className={styles.username}>
              <i className={styles.icon+" iconfont"}>&#xe7d6;</i>
              <input type="text" onChange={e=>{
                this.setState({userName:e.target.value})
              }} placeholder="请输入用户名"/>
            </div>
            <div className={styles.username+' '+styles.password}>
              <i className={styles.icon+" iconfont"}>&#xe738;</i>
              <input type="password" onChange={e=>{
                this.setState({password:e.target.value})
              }} placeholder="请输入密码"/>
            </div>
          </div>
          <button className={styles.button} onClick={e=>{
            this.onSubmit(e)
          }}>登录</button>
          <a className={styles.button1} onClick={e=>{
            window.location.href='#reset/2';
          }}>修改密码</a>
        </form>
      </div>
    )
  }
})
