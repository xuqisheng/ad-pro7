import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router'
import Frame from '../frame';
import React from 'react';

import Login from '../../page/login'
import reset from '../../page/reset'
import Welcome from '../../page/welcome'
import account from './account.js'
import purchase from './purchase.js'

export default (
  <Router history={hashHistory}>
    <Route path="/login" component={Login} />
    <Route path="/reset/:id" component={reset} />
    <Route path="/" component={Frame}>
      <IndexRoute component={Welcome} />
      {
        // route配置
        [
          ...account,
          ...purchase
        ].map((item,index)=>(
          <Route key={index} path={item.path} component={item.component} />
        ))
      }
    </Route>
  </Router>
)
