import React from 'react'
import { Form, Icon, Input, Button, InputGroup, message} from 'antd';
const FormItem = Form.Item;
import login from 'widget/login'
import styles from './reset.less'
import request from 'widget/request'
const maxTime = 60
import md5 from 'blueimp-md5'

export default React.createClass({
  getInitialState(){
    return {
      userName:'',
      password:'',
      surePassword:'',
      code:'',
      loading:false,
      sending:false,
      sendingTime:maxTime
    }
  },
  handleSubmit(e){
    e.preventDefault();

    var {
      userName,
      password,
      surePassword,
      code
    } = this.state

    if(code === ''){
      return message.info('请输入验证码')
    }
    if(password === ''){
      return message.info('请输入密码')
    }
    if(password !== surePassword){
      return message.info('两次输入密码不一致')
    }
    this.setState({loading:true})

    const equipmentId = md5(window.navigator.userAgent)
    const sysTime = +new Date
    const token = md5(code)
    const pwd = md5(password)
    const sign = md5(`${pwd}_${token}_${sysTime}_${equipmentId}`)

    var req=request('/supplier/modifiedpwd',{
      method:'post',
      data:{
        userName,
        pwd,
        token,
        equipmentId,
        sysTime,
        sign
      }
    });
    req.done(result=>{
      result = JSON.parse(result)
      if(result.success){
        message.info('密码修改成功')
      }else{
        message.info(result.errorMsg)
      }
    })
    req.fail(e=>{
      message.info('重置密码失败')
    })
    req.always(()=>this.setState({loading:false}))
  },
  // 发送验证码倒计时
  count(){
    this.setState({sending:true})
    var {sendingTime} = this.state
    var interval = this.interval = window.setInterval(()=>{
      if(sendingTime<=0){
        window.clearInterval(interval)
        this.setState({
          sending:false,
          sendingTime:maxTime
        })
      }else{
        sendingTime--;
        this.setState({sendingTime})
      }
    },1000)
  },
  componentWillUnmount(){
    window.clearInterval(this.interval)
  },
  sendCheckCode(){
    var promise = request('/supplier/sendcheckcode',{
      method:'post',
      data:{
        userName:this.state.userName
      }
    })
    promise.then(result=>{
      result = JSON.parse(result)
      if(result.success){
        this.count()
        message.info('发送验证码成功')
      }
    })
  },
  componentDidMount(){
    var {userName} = login.getInfo()
    this.setState({userName})
  },
  render(){
    var {userName,password,surePassword,code,loading,sendingTime,sending} = this.state
    return (
      <Form className={styles.form} onSubmit={e=>this.handleSubmit(e)}>
        <FormItem>
          <Input addonBefore="用户名" value={userName}/>
        </FormItem>
        <FormItem>
          <Input
            addonBefore="新密码"
            value={password}
            type="password"
            onChange={e=>this.setState({password:e.target.value})}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore="确认新密码"
            value={surePassword}
            type="password"
            onChange={e=>this.setState({surePassword:e.target.value})}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore="验证码"
            addonAfter={!sending?
              <span onClick={e=>this.sendCheckCode(e)} className={styles.sendCode}>获取验证码</span>:
              <span>{sendingTime}秒后重新发送</span>
            }
            value={code}
            onChange={e=>this.setState({code:e.target.value})}
          />
        </FormItem>
        <FormItem>
          {!loading&&<Button htmlType="submit" type="primary">重置密码</Button>}
          {loading&&<Button type="primary" loading>正在重置</Button>}
        </FormItem>
      </Form>
    )
  }
})
