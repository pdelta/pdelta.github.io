import React, { Component } from 'react';
import { USER_SHAPE } from '../util/shapes';

export default class Nav extends Component {
  static contextTypes = {
    user: USER_SHAPE
  };

  logOut = e => {
    e.preventDefault();
    // remove all session storage and refresh the page
    localStorage.clear();
    window.location.reload();
  };

  render() {
    const { user } = this.context;

    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container-fluid">

          <div className="navbar-header">
            <a className="navbar-brand" href={window.location.origin}>
              GitLock {process.env.REACT_APP_GIT_VERSION}
            </a>
          </div>

          {
            user ? (
              <div className="navbar-right">
                <p className="navbar-text">
                  Signed in as {user.profile.name}
                </p>

                <p className="navbar-text">
                  <a className="navbar-link" onClick={this.logOut}>Sign Out</a>
                </p>
              </div>
            ) : null
          }
        </div>
      </nav>
    );
  }
}