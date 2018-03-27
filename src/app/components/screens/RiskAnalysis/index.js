import React, {Component} from 'react';
import {
  Form,
  Icon,
  Progress,
  Table
} from 'antd';
import axios from 'axios';
import {Link, Redirect} from "react-router-dom";
import { connect } from 'react-redux';
import renderIf from 'render-if';
import './local.css';





class RiskAnalysis extends Component {
  constructor() {
    super();
    this.state = {
      redirect: null,
      data: [],
      totalTests: 0, 
      amountPassed: 0,
      recordingPass: 0,
      recordingTotal: 0,
      custodyPass: 0,
      custodyTotal: 0,
      authPass: 0,
      authTotal: 0,
      veriPass: 0,
      veriTotal: 0,
      genLedgerPass: 0,
      genLedgerTotal: 0,
      receivablesPass: 0,
      receivablesTotal: 0,
      payablesPass: 0,
      payablesTotal: 0,
      purchasingPass: 0,
      purchasingTotal: 0,
      inventoryPass: 0,
      inventoryTotal: 0,
      adminPass: 0,
      adminTotal: 0,
      testTable: [],
    }
  }




  transformData(resp){

    console.log("IN TRANSFORM DATA: " + resp);

    let data = resp.slice();
    let totalTests = data.length; 
    let amountPassed = 0;
    let recordingPass = 0;
    let recordingTotal = 0;
    let recordingPerc = 0;
    let custodyPass = 0;
    let custodyTotal = 0;
    let custodyPerc = 0;
    let authPass = 0;
    let authTotal = 0;
    let authPerc = 0;
    let veriPass = 0;
    let veriTotal = 0;
    let veriPerc = 0;
    let genLedgerPass = 0;
    let genLedgerTotal = 0;
    let genLedgerPerc = 0;
    let receivablesPass = 0;
    let receivablesTotal = 0;
    let receivablesPerc = 0;
    let payablesPass = 0;
    let payablesTotal = 0;
    let payablesPerc = 0;
    let purchasingPass = 0;
    let purchasingTotal = 0;
    let purchasingPerc = 0;
    let inventoryPass = 0;
    let inventoryTotal = 0;
    let inventoryPerc = 0;
    let adminPass = 0;
    let adminTotal = 0;
    let adminPerc = 0;


    data.forEach((element) => {

      //total test count
      if(element.Violation === "Pass"){
        amountPassed++;
      }


      //governance tests
      if(element.Governance === "REC"){
        recordingTotal++;
        if(element.Violation === "Pass"){
          recordingPass++;
        }
      }
      else if(element.Governance === "CUS"){
        custodyTotal++;
        if(element.Violation === "Pass"){
          custodyPass++;
        }
      }
      else if(element.Governance === "AUT"){
        authTotal++;
        if(element.Violation === "Pass"){
          authPass++;
        }
      }
      else if(element.Governance === "VER"){
        veriTotal++;
        if(element.Violation === "Pass"){
          veriPass++;
        }
      }


      //functional breakdown
      if(element.Application === "GL"){
        genLedgerTotal++;
        if(element.Violation === "Pass"){
          genLedgerPass++;
        }
      }
      else if(element.Application === "AR"){
        receivablesTotal++;
        if(element.Violation === "Pass"){
          receivablesPass++;
        }
      }
      else if(element.Application === "AP"){
        payablesTotal++;
        if(element.Violation === "Pass"){
          payablesPass++;
        }
      }
      else if(element.Application === "PO"){
        purchasingTotal++;
        if(element.Violation === "Pass"){
          purchasingPass++;
        }
      }
      else if(element.Application === "AR"){
        receivablesTotal++;
        if(element.Violation === "Pass"){
          receivablesPass++;
        }
      }
      else if(element.Application === "INV"){
        inventoryTotal++;
        if(element.Violation === "Pass"){
          inventoryPass++;
        }
      }
      else if(element.Application === "Admin"){
        adminTotal++;
        if(element.Violation === "Pass"){
          adminPass++;
        }
      }

    });

   

    this.setState({
      data: data,
      totalTests: data.length, 
      amountPassed: amountPassed,
      recordingPass: recordingPass,
      recordingTotal: recordingTotal,
      recordingPerc: Math.round(recordingPass / recordingTotal * 100),
      custodyPass: custodyPass,
      custodyTotal: custodyTotal,
      custodyPerc: Math.round(custodyPass / custodyTotal * 100),
      authPass: authPass,
      authTotal: authTotal,
      authPerc: Math.round(authPass / authTotal * 100),
      veriPass: veriPass,
      veriTotal: veriTotal,
      veriPerc: Math.round(veriPass / veriTotal * 100),
      genLedgerPass: genLedgerPass,
      genLedgerTotal: genLedgerTotal,
      genLedgerPerc: Math.round(genLedgerPass / genLedgerTotal * 100),
      receivablesPass: receivablesPass,
      receivablesTotal: receivablesTotal,
      receivablesPerc: Math.round(receivablesPass / receivablesTotal * 100),
      payablesPass: payablesPass,
      payablesTotal: payablesTotal,
      payablesPerc: Math.round(payablesPass / payablesTotal * 100),
      purchasingPass: purchasingPass,
      purchasingTotal: purchasingTotal,
      purchasingPerc: Math.round(purchasingPass / purchasingTotal * 100),
      inventoryPass: inventoryPass,
      inventoryTotal: inventoryTotal,
      inventoryPerc: Math.round(inventoryPass / inventoryTotal * 100),
      adminPass: adminPass,
      adminTotal: adminTotal,
      adminPerc: Math.round(adminPass / adminTotal * 100),
      
    });


  }

  

  componentWillMount(){
    var url = "http://localhost:5000/workbook/"
    axios.post(url,{
      workbookName: "riskAnalysis"
    })
    .then((response)=>{
      console.log("value of response: ", response);
      this.transformData(response.data[0]);
    })
    .catch((error)=>{
      console.log("value of error: ", error);
    })
  }


  setTableDataGov(test, pass){

    let tableData = [];
    let counter = 0;

    this.state.data.forEach((element) => {

      if(pass){
        if(element.Governance === test && element.Violation === "Pass"){
          tableData.push({
            test: element["Segregation Test"],
            outcome: element["Detail Outcome"]
          });
        }
      }
      else{
        if(element.Governance === test){
          tableData.push({
            test: element["Segregation Test"],
            outcome: element["Detail Outcome"]
          });
        }
      }

    });

    console.log("SAMPLE TABLE DATAs" + tableData);
    console.log(JSON.parse(JSON.stringify(tableData)));

    this.setState({
      testTable: tableData
    }, ()=>{
      console.log("after changing testTable: ", this.state.testTable);
      this.forceUpdate();
    });

    // this.forceUpdate()

  }

  setTableDataFunc(test){

    let tableData = [];

    this.state.data.forEach((element) => {

      if(test === "REC" ){

      }
      else if(test === "REC" ){

      }
    

    });

  }


  render() {


    const dataSource = [{
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street'
    }, {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street'
    }];

    const columns = [{
      title: 'Segregation Test',
      dataIndex: 'test',
    }, {
      title: 'Detail Outcome',
      dataIndex: 'outcome',
    }];


    return(
      <div style={{  }}>
        
        <div style={{ display: "flex", flexDirection: "row" }} >
          
          <div style={{ height: "40vh", width: "35vw", backgroundColor: "#d8dbe2" }}> 
            <h2> Total Tests Passed </h2>
            <Progress width={200} type="circle" percent={Math.round(this.state.amountPassed / this.state.totalTests * 100)} style={{ padding: "10px"}} />
          </div>

          <div style={{ height: "40vh", width: "65vw", backgroundColor: "#d8dbe2" }}> 
            <h2> Governance Breakdown </h2>
            <table id="governance">
              <tbody>
                <tr>
                  <th>Test</th>
                  <th>Pass</th>
                  <th>Total</th>
                  <th>%</th>
                </tr>
                <tr>
                  <td>Recording</td>
                  <td onClick = {() => this.setTableDataGov("REC", true)}>{this.state.recordingPass}</td>
                  <td>{this.state.recordingTotal}</td>
                  <td>{this.state.recordingPerc}</td>
                </tr>
                <tr>
                  <td>Custody</td>
                  <td onClick = {() => this.setTableDataGov("CUS", true)}>{this.state.custodyPass}</td>
                  <td>{this.state.custodyTotal}</td>
                  <td>{this.state.custodyPerc}</td>
                </tr>
                <tr>
                  <td>Authorization</td>
                  <td>{this.state.authPass}</td>
                  <td>{this.state.authTotal}</td>
                  <td>{this.state.authPerc}</td>
                </tr>
                <tr>
                  <td>Verification</td>
                  <td>{this.state.veriPass}</td>
                  <td>{this.state.veriTotal}</td>
                  <td>{this.state.veriPerc}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <div style={{ height: "60vh", width: "100vw", backgroundColor: "" }} > 
        <h2> Test Breakdown </h2>
          <Table dataSource={this.state.testTable} columns={columns} />
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
    RiskAnalysis
))