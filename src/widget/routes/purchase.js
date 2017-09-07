import List from '../../page/purchase/list'
import Detail from '../../page/purchase/detail'

export default [
  {path:'purchase/list',component:List},
  {path:'purchase/detail/:purchaseId',component:Detail}
];
