import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ImportData extends Component {
  static propTypes = {
    onImport: PropTypes.func.isRequired
  };
  static defaultProps = {};

  render() {
    const { ...rest } = this.props;

    return (
      <div className="container-fluid">
      <p className="lead">Coming soon!</p>
      </div>
    );
  }
}