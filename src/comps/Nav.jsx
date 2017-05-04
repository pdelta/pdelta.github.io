import React, { Component } from 'react';
import LoginInfo from './LoginInfo';

export default class Nav extends Component {
  logOut = e => {
    e.preventDefault();
    // remove all session storage and refresh the page
    sessionStorage.clear();
    location.href = location.origin;
  };

  render() {
    return (
      <nav className="navbar navbar-inverse navbar-static-top" style={{ margin: 0 }}>
        <div className="container-fluid display-flex align-items-center">
          <div className="flex-grow-1">
            <a className="navbar-brand" href="#">GitLock <i className="fa fa-lock"/></a>
          </div>

          <LoginInfo style={{color:'white'}}/>

          <p className="navbar-text" style={{ marginLeft: 20 }}>
            <a className="navbar-link" href="#" onClick={this.logOut}>
              Sign Out
            </a>
          </p>
        </div>
      </nav>
    );
  }
}