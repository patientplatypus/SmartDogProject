import React, {Component} from 'react';
import {
  Form,
  Icon
} from 'antd';
import axios from 'axios';
import {Link, Redirect} from "react-router-dom";
import { connect } from 'react-redux';
import renderIf from 'render-if';
import './local.css';





class RiskAnalysis extends Component {
  constructor() {
    super();
    this.state = {
      redirect: null,
    }
  }

  componentWillMount(){
    var url = "http://localhost:5000/workbook/"
    axios.post(url,{
      workbookName: "sodCalculation"
    })
    .then((response)=>{
      console.log("value of response: ", response);
      this.transformData(response);
    })
    .catch((error)=>{
      console.log("value of error: ", error);
    })
  }


  render() {

    return(
      <div>
        <p>Hello ese</p>
      </div>
    );

  }


}


function mapDispatchToProps(dispatch) {
    return({
      //  checkloginoci: (e)=>{dispatch(checkLoginOCI(e))},
    })
}

function mapStateToProps(state) {
    return({
      // loginreturn: state.loginreturn,
    })
}

export default (connect(
    mapStateToProps, mapDispatchToProps)(
    RiskAnalysis
))