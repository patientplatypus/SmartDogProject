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

class EarlyPaymentTable extends Component {
 

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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    }, {
      title: 'Days Early',
      dataIndex: 'daysEarly',
      key: 'daysEarly',
      sorter: (a, b) => a.daysEarly - b.daysEarly,
      sortOrder: sortedInfo.columnKey === 'daysEarly' && sortedInfo.order,
    }, {
      title: 'Amount Paid',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount', 
      onFilter: (value, record) => record.address.includes(value),
      sorter: (a, b) => a.paymentAmount - b.paymentAmount,
      sortOrder: sortedInfo.columnKey === 'paymentAmount' && sortedInfo.order,
    }, {
      title: 'Neg. Cash Impact',
      dataIndex: 'negImpact',
      key: 'negImpact',
      sorter: (a, b) => a.negImpact - b.negImpact,
      sortOrder: sortedInfo.columnKey === 'negImpact' && sortedInfo.order,
    }];
    return (
      <div>
        <div className="table-operations">
          <Button onClick={this.setImpactSort}>Sort Neg. Cash Impact</Button>
          <Button onClick={this.setAmountSort}>Sort Amount Paid</Button>
          <Button onClick={this.clearAll}>Clear Sorters</Button>
        </div>
        <Table columns={columns} dataSource={this.state.tableArr} onChange={this.handleChange} />
      </div>
    );
  } 
}





export default EarlyPaymentTable;