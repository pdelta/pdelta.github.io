import React, { Component } from 'react';

export default class Spinner extends Component {
  render() {
    return (
      <div className="text-center" style={{ margin: 50 }}>
        <i className="fa fa-3x fa-spin fa-refresh"/>
      </div>
    );
  }
}