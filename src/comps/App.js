import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter , Route, Switch } from 'react-router-dom';
import DatabasePage from './DatabasePage';
import SelectDatabase from './SelectDatabase';
import AppShell from './AppShell';

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
      <BrowserRouter>
        <AppShell>
          <Switch>
            <Route path="/db/:owner/:repo" component={DatabasePage}/>
            <Route component={SelectDatabase}/>
          </Switch>
        </AppShell>
      </BrowserRouter>
    );
  }
}