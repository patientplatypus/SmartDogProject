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
import { VictoryChart, VictoryBar, VictoryCursorContainer, VictoryLabel, VictoryGroup, VictoryAxis, Bar, VictoryTheme, VictoryZoomContainer, VictoryStack, VictoryScatter, VictoryArea, VictoryVoronoiContainer, VictoryLine, VictoryTooltip, Line } from 'victory';
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
      chartArr: [],
      cursorValue: null,
      statchangedgraph1: null,
      statchangedgraph2: null
    }
  }

  transformData(response){
    let tempChartArr = [];
    let tempLinArr = [];
    let tempVarArr = [];
    let tempPoArr = [];
    let tempPerArr = [];
    let tempDispArr = [];
    let yMax = 0;
    let yMin = 0;
    let counter = 0;
    response.data[0].forEach((element)=>{
      let vendorName = element["VENDOR_NAME"]
      let operatingUnit = element["OPERATING_UNIT"]
      //PO_LINE_PRICE = INVOICE_LINE_PRICE - INVOICE_PRICE_VARIANCE
      let poPrice = element["PO_LINE_PRICE"]
      let linePrice = element["INVOICE_LINE_PRICE"]
      let priceVariance = element["INVOICE_PRICE_VARIANCE"]

      let labelVal = "Unit: "+operatingUnit+"\nVendor: "+vendorName

      let perDif
      if (poPrice<=1){
        perDif = 0
      }else{
        perDif = priceVariance/linePrice
      }

      tempDispArr.push({
        x: counter,
        vendorName: vendorName,
        operatingUnit: operatingUnit,
        poPrice: poPrice,
        linePrice: linePrice,
        priceVariance: priceVariance
      })
      tempPoArr.push({
        x: counter,
        y: poPrice,
        labelsName: labelVal
      })
      tempLinArr.push({
        x: counter,
        y: linePrice,
        labelsName: labelVal
      })
      tempVarArr.push({
        x: counter,
        y: priceVariance,
        labelsName: labelVal
      })
      tempPerArr.push({
        x: counter,
        y: perDif,
        labelsName: labelVal
      })
      counter++;
    })
    this.setState({
      chartArr: tempChartArr,
      poArr: tempPoArr,
      linArr: tempLinArr,
      varArr: tempVarArr,
      perArr: tempPerArr,
      dispArr: tempDispArr,
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

  clickChart(value){
    console.log('inside lockChart');
    if (value === 1){
      this.setState({
        statchangedgraph1: true,
        graph1vendorName: this.state.dispArr[this.state.roundedCursorValue1]["vendorName"],
        graph1operatingUnit: this.state.dispArr[this.state.roundedCursorValue1]["operatingUnit"],
        graph1poPrice: this.state.dispArr[this.state.roundedCursorValue1]["poPrice"],
        graph1linePrice: this.state.dispArr[this.state.roundedCursorValue1]["linePrice"],
        graph1priceVariance: this.state.dispArr[this.state.roundedCursorValue1]["priceVariance"]
      })
    }
    if (value === 2){
      this.setState({
        statchangedgraph2: true,
        graph2vendorName: this.state.dispArr[this.state.roundedCursorValue2]["vendorName"],
        graph2operatingUnit: this.state.dispArr[this.state.roundedCursorValue2]["operatingUnit"],
        graph2poPrice: this.state.dispArr[this.state.roundedCursorValue2]["poPrice"],
        graph2linePrice: this.state.dispArr[this.state.roundedCursorValue2]["linePrice"],
        graph2priceVariance: this.state.dispArr[this.state.roundedCursorValue2]["priceVariance"]
      })
    }

  }

  render() {
    return (
      <div>
        <div className="gridcontainer">
          <div className="graphboxleft" style={{backgroundColor: "#dee0e0", marginLeft: "0.5vw", marginTop:"1vh", marginBottom:"7vh", padding: "0.5%"}}>
            <FlexColumn>
              <Flex1 onClick={()=>{this.clickChart(1)}}>
                <VictoryChart
                  width={1800}
                  height={550}
                  domain={{y: [0,5000]}}
                  containerComponent={
                    <VictoryCursorContainer
                      cursorDimension="x"
                      defaultCursorValue={500}
                      cursorLabelOffset={{ x: 30, y: -50 }}
                      onCursorChange={(value, props) =>
                         this.setState({cursorValue: value, roundedCursorValue1: Math.round(value)})}
                    />
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
                  <VictoryArea
                  style={{
                    data: { fill: "#2b8ca3" },
                  }}
                    data={this.state.varArr}
                  />
                  <VictoryArea
                  style={{
                    data: { fill: "#f53234" },
                  }}
                    data={this.state.poArr}
                  />
                </VictoryChart>
              </Flex1>
              <Flex1 onClick={()=>{this.clickChart(2)}}>
                <VictoryChart
                  width={1800}
                  height={550}
                  domain={{x: [0, 1000], y: [0, 1]}}
                  containerComponent={
                    <VictoryCursorContainer
                      cursorDimension="x"
                      cursorComponent={<Line style={{width: 40}}/>}
                      defaultCursorValue={500}
                      cursorLabelOffset={{ x: 30, y: -50 }}
                      onCursorChange={(value, props) =>
                         this.setState({cursorValue: value, roundedCursorValue2: Math.round(value)})}
                    />
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
                      domain={[0, 1]}
                      theme={VictoryTheme.material}
                      standalone={false}
                    />
                    <VictoryArea
                      labelComponent={<VictoryTooltip/>}
                      style={{ data: { fill: "#f53234" } }}
                      data={this.state.perArr}
                    />
                </VictoryChart>
              </Flex1>
            </FlexColumn>
          </div>
          <div className="alertboxright">
            <FlexColumn>
              <Flex1 style={{position: "relative"}}>
                <Card title="Graph 1" style={{color: `#2b8ca3`, height: "100%", width: "100%", lineHeight:"2vh", marginLeft: "1%", marginTop: "1.5%", fontSize:"10pt", height: "30vh"}}>
                  {renderIf(this.state.statchangedgraph1)(
                    <div>
                      <p>
                        Vendor Name: {this.state.graph1vendorName}
                      </p>
                      <p>
                        Operating Unit: {this.state.graph1operatingUnit}
                      </p>
                      <p>
                        PO Price: {this.state.graph1poPrice}
                      </p>
                      <p>
                        Line Price: {this.state.graph1linePrice}
                      </p>
                      <p>
                        Price Variance: {this.state.graph1priceVariance}
                      </p>
                    </div>
                  )}
                </Card>
                <Icon style={{position: "absolute", top: "0", left: "0", fontWeight: "900"}} type="check" className={ this.state.statchangedgraph1 ? "statChangeCheck" : "invisibleCheck" }/>
              </Flex1>
              <Flex1 style={{position: "relative"}}>
                <Card title="Graph 2" style={{color: `#2b8ca3`, height: "100%", width: "100%", lineHeight:"2vh", marginLeft: "1%", marginTop: "1.5%", fontSize:"10pt", height: "30vh"}}>
                  {renderIf(this.state.statchangedgraph2)(
                    <div>
                      <p>
                        Vendor Name: {this.state.graph2vendorName}
                      </p>
                      <p>
                        Operating Unit: {this.state.graph2operatingUnit}
                      </p>
                      <p>
                        PO Price: {this.state.graph2poPrice}
                      </p>
                      <p>
                        Line Price: {this.state.graph2linePrice}
                      </p>
                      <p>
                        Price Variance: {this.state.graph2priceVariance}
                      </p>
                    </div>
                  )}
                </Card>
                <Icon style={{position: "absolute", top: "0", left: "0", fontWeight: "900"}} type="check" className={ this.state.statchangedgraph2 ? "statChangeCheck" : "invisibleCheck" }/>
              </Flex1>
              <Flex1>
                <Card title="Alert" style={{color: `#2b8ca3`, height: "100%", width: "100%", lineHeight:"2vh", marginLeft: "1%", marginTop: "1.5%", fontSize:"10pt", height: "30vh"}}>
                  <div>
                    <p>
                      Currently a place holder for alert functionality.
                    </p>
                  </div>
                </Card>
              </Flex1>
            </FlexColumn>
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
