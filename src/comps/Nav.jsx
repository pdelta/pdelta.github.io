import React, { Component } from 'react';
import LoginInfo from './LoginInfo';
import { GITHUB_TOKEN_KEY } from '../requireGitHubLogin';

export default class Nav extends Component {
  logOut = e => {
    e.preventDefault();
    localStorage.removeItem(GITHUB_TOKEN_KEY);
    location.href = location.origin;
  };

  render() {
    return (
      <nav className="navbar navbar-inverse navbar-static-top" style={{ margin: 0 }}>
        <div className="container-fluid display-flex align-items-center">
          <div className="flex-grow-1">
            <a className="navbar-brand" href="#">GitLock <i className="fa fa-lock"/></a>
          </div>

          <div className="navbar-text">
            <LoginInfo />
          </div>

          <p className="navbar-text" style={{ marginLeft: 10 }}>
            <a className="navbar-link" href="#" onClick={this.logOut}>
              Sign Out
            </a>
          </p>
        </div>
      </nav>
    );
  }
}