import React, { Component } from "react";
import ReactTable from "react-table";
import 'react-table/react-table.css'

export default class Table extends Component {
  constructor(props){
    super(props);

    this.state = {
      averages: props.data
    }
  }

  render(){
    const { averages } = this.state;
    const columns = [{
      Header: 'Message',
      accessor: 'message'
    },{
      Header: 'Average',
      accessor: 'average'
    },{
      Header: 'Time',
      accessor: 'timestamp'
    }]    
    return (
      <ReactTable
        data={averages}
        columns={columns}
        minRows={3}
        showPaginationBottom={false}
      />
    )
  }
}
