import React, { Component } from 'react';
import { USER_SHAPE } from '../util/shapes';

export default class Nav extends Component {
  static contextTypes = {
    user: USER_SHAPE.isRequired
  };

  logOut = e => {
    e.preventDefault();
    // remove all session storage and refresh the page
    sessionStorage.clear();
    location.href = location.origin;
  };

  render() {
    const { user: { profile: { name } } } = this.context;

    return (
      <nav className="navbar navbar-inverse navbar-static-top" style={{ margin: 0 }}>
        <div className="container-fluid">

          <div className="navbar-header">
            <a className="navbar-brand" href={location.origin}>GitLock <i className="fa fa-lock"/></a>
          </div>

          <div className="navbar-right">
            <p className="navbar-text">
              Signed in as <a className="navbar-link" href="#" onClick={this.logOut}>{name}</a>
            </p>
          </div>
        </div>
      </nav>
    );
  }
}