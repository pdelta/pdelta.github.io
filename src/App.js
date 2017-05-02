import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';

export default class App extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired
  };

  render() {
    const { token } = this.props;

    return (
      <div>
        { token }
      </div>
    );
  }
}