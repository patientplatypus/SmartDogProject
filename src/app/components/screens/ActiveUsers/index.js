import React, {Component} from 'react';
import logo from '../../../style/images/logo.png';
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Card,
  Pagination,
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
      selectedRows: [],
      graphAverage: -1,
      graphAverageTable: -1,
      numberusers: 0,
      numberuserstable: 0,
      statchanged: false,
      statchangedtable: false,
      paginationValue: 1,
      selectedRowKeys: [],
      checkBoxValue: false,
      inputValue: false,
      top3sorted: []
    }
  }

  sortByKeyHighLow(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  }
  sortByKeyLowHigh(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
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
      this.setState({
        lowHighSort: this.sortByKeyLowHigh(this.state.rawData, "DAYS_SINCE_LAST_LOGIN"),
        highLowSort: this.sortByKeyHighLow(this.state.rawData, "DAYS_SINCE_LAST_LOGIN")
      })
    });

  };




  //If I want to calculate the median.

  // median(values) {
  //   values = values.slice(0).sort( function(a, b) {return a - b; } );
  //
  //   return middle(values);
  // }
  //
  // middle(values) {
  //   var len = values.length;
  //   var half = Math.floor(len / 2);
  //
  //   if(len % 2)
  //       return (values[half - 1] + values[half]) / 2.0;
  //   else
  //       return values[half];
  // }

  getDaysLastLoginStats(array){
    let totalDays = 0;
    let countDays = 0;
    let averDays = 0;
    array.forEach(element=>{
      console.log('inside getDaysLastLoginStats array and element: ');
      console.log(element);
      totalDays += element.DAYS_SINCE_LAST_LOGIN;
      countDays++;
    })
    averDays = totalDays/countDays;
    return averDays;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedRowKeys!=this.state.selectedRowKeys){
      if(nextState.selectedRowKeys.length===0){
        this.setState({
          graphAverageTable: -1,
          numberuserstable: 0,
          statchangedtable: true
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              statchangedtable: false
            })
          }, 500)
        })
      }else{
        console.log(this.getDaysLastLoginStats(nextState.selectedRows).toFixed(0));
        this.setState({
          graphAverageTable: this.getDaysLastLoginStats(nextState.selectedRows).toFixed(0),
          numberuserstable: nextState.selectedRows.length,
          statchangedtable: true
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              statchangedtable: false
            })
          }, 500)
        })
      }
    }
    if (nextState.clickedIndex!=this.state.clickedIndex){
      if(nextState.clickedIndex===0){
        this.setState({
          graphAverage: this.getDaysLastLoginStats(this.state.arr100).toFixed(0),
          numberusers: this.state.arr100.length,
          statchanged: true
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              statchanged: false
            })
          }, 500)
        })
      }
      if(nextState.clickedIndex===1){
        this.setState({
          graphAverage: this.getDaysLastLoginStats(this.state.arr200).toFixed(0),
          numberusers: this.state.arr200.length,
          statchanged: true
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              statchanged: false
            })
          }, 500)
        })
      }
      if(nextState.clickedIndex===2){
        this.setState({
          graphAverage: this.getDaysLastLoginStats(this.state.arr300).toFixed(0),
          numberusers: this.state.arr300.length,
          statchanged: true
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              statchanged: false
            })
          }, 500)
        })
      }
      if(nextState.clickedIndex===3){
        this.setState({
          graphAverage: this.getDaysLastLoginStats(this.state.arr400).toFixed(0),
          numberusers: this.state.arr400.length,
          statchanged: true
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              statchanged: false
            })
          }, 500)
        })
      }
      if(nextState.clickedIndex===4){
        this.setState({
          graphAverage: this.getDaysLastLoginStats(this.state.arr500).toFixed(0),
          numberusers: this.state.arr500.length,
          statchanged: true
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              statchanged: false
            })
          }, 500)
        })
      }
      if(nextState.clickedIndex===5){
        this.setState({
          graphAverage: this.getDaysLastLoginStats(this.state.arr600).toFixed(0),
          numberusers: this.state.arr600.length,
          statchanged: true
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              statchanged: false
            })
          }, 500)
        })
      }
      if(nextState.clickedIndex===6){
        this.setState({
          graphAverage: this.getDaysLastLoginStats(this.state.arrOver600).toFixed(0),
          numberusers: this.state.arrOver600.length,
          statchanged: true
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              statchanged: false
            })
          }, 500)
        })
      }
    }
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

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys, selectedRows });
  }

  handleTableChange = (pagination, filters, sorter) => {
      console.log('value of pagination: ', pagination);
      console.log('Various parameters', pagination, filters, sorter);
      if (pagination.current!=this.state.paginationValue){
        this.setState({
          selectedRowKeys: [],
          filteredInfo: filters,
          sortedInfo: sorter,
          paginationValue: pagination.current
        })
      }else{
        this.setState({
          filteredInfo: filters,
          sortedInfo: sorter,
          paginationValue: pagination.current
        });
      }
    }



  checkBoxChange(){
    console.log('inside checkBoxValue');
    this.setState({
      checkBoxValue: !this.state.checkBoxValue
    }, ()=>{
      if (this.state.checkBoxValue===true){
        this.setState({
          top3sorted: [this.state.highLowSort[0], this.state.highLowSort[1], this.state.highLowSort[2]]
        })
      }else{
        this.setState({
          top3sorted: [null, null, null]
        })
      }
    })
  }

  inputChange(e){
    console.log('inside inputChange');
    this.setState({
      inputValue: e.target.value
    })
  }

  alertCreator(){
    console.log("inside alert creator!");
    let sendArr = [];
    this.state.lowHighSort.forEach(element=>{
      if (element["DAYS_SINCE_LAST_LOGIN"] > this.state.inputValue){
        sendArr.push(element)
      }
    })
    this.props.setDaysActiveUsers(sendArr)
    this.props.setTop3ActiveUsers(this.state.top3sorted)
    this.props.setDaysOverdue(this.state.inputValue)
  }

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

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
                  tickFormat={["<100", "<200", "<300", "<400", "<500", "<600", "700+"]}
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
              onChange={this.handleTableChange}
              rowSelection={rowSelection}
              dataSource={this.state.rawData}
              scroll={{ y: `40vh` }}
              pagination={{ pageSize: 100 }}
            />
          </div>
          <div className="statboxtopright" style={{backgroundColor: "#e8f1f5"}}>
            <Card title="Graph Statistics" style={{color: `#2b8ca3`, height: "100%", width: "100%", lineHeight:"2vh", marginLeft: "1%", marginTop: "1%", fontSize:"10pt"}}>
              {renderIf(this.state.graphAverage===-1)(
                <div>
                  <p>
                    Click on the graph to get the average value of the days!
                  </p>
                </div>
              )}
              {renderIf(this.state.graphAverage!=-1)(
                <div className={ this.state.statchanged ? "statChanger" : "" }>
                  <p>
                    Average value of days: {this.state.graphAverage}
                  </p>
                  <p>
                    The number of users that this bar is polling: {this.state.numberusers}
                  </p>
                </div>
              )}
            </Card>
          </div>
          <div className="statboxbottomright" style={{backgroundColor: "#e8f1f5"}}>
            <Card title="Table Statistics" style={{color: `#2b8ca3`, height: "100%", width: "100%", lineHeight:"2vh", marginLeft: "1%", marginTop: "1%", fontSize:"10pt"}}>
              {renderIf(this.state.graphAverageTable===-1)(
                <div>
                  <p>
                    Click on the table to get the average value of the days!
                  </p>
                </div>
              )}
              {renderIf(this.state.graphAverageTable!=-1)(
                <div className={ this.state.statchangedtable ? "statChanger" : "" }>
                  <p>
                    Average value of days: {this.state.graphAverageTable}
                  </p>
                  <p>
                    The number of users clicked in table: {this.state.numberuserstable}
                  </p>
                </div>
              )}
            </Card>
          </div>
          <div className="statboxleft" style={{backgroundColor: "#e8f1f5"}}>
            <Card title="Alert Creation" style={{color: `#2b8ca3`, height: "100%", width: "100%", lineHeight:"2vh", marginLeft: "1%", marginTop: "1%"}}>
              <div>
                <p>
                  In this toolbox, you can create an alert. These alerts will populate the home page if there are users that fit the criteria.
                </p>
              </div>
              <br/>
              <Card style={{backgroundColor: "#e8f1f5"}}>
                <p>
                   <Checkbox onChange={()=>{this.checkBoxChange()}}>Alert me of top 3 users most overdue.</Checkbox>
                </p>
              </Card>
              <br/>
              <Card  style={{backgroundColor: "#e8f1f5"}}>
                <p>
                  Alert me of the of the users greater than <Input placeholder="some number" onChange={(e)=>{this.inputChange(e)}} style={{width: "10%", textAlign: "right"}}/> days overdue.
                </p>
              </Card>
              <br/>
              <Button style={{float: "right", backgroundColor: "#2b8ca3", color: "#fffcff"}} onClick={()=>{this.alertCreator()}}>Create Alert!</Button>
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



// <Card style={{backgroundColor: `#DEE0E0`}}>
//   <FlexRow>
//     <Flex1>
//       <FlexColumn>
//         <Flex1>
//           <Card title="Card title" style={{marginRight: "2%", marginBottom: "2%", color: `#f53234`}}>
//             <p>Card content</p>
//             <p>Card content</p>
//             <p>Card content</p>
//           </Card>
//         </Flex1>
//         <Flex1>
//           <Card title="Card title" style={{marginRight: "2%", color: `#f53234`}}>
//             <p>Card content</p>
//             <p>Card content</p>
//             <p>Card content</p>
//           </Card>
//         </Flex1>
//       </FlexColumn>
//     </Flex1>
//     <Flex1>
//       <Card title="Card title" style={{height: '100%'}}>
//         <p>Card content</p>
//         <p>Card content</p>
//         <p>Card content</p>
//       </Card>
//     </Flex1>
//   </FlexRow>
// </Card>
  // pagination={{ pageSize: this.state.rawData.length }}


  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //     this.setState({
  //       selectedRows: selectedRows,
  //       selectedRowKeys: selectedRowKeys
  //     }, ()=>{
  //       console.log('value of state of selectedRows is : ', this.state.selectedRows);
  //     })
  //   },
  // };
