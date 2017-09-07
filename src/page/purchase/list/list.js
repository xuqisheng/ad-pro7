import React from 'react'
import {Input,Form,DatePicker,Table,Button,Modal,Select,InputNumber,message} from 'antd'
import Search from 'widget/search'
import request from 'widget/request'
import {purchaseStatus} from 'widget/status/purchase.js'
import parseDatetime from 'widget/util/date.js'

export default React.createClass({
  getInitialState(){
    return {

      // 初审
      visible:false,
      memo:'',

      purchaseId:null,

      list:null,

      // 分页参数
      pageNum:0,
      pageSize:10,
      totalNum:0,

      search:{}
    }
  },
  getColumns(){
    var self=this
    return [
      {title:"采购编号",dataIndex:'purchaseId',key:'purchaseId'},
      {title:'采购日期',dataIndex:"purchaseData",key:'purchaseData'},
      {title:'供应商',dataIndex:"supplier",key:"supplier"},
      {title:"购货金额",dataIndex:"purchaseAmount",key:"purchaseAmount"},
      {title:"实际金额",dataIndex:'actualAmount',key:'actualAmount'},
      {title:"送货时间",dataIndex:"arriveDate",key:"arriveDate"},
      {title:"采购单状态",dataIndex:"auditingStatusString",key:"auditingStatusString",width:100},
      {title:"备注",width:200,render(data,record){
        var remarks = (record.remarks||'').split('<br>')
        return (
          <div>{remarks.map((remark,index)=>(
            <div key={index}>{remark}</div>
          ))}</div>
        )
      }},
      {title:"操作",width:300,render(data,record){
        return (
          <span>
            <Button size="small" type="primary" onClick={e=>self.setState({visible:true,purchaseId:record.purchaseId})}>审核</Button>
            {' '}
            <Button size="small" type="primary" onClick={e=>self.submitPurchase(record.purchaseId,5)}>配送</Button>
            {' '}
            <Button size="small" type="primary" onClick={e=>window.location=`#/purchase/detail/${record.purchaseId}`}>详情</Button>
          </span>
        )
      }}
    ]
  },
  getPurchase(){
    var {pageNum,pageSize,search} = this.state
    var {supplier,purchaseSubId,purchase,status} = search
    var params = {}

    if(status&&status!='-1'){
      params.auditingStatus = status+""
    }
    if(supplier){
      params.supplier = supplier.name
    }
    if(purchaseSubId){
      params.purchaseId = purchaseSubId+''
    }
    if(purchase){
      if(purchase.end&&purchase.start){
        var range = parseDatetime.parseRange(purchase.end,purchase.start)
        params.beginTime = range.beginTime
        params.endTime = range.endTime
      }
    }

    var url = '/orderlist/requestorderlistwithsupplier'

    var promise = request(url,{
      method:'post',
      data:{
        ...params,
        pageNum,
        pageSize
      }
    })
    promise.done(result=>{
      if(result.success){
        this.setState({
          list:result.module.orderListVOs,
          totalNum:result.totalNum,
          pageNum:result.currentPageNum
        })
      }
    })
  },
  getPagination(){
    var self = this
    return {
      pageSize:this.state.pageSize,
      current:this.state.pageNum+1,
      total:this.state.totalNum,
      onChange(e){
        self.setState({pageNum:e-1},()=>self.getPurchase())
      }
    }
  },
  componentDidMount(){
    this.getPurchase()
  },

  // 初审意见
  agree(auditingStatus){
    var {purchaseId,memo} = this.state

    var promise = request('/orderlist/trialwithsupplier',{
      method:'post',
      data:{
        purchaseId:purchaseId+'',auditingStatus:auditingStatus+'',remarks:memo
      }
    })
    promise.done(result=>{
      if(result.success){
        this.setState({visible:false,purchaseId:null})
        message.info('审核提交成功')
        this.getPurchase()
      }
    })
  },

  // 配送
  submitPurchase(purchaseId,auditingStatus){

    var promise = request('/orderlist/trialwithsupplier',{
      method:'post',
      data:{
        purchaseId:purchaseId+'',auditingStatus:auditingStatus+''
      }
    })
    promise.done(result=>{
      if(result.success){
        message.info('提交成功')
        this.getPurchase()
      }
    })
  },

  render(){
    var {list,visible,memo} = this.state
    return (
      <div>
        <Search
          row
          widgets={[
            {name:'purchaseSubId',type:'input',text:'采购单号'},
            {name:'purchase',type:'range',text:'采购时间'},
            {name:'status',type:'select',options:purchaseStatus,text:'状态'}
          ]}
          onSearch={e=>this.setState({search:e},()=>this.getPurchase())}
        />
        <Table
          rowKey="purchaseId"
          bordered
          columns={this.getColumns()}
          dataSource={list}
          pagination={this.getPagination()}
        />
        <Modal
          onOk={e=>this.setState({visible:false})}
          onCancel={e=>this.setState({visible:false})}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={e=>this.agree(4)}>同意</Button>,
            <Button key="back" size="large" onClick={e=>this.agree(0)}>不同意</Button>
          ]}
          title="审核意见"
          visible={visible}
        >
          <Input type="textarea" rows={5} value={memo} onChange={e=>this.setState({memo:e.target.value})}/>
        </Modal>
      </div>
    )
  }
})
