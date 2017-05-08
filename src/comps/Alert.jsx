import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class Alert extends Component {
  static propTypes = {
    level: PropTypes.oneOf([ 'info', 'danger', 'warning', 'success' ]).isRequired
  };

  static defaultProps = {};

  render() {
    const { level, className, ...rest } = this.props;

    return (
      <div className={cx(`alert alert-${level}`, className)} {...rest}/>
    );
  }
}