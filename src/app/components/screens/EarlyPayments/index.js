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
import "./grid.css";
import { VictoryChart, VictoryBar, VictoryLabel, VictoryAxis, Bar, VictoryTheme, VictorySharedEvents, VictoryPie, VictoryGroup, VictoryArea } from 'victory';

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


class EarlyPayments extends Component {
  constructor() {
    super();
    this.state = {
      redirect: null,
      sortedArr: [],
      amountSorted: [],
      impactSorted: [],
      rawData: [],
      amountArr: [],
      impactArr: [],
      amountArrLine: [],
      impactArrLine: []
    }
  }

  buttonClicked(value){
    console.log('inside button clicked and value: ', value);

  }



  transformData(response){

    let amountSorted = response.data[0].slice();
    let daysSorted = response.data[0].slice();
    let impactSorted = response.data[0].slice();

    let daysVsAmount = [];
    let daysVsImpact = [];

    let daysVsAmountLine = [];
    let daysVsImpactLine = [];

    let amountUnder20 = [];
    let amountUnder40 = [];
    let amountUnder60 = [];
    let amountUnder80 = [];
    let amountUnder100 = [];


    // let daysUnder20 = [];
    // let daysUnder40 = [];
    // let daysUnder60 = [];
    // let daysUnder80 = [];
    // let daysUnder100 = [];

    // let impactUnder20 = [];
    // let impactUnder40 = [];
    // let impactUnder60 = [];
    // let impactUnder80 = [];
    // let impactUnder100 = [];

    let amountUnder20Counter = 0;
    let amountUnder40Counter = 0;
    let amountUnder60Counter = 0;
    let amountUnder80Counter = 0;
    let amountUnder100Counter = 0;

    // let daysUnder20Counter = 0;
    // let daysUnder40Counter = 0;
    // let daysUnder60Counter = 0;
    // let daysUnder80Counter = 0;
    // let daysUnder100Counter = 0;

    let impactUnder20Counter = 0;
    let impactUnder40Counter = 0;
    let impactUnder60Counter = 0;
    let impactUnder80Counter = 0;
    let impactUnder100Counter = 0;





    amountSorted.sort((a, b) => {
      return a.INV_PAYMENT_AMT - b.INV_PAYMENT_AMT;
    });

    daysSorted.sort((a, b) => {
      return a.DAYS_PAID_EARLY - b.DAYS_PAID_EARLY;
    });

    impactSorted.sort((a, b) => {
      return a.NEGATIVE_CASH_IMPACT - b.NEGATIVE_CASH_IMPACT;
    });

    daysSorted.forEach((element, index) => {
      if(index <= (amountSorted.length * 0.2)){
        amountUnder20.push(element);
        amountUnder20Counter += element.INV_PAYMENT_AMT;
        impactUnder20Counter += element.NEGATIVE_CASH_IMPACT;
      }
      else if(index <= (amountSorted.length * 0.4)){
        amountUnder40.push(element);
        amountUnder40Counter += element.INV_PAYMENT_AMT;
        impactUnder40Counter += element.NEGATIVE_CASH_IMPACT;
      }
      else if(index <= (amountSorted.length * 0.6)){
        amountUnder60.push(element);
        amountUnder60Counter += element.INV_PAYMENT_AMT;
        impactUnder60Counter += element.NEGATIVE_CASH_IMPACT;
      }
      else if(index <= (amountSorted.length * 0.8)){
        amountUnder80.push(element);
        amountUnder80Counter += element.INV_PAYMENT_AMT;
        impactUnder80Counter += element.NEGATIVE_CASH_IMPACT;
      }
      else{
        amountUnder100.push(element);
        amountUnder100Counter += element.INV_PAYMENT_AMT;
        impactUnder100Counter += element.NEGATIVE_CASH_IMPACT;
      }
    });


    daysVsAmount.push(
      {x: "20", y: amountUnder20Counter},
      {x: "40", y: amountUnder40Counter},
      {x: "60", y: amountUnder60Counter},
      {x: "80", y: amountUnder80Counter},
      {x: "100", y: amountUnder100Counter}
    );

    daysVsImpact.push(
      {x: "20", y: impactUnder20Counter},
      {x: "40", y: impactUnder40Counter},
      {x: "60", y: impactUnder60Counter},
      {x: "80", y: impactUnder80Counter},
      {x: "100", y: impactUnder100Counter}
    );

    daysSorted.forEach((element, index) => {
      daysVsAmountLine.push({x: index, y: element.INV_PAYMENT_AMT});
      daysVsImpactLine.push({x: index, y: element.NEGATIVE_CASH_IMPACT});
    });



    console.log("TEST1" + daysSorted);

    this.setState({
      sortedArr: daysSorted
    });

    console.log("TEST 2" + daysSorted);
    this.setState({
      amountSorted: amountSorted,
      impactSorted: impactSorted,
      rawData: response.data[0],
      amountArr: daysVsAmount,
      impactArr: daysVsImpact,
      amountArrLine: daysVsAmountLine,
      impactArrLine: daysVsImpactLine,
    });


    console.log("TEST 3 state" + this.state.sortedArr);

  }

  componentWillMount(){
    var url = "http://localhost:5000/workbook/"
    axios.post(url,{
      workbookName: "earlyPayments"
    })
    .then((response)=>{
      console.log("value of response: ", response);
      this.transformData(response);

    })
    .catch((error)=>{
      console.log("value of error: ", error);
    })
  }


   mergeSortTopDown(array) {
      if(array.length < 2) {
        return array;
      }

      var middle = Math.floor(array.length / 2);
      var left = array.slice(0, middle);
      var right = array.slice(middle);

      return mergeTopDown(mergeSortTopDown(left), mergeSortTopDown(right));
    }
     mergeTopDown(left, right) {
      var array = [];

      while(left.length && right.length) {
        if(left[0] < right[0]) {
          array.push(left.shift());
        } else {
          array.push(right.shift());
        }
      }
      return array.concat(left.slice()).concat(right.slice());
    }


  render() {
    return (
      <div class="graphContainer" style={{height: "50vh", width: "100vw",display: "flex", flexDirection: "row"}}>
          
            <div class="lineGraph" style={{ backgroundColor: "blue", flex: "2"}}>
          
              <VictoryChart 
              width={800} 
              height={400}
              domain={{x: [0, 700],y: [0, 9000]}}
              >
                <VictoryGroup
                  style={{
                    data: { strokeWidth: 3, fillOpacity: 0.4 }
                  }}
                >
                  <VictoryArea
                    style={{
                      data: { fill: "cyan", stroke: "cyan" }
                    }}
                    data={this.state.impactArrLine}
                  />
                  <VictoryArea
                    style={{
                      data: { fill: "magenta", stroke: "magenta" }
                    }}
                    data={this.state.impactArrLine}
                  />
                </VictoryGroup>
              </VictoryChart>
            </div>

          <div class="circleAndBar" style={{backgroundColor: "red",flex: "3"}}>
            <VictorySharedEvents
                events={[{
                  childName: ["pie", "bar"],
                  target: "data",
                  eventHandlers: {
                    onMouseOver: () => {
                      return [{
                        childName: ["pie", "bar"],
                        mutation: (props) => {
                          return {
                            style: Object.assign({}, props.style, {fill: "tomato"})
                          };
                        }
                      }];
                    },
                    onMouseOut: () => {
                      return [{
                        childName: ["pie", "bar"],
                        mutation: () => {
                          return null;
                        }
                      }];
                    }
                  }
                }]}
              >
                <g transform={"translate(150, 50)"}>
                  <VictoryAxis 
                    width={300}
                    height={300}
                    domain={[0, 100]}
                    theme={VictoryTheme.material}
                    standalone={false}
                  />
                  <VictoryAxis dependentAxis 
                    width={300}
                    height={300}
                    domain={[0, 10]}
                    theme={VictoryTheme.material}
                    standalone={false}
                  />
                  <VictoryBar name="bar"
                    width={300}
                    standalone={false}
                    style={{
                      data: { width: 20 },
                      labels: {fontSize: 25}
                    }}
                    data={this.state.amountArr}
                    labels={["20", "40", "60", "80", "100"]}
                    labelComponent={<VictoryLabel y={280}/>}
                  />
                </g>
                <g transform={"translate(-65, -75)"}>
                  <VictoryPie name="pie"
                    width={250}
                    standalone={false}
                    style={{ labels: {fontSize: 25, padding: 10}}}
                    data={this.state.impactArr}
                  />
                </g>
              </VictorySharedEvents>
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
    EarlyPayments
))
