// @flow weak

/* eslint-disable no-process-env */
import React, {
  Component
}                               from 'react';
// import PropTypes                from 'prop-types';
// import {
//   // BrowserRouter as Router,
//   browserHistory,
//   HashRouter as Router,
//   Switch,
//   Route
// }                               from 'react-router-dom';

// import { Router, Route, browserHistory } from 'react-router';
import { BrowserRouter, Route } from 'react-router-dom';


import { Provider }             from 'react-redux';
// import { syncHistoryWithStore } from 'react-router-redux';
// import configureStore           from './redux/store/configureStore';
// import { createBrowserHistory } from 'history';
import thunk                    from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import  reducer                 from './redux/reducers';

import { createHashHistory } from 'history';

import { syncHistoryWithStore } from 'react-router-redux';


// import Entry from './components/screens/SwitchEntryPoint';
// import Doctor from './components/screens/DoctorScreen';
// import Pharmacist from './components/screens/PharmacistScreen';
// import IoT from './components/screens/IoTScreen';
// import Test from './components/TestComponent';

import EntryPage from './components/screens/EntryPage';
import ActiveUsers from './components/screens/ActiveUsers';
import EarlyPayments from './components/screens/EarlyPayments';
import InvoicePriceVariance from './components/screens/InvoicePriceVariance';
import Requisitions from './components/screens/Requisitions';
import UnapprovedPurchaseOrders from './components/screens/UnapprovedPurchaseOrders';
import RiskAnalysis from './components/screens/RiskAnalysis';
import { Menu, Icon } from 'antd';

import renderIf from "render-if";

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

//  <Route path='/home' component={Pharmacist} />
//  <Route path='/doctor' component={Doctor} />
//  <Route path='/iot' component={IoT} />

//EntryPage

const history = createHashHistory()


class Root extends Component {
  constructor(props){
    super(props);
    this.state = {
      current: 'splash',
      top3ActiveUsers: [],
      daysActiveUsers: [],
      daysOverdue: null
    }
  }

  setTop3ActiveUsers(value){
    // console.log('inside setTop3ActiveUsers and value: ', value);
    this.setState({
      top3ActiveUsers: value
    }, ()=>{
      // console.log('******************************');
      // console.log('value of state after setting top3ActiveUsers: ', this.state.top3ActiveUsers);
    })
  }

  setDaysActiveUsers(value){
    // console.log('inside setDaysActiveUsers and value ', value);
    this.setState({
      daysActiveUsers: value
    })
  }

  setDaysOverdue(value){
    // console.log('inside setDaysOverdue and value ', value);
    this.setState({
      daysOverdue: value
    })
  }

  handleClick = (e) => {
    console.log('click ', e.key);
    this.setState({
      current: e.key,
    });
  }
  render() {
    console.log('inside root');
    return (
      <Provider store={store}>
        <div>
           <Menu
               onClick={this.handleClick}
               selectedKeys={[this.state.current]}
               mode="horizontal"
               style={{backgroundColor: "#fffcff",
                       color: "#f53234"}}
             >
               <Menu.Item key="EntryPage">
                 <Icon type="home" /> Home
               </Menu.Item>
               <Menu.Item key="ActiveUsers">
                 <Icon type="area-chart" /> Active Users
               </Menu.Item>
               <Menu.Item key="EarlyPayments">
                 <Icon type="area-chart" /> Early Payments
               </Menu.Item>
               <Menu.Item key="InvoicePriceVariance">
                 <Icon type="area-chart" /> Invoice Price Variance
               </Menu.Item>
               <Menu.Item key="Requisitions">
                 <Icon type="area-chart" /> Requisitions
               </Menu.Item>
               <Menu.Item key="UnapprovedPurchaseOrders">
                 <Icon type="area-chart" /> Unapproved Purchase Orders
               </Menu.Item>
               <Menu.Item key="RiskAnalysis">
                 <Icon type="area-chart" /> Risk Analysis
               </Menu.Item>
           </Menu>

           {renderIf(this.state.current==='splash')(
             <div>
               <EntryPage
               top3ActiveUsers={this.state.top3ActiveUsers}
               daysActiveUsers={this.state.daysActiveUsers}
               daysOverdue={this.state.daysOverdue}
               />
             </div>
           )}

           {renderIf(this.state.current==='EntryPage')(
             <div>
               <EntryPage
               top3ActiveUsers={this.state.top3ActiveUsers}
               daysActiveUsers={this.state.daysActiveUsers}
               daysOverdue={this.state.daysOverdue}
               />
             </div>
           )}

           {renderIf(this.state.current==='ActiveUsers')(
             <div>
               <ActiveUsers setTop3ActiveUsers={this.setTop3ActiveUsers.bind(this)}
               setDaysActiveUsers={this.setDaysActiveUsers.bind(this)}
               setDaysOverdue={this.setDaysOverdue.bind(this)}
               />
             </div>
           )}

           {renderIf(this.state.current==='EarlyPayments')(
             <div>
               <EarlyPayments />
             </div>
           )}

           {renderIf(this.state.current==='InvoicePriceVariance')(
             <div>
               <InvoicePriceVariance />
             </div>
           )}

           {renderIf(this.state.current==='Requisitions')(
             <div>
               <Requisitions />
             </div>
           )}

           {renderIf(this.state.current==='UnapprovedPurchaseOrders')(
             <div>
               <UnapprovedPurchaseOrders />
             </div>
           )}

           {renderIf(this.state.current==='RiskAnalysis')(
             <div>
               <RiskAnalysis />
             </div>
           )}

        </div>
      </Provider>
    );
  }
}

export default Root;
