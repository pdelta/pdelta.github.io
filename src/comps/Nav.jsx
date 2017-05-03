import React, { Component } from 'react';
import LoginInfo from './LoginInfo';

export default class Nav extends Component {
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
        </div>
      </nav>
    );
  }
}