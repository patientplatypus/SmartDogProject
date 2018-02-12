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
import "./grid.css"
import axios from 'axios';
import { VictoryChart, VictoryBar, VictoryLabel, VictoryAxis, Bar, VictoryTheme } from 'victory';


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

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
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
      clickedindexArray: [],
      rawData: null,
      filteredInfo: null,
      sortedInfo: null,
      selectedRows: []
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
      chartArr: [{x: 100,y: less100, click: "0"},
                 {x: 200,y: less200, click: "1"},
                 {x: 300,y: less300, click: "2"},
                 {x: 400,y: less400, click: "3"},
                 {x: 500,y: less500, click: "4"},
                 {x: 600,y: less600, click: "5"},
                 {x: 700,y: over600, click: "6"}],
      rawData: response.data[0],
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
      console.log("value of rawData: ", this.state.rawData);
    });

  };

  handleTableChange = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter);
      this.setState({
        filteredInfo: filters,
        sortedInfo: sorter,
      });
    }


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
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [{
          title: 'User Name',
          dataIndex: 'USER_NAME',
          key: 'USER_NAME',
          className: 'USER_NAME'
        }, {
          title: 'Employe ID',
          dataIndex: 'EMPLOYEE_ID',
          key: 'EMPLOYEE_ID',
          sorter: (a, b) => a.EMPLOYEE_ID - b.EMPLOYEE_ID,
          sortOrder: sortedInfo.columnKey === 'EMPLOYEE_ID' && sortedInfo.orderm,
          className: 'EMPLOYEE_ID'
        }, {
          title: 'Days Since Last Login',
          dataIndex: 'DAYS_SINCE_LAST_LOGIN',
          key: 'DAYS_SINCE_LAST_LOGIN',
          sorter: (a, b) => a.DAYS_SINCE_LAST_LOGIN - b.DAYS_SINCE_LAST_LOGIN,
          sortOrder: sortedInfo.columnKey === 'DAYS_SINCE_LAST_LOGIN' && sortedInfo.order,
          className: 'DAYS_SINCE_LAST_LOGIN'
        }, {
          title: 'Last Logon Date',
          dataIndex: 'LAST_LOGON_DATE',
          key: 'LAST_LOGON_DATE',
          sorter: (a, b) => a.LAST_LOGON_DATE - b.LAST_LOGON_DATE,
          sortOrder: sortedInfo.columnKey === 'LAST_LOGON_DATE' && sortedInfo.order,
          className: 'LAST_LOGON_DATE'
        }, {
          title: 'Description',
          dataIndex: 'DESCRIPTION',
          key: 'DESCRIPTION',
          className: 'DESCRIPTION'
        }];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectedRows: selectedRows
        }, ()=>{
          console.log('value of state of selectedRows is : ', this.state.selectedRows);
        })
      },
    };


    return (
      <div>
        <div className="gridcontainer">
          <div style={{paddingLeft: "0", paddingRight: "0", backgroundColor: "#e8f1f5", position: "absolute", right: "2.5vw", top: "10vh", width: "20vw", height: "10vh"}}>
            <Card style={{backgroundColor: `#DEE0E0`}}>
              <VictoryChart
              >
              <VictoryAxis
                  width={400}
                  height={400}
                  domain={[0, 700]}
                  tickValues={[100, 200, 300, 400, 500, 600, 700]}
                  tickFormat={["100", "200", "300", "400", "500", "600", "700+"]}
                  theme={VictoryTheme.material}
                  standalone={false}
                />
                <VictoryLabel
                text={["Days since last login"]}
                x={150} y={285}
                style={{fontSize:12, fontWeight: "bold"}}
                />
                <VictoryAxis dependentAxis
                  width={400}
                  height={400}
                  padding={{left: 200}}
                  domain={[0, 300]}
                  theme={VictoryTheme.material}
                  standalone={false}
                />
                <VictoryLabel
                text={["Amount of users"]}
                x={5} y={200}
                angle={270}
                style={{fontSize:12, fontWeight: "bold"}}
                />
                <VictoryBar
                  style={{ data: { fill: "#2b8ca3", width: 30 } }}
                  data={this.state.chartArr}
                  eventKey={datum=>datum.click}
                  events={[
                    {
                      target: "data",
                      eventKey: ["0","1","2","3","4","5","6"],
                      eventHandlers: {
                        onClick: (evt, clickedProps) => {
                          const clickedIndex = clickedProps.index
                          console.log('value of evt: ', evt);
                          this.setState({
                            clickedIndex: clickedIndex
                          }, ()=>{
                            console.log('after setstate and clickedIndex: ', this.state.clickedIndex);
                          })
                          return [
                            {
                              eventKey: "0",
                              mutation: (props) => {
                                console.log("props key color", props.style.fill);
                                if(props.index===clickedProps.index&&props.style.fill==="#f53234"){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                                if(props.index===clickedProps.index&&props.style.fill==="#2b8ca3"){
                                  return {style: Object.assign(props.style, {fill: "#f53234"})}
                                }
                                if(props.index!=clickedProps.index){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                              }
                            },
                            {
                              eventKey: "1",
                              mutation: (props) => {
                                if(props.index===clickedProps.index&&props.style.fill==="#f53234"){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                                if(props.index===clickedProps.index&&props.style.fill==="#2b8ca3"){
                                  return {style: Object.assign(props.style, {fill: "#f53234"})}
                                }
                                if(props.index!=clickedProps.index){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                              }
                            },
                            {
                              eventKey: "2",
                              mutation: (props) => {
                                if(props.index===clickedProps.index&&props.style.fill==="#f53234"){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                                if(props.index===clickedProps.index&&props.style.fill==="#2b8ca3"){
                                  return {style: Object.assign(props.style, {fill: "#f53234"})}
                                }
                                if(props.index!=clickedProps.index){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                              }
                            },
                            {
                              eventKey: "3",
                              mutation: (props) => {
                                if(props.index===clickedProps.index&&props.style.fill==="#f53234"){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                                if(props.index===clickedProps.index&&props.style.fill==="#2b8ca3"){
                                  return {style: Object.assign(props.style, {fill: "#f53234"})}
                                }
                                if(props.index!=clickedProps.index){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                              }
                            },
                            {
                              eventKey: "4",
                              mutation: (props) => {
                                if(props.index===clickedProps.index&&props.style.fill==="#f53234"){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                                if(props.index===clickedProps.index&&props.style.fill==="#2b8ca3"){
                                  return {style: Object.assign(props.style, {fill: "#f53234"})}
                                }
                                if(props.index!=clickedProps.index){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                              }
                            },
                            {
                              eventKey: "5",
                              mutation: (props) => {
                                if(props.index===clickedProps.index&&props.style.fill==="#f53234"){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                                if(props.index===clickedProps.index&&props.style.fill==="#2b8ca3"){
                                  return {style: Object.assign(props.style, {fill: "#f53234"})}
                                }
                                if(props.index!=clickedProps.index){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                              }
                            },
                            {
                              eventKey: "6",
                              mutation: (props) => {
                                if(props.index===clickedProps.index&&props.style.fill==="#f53234"){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                                if(props.index===clickedProps.index&&props.style.fill==="#2b8ca3"){
                                  return {style: Object.assign(props.style, {fill: "#f53234"})}
                                }
                                if(props.index!=clickedProps.index){
                                  return {style: Object.assign(props.style, {fill: "#2b8ca3"})}
                                }
                              }
                            }
                        ];
                        }
                      }
                    }
                  ]}
                />
              </VictoryChart>
            </Card>
          </div>
          <div className="tablebox" style={{backgroundColor: "#e8f1f5", marginTop: "2%"}}>
            <Table
            columns={columns}
            rowSelection={rowSelection}
            dataSource={this.state.rawData}
            onChange={this.handleTableChange}
            scroll={{ y: `40vh` }}
            pagination={{ pageSize: 100 }}
            />
          </div>
          <div className="statbox">
            <Card style={{backgroundColor: `#DEE0E0`}}>
              <FlexRow>
                <Flex1>
                  <FlexColumn>
                    <Flex1>
                      <Card title="Card title" style={{marginRight: "2%", marginBottom: "2%", color: `#f53234`}}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                      </Card>
                    </Flex1>
                    <Flex1>
                      <Card title="Card title" style={{marginRight: "2%", color: `#f53234`}}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                      </Card>
                    </Flex1>
                  </FlexColumn>
                </Flex1>
                <Flex1>
                  <Card title="Card title" style={{height: '100%'}}>
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                  </Card>
                </Flex1>
              </FlexRow>
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
    ActiveUsers
))
