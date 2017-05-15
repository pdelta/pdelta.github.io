import React, { PureComponent } from 'react';
import { goToLogin } from '../util/require-github-login';
import PropTypes from 'prop-types';
import Alert from './Alert';
import Nav from './Nav';

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
      <div>
        <Nav/>

        <div className="container">
          <Alert level="info">
            <strong>Error: </strong>
            <span>{error.message}</span>
          </Alert>

          <div className="text-center">
            <button className="btn btn-primary" onClick={e => {
              e.preventDefault();
              goToLogin(loginParams);
            }}><i className="fa fa-sign-in"/> sign in
            </button>
          </div>
        </div>
      </div>
    );
  }
}