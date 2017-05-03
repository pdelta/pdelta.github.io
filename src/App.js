import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DatabasePage from './comps/DatabasePage';
import SelectDatabase from './comps/SelectDatabase';
import AppShell from './comps/AppShell';

export default class App extends Component {
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
          <Switch>
            <Route path="/db/:owner/:repo" component={DatabasePage}/>
            <Route component={SelectDatabase}/>
          </Switch>
        </AppShell>
      </Router>
    );
  }
}