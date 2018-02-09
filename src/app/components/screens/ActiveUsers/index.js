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
import "./grid.scss"
import axios from 'axios';
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


class ActiveUsers extends Component {
  constructor() {
    super();
    this.state = {
      redirect: null,
      chartArr: null,
      arr100: null,
      arr200: null,
      arr300: null,
      arr400: null,
      arr500: null,
      arr600: null,
      arrOver600: null,
    }
  }

  buttonClicked(value){
    console.log('inside button clicked and value: ', value);
  }


  transformData(response){


    let temp100 = [];
    let temp200 = [];
    let temp300 = [];
    let temp400 = [];
    let temp500 = [];
    let temp600 = [];
    let tempOver600 = [];

    let less100 = 0;
    let less200 = 0;
    let less300 = 0;
    let less400 = 0;
    let less500 = 0;
    let less600 = 0;
    let over600 = 0;

    response.data[0].forEach((element) => {
      //console.log(element);




      if(element.DAYS_SINCE_LAST_LOGIN < 100){
        less100++;
        temp100.push(element);
      }
      else if(element.DAYS_SINCE_LAST_LOGIN > 100 && element.DAYS_SINCE_LAST_LOGIN < 200){
        less200++;
        temp200.push(element);
      }
      else if(element.DAYS_SINCE_LAST_LOGIN > 200 && element.DAYS_SINCE_LAST_LOGIN < 300){
        less300++;
        temp300.push(element);
      }
      else if(element.DAYS_SINCE_LAST_LOGIN > 300 && element.DAYS_SINCE_LAST_LOGIN < 400){
        less400++;
        temp400.push(element);
      }
      else if(element.DAYS_SINCE_LAST_LOGIN > 400 && element.DAYS_SINCE_LAST_LOGIN < 500){
        less500++;
        temp500.push(element);
      }
      else if(element.DAYS_SINCE_LAST_LOGIN > 500 && element.DAYS_SINCE_LAST_LOGIN < 600){
        less600++;
        temp600.push(element);
      }
      else if(element.DAYS_SINCE_LAST_LOGIN > 600){
        over600++;
        tempOver600.push(element);
      }
    });



    this.setState({
      chartArr: [{x: 100,y: less100},
                 {x: 200,y: less200},
                 {x: 300,y: less300},
                 {x: 400,y: less400},
                 {x: 500,y: less500},
                 {x: 600,y: less600},
                 {x: 700,y: over600}],
      arr100: temp100,
      arr200: temp200,
      arr300: temp300,
      arr400: temp400,
      arr500: temp500,
      arr600: temp600,
      arrOver600: tempOver600,

    }, ()=>{
      console.log("hey we are after the setState and value");
      console.log("of new chartArr is: ", this.state.chartArr);
    });

  };


  componentWillMount(){
    var url = "http://localhost:5000/workbook/"
    axios.post(url,{
      workbookName: "activeUsers"
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
        <div className="GridContainer">
          <h1>
            hello there activeUsers
          </h1>
          <div className="graphbox">
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
    ActiveUsers
))
