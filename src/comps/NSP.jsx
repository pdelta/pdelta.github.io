import React, { Component } from "react";
import PropTypes from "prop-types";
import NotificationSystem from "react-notification-system";

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
    messageDefaults: { position: 'bc' }
  };

  addNotification = (level, message, opts) => this._ns ?
    this._ns.addNotification({ ...this.props.messageDefaults, level, message, ...opts }) :
    console.log(message, opts);

  handleError = (err, opts) => {
    if (err instanceof Error) {
      console.error(err);
      this.addNotification('error', err.message, opts);
    } else {
      this.addNotification('error', err, opts);
    }
  };
  handleWarning = (msg, opts) => this.addNotification('warning', msg, opts);
  handleSuccess = (msg, opts) => this.addNotification('success', msg, opts);
  handleInfo = (msg, opts) => this.addNotification('info', msg, opts);

  render() {
    return (
      <div>
        <NotificationSystem ref={ns => this._ns = ns}/>
        {this.props.children}
      </div>
    );
  }
}