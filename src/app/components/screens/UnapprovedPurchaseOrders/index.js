import React, {Component} from 'react';
import logo from '../../../style/images/logo.png';
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Card,
  Table,
  Tabs,
  Layout,
  Row,
  Timeline,
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
import { VictoryChart, VictoryBar, VictoryLabel, VictoryAxis, VictoryGroup, Bar, VictoryTheme, VictoryPie } from 'victory';
import "./UnapprovedGrid.css"



import {Link, Redirect} from "react-router-dom";
import { checkLoginOCI } from '../../../redux';
const {Header, Content} = Layout;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

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
      tempPieData: null,
      reapprovalBilledSorted: [],
      reapprovalQtyOrderedSorted: [],
      reapprovalReceivedSorted: [],
      rejectedBilledSorted: [],
      rejectedQtyOrderedSorted: [],
      rejectedReceivedSorted: [],
      alertArray1:[],
      alertArray2:[],
      alertArray3:[],
      alertArray4:[],
      alertArray5:[],
      alertArray6:[],
    }
  }

  sortByKeyHighLow(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  }

  handleTimeline(array, number){
    console.log("array ", array, " number ", number);
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
    let rejectedCounter = 0;
    let requiresApprovalCounter = 0;

    let reapprovalBILLEDcount = 0;
    let reapprovalQTY_ORDEREDcount = 0;
    let reapprovalRECEIVEDcount = 0;

    let rejectedBILLEDcount = 0;
    let rejectedQTY_ORDEREDcount = 0;
    let rejectedRECEIVEDcount = 0;

    response.data[0].forEach(element=>{
      // console.log('value of element: ', element);
      if (element.AUTHORIZATION_STATUS==='REQUIRES REAPPROVAL'){
        tempTotalArr.push(element);
        tempReapprovalArr.push(element);
        reapprovalBILLEDcount = reapprovalBILLEDcount+element.BILLED;
        reapprovalQTY_ORDEREDcount = reapprovalQTY_ORDEREDcount+element.QTY_ORDERED;
        reapprovalRECEIVEDcount = reapprovalRECEIVEDcount+element.RECEIVED;
        requiresApprovalCounter++;
      }else if(element.AUTHORIZATION_STATUS==='REJECTED'){
        tempTotalArr.push(element);
        tempRejectedArr.push(element);
        rejectedBILLEDcount = rejectedBILLEDcount+element.BILLED;
        rejectedQTY_ORDEREDcount = rejectedQTY_ORDEREDcount+element.QTY_ORDERED;
        rejectedRECEIVEDcount = rejectedRECEIVEDcount+element.RECEIVED;
        rejectedCounter++;
      }
    })




    console.log('value of requiresApprovalCounter: ', requiresApprovalCounter);
    console.log('value of rejectedCounter: ', rejectedCounter);

    let displayRequires = (100*requiresApprovalCounter/(rejectedCounter+requiresApprovalCounter)).toFixed(1)

    let displayRejected = (100*rejectedCounter/(rejectedCounter+requiresApprovalCounter)).toFixed(1)


    console.log("rejectedBILLEDcount/rejectedCounter", rejectedBILLEDcount/rejectedCounter);

    this.setState({
      reapprovalBilledSorted: this.sortByKeyHighLow(tempReapprovalArr, "BILLED").slice(0,5),
      reapprovalQtyOrderedSorted: this.sortByKeyHighLow(tempReapprovalArr, "QTY_ORDERED").slice(0,5),
      reapprovalReceivedSorted: this.sortByKeyHighLow(tempReapprovalArr, "RECEIVED").slice(0,5),
      rejectedBilledSorted: this.sortByKeyHighLow(tempRejectedArr, "BILLED").slice(0,5),
      rejectedQtyOrderedSorted: this.sortByKeyHighLow(tempRejectedArr, "QTY_ORDERED").slice(0,5),
      rejectedReceivedSorted: this.sortByKeyHighLow(tempRejectedArr, "RECEIVED").slice(0,5),
      pieData: [
        {x: `Requires Reapproval: ${displayRequires}%`, y: requiresApprovalCounter},
        {x: `Rejected: ${displayRejected}%`, y: rejectedCounter}
      ],
      rejectedData: [
        {x:`Rejected Billed`, y:rejectedBILLEDcount},
        {x:`Rejected Qty Ordered`, y:rejectedQTY_ORDEREDcount},
        {x:`Rejected Received`, y:rejectedRECEIVEDcount},
      ],
      reapprovalData: [
        {x:`Reapproval Billed`, y:reapprovalBILLEDcount},
        {x:`Reapproval Qty Orderd`, y:reapprovalQTY_ORDEREDcount},
        {x:`Reapproval Received`, y:reapprovalRECEIVEDcount},
      ],
    },()=>{
      console.log('value of reapprovalBilledSorted: ', this.state.reapprovalBilledSorted);
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
              colorScale={["#2b8ca3", "#f53234"]}
              data={this.state.pieData}
            />
          </div>
          <div className='reapprovalBox'>
            <VictoryChart
            domainPadding={{ x: 20 }}>
                <VictoryBar
                  style={{ data: { fill: "#2b8ca3" } }}
                  data={this.state.reapprovalData}
                />
            </VictoryChart>
          </div>
          <div className='rejectedBox'>
            <VictoryChart
            domainPadding={{ x: 20 }}>
                <VictoryBar
                  style={{ data: { fill: "#f53234" } }}
                  data={this.state.rejectedData}
                />
            </VictoryChart>
          </div>
          <div className='approvalTimeline' style={{backgroundColor: '#e8f1f5'}}>
            <Card title="Awaiting Approval Items" style={{color: `#2b8ca3`, height: "100%", width: "100%", lineHeight:"2vh", marginLeft: "7.5%", marginTop: "5%"}}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Billed" key="1">
                  {renderIf(this.state.reapprovalBilledSorted.length>0)(
                    <Timeline>
                        {
                           Array.from({ length: this.state.reapprovalBilledSorted.length }, (_, i) =>
                            <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
                            style={{cursor: "pointer"}} onClick={()=>{this.handleTimeline(1, i)}}>
                              <p>
                                Vendor Name: {this.state.reapprovalBilledSorted[i]["VENDOR_NAME"]}
                              </p>
                              <p>
                                Billed: {this.state.reapprovalBilledSorted[i]["BILLED"]}
                              </p>
                            </Timeline.Item>
                          )
                        }
                    </Timeline>
                  )}
                </TabPane>
                <TabPane tab="Qty Ordered" key="2">
                  {renderIf(this.state.reapprovalQtyOrderedSorted.length>0)(
                    <Timeline>
                        {
                           Array.from({ length: this.state.reapprovalQtyOrderedSorted.length }, (_, i) =>
                            <Timeline.Item  style={{cursor: "pointer"}} onClick={()=>{this.handleTimeline(2, i)}}>
                              <p>
                                Vendor Name: {this.state.reapprovalQtyOrderedSorted[i]["VENDOR_NAME"]}
                              </p>
                              <p>
                                Qty Ordered: {this.state.reapprovalQtyOrderedSorted[i]["QTY_ORDERED"]}
                              </p>
                            </Timeline.Item>
                          )
                        }
                    </Timeline>
                  )}
                </TabPane>
                <TabPane tab="Received" key="3">
                  {renderIf(this.state.reapprovalReceivedSorted.length>0)(
                    <Timeline>
                        {
                           Array.from({ length: this.state.reapprovalReceivedSorted.length }, (_, i) =>
                            <Timeline.Item style={{cursor: "pointer"}} onClick={()=>{this.handleTimeline(3 ,i)}}>
                              <p>
                                Vendor Name: {this.state.reapprovalReceivedSorted[i]["VENDOR_NAME"]}
                              </p>
                              <p>
                                Received: {this.state.reapprovalReceivedSorted[i]["QTY_ORDERED"]}
                              </p>
                            </Timeline.Item>
                          )
                        }
                    </Timeline>
                  )}
                </TabPane>
              </Tabs>
            </Card>
          </div>
          <div className='rejectedTimeline' style={{backgroundColor: '#e8f1f5'}}>
            <Card title="Rejected Items" style={{color: `#2b8ca3`, height: "100%", width: "100%", lineHeight:"2vh", marginLeft: "7.5%", marginTop: "5%"}}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Billed" key="1">
                  {renderIf(this.state.rejectedBilledSorted.length>0)(
                    <Timeline>
                        {
                           Array.from({ length: this.state.rejectedBilledSorted.length }, (_, i) =>
                            <Timeline.Item style={{cursor: "pointer"}} onClick={()=>{this.handleTimeline(4, i)}}>
                              <p>
                                Vendor Name: {this.state.rejectedBilledSorted[i]["VENDOR_NAME"]}
                              </p>
                              <p>
                                Billed: {this.state.rejectedBilledSorted[i]["BILLED"]}
                              </p>
                            </Timeline.Item>
                          )
                        }
                    </Timeline>
                  )}
                </TabPane>
                <TabPane tab="Qty Ordered" key="2">
                  {renderIf(this.state.rejectedQtyOrderedSorted.length>0)(
                    <Timeline>
                        {
                           Array.from({ length: this.state.rejectedQtyOrderedSorted.length }, (_, i) =>
                            <Timeline.Item style={{cursor: "pointer"}} onClick={()=>{this.handleTimeline(5, i)}}>
                              <p>
                                Vendor Name: {this.state.rejectedQtyOrderedSorted[i]["VENDOR_NAME"]}
                              </p>
                              <p>
                                Qty Ordered: {this.state.rejectedQtyOrderedSorted[i]["QTY_ORDERED"]}
                              </p>
                            </Timeline.Item>
                          )
                        }
                    </Timeline>
                  )}
                </TabPane>
                <TabPane tab="Received" key="3">
                  {renderIf(this.state.rejectedReceivedSorted.length>0)(
                    <Timeline>
                        {
                           Array.from({ length: this.state.rejectedReceivedSorted.length }, (_, i) =>
                            <Timeline.Item style={{cursor: "pointer"}} onClick={()=>{this.handleTimeline(6, i)}}>
                              <p>
                                Vendor Name: {this.state.rejectedReceivedSorted[i]["VENDOR_NAME"]}
                              </p>
                              <p>
                                Received: {this.state.rejectedReceivedSorted[i]["QTY_ORDERED"]}
                              </p>
                            </Timeline.Item>
                          )
                        }
                    </Timeline>
                  )}
                </TabPane>
              </Tabs>
            </Card>
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
