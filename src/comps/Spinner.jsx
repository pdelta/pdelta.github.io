import React, { PureComponent } from 'react';

export default class Spinner extends PureComponent {
  render() {
    return (
      <div className="text-center" style={{ margin: 50 }}>
        <i className="fa fa-3x fa-spin fa-refresh"/>
      </div>
    );
  }
}