import React, { Component } from "react";
import PropTypes from "prop-types";
import { AlertList } from "react-bs-notifier";
import _ from "underscore";

export default class NSP extends Component {
  static childContextTypes = {
    onError: PropTypes.func.isRequired,
    onWarning: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onInfo: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      onError: this.handleError,
      onWarning: this.handleWarning,
      onSuccess: this.handleSuccess,
      onInfo: this.handleInfo,
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
    const alertId = this._lastId++;
    const removeAlert = () => this.setState({ alerts: _.filter(this.state.alerts, ({ id }) => id !== alertId) });

    this.setState({
      alerts: [
        {

          onDismiss: removeAlert,
          showDismiss: true,
          ...opts,
          id: alertId,
          type,
          message
        }
      ].concat(this.state.alerts)
    }, () => setTimeout(removeAlert, 5000));
  };

  handleError = (err, opts) => {
    if (err instanceof Error) {
      console.error(err);
      this.addNotification('danger', err.message, { headline: 'error!', ...opts });
    } else {
      this.addNotification('danger', err, { headline: 'error!', ...opts });
    }
  };
  handleWarning = (msg, opts) => this.addNotification('warning', msg, { headline: 'warning!', ...opts });
  handleSuccess = (msg, opts) => this.addNotification('success', msg, { headline: 'success!', ...opts });
  handleInfo = (msg, opts) => this.addNotification('info', msg, { headline: 'info!', ...opts });

  render() {
    const { alerts } = this.state;

    return (
      <div>
        <AlertList alerts={alerts} position="bottom-right"/>
        {this.props.children}
      </div>
    );
  }
}