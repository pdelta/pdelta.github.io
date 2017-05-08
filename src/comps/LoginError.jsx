import React, { PureComponent } from 'react';
import { goToLogin } from '../util/require-github-login';
import PropTypes from 'prop-types';

export default class LoginError extends PureComponent {
  static contextTypes = {};
  static propTypes = {
    error: PropTypes.instanceOf(Error).isRequired,
    loginParams: PropTypes.object.isRequired
  };
  static defaultProps = {};

  render() {
    const { error, loginParams } = this.props;

    return (
      <div style={{ width: '100vw', height: '100vh' }}
           className="display-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="alert alert-info">{error.message}</div>

          <div>
            <button className="btn btn-primary" onClick={e => {
              e.preventDefault();
              goToLogin(loginParams);
            }}><i className="fa fa-sign-in"/> log in
            </button>
          </div>
        </div>
      </div>
    );
  }
}