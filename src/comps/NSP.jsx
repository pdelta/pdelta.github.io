import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertList } from 'react-bs-notifier';
import _ from 'underscore';

export default class NSP extends Component {
  static childContextTypes = {
    onError: PropTypes.func.isRequired,
    onWarning: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onInfo: PropTypes.func.isRequired
  };

  getChildContext() {
    return {
      onError: this.handleError,
      onWarning: this.handleWarning,
      onSuccess: this.handleSuccess,
      onInfo: this.handleInfo
    };
  }

  static propTypes = {
    messageDefaults: PropTypes.object
  };

  static defaultProps = {
    messageDefaults: {}
  };

  _lastId = 0;

  state = {
    alerts: []
  };

  addNotification = (type, message, opts) => {
    const { alerts } = this.state;
    const id = this._lastId++;

    this.setState({
      alerts: [ { timeout: 5000, ...opts, id: id, type, message } ].concat(alerts)
    });
  };

  dismissAlert = item => {
    this.setState({ alerts: _.filter(this.state.alerts, ({ id }) => id !== item.id) });
  };

  handleError = (err, opts) => {
    if (err instanceof Error) {
      console.error(err);
      this.addNotification('danger', err.message, { ...opts });
    } else {
      this.addNotification('danger', err, { ...opts });
    }
  };
  handleWarning = (msg, opts) => this.addNotification('warning', msg, { ...opts });
  handleSuccess = (msg, opts) => this.addNotification('success', msg, { ...opts });
  handleInfo = (msg, opts) => this.addNotification('info', msg, { ...opts });

  render() {
    const { alerts } = this.state;

    return (
      <div>
        <AlertList position="bottom-right" onDismiss={this.dismissAlert} alerts={alerts}/>
        {this.props.children}
      </div>
    );
  }
}