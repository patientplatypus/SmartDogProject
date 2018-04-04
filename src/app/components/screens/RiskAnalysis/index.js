import React, {Component} from 'react';
import {
  Form,
  Icon,
  Progress,
  Table,
  Card
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
        if((element.Governance === test && element.Violation === "Pass") || (element.Application === test && element.Violation === "Pass")){
          tableData.push({
            test: element["Segregation Test"],
            outcome: element["Detail Outcome"],
            color: "#80fc8f"
          });
        }
      }
      else{
        if(element.Governance === test || element.Application === test){
          if(element.Violation === "Pass"){
            tableData.push({
              test: element["Segregation Test"],
              outcome: element["Detail Outcome"],
              color: "#80fc8f"
            });
          }
          else{
            tableData.push({
              test: element["Segregation Test"],
              outcome: element["Detail Outcome"],
              color: "#ef5f5f"
            });

          }  
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
      render(text, record) {
        return {
          props: {
            style: { background: record.color },
          },
          children: <div>{text}</div>,
        };
      }
    }, {
      title: 'Detail Outcome',
      dataIndex: 'outcome',
      render(text, record) {
        return {
          props: {
            style: { background: record.color },
          },
          children: <div>{text}</div>,
        };
      }
    }];


    return(
     <div style={{ height: "95vh", width: "100vw", backgroundColor: "", display: "flex", flexDirection: "row" }}>

            <div style={{ height: "95vh", width: "50%", backgroundColor: "#d8dbe2", display: "flex", flexDirection: "column" }} >

              <div style={{ display: "flex", flexDirection: "row" }}>

                <div style={{ height: "33%", width: "50vw", backgroundColor: "#d8dbe2" }}> 
                  <h2> Total Tests Passed </h2>
                  <Progress width={200} type="circle" percent={Math.round(this.state.amountPassed / this.state.totalTests * 100)} style={{ padding: "10px"}} />
                </div>

                <div style={{ height: "33%", width: "50vw", backgroundColor: "#d8dbe2" }}> 
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
                        <td onClick = {() => this.setTableDataGov("REC", false)}>{this.state.recordingTotal}</td>
                        <td>{this.state.recordingPerc}</td>
                      </tr>
                      <tr>
                        <td>Custody</td>
                        <td onClick = {() => this.setTableDataGov("CUS", true)}>{this.state.custodyPass}</td>
                        <td onClick = {() => this.setTableDataGov("CUS", false)}>{this.state.custodyTotal}</td>
                        <td>{this.state.custodyPerc}</td>
                      </tr>
                      <tr>
                        <td>Authorization</td>
                        <td onClick = {() => this.setTableDataGov("AUT", true)}>{this.state.authPass}</td>
                        <td onClick = {() => this.setTableDataGov("AUT", false)}>{this.state.authTotal}</td>
                        <td>{this.state.authPerc}</td>
                      </tr>
                      <tr>
                        <td>Verification</td>
                        <td onClick = {() => this.setTableDataGov("VER", true)}>{this.state.veriPass}</td>
                        <td onClick = {() => this.setTableDataGov("VER", false)}>{this.state.veriTotal}</td>
                        <td>{this.state.veriPerc}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              <div style={{ height: "33%", width: "50vw", backgroundColor: "#d8dbe2" }}> 
                <h2> Functional Breakdown </h2>
                <table id="governance">
                  <tbody>
                    <tr>
                      <th>Application</th>
                      <th>Pass</th>
                      <th>Total</th>
                      <th>%</th>
                    </tr>
                    <tr>
                      <td>General Ledger</td>
                      <td onClick = {() => this.setTableDataGov("GL", true)}>{this.state.genLedgerPass}</td>
                      <td onClick = {() => this.setTableDataGov("GL", false)}>{this.state.genLedgerTotal}</td>
                      <td>{this.state.genLedgerPerc}</td>
                    </tr>
                    <tr>
                      <td>Accounts Receivables</td>
                      <td onClick = {() => this.setTableDataGov("AR", true)}>{this.state.receivablesPass}</td>
                      <td onClick = {() => this.setTableDataGov("AR", false)}>{this.state.receivablesTotal}</td>
                      <td>{this.state.receivablesPerc}</td>
                    </tr>
                    <tr>
                      <td>Accounts Payables</td>
                      <td onClick = {() => this.setTableDataGov("AP", true)}>{this.state.payablesPass}</td>
                      <td onClick = {() => this.setTableDataGov("AP", false)}>{this.state.payablesTotal}</td>
                      <td>{this.state.payablesPerc}</td>
                    </tr>
                    <tr>
                      <td>Purchasing</td>
                      <td onClick = {() => this.setTableDataGov("PO", true)}>{this.state.purchasingPass}</td>
                      <td onClick = {() => this.setTableDataGov("PO", false)}>{this.state.purchasingTotal}</td>
                      <td>{this.state.purchasingPerc}</td>
                    </tr>
                    <tr>
                      <td>Inventory</td>
                      <td onClick = {() => this.setTableDataGov("INV", true)}>{this.state.inventoryPass}</td>
                      <td onClick = {() => this.setTableDataGov("INV", false)}>{this.state.inventoryTotal}</td>
                      <td>{this.state.inventoryPerc}</td>
                    </tr>
                    <tr>
                      <td>Administration</td>
                      <td onClick = {() => this.setTableDataGov("Admin", true)}>{this.state.adminPass}</td>
                      <td onClick = {() => this.setTableDataGov("Admin", false)}>{this.state.adminTotal}</td>
                      <td>{this.state.adminPerc}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              </div>

              <div style={{ display: "flex", flexDirection: "row" }}>

                <Card title="Segregation of Duties Best Practice"  style={{ width: "32%", height: "50vh", margin: "3px" }}>
                  <p>1.  <a href="http://www.ey.com/Publication/vwLUAssets/EY_Segregation_of_duties/$FILE/EY_Segregation_of_duties.pdf">Ernst & Young:</a>  A risk-based approach to segregation of duties</p>
                  <p>2.  <a href="https://www.kpmg-institutes.com/institutes/advisory-institute/events/2017/10/segregation-of-duties-best-practices-for-a-sustainable-process.html">Bearing Point:</a>  Segregation of Duties – Best Practices for a Sustainable Process</p>
                  <p>3.  <a href="https://www.pwc.com/us/en/increasing-it-effectiveness/publications/minimum-access-maximum-sod-validation.html">PWC:</a>  Minimum access, maximum SOD validation</p>
                  <p>4.  <a href="https://oaug.org/component/k2/item/3035-real-life-examples-oracle-grc-benefits-of-oracle-ebs12-upgrade-implementation">KPMG:</a>  Real-Life Examples: Oracle GRC Benefits of Oracle EBS12 Upgrade/Implementation</p>
                  <p>5.  <a href="https://www.isaca.org/Journal/archives/2016/volume-3/Pages/implementing-segregation-of-duties.aspx">ISACA Journal:</a>  Implementing Segregation of Duties: A Practical Experience Based on Best Practices</p>
                </Card>

                <Card title="Oracle User Group Collateral"  style={{ width: "32%", height: "50vh", margin: "3px" }}>
                  <p>1.  <a href="https://oaug.org/education-events/elearning/archive/2018/item/7118-oracle-e-business-suite-comply-grc-segregation-of-duties">Config SnapShot</a> - Oracle E-Business Suite ‘Comply’ – GRC & Segregation of Duties</p>
                  <p>2.  <a href="https://oaug.org/component/k2/item/7119-oaug-apex-for-ebs-sig-presents-security-audit-controls-and-compliance-for-ebs-using-oracle-apex">Kirby Corporation</a> - OAUG APEX for EBS SIG Presents: Security, Audit, Controls and Compliance for EBS using Oracle Apex</p>
                  <p>3.  <a href="http://www.fulcrumway.com/images/resources/OracleEBSSegragationDutyControls.pdf">Fulcrum Way:</a>  Rapidly Reduce Segregation of Duty Violations in Oracle EBS R12 Responsibilities</p>
                  <p>4.  <a href="https://oaug.org/component/k2/item/5914-sarbanes-oxley-compliance-challenges-for-oracle-e-business-suite-panel">ERP Risk Advisors:</a>  Sarbanes Oxley Compliance Challenges for Oracle E-Business Suite Panel</p>
                </Card>

                <Card title="SmartDog Partner Solutions"  style={{ width: "32%", height: "50vh", margin: "3px" }}>
                  <ul style={{ listStyle: "square outside" }}>
                    <li >Card content</li>
                    <li>Card content</li>
                    <li>Card content</li>
                  </ul>
                </Card>

              </div>
              
            </div>

            <div style={{ height: "100%", width: "50%", backgroundColor: "" }} >

              <div style={{ height: "100%", width: "50vw", backgroundColor: "" }} > 
                <h2> Test Breakdown </h2>
                <Table 
                dataSource={this.state.testTable} 
                columns={columns}
                pagination={{ pageSize: 9 }}
               />
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
    RiskAnalysis
))


/*

rowClassName={(record, index) => {
            console.log("index: " + index);
            console.log("record: " + JSON.stringify(record))
            console.log("TEST-TABLE[index] " + this.state.testTable[index])
            if(this.state.testTable[index].pass === true){
              record.color('green');
              console.log("FOUND TRUE");
            }
            else{
              record.color('red');
              console.log("FOUND FALSE");
            }

          }}


*/