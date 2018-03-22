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
      payload: [],
    }
  }

  transformData(resp){

    console.log("IN TRANSFORM DATA: " + resp);

    let data = resp.slice();
    let totalTests = data.length; 
    let amountPassed = 0;
    let recordingPass = 0;
    let recordingTotal = 0;
    let custodyPass = 0;
    let custodyTotal = 0;
    let authPass = 0;
    let authTotal = 0;
    let veriPass = 0;
    let veriTotal = 0;
    let genLedgerPass = 0;
    let genLedgerTotal = 0;
    let receivablesPass = 0;
    let receivablesTotal = 0;
    let payablesPass = 0;
    let payablesTotal = 0;
    let purchasingPass = 0;
    let purchasingTotal = 0;
    let inventoryPass = 0;
    let inventoryTotal = 0;
    let adminPass = 0;
    let adminTotal = 0;


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

    // this.setState({
      
    // }, () => {
    //      console.log("state updated");

    //    });

    // };


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


  render() {


    const columns = [{
      title: 'Name',
      dataIndex: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
    }];

    const data = [{
      key: '1',
      name: 'John Brown',
      money: '￥300,000.00',
      address: 'New York No. 1 Lake Park',
    }, {
      key: '2',
      name: 'Jim Green',
      money: '￥1,256,000.00',
      address: 'London No. 1 Lake Park',
    }, {
      key: '3',
      name: 'Joe Black',
      money: '￥120,000.00',
      address: 'Sidney No. 1 Lake Park',
    }];


    return(
      <div style={{  }}>
        
        <div style={{ display: "flex", flexDirection: "row" }} >
          
          <div style={{ height: "50vh", width: "35vw", backgroundColor: "#d8dbe2" }}> 
            <Progress width={200} type="circle" percent={75} />
          </div>

          <div style={{ height: "50vh", width: "65vw", backgroundColor: "green" }}> 
            <Table
              columns={columns}
              dataSource={data}
              bordered
              title={() => 'Header'}
              footer={() => 'Footer'}
            />
          </div>

        </div>

        <div style={{ height: "50vh", width: "100vw", backgroundColor: "red" }} > 
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