import React from 'react'
import {Table,Input,Button,Form,Select,DatePicker} from 'antd'
import styles from './search.less'

const {RangePicker} =DatePicker
const FormItem = Form.Item
const Option = Select.Option

var formatMoment=(e,hour,minute,second)=>{
  if(!e){
    return null
  }
  var d=new Date(e._d)
  d.setHours(hour)
  d.setMinutes(minute)
  d.setSeconds(second)
  return d
}

export default React.createClass({
  getInitialState(){
    return {}
  },
  getComponentByConfig(){
    var config = this.props.widgets||[]
    return config.map((widget,index)=>{
      if(widget.type==='input'){
        return (
          <FormItem label={widget.text} key={index}>
            <Input
              placeholder={widget.placeholder||''}
              maxLength={widget.maxLength||100}
              onChange={e=>{
                var state=this.state
                state[widget.name||('input'+index)]=e.target.value
                this.setState(state)
              }}
            />
          </FormItem>
        )
      }
      if(widget.type==='select'){
        const options = widget.options||[];
        return (
          <FormItem label={widget.text} key={index}>
            <Select
              style={{width:parseFloat(widget.width)||120}}
              placeholder={widget.placeholder||'请选择'}
              onChange={e=>{
                var state=this.state
                state[widget.name||('select'+index)]=e
                this.setState(state)
              }}
            >
              {Object.keys(options).map((key)=>{
                return <Option key={key} value={key+''}>{options[key]}</Option>
              })}
            </Select>
          </FormItem>
        )
      }
      if(widget.type==='range'){
        var name=widget.name||(widget.type+index);
        return (
          <FormItem label={widget.text} key={index}>
            <RangePicker onChange={e=>{
              var state=this.state
              state[name]={
                start:formatMoment(e[0],0,0,0),
                end:formatMoment(e[1],23,59,59)
              }
              this.setState(state)
            }} />
          </FormItem>
        )
      }
      return <span></span>
    })
  },
  render(){
    return (
      <Form inline className={styles.form}>
        {this.getComponentByConfig()}
        <FormItem>
          <Button onClick={e=>{
            this.props.onSearch&&this.props.onSearch(this.state)
          }} type="primary">查询</Button>
        </FormItem>
      </Form>
    );
  }
})
