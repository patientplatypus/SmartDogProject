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
import "./gridVariance.css"
import { VictoryChart, VictoryBar, VictoryLabel, VictoryAxis, Bar, VictoryTheme, VictoryZoomContainer, VictoryStack, VictoryScatter, VictoryArea } from 'victory';
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



class InvoicePriceVariance extends Component {
  constructor() {
    super();
    this.state = {
      redirect: null,
      chartArr: []
    }
  }

  transformData(response){
    let tempChartArr = [];
    let tempLinArr = [];
    let tempVarArr = [];
    let yMax = 0;
    let yMin = 0;
    let counter = 0;
    response.data[0].forEach((element)=>{
      let vendorName = element["VENDOR_NAME"]

      let linePrice = element["INVOICE_LINE_PRICE"]
      let priceVariance = element["INVOICE_PRICE_VARIANCE"]

      // console.log('value of element: ', element);
      // console.log('value of priceVariance: ', priceVariance);
      // if(priceVariance<yMin){
      //   yMin = priceVariance;
      // }
      // if(priceVariance>yMax){
      //   yMax = priceVariance;
      // }
      // tempChartArr.push({
      //   x: counter,
      //   y: priceVariance,
      // })
      tempLinArr.push({
        x: counter,
        y: linePrice
      })
      tempVarArr.push({
        x: counter,
        y: priceVariance
      })
      counter++;
    })
    this.setState({
      chartArr: tempChartArr,
      linArr: tempLinArr,
      varArr: tempVarArr,
      xMax: counter,
      yMax: yMax,
      yMin: yMin
    }, ()=>{
      console.log('after setState and yMax: ', this.state.yMax, ' yMin: ', this.state.yMin);
      console.log('value of charArr: ', this.state.chartArr);
      console.log('value of tempChartArr: ', tempChartArr);
    })
  }

  componentWillMount(){
    var url = "http://localhost:5000/workbook/"
    axios.post(url,{
      workbookName: "invoicePriceVariance"
    })
    .then((response)=>{
      console.log("value of response: ", response);
      this.transformData(response)
    })
    .catch((error)=>{
      console.log("value of error: ", error);
    })
  }

  render() {
    return (
      <div>
        <div className="gridcontainer">
          <div className="graphboxtopleft" style={{backgroundColor: "purple"}}>

            <VictoryChart
              width={1800}
              height={400}
              containerComponent={
                <VictoryZoomContainer
                allowZoom={false}
                zoomDomain={{x: [0,1000]}}/>
              }
            >
            <VictoryAxis
                domain={[0, 1000]}
                tickValues={[100, 200, 300, 400, 500, 600, 700, 800, 900, 999]}
                tickFormat={[`100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `1000`]}
                theme={VictoryTheme.material}
                standalone={false}
              />
              <VictoryAxis dependentAxis
                  domain={[-100, 6000]}
                  theme={VictoryTheme.material}
                  standalone={false}
                />
                <VictoryStack>
                  <VictoryArea
                    style={{ data: { fill: "#2b8ca3", width: 30 } }}
                    data={this.state.linArr}
                  />
                  <VictoryArea
                    style={{ data: { fill: "#f53234", width: 30 } }}
                    data={this.state.varArr}
                  />
                </VictoryStack>
            </VictoryChart>
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
    InvoicePriceVariance
))
