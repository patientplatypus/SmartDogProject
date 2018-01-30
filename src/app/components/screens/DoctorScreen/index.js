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
  Select,
  Row,
  Col,
  Menu
} from 'antd';
import {headStyles, cardStyles, contentStyles, medusa, layoutStyles} from '../../../style/MainStyles.js';
import { connect } from 'react-redux'
import './local.css'
import renderIf from 'render-if'
import styled, { keyframes }  from 'styled-components';

import {Link, Redirect} from "react-router-dom";
import { getPATIENTINFO, getALLPATIENTS, getRXINFO } from '../../../redux';
const {Header, Content} = Layout;
const FormItem = Form.Item;

import { fadeInRight } from 'react-animations';
import { fadeInLeftBig } from 'react-animations';

const FadeInRightAnimation = keyframes`${fadeInRight}`;
const FadeInLeftBigAnimation = keyframes`${fadeInLeftBig}`;

const FadeInRightDiv = styled.div`
  animation: 1s ${FadeInRightAnimation};
`;

const FadeInLeftBigDiv = styled.div`
  animation: 1.5s ${FadeInLeftBigAnimation};
`;

const Option = Select.Option;

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

class Doctor extends Component {
  constructor() {
    super();
    this.state = {
      allpatients: [],
      // requestpatientinfo: false,
      // requestallpatients: false,
      // requestpatientrx: false,
      // receivedpatientrx: false
      receivedpatientinfo: false,
      receivedallpatients: false,
      patientinfoTitle: null,
      patientinfoID: null,
      patientinfoDOB: null,
      patientinfoAddress: null,
      patientinfoEthnicity: null,
      patientinfoPhone: null,
      selectedFirstName: null,
      selectedLastName: null,
      displaygetpatientwarning: false,
      rxinfo: []
    }
  }

  componentDidMount(){
    console.log('inside componentDidMount of Doctor');
    this.setState({
      requestallpatients: true
    }, ()=>{
      //
      this.props.getallpatients();
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.patientinfo!=this.props.patientinfo){
      this.setState({
        patientinfoTitle: "Patient Name: " + nextProps.patientinfo.LastName + ", " + nextProps.patientinfo.FirstName,
        patientinfoID: nextProps.patientinfo.ID,
        patientinfoDOB: nextProps.patientinfo.DOB,
        patientinfoAddress: nextProps.patientinfo.Address,
        patientinfoEthnicity: nextProps.patientinfo.Ethinicity, //misspelled doy!
        patientinfoPhone: nextProps.patientinfo.Phone,
      }, ()=>{
        this.setState({
          receivedpatientinfo: true,
        })
      })
      console.log('value of patientinfo after receiving props: ', nextProps.patientinfo);
      if(nextProps.patientinfo.ID!=null){
        this.props.getrxinfo({id: nextProps.patientinfo.ID})
      }
    }
    if(nextProps.allpatients!=this.props.allpatients){
      this.setState({
        receivedallpatients: true
      }, () => {
        this.setState({
          allpatients: nextProps.allpatients.Persons
        })
      })
      console.log('value of allpatients after receiving props: ', nextProps.allpatients.Persons);
    }
    if(nextProps.rxinfo!=this.props.rxinfo){
      this.setState({
        receivedpatientrx: true,
        rxinfo: nextProps.rxinfo
      }, ()=>{
        console.log("in componentWillReceiveProps and requestpatientrx: ", nextProps.rxinfo);
      })
    }

  }

  handleChange(value) {
    console.log(`selected ${value}`);
    var localNames = value.split(" ");
    this.setState({
      selectedFirstName: localNames[0],
      selectedLastName: localNames[1],
      displaygetpatientwarning: false
    })
  }

  handleGetPatient(){
    if (this.state.selectedLastName!=null && this.state.selectedFirstName!=null){
      this.setState({
        requestpatientinfo: true
      }, ()=>{
        this.props.getpatientinfo({firstname: this.state.selectedFirstName, lastname: this.state.selectedLastName})
      })
    }else{
      this.setState({
        displaygetpatientwarning: true
      })
    }
  }

  handleBlur() {
    console.log('blur');
  }

  handleFocus() {
    console.log('focus');
  }

  render() {
    console.log('inside DoctorScreen');
    let patientnames;
    patientnames = this.state.allpatients.map(function(patient, i){
      let patientFullName = patient.FirstName + " " + patient.LastName
      console.log('value of patientFullName: ', patientFullName);
      return(<Option value={patientFullName} key={i}>{patientFullName}</Option>);
    })
    let scriptlist;
    if (this.state.rxinfo.RX!=undefined){
      scriptlist = this.state.rxinfo.RX.map(function(pill, i){
        return(
          <Card style={{fontWeight: "bold", fontSize:"1.5vh", marginBottom: "1vh", padding:"0vh", textAlign: "left", backgroundColor: "#E8F1F5"}}>
            <FlexRow>
              <Flex1>
                <p key={i}>
                  {pill.RXID}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.Doctor}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.License}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.Prescription}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.REFILLS}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.Status}
                </p>
              </Flex1>
            </FlexRow>
          </Card>
        );
      })
    }

    console.log('value of patientnames: ', patientnames);
    return (
      <div>
      <div style={{position:"absolute", left: "5vw"}}>
        <i className="fas fa-user-md" style={{fontSize: "30vh"}}></i>
      </div>
      <div style={{position: "absolute", left: "20vw", top: "2vh", fontSize: "12vh", lineHeight: "13vh"}}>
        <p>
          Doctor
        </p>
        <p>
          Portal
        </p>
      </div>



      {renderIf(this.state.receivedallpatients===true)(
        <div>
          <Card title="Search for a Patient" bordered={false} style={{width: "20vw", left: "55vw", top: "2.5vh", height:"100%", backgroundColor: "#1989AC"}}>
            <FlexColumn>
              <Flex1>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  size="large"
                  optionFilterProp="children"
                  onChange={(e)=>this.handleChange(e)}
                  onFocus={()=>this.handleFocus()}
                  onBlur={()=>this.handleBlur()}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {patientnames}
                  </Select>
                </Flex1>
                <Flex1><br/></Flex1>
                <Flex1>
                  <Button type="secondary" size="large" onClick={()=>this.handleGetPatient()}>
                    Get Records!
                  </Button>
                </Flex1>
                {renderIf(this.state.displaygetpatientwarning===true)(
                  <div>
                    <Flex1><br/></Flex1>
                    <Flex1 style={{color: "#FFDE25"}}>
                      You must select a patient first!
                    </Flex1>
                  </div>
                )}
            </FlexColumn>
          </Card>

        </div>
       )}

      {renderIf(this.state.receivedpatientinfo===true)(
        <FadeInRightDiv style={{position: "absolute", left: "77.5vw", right: "20vw", top: "2.5vh", width: "20vw", textAlign: "left"}}>
          <Card title={this.state.patientinfoTitle} bordered={false} style={{ backgroundColor: "#1989AC", color: "#283E56"}}>
            <FlexColumn>
              <Flex1>
                <Card style={{fontWeight: "bold", fontSize:"2vh", paddingTop: "0",  textAlign: "left", backgroundColor: "#E8F1F5"}}>
                    ID
                  <div style={{fontSize:"1.5vh", textAlign: "right"}}>
                    <p>
                      {this.state.patientinfoID}
                    </p>
                  </div>
                </Card>
              </Flex1>
              <Flex1><br/></Flex1>
              <Flex1>
                <Card style={{fontWeight: "bold", fontSize:"2vh", paddingTop: "0",  textAlign: "left", backgroundColor: "#E8F1F5"}}>
                  <p>
                    DOB
                  </p>
                  <div style={{fontSize:"1.5vh", textAlign: "right"}}>
                    <p>
                      {this.state.patientinfoDOB}
                    </p>
                  </div>
                </Card>
              </Flex1>
              <Flex1><br/></Flex1>
              <Flex1>
                <Card style={{fontWeight: "bold", fontSize:"2vh", paddingTop: "0",  textAlign: "left", backgroundColor: "#E8F1F5"}}>
                  <p>
                    Address
                  </p>
                  <div style={{fontSize:"1.5vh", textAlign: "right"}}>
                    <p>
                      {this.state.patientinfoAddress}
                    </p>
                  </div>
                </Card>
              </Flex1>
              <Flex1><br/></Flex1>
              <Flex1>
                <Card style={{fontWeight: "bold", fontSize:"2vh", paddingTop: "0",  textAlign: "left", backgroundColor: "#E8F1F5"}}>
                  <p>
                    Ethnicity
                  </p>
                  <div style={{fontSize:"1.5vh", textAlign: "right"}}>
                    <p>
                      {this.state.patientinfoEthnicity}
                    </p>
                  </div>
                </Card>
              </Flex1>
              <Flex1><br/></Flex1>
              <Flex1>
                <Card style={{fontWeight: "bold", fontSize:"2vh", paddingTop: "0",  textAlign: "left", backgroundColor: "#E8F1F5"}}>
                  <p>
                    Phone
                  </p>
                  <div style={{fontSize:"1.5vh", textAlign: "right"}}>
                    <p>
                      {this.state.patientinfoPhone}
                    </p>
                  </div>
                </Card>
              </Flex1>
            </FlexColumn>
          </Card>
        </FadeInRightDiv>


      )}

      {renderIf(this.state.receivedpatientrx===true)(
        <FadeInLeftBigDiv style={{position: "absolute", left: "2.5vw", top: "27.5vh", width: "72.5vw", height: "50vh", textAlign: "left"}}>
          <Card title="PRESCRIPTIONS" bordered={false} style={{ backgroundColor: "#1989AC", color: "#283E56"}}>

            <Card style={{fontWeight: "bold", fontSize:"1.5vh", marginBottom: "1vh", padding:"0vh", textAlign: "left", backgroundColor: "#283E56"}}>
              <FlexRow>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    RXID
                  </h1>
                </Flex1>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    DOCTOR
                  </h1>
                </Flex1>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    LICENSE
                  </h1>
                </Flex1>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    SCRIPT
                  </h1>
                </Flex1>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    REFILLS
                  </h1>
                </Flex1>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    STATUS
                  </h1>
                </Flex1>
              </FlexRow>
            </Card>

            {scriptlist}
          </Card>
        </FadeInLeftBigDiv>
      )}

      </div>
    );
  }
}

// export default Doctor

//
function mapDispatchToProps(dispatch) {
    return({
      //  checkloginoci: (e)=>{dispatch(checkLoginOCI(e))},
      getpatientinfo: (e)=>{dispatch(getPATIENTINFO(e))},
      getallpatients: ()=>{dispatch(getALLPATIENTS())},
      getrxinfo: (e)=>{dispatch(getRXINFO(e))}
    })
}

function mapStateToProps(state) {
    return({
      // loginreturn: state.loginreturn,
      patientinfo: state.patientinfo,
      allpatients: state.allpatients,
      rxinfo: state.rxinfo
    })
}

export default (connect(
    mapStateToProps, mapDispatchToProps)(
    Doctor
))
