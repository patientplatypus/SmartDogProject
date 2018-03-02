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
import "./grid.scss";
import InProcessReqs from './inProcessReqs';
import PreApprovedReqs from './preApprovedReqs';



//
// import XLSX from 'xlsx';
//
// import worksheetexample from '../../sample_data/activeUsers.xlsx';



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




class Requisitions extends Component {
  constructor() {
    super();
    this.state = {
      redirect: null,
      rows: [],
      formattedRows: [],
      inProcessRows: [],
      preApprovedRows: [],
    }
  }


  
  
  
  transformData(res) {

    let tempArr = [];
    let tempArr2 = [];
    let tempArr3 = [];

    res.forEach((element, index) => {
      tempArr.push({
        requisitionNum: element[0],
        authorizationStatus: element[1],
        requisitionType: element[2],
        preparer: element[3],
        creator: element[4],
        lastUpdateDate: element[5],
      });

      if(element[1] === "IN PROCESS"){
        tempArr2.push({
          requisitionNum: element[0],
          authorizationStatus: element[1],
          requisitionType: element[2],
          preparer: element[3],
          creator: element[4],
          lastUpdateDate: element[5],
        });
      }
      else {
        tempArr3.push({
          requisitionNum: element[0],
          authorizationStatus: element[1],
          requisitionType: element[2],
          preparer: element[3],
          creator: element[4],
          lastUpdateDate: element[5],
        });
      }

    });


      //console.log("TEST1: "+ tempArr2);
    this.setState({
      formattedRows: tempArr,
      inProcessRows: tempArr2,
      preApprovedRows: tempArr3,
    });

  }


  buttonClicked(value){
    console.log('inside button clicked and value: ', value);

  }

  componentWillMount(){
    // var url = "http://localhost:5000/workbook/"
    // var url2 = "http://localhost:5000/requisition/"
    // axios.post(url,{
    //   workbookName: "requisitions"
    // })
    // .then((response)=>{
    //   console.log("value of response: ", response);
    // })
    // .catch((error)=>{
    //   console.log("value of error: ", error);
    // });

    var url2 = "http://localhost:5000/requisition/"

    axios.get(url2)
    .then((response) => {
      console.log("RETURNED DB RESPONSE: " + response);
      this.setState({
        rows: response,
      }, () => {
        console.log(this.state.rows);
        this.transformData(response.data);
      });
    })
    .catch(function (error) {
      console.log(error);
    });



  }

 


  








  render() {
    return (
      <div>
        {renderIf(this.state.inProcessRows.length )(
          <div>
          <p>In Process </p>
            <div style={{height: "45vh", width: "100vw", overflow: "hidden"}}>
              <InProcessReqs tableData={this.state.inProcessRows} />
            </div>
            <div style={{height: "45vh", width: "100vw", overflow: "hidden"}}>
              <PreApprovedReqs tableData={this.state.preApprovedRows} />
            </div>
          </div>
        )}
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
    Requisitions
))
