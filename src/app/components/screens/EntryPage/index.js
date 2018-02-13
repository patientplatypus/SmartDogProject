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
import "./grid.css"
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
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      activeUser1Name: null,
      activeUser1Days: null,
      activeUser2Name: null,
      activeUser2Days: null,
      activeUser3Name: null,
      activeUser3Days: null,
      daysOverdue: null,
      daysOverActiveUsers: [],
      daysActiveUsers: []
    }
  }

  // componentWillReceiveProps(nextProps){
  //   console.log('inside Entry componentWillReceiveProps and nextProps.top3ActiveUsers: ', nextProps);
  //   if (this.props.top3ActiveUsers!=nextProps.top3ActiveUsers){
  //     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
  //     console.log('value of top3ActiveUsers is: ', nextProps.top3ActiveUsers);
  //     this.setState({
  //       activeUser1Name:this.state.top3ActiveUsers[0]["USER_NAME"],
  //       activeUser1Days:this.state.top3ActiveUsers[0]["DAYS_SINCE_LAST_LOGIN"],
  //       activeUser2Name:this.state.top3ActiveUsers[1]["USER_NAME"],
  //       activeUser2Days:this.state.top3ActiveUsers[1]["DAYS_SINCE_LAST_LOGIN"],
  //       activeUser3Name:this.state.top3ActiveUsers[2]["USER_NAME"],
  //       activeUser3Days:this.state.top3ActiveUsers[2]["DAYS_SINCE_LAST_LOGIN"],
  //     }, ()=>{
  //       console.log('after setstate and activeUser1Name: ', this.state.activeUser1Name);
  //     })
  //   }
  // }

  componentWillMount(){
    if(this.props.top3ActiveUsers.length>0){
      console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
      console.log('this is the value of this.props.top3ActiveUsers: ', this.props.top3ActiveUsers);
      this.setState({
        activeUser1Name:this.props.top3ActiveUsers[0]["USER_NAME"],
        activeUser1Days:this.props.top3ActiveUsers[0]["DAYS_SINCE_LAST_LOGIN"],
        activeUser2Name:this.props.top3ActiveUsers[1]["USER_NAME"],
        activeUser2Days:this.props.top3ActiveUsers[1]["DAYS_SINCE_LAST_LOGIN"],
        activeUser3Name:this.props.top3ActiveUsers[2]["USER_NAME"],
        activeUser3Days:this.props.top3ActiveUsers[2]["DAYS_SINCE_LAST_LOGIN"],
      }, ()=>{
        console.log('after setstate and activeUser1Name: ', this.state.activeUser1Name);
      })
    }
    if(this.props.daysOverdue!=null){
      this.setState({
        daysOverdue: this.props.daysOverdue
      })
    }
    if(this.props.daysActiveUsers!=null){
      this.setState({
        daysActiveUsers: this.props.daysActiveUsers
      })
    }
  }

  render() {

    return (
      <div>
        <div className="gridcontainer">
          <div className="alertboxholder">
            <Card title="Alerts!" style={{color: `#2b8ca3`, height: "100%", width: "100%", lineHeight:"2vh", marginRight: "1%", marginTop: "1%", fontSize:"10pt"}}>
              <Card title="Active Users" style={{color: `#2b8ca3`, height: "100%", width: "100%", lineHeight:"2vh", marginLeft: "1%", marginRight: "1%", fontSize:"10pt"}}>
                {renderIf(this.state.activeUser1Name!=null)(
                  <div>
                    <p>
                      Top 3 Users By Days Since Last Logon:
                    </p>
                    <p>
                      User1: {this.state.activeUser1Name}, Days Since Logon: {this.state.activeUser1Days}
                    </p>
                    <p>
                      User2: {this.state.activeUser2Name}, Days Since Logon: {this.state.activeUser2Days}
                    </p>
                    <p>
                      User3: {this.state.activeUser3Name}, Days Since Logon: {this.state.activeUser3Days}
                    </p>
                    <br/>
                  </div>
                )}
                {renderIf(this.state.daysOverdue!=null)(
                  <div>
                    <p>
                      Users that are more than {this.props.daysOverdue} days overdue:
                    </p>
                  </div>
                )}
                {renderIf(this.state.daysActiveUsers.length!=0)(
                  <div style={{height: "10vh", backgroundColor: "#f53234", overflow: "hidden", overflowY: "scroll", fontWeight: "bold"}}>
                    {
                       Array.from({ length: this.state.daysActiveUsers.length }, (_, i) =>
                        <div>
                          <p>
                            Name: {this.state.daysActiveUsers[i]["USER_NAME"]}
                          </p>
                        </div>
                      )
                    }
                  </div>
                )}
              </Card>
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
    EntryPage
))
