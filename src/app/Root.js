// @flow weak

/* eslint-disable no-process-env */
import React, {
  Component
}                               from 'react';
// import PropTypes                from 'prop-types';
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  Switch,
  Route
}                               from 'react-router-dom';
import { Provider }             from 'react-redux';
// import { syncHistoryWithStore } from 'react-router-redux';
// import configureStore           from './redux/store/configureStore';
// import { createBrowserHistory } from 'history';
import thunk                    from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import  reducer                 from './redux/reducers'

import SwitchEntryPoint from './components/screens/SwitchEntryPoint';
import DoctorScreen from './components/screens/DoctorScreen';
import PharmacistScreen from './components/screens/PharmacistScreen';

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Router>
              <div>
                <Route exact path="/" exact render={()=><SwitchEntryPoint />}/>
                <Route path="/Doctor" exact render={()=><DoctorScreen />}/>
                <Route path="/Pharmacist" exact render={()=><PharmacistScreen />}/>
              </div>
          </Router>
        </div>
      </Provider>
    );
  }
}

export default Root;
