import React, {Component} from 'react';
import logo from '../../../style/images/logo.png';
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Card,
  Layout,
  Row,
  Col,
  Menu
} from 'antd';
import {headStyles, cardStyles, contentStyles, medusa, layoutStyles} from '../../../style/MainStyles.js';
import { connect } from 'react-redux';
import "../../../style/fonts/fontface.css";
import './local.css';
import GreenCloud from '../../../style/images/GreenCloud.png';
import DoctorSplash from '../../../style/images/doctorsplashkeyboard.jpg';
import styled from 'styled-components';
import axios from 'axios';
import { VictoryChart, VictoryBar, VictoryLabel, VictoryAxis, Bar, VictoryTheme, VictoryPie } from 'victory';
import "./UnapprovedGrid.css"



import {Link, Redirect} from "react-router-dom";
import { checkLoginOCI } from '../../../redux';
const {Header, Content} = Layout;
const FormItem = Form.Item;

import renderIf from 'render-if'

const Flex1 = styled.div`
  flex: 1
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  text-align:center;
`


class UnapprovedPurchaseOrders extends Component {
  constructor() {
    super();
    this.state = {
      redirect: null,
      tempPieData: null
    }
  }

  transformData(response){
    // AUTHORIZATION_STATUS: "REQUIRES REAPPROVAL"
    // BILLED: 2
    // LAST_UPDATE_DATE: 42788
    // PO_NUMBER: "CHE042204"
    // QTY_ORDERED: 2
    // RECEIVED: 2
    // USER_NAME: "EMPL04"
    // VENDOR_NAME: "FROMAN PROPANE CO INC"
    let tempTotalArr = [];
    let tempReapprovalArr = [];
    let tempRejectedArr = [];
    let tempPieData = [];
    response.data[0].forEach(element=>{
      console.log('value of element: ', element);
      if (element.AUTHORIZATION_STATUS==='REQUIRES REAPPROVAL'){
        tempTotalArr.push(element);
        tempReapprovalArr.push(element);
      }else if(element.AUTHORIZATION_STATUS==='REJECTED'){
        tempTotalArr.push(element);
        tempRejectedArr.push(element);
      }

    })

    this.setState({
      pieData: [{x: `Requires Reapproval: ${tempReapprovalArr.length}%`, y: tempReapprovalArr.length}, {x: `Re`, y: tempRejectedArr.length}]
    })

  }

  componentWillMount(){
    var url = "http://localhost:5000/workbook/"
    axios.post(url,{
      workbookName: "unapprovedPurchaseOrders"
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
    return (
      <div>
        <div className="gridcontainer">
          <div className="piebox1">
            <VictoryPie
              colorScale={["#f53234", "#2b8ca3"]}
              data={this.state.pieData}
            />
          </div>
        </div>
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
    UnapprovedPurchaseOrders
))
