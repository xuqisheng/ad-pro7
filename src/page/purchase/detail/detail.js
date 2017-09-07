import React from 'react'
import {Input,Form,DatePicker,Table,Button,Modal,Select,InputNumber,message} from 'antd'
import moment from 'moment'
import styles from './detail.less'
import warehouseMap from 'widget/status/warehouse.js'
import request from 'widget/request'
import login from 'widget/login'

var FormItem = Form.Item
var Option = Select.Option

export default React.createClass({
  getInitialState(){
    return {
      supplier:'',

      purchase:moment(),
      arrive:moment(),
      list:[],

      remark:''

    }
  },
  getColumns(){
    var self = this
    return [
      { title: '序号', dataIndex: 'index',width:60,render(data,record,index){ return index } },
      { title: '商品', dataIndex: 'title' ,width:300},
      { title: '商品编码', dataIndex: 'skuId',width:130 },
      { title: '商品69码', dataIndex: 'sku69Code', key:"sku69Code",width:140 },
      { title: '商品规格', dataIndex: 'specification',width:150 },
      { title: '采购单位', dataIndex: 'purchaseUnit',width:70 },
      { title: '仓库', dataIndex: 'store',width:60,render:store => warehouseMap[store] },
      { title: '数量', dataIndex: 'count',width:50 },
      { title: '购货单价', dataIndex:'discountPrice',width:150 },
      { title: '购货总金额', dataIndex:'total',width:150,render(data,record){
        var count = parseInt(record.count)
        var price = parseFloat(record.discountPrice)
        if(!count||!price){
          return ''
        }
        return (count*price).toFixed(2)
      } },
      { title: '实际金额', dataIndex:'subPurchaseActualAmount',key:'subPurchaseActualAmount',width:150},
      { title: '实际入库数量' ,dataIndex:'actualCount',key:'actualCount',width:100 },
      { title: '备注', dataIndex:'remark',width:200}
    ]
  },
  getFooter(){
    var {list} = this.state
    var sum = list.reduceRight(($1,$2)=>{
      return $1+(parseFloat($2.count)||0)
    },0)
    var sumPrice = list.reduceRight(($1,$2)=>{
      return $1 + (parseFloat($2.count*$2.discountPrice)||0)
    },0)
    return (
      <span>
        <span>总数量:</span>
        <span>{sum}</span>
        {'  '}
        <span>购货总价格:</span>
        <span>{sumPrice.toFixed(2)}</span>
      </span>
    )
  },
  componentDidMount(){
    try{
      this.props.params.changeBrumb(['采购模块','采购单详情'])
    }catch(e){

    }
    var {purchaseId} = this.props.params
    if(purchaseId){
      var promise = request('/orderlist/supplierRequestorderDetail',{
        method:'post',
        data:{
          purchaseId:parseInt(purchaseId),pageSize:10,pageNum:0
        }
      })
      promise.done(result=>{
        if(result.success){
          var {arriveDate,purchaseDate,purchaseItems,supplier,remarks} = result.module
          this.setState({
            list:purchaseItems,
            arrive:moment(arriveDate),
            purchase:moment(purchaseDate),
            remark:remarks,
            supplier
          })
        }
      })
    }
  },

  render(){
    //<Form inline>
    //        <FormItem label="采购日期">
    //          {purchase.format('YYYY-MM-DD')}
    //        </FormItem>
    //        <FormItem label="到货日期">
    //          {arrive.format('YYYY-MM-DD')}
    //        </FormItem>
    //        <FormItem label="采购单id">{this.props.params.purchaseId}</FormItem>
    //      </Form>
    var {purchase,arrive,list,visible,editIndex,supplier} = this.state
    var editObj = list[editIndex]||{}
    return (
      <div>
        <h2 className={styles.title}>{supplier+'__鲜在时供货单'}</h2>
        <div className={styles.form}>
          <span>采购日期:</span><span>{purchase.format('YYYY-MM-DD')}</span>
          {' '}
          <span>到货日期:</span><span>{arrive.format('YYYY-MM-DD')}</span>
          {' '}
          <span>采购单id:</span><span>{this.props.params.purchaseId}</span>
        </div>
        <Table
          rowKey={(data,index)=>index}
          bordered
          title={()=>(
            <div>
              <span>采购单明细</span>
            </div>
          )}
          dataSource={list}
          columns={this.getColumns()}
          pagination={false}
          footer={e=>this.getFooter()}
        />
        <FormItem label="备注">
          <Input
            type="textarea"
            value={this.state.remark}
            rows={6}
          />
        </FormItem>
        <div className={styles.print}>
          <Button type="primary" onClick={e=>window.print()}>打印</Button>
        </div>
      </div>
    )
  }
})
