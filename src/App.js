import React, { PureComponent } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import DatabaseList from './comps/DatabaseList';
import LoginInfo from './comps/LoginInfo';

class NotFound extends PureComponent {
  render() {
    return (
      <div className="container">
        <h2>404</h2>
        <p>Page Not Found!</p>
      </div>
    );
  }
}

class Nav extends PureComponent {
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

class AppShell extends PureComponent {
  render() {
    return (
      <div style={{ width: '100vw', height: '100vh' }}
           className="display-flex flex-direction-column">
        <div className="flex-shrink-0">
          <Nav/>
        </div>
        <div className="flex-grow-1 flex-shrink-1 sm-up-display-flex" style={{ overflow: 'hidden' }}>
          <div className="flex-shrink-0" style={{ padding: 20, boxShadow: '1px 0 1px 1px rgba(0,0,0,0.2)' }}>
            <DatabaseList/>
          </div>
          <div className="flex-grow-1 flex-shrink-1" style={{ overflow: 'hidden' }}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default class App extends PureComponent {
  static propTypes = {
    token: PropTypes.string.isRequired
  };

  static childContextTypes = {
    token: PropTypes.string
  };

  getChildContext() {
    return { token: this.props.token };
  }

  render() {
    return (
      <Router>
        <AppShell>
          <Route path="db/:id" component={NotFound}/>
          <Route component={NotFound}/>
        </AppShell>
      </Router>
    );
  }
}