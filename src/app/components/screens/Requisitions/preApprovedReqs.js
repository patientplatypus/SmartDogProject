import { Table, Button } from 'antd';
import React, {Component} from 'react';

import './local.css';

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Jim Red',
  age: 32,
  address: 'London No. 2 Lake Park',
}];

//console.log("PROPS DATA: " + data);

class PreApprovedReqs extends Component {
 

  //console.log("FOUND TEST" + {this.props.tableData});

  constructor(props) {
    super(props);
  //const data = {this.props.tableData};  
    this.state = {
      filteredInfo: null,
    sortedInfo: null,
    tableArr: null,
    }
  }

  componentWillReceiveProps() {
    this.setState({
      tableArr: this.props.tableData,
    });
    //console.log("PROPS OUTPUT" + this.props.tableData);
  }

  componentDidMount() {
    this.setState({
      tableArr: this.props.tableData,
    }, () => {
      console.log("PROPS OUTPUT" + JSON.stringify(this.state.tableArr));
    });
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }
  clearFilters = () => {
    this.setState({ filteredInfo: null });
  }
  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  }
  setImpactSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'negImpact',
      },
    });
  }
  setAmountSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'paymentAmount',
      },
    });
  }
  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [{
      title: 'Requisition Number',
      dataIndex: 'requisitionNum',
      key: 'requisitionNum',
      sorter: (a, b) => a.requisitionNum - b.requisitionNum,
      sortOrder: sortedInfo.columnKey === 'requisitionNum' && sortedInfo.order,
    }, {
      title: 'Requisition Type',
      dataIndex: 'requisitionType',
      key: 'requisitionType',
      sorter: (a, b) => a.requisitionType - b.requisitionType,
      sortOrder: sortedInfo.columnKey === 'requisitionType' && sortedInfo.order,
    }, {
      title: 'Preparer',
      dataIndex: 'preparer',
      key: 'preparer',
      sorter: (a, b) => a.preparer - b.preparer,
      sortOrder: sortedInfo.columnKey === 'preparer' && sortedInfo.order,
    }, {
      title: 'Creator',
      dataIndex: 'creator',
      key: 'creator',
      sorter: (a, b) => a.creator - b.creator,
      sortOrder: sortedInfo.columnKey === 'creator' && sortedInfo.order,
    }, {
      title: 'Last Updated',
      dataIndex: 'lastUpdateDate',
      key: 'lastUpdateDate',
      sorter: (a, b) => a.lastUpdateDate - b.lastUpdateDate,
      sortOrder: sortedInfo.columnKey === 'lastUpdateDate' && sortedInfo.order,
    }];
    return (
      <div>
        <div className="table-operations">
         
        </div>
        <Table columns={columns} dataSource={this.state.tableArr} pagination={{pageSize: 4}} onChange={this.handleChange} />
      </div>
    );
  } 
}





export default PreApprovedReqs;