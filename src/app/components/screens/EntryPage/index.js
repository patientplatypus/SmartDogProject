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


class EntryPage extends Component {
  constructor() {
    super();
    this.state = {
      redirect: null
    }
  }

  buttonClicked(value){
    console.log('inside button clicked and value: ', value);

  }

  componentWillMount(){

  }

  render() {
    return (
      <div>
        <h1>
          hello there sailor
        </h1>
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
    EntryPage
))